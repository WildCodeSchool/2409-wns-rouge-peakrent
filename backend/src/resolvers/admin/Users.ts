import { dataSource } from "@/config/db";
import { Profile } from "@/entities/Profile";
import {
  CreateUserInputAdmin,
  UpdateUserInputAdmin,
  User,
} from "@/entities/User";
import { hashPassword } from "@/helpers/helpers";
import { validateInput } from "@/helpers/validateInput";
import { AuthContextType, RoleType } from "@/types";
import { ValidationError } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";

@Resolver(User)
export class UserResolverAdmin {
  @Authorized(["admin", "superadmin"])
  @Mutation(() => Profile)
  async createUserByAdmin(
    @Arg("data", () => CreateUserInputAdmin) data: CreateUserInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Profile | ValidationError[]> {
    await validateInput(data);

    if (
      context.user.role !== "superadmin" &&
      data.role &&
      data.role === "superadmin"
    ) {
      throw new GraphQLError("Unauthorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 403 },
        },
      });
    }

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

      let profile: Profile | null = null;

      await dataSource.manager.transaction(async () => {
        await newUser.save();

        profile = new Profile();
        profile.email = newUser.email;
        profile.firstname = newUser.firstname;
        profile.lastname = newUser.lastname;
        profile.id = newUser.id;
        profile.role = newUser.role;

        await profile.save();
      });

      return profile;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Unable to create user. Please try again.");
    }
  }

  @Authorized(["admin", "superadmin"])
  @Mutation(() => Profile)
  async updateUserByAdmin(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => UpdateUserInputAdmin) data: UpdateUserInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Profile | ValidationError[]> {
    await validateInput(data);

    if (
      context.user.role !== "superadmin" &&
      data.role &&
      data.role === "superadmin"
    ) {
      throw new GraphQLError("Unauthorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 403 },
        },
      });
    }

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

        profile = await Profile.findOne({
          where: { id: user.id },
        });
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

      return profile;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Unable to update user. Please try again.");
    }
  }
}
