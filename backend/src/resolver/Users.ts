import { UserInputError } from "apollo-server-errors";
import { validate, ValidationError } from "class-validator";
import Cookies from "cookies";
import * as jsonwebtoken from "jsonwebtoken";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { dataSource } from "../config/db";
import { Profile } from "../entities/Profile";
import { User, UserCreateInput } from "../entities/User";
import { UserToken } from "../entities/UserToken";
import { hashPassword, verifyPassword } from "../helpers/helpers";
import { ContextType, RoleType, UserType } from "../types";

@Resolver(User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User | ValidationError[]> {
    if (data.password !== data.confirmPassword) {
      throw new UserInputError("Passwords don't match");
    }

    const inputErrors = await validate(data);
    if (inputErrors.length > 0) {
      throw new UserInputError("Validation error", {
        validationErrors: inputErrors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }

    try {
      const hashedPassword = await hashPassword(data.password);
      const newUser = new User();
      newUser.email = data.email;
      newUser.password = hashedPassword;
      newUser.firstname = data.firstname;
      newUser.lastname = data.lastname;
      newUser.role = RoleType.USER;

      await dataSource.manager.transaction(async () => {
        await newUser.save();

        const profile = new Profile();
        profile.email = newUser.email;
        profile.firstname = newUser.firstname;
        profile.lastname = newUser.lastname;
        profile.user_id = newUser.id;
        profile.role = newUser.role;

        await profile.save();
      });
      //TODO send email for validation
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Unable to create user. Please try again.");
    }
  }

  @Mutation(() => User, { nullable: true })
  async signIn(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() context: ContextType
  ): Promise<User | null> {
    try {
      const user: User | null = await User.findOneBy({ email });

      if (user) {
        const passwordMatch = await verifyPassword(user.password, password);
        if (passwordMatch) {
          //TODO replace 3d per 1h when refresh token is fully implemented
          const token = jsonwebtoken.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3d" }
          );

          const refreshToken = jsonwebtoken.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: "7d" }
          );

          const userToken = new UserToken();
          userToken.token = token;
          userToken.refresh_token = refreshToken;
          userToken.user = user;
          await userToken.save();
          if (process.env.NODE_ENV !== "testing") {
            const cookies = new Cookies(context.req, context.res);
            //TODO remove 24 * 3 when refresh token is fully implemented
            cookies.set("token", token, {
              secure: process.env.NODE_ENV === "production",
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 3,
            });

            cookies.set("refresh_token", refreshToken, {
              secure: process.env.NODE_ENV === "production",
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 7,
            });
          }

          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async signOut(@Ctx() context: ContextType): Promise<Boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }

  // Authorisez()
  @Query(() => User, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<UserType | null> {
    return context.user;
  }
}
