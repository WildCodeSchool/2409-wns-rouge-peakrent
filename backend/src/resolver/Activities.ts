import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { In } from "typeorm";
import {
  ActivitiesWithCount,
  Activity,
  ActivityCreateInput,
  ActivityPaginationInput,
  ActivityUpdateInput,
  ActivityWithCount,
} from "../entities/Activity";
import { Product } from "../entities/Product";
import { normalizeString } from "../helpers/helpers";
import { ErrorCatcher } from "../middlewares/errorHandler";
import { AuthContextType } from "../types";

@Resolver(Activity)
export class ActivityResolver {
  @Query(() => ActivitiesWithCount)
  async getActivities(
    @Arg("data", () => ActivityPaginationInput) data: ActivityPaginationInput
  ): Promise<ActivitiesWithCount> {
    const { page, onPage, sort, order } = data;

    const [activities, total] = await Activity.findAndCount({
      relations: { products: true },
      skip: (page - 1) * onPage,
      take: onPage,
      order: { [sort]: order },
    });
    return {
      activities,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / onPage),
      },
    };
  }

  @Query(() => ActivityWithCount, { nullable: true })
  async getActivityById(
    @Arg("param", () => String) param: string,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("onPage", () => Int, { defaultValue: 15 })
    onPage: number
  ): Promise<ActivityWithCount | null> {
    const isId = !isNaN(Number(param));
    const whereCondition = isId ? { id: Number(param) } : { name: param };

    const activity = await Activity.findOne({
      where: whereCondition,
      relations: {
        products: true,
        createdBy: true,
      },
    });

    if (!activity) return null;

    const skip = (page - 1) * onPage;

    const [products, total] = await Product.findAndCount({
      where: { activities: { id: activity.id } },
      relations: { activities: true, createdBy: true },
      skip,
      take: onPage,
    });

    return {
      activity,
      products,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / onPage),
      },
    };
  }

  @Authorized(["admin", "superadmin"])
  @Mutation(() => Activity)
  @UseMiddleware(ErrorCatcher)
  async createActivity(
    @Arg("data", () => ActivityCreateInput) data: ActivityCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Activity> {
    const user = context.user;

    const newActivity = new Activity();

    Object.assign(newActivity, {
      name: data.name,
      variant: data.variant,
      urlImage: data.urlImage,
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

  @Authorized(["admin", "superadmin"])
  @Mutation(() => Activity, { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async updateActivity(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => ActivityUpdateInput) data: ActivityUpdateInput,
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

    Object.assign(activity, {
      name: data.name,
      variant: data.variant,
      urlImage: data.urlImage,
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

  @Authorized(["admin", "superadmin"])
  @Mutation(() => Activity, { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async deleteActivity(
    @Arg("id", () => ID) _id: number
  ): Promise<Activity | null> {
    const id = Number(_id);
    const activity = await Activity.findOne({
      where: { id },
    });
    if (activity !== null) {
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

  @Authorized(["admin", "superadmin"])
  @Mutation(() => [ID], { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async deleteActivities(
    @Arg("ids", () => [ID]) ids: number[]
  ): Promise<number[] | null> {
    const activities = await Activity.find({
      where: {
        id: In(ids),
      },
    });

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
