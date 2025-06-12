import { Arg, Authorized, Ctx, ID, Query, Resolver } from "type-graphql";
import { ILike } from "typeorm";
import { Profile } from "../entities/Profile";
import { getUserFromContext } from "../helpers/helpers";
import { ContextType, ProfileType } from "../types";

@Resolver(Profile)
export class ProfileResolver {
  @Query(() => Profile, { nullable: true })
  async getProfile(@Ctx() context: ContextType): Promise<Profile | null> {
    const user = await getUserFromContext(context);
    if (!user) {
      return null;
    }
    return await Profile.findOneBy({ id: user.id });
  }

  @Authorized(["admin"])
  @Query(() => [Profile], { nullable: true })
  async getProfiles(
    @Arg("search", () => String, { nullable: true }) search?: string
  ): Promise<Profile[] | null> {
    const where: any = {};
    if (search) {
      where.email = ILike(`%${search}%`);
    }
    return await Profile.find({ where });
  }

  @Authorized(["admin", "superadmin"])
  @Query(() => Profile, { nullable: true })
  async getProfileByUserId(
    @Arg("userId", () => ID) userId: number
  ): Promise<Profile | null> {
    return await Profile.findOne({ where: { id: userId } });
  }

  @Authorized(["admin", "superadmin", "user"])
  @Query(() => Profile, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<ProfileType | null> {
    return context.user;
  }

  @Authorized(["admin", "superadmin", "user"])
  @Query(() => Profile, { nullable: true })
  async getMyProfile(@Ctx() context: ContextType): Promise<Profile | null> {
    if (!context.user) {
      return null;
    }
    return await Profile.findOneBy({ id: context.user.id });
  }
}
