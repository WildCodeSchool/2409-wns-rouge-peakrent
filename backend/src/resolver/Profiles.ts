import { Ctx, Query, Resolver } from "type-graphql";
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

  // @Query(() => Profile, { nullable: true })
  // async getProfileById(
  //   @Arg("id", () => Int, { defaultValue: 1 }) profileId: number
  // ): Promise<Profile | null> {
  //   return await Profile.findOneBy({ user_id: profileId });
  // }

  // Authorisez()
  @Query(() => Profile, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<ProfileType | null> {
    return context.user;
  }
}
