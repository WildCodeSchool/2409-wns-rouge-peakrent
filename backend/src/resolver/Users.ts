import { UserInputError } from "apollo-server-errors";
import { validate, ValidationError } from "class-validator";
import Cookies from "cookies";
import * as jsonwebtoken from "jsonwebtoken";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User, UserCreateInput } from "../entities/User";
import {
  getUserFromContext,
  hashPassword,
  verifyPassword,
} from "../helpers/helpers";
import { ContextType, RoleType } from "../types";

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

    const newUser = new User();
    try {
      const hashedPassword = await hashPassword(data.password);
      newUser.email = data.email;
      newUser.password = hashedPassword;
      newUser.firstname = data.firstname;
      newUser.lastname = data.lastname;
      newUser.role = RoleType.USER;
      await newUser.save();
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
        if (await verifyPassword(user.password, password)) {
          const token = jsonwebtoken.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY
          );
          const cookies = new Cookies(context.req, context.res);
          cookies.set("token", token, {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * (24 * 3),
          });
          //TODO create user token in db
          // const userToken = await UserToken.createUserToken(token);
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
  async whoami(@Ctx() context: ContextType): Promise<User | null> {
    return await getUserFromContext(context);
  }
}
