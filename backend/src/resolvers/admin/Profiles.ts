import { Profile } from "@/entities/Profile";
import { RoleType } from "@/types";
import { Arg, Authorized, ID, Query, Resolver } from "type-graphql";
import { ILike } from "typeorm";

@Resolver(Profile)
export class ProfileResolverAdmin {
  @Authorized([RoleType.admin, RoleType.superadmin])
  @Query(() => [Profile], { nullable: true })
  async getProfilesAdmin(
    @Arg("search", () => String, { nullable: true }) search?: string
  ): Promise<Profile[] | null> {
    const where: any = {};
    if (search) {
      where.email = ILike(`%${search}%`);
    }
    return await Profile.find({ where });
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Query(() => Profile, { nullable: true })
  async getProfileByUserId(
    @Arg("userId", () => ID) userId: number
  ): Promise<Profile | null> {
    return await Profile.findOne({ where: { id: userId } });
  }
}
