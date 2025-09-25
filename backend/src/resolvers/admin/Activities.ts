import {
  Activity,
  ActivityCreateInputAdmin,
  ActivityUpdateInputAdmin,
} from "@/entities/Activity";
import { deleteImageFromUploadsDir } from "@/helpers/deleteImage";
import { normalizeString } from "@/helpers/helpers";
import { AuthContextType, RoleType } from "@/types";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { In } from "typeorm";

@Resolver(Activity)
export class ActivityResolverAdmin {
  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Activity)
  async createActivityAdmin(
    @Arg("data", () => ActivityCreateInputAdmin) data: ActivityCreateInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Activity> {
    const user = context.user;

    const newActivity = new Activity();

    Object.assign(newActivity, {
      name: data.name,
      variant: data.variant,
      urlImage: data.urlImage,
      description: data.description,
      createdBy: user,
    });
    newActivity.normalizedName = normalizeString(newActivity.name);

    const errors = await validate(newActivity);
    if (errors.length > 0) {
      throw new GraphQLError("Validation error", {
        extensions: {
          code: "VALIDATION_ERROR",
          http: { status: 400 },
        },
      });
    }

    await newActivity.save();

    return newActivity;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Activity, { nullable: true })
  async updateActivityAdmin(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => ActivityUpdateInputAdmin) data: ActivityUpdateInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Activity | null> {
    const id = Number(_id);
    const user = context.user;

    const activity = await Activity.findOne({
      where: { id, createdBy: { id: user.id } },
    });

    if (!activity) {
      throw new GraphQLError(`Activity not found`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    if (data.urlImage !== activity.urlImage) {
      deleteImageFromUploadsDir(activity.urlImage);
    }

    Object.assign(activity, {
      name: data.name,
      variant: data.variant,
      urlImage: data.urlImage,
      description: data.description,
    });
    activity.normalizedName = normalizeString(activity.name);

    const errors = await validate(activity);
    if (errors.length > 0) {
      throw new GraphQLError("Validation error", {
        extensions: {
          code: "VALIDATION_ERROR",
          http: { status: 400 },
        },
      });
    }

    await activity.save();

    return activity;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Activity, { nullable: true })
  async deleteActivityAdmin(
    @Arg("id", () => ID) _id: number
  ): Promise<Activity | null> {
    const id = Number(_id);
    const activity = await Activity.findOne({
      where: { id },
    });
    if (activity !== null) {
      deleteImageFromUploadsDir(activity.urlImage);
      await activity.remove();
      return activity;
    } else {
      throw new GraphQLError(`Activity not found`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => [ID], { nullable: true })
  async deleteActivitiesAdmin(
    @Arg("ids", () => [ID]) ids: number[]
  ): Promise<number[] | null> {
    const activities = await Activity.find({
      where: {
        id: In(ids),
      },
    });

    for (const activity of activities) {
      deleteImageFromUploadsDir(activity.urlImage);
    }

    if (activities.length === 0) {
      throw new GraphQLError("No activity found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const deletedIds = activities.map((activity) => activity.id);
    await Activity.remove(activities);

    return deletedIds;
  }
}
