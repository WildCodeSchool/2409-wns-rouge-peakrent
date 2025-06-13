import { Profile } from "@/entities/Profile";
import { getUserFromContext } from "@/helpers/helpers";
import { ContextType, ProfileType } from "@/types";
import { Ctx, Query, Resolver } from "type-graphql";

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

  @Query(() => Profile, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<ProfileType | null> {
    return context.user;
  }

  @Query(() => Profile, { nullable: true })
  async getMyProfile(@Ctx() context: ContextType): Promise<Profile | null> {
    if (!context.user) {
      return null;
    }
    return await Profile.findOneBy({ id: context.user.id });
  }
}
