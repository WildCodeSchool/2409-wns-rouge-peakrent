import { Profile } from "@/entities/Profile";
import {
  anonymizeProfileAndUser,
  getUserAndProfile,
  getUserFromContext,
  randomizeProfileAndUser,
} from "@/helpers/helpers";
import { ContextType, ProfileType, RoleType } from "@/types";
import { Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

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

  @Authorized([RoleType.user])
  @Mutation(() => Boolean)
  async softDeleteProfile(@Ctx() context: ContextType): Promise<boolean> {
    const { user, profile } = await getUserAndProfile(context.user.id);
    await randomizeProfileAndUser(profile, user);
    return true;
  }

  //!  Data anonymised to retrieve account
  @Mutation(() => Boolean)
  async anonymiseProfile(@Ctx() context: ContextType): Promise<boolean> {
    const { user, profile } = await getUserAndProfile(context.user.id);
    await anonymizeProfileAndUser(profile, user);
    return true;
  }
}
