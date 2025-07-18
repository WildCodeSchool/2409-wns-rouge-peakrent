import { dataSource } from "@/config/db";
import { Profile } from "@/entities/Profile";
import { User } from "@/entities/User";
import { RoleType } from "@/types";
import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { ILike, Not } from "typeorm";
import { GraphQLError } from "graphql";
import {
  anonymizeProfileAndUser,
  getUserAndProfile,
  randomizeProfileAndUser,
  secureHash,
  verifyPassword,
} from "@/helpers/helpers";

@Resolver(Profile)
export class ProfileResolverAdmin {
  @Authorized([RoleType.admin, RoleType.superadmin])
  @Query(() => [Profile], { nullable: true })
  async getProfilesByAdmin(
    @Arg("search", () => String, { nullable: true }) search?: string
  ): Promise<Profile[] | null> {
    const where: any = {};
    if (search) {
      where.email = ILike(`%${search}%`);
    }
    return await Profile.find({ where });
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Query(() => [Profile], { nullable: true })
  async getDeletedProfilesByAdmin(
    @Arg("search", () => String, { nullable: true }) search?: string
  ): Promise<Profile[] | null> {
    const where: any = {};
    if (search) {
      where.email = ILike(`%${search}%`);
    }
    return await Profile.find({ withDeleted: true, where });
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Query(() => Profile, { nullable: true })
  async getProfileByUserId(
    @Arg("userId", () => ID) userId: number
  ): Promise<Profile | null> {
    return await Profile.findOne({ where: { id: userId } });
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Boolean)
  async softDeleteProfileByAdmin(
    @Arg("userId") userId: number
  ): Promise<boolean> {
    const { user, profile } = await getUserAndProfile(userId);
    await randomizeProfileAndUser(profile, user);
    return true;
  }

  //!  Data anonymised to retrieve account
  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Boolean)
  async anonymiseProfileByAdmin(
    @Arg("userId") userId: number
  ): Promise<boolean> {
    const { user, profile } = await getUserAndProfile(userId);
    await anonymizeProfileAndUser(profile, user);
    return true;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => User, { nullable: true })
  async retrieveAnonymisedAccount(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const userRepository = dataSource.getRepository(User);
    const profileRepository = dataSource.getRepository(Profile);

    const hashedEmail = secureHash(email);

    const user = await userRepository.findOne({
      where: { email: hashedEmail, deletedAt: Not(null) },
      relations: ["profile"],
    });

    if (!user) {
      throw new GraphQLError("No deleted account matches these email.");
    }

    const passwordMatch = await verifyPassword(user.password, password);
    if (!passwordMatch) {
      throw new GraphQLError("No deleted account matches these password.");
    }

    user.deletedAt = null;
    await userRepository.save(user);

    const profile = await profileRepository.findOne({
      where: { id: user.id },
      relations: ["user"],
    });

    if (profile) {
      profile.deletedAt = null;
      profile.firstname = "Restored";
      profile.lastname = "Restored";
      await profileRepository.save(profile);
    }

    return user;
  }
}
