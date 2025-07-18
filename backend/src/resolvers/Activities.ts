import {
  ActivitiesWithCount,
  Activity,
  ActivityPaginationInput,
} from "@/entities/Activity";
import { GraphQLError } from "graphql";
import { Arg, ID, Query, Resolver } from "type-graphql";

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

  @Query(() => Activity, { nullable: true })
  async getActivityById(
    @Arg("id", () => ID) _id: number
  ): Promise<Activity | null> {
    const id = Number(_id);

    const activity = await Activity.findOne({
      where: { id },
    });

    if (!activity) {
      throw new GraphQLError("Activity not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    return activity;
  }

  @Query(() => Activity, { nullable: true })
  async getActivityByNormalizedName(
    @Arg("normalizedName", () => String) normalizedName: string
  ): Promise<Activity | null> {
    const activity = await Activity.findOne({
      where: { normalizedName },
      relations: { products: { categories: true, variants: true } },
    });

    if (!activity) {
      throw new GraphQLError("Activity not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    return activity;
  }
}
