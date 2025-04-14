import { UserInputError } from "apollo-server-errors";
import { ValidationError } from "class-validator";
import Cookies from "cookies";
import { GraphQLError } from "graphql";
import * as jsonwebtoken from "jsonwebtoken";
import { Arg, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { dataSource } from "../config/db";
import { Profile } from "../entities/Profile";
import {
  AdminCreateUserInput,
  AdminUpdateUserInput,
  SignInInput,
  User,
  UserCreateInput,
} from "../entities/User";
import { UserToken } from "../entities/UserToken";
import { hashPassword, verifyPassword } from "../helpers/helpers";
import { validateInput } from "../helpers/validateInput";
import { ContextType, RoleType } from "../types";

@Resolver(User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User | ValidationError[]> {
    if (data.password !== data.confirmPassword) {
      throw new GraphQLError("Passwords don't match", {
        extensions: {
          code: "PASSWORDS_DONT_MATCH",
          http: { status: 400 },
        },
      });
    }

    await validateInput(data);

    const existingUser = await User.findOne({ where: { email: data.email } });

    if (existingUser) {
      throw new GraphQLError("User with this email already exists", {
        extensions: {
          code: "EMAIL_ALREADY_EXIST",
          http: { status: 409 },
        },
      });
    }

    try {
      const hashedPassword = await hashPassword(data.password);
      const newUser = new User();
      newUser.email = data.email;
      newUser.password = hashedPassword;
      newUser.firstname = data.firstname;
      newUser.lastname = data.lastname;
      newUser.role = RoleType.user;

      await dataSource.manager.transaction(async () => {
        await newUser.save();

        const profile = new Profile();
        profile.email = newUser.email;
        profile.firstname = newUser.firstname;
        profile.lastname = newUser.lastname;
        profile.id = newUser.id;
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
    @Arg("datas") datas: SignInInput,
    @Ctx() context: ContextType
  ): Promise<User | null> {
    try {
      await validateInput(datas);

      const { email, password } = datas;
      const user: User | null = await User.findOneBy({ email });

      if (!user) {
        throw new GraphQLError("Invalid email or password", {
          extensions: {
            code: "INVALID_CREDENTIALS",
            http: { status: 401 },
          },
        });
      }

      const passwordMatch = await verifyPassword(user.password, password);

      if (!passwordMatch) {
        throw new GraphQLError("Invalid email or password", {
          extensions: {
            code: "INVALID_CREDENTIALS",
            http: { status: 401 },
          },
        });
      }
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
      userToken.refreshToken = refreshToken;
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
    } catch (err) {
      if (err instanceof GraphQLError || err instanceof UserInputError) {
        throw err;
      }
      console.error("Sign-in error:", err);
      throw new Error("Unable to sign in. Please try again.");
    }
  }

  @Mutation(() => Boolean)
  async signOut(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }

  @Mutation(() => User)
  async createUserByAdmin(
    @Arg("data", () => AdminCreateUserInput) data: AdminCreateUserInput
  ): Promise<User | ValidationError[]> {
    await validateInput(data);

    const existingUser = await User.findOne({ where: { email: data.email } });

    if (existingUser) {
      throw new GraphQLError("User with this email already exists", {
        extensions: {
          code: "EMAIL_ALREADY_EXIST",
          http: { status: 409 },
        },
      });
    }

    try {
      const hashedPassword = await hashPassword(data.password);
      const newUser = new User();
      newUser.email = data.email;
      newUser.password = hashedPassword;
      newUser.firstname = data.firstname;
      newUser.lastname = data.lastname;
      newUser.role = data.role || RoleType.user;

      await dataSource.manager.transaction(async () => {
        await newUser.save();

        const profile = new Profile();
        profile.email = newUser.email;
        profile.firstname = newUser.firstname;
        profile.lastname = newUser.lastname;
        profile.id = newUser.id;
        profile.role = newUser.role;

        await profile.save();
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Unable to create user. Please try again.");
    }
  }

  @Mutation(() => User)
  async updateUserByAdmin(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => AdminUpdateUserInput) data: AdminUpdateUserInput
  ): Promise<Profile | ValidationError[]> {
    await validateInput(data);

    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: {
          code: "USER_NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    try {
      user.email = data.email;
      user.firstname = data.firstname;
      user.lastname = data.lastname;
      user.role = data.role || user.role;

      let profile: Profile | null = null;

      await dataSource.manager.transaction(async () => {
        await user.save();

        profile = await Profile.findOne({ where: { id: user.id } });
        if (profile) {
          profile.email = user.email;
          profile.firstname = user.firstname;
          profile.lastname = user.lastname;
          profile.role = user.role;
          await profile.save();
        }
      });

      if (!profile) {
        throw new GraphQLError("Profile not found", {
          extensions: {
            code: "PROFILE_NOT_FOUND",
            http: { status: 404 },
          },
        });
      }
      console.log(profile);
      return profile;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Unable to update user. Please try again.");
    }
  }
}
