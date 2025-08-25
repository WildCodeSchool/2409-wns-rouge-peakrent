import { Order } from "@/entities/Order";
import { AuthContextType, RoleType } from "@/types";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";

@Resolver(Order)
export class OrderResolver {
  @Query(() => Order)
  @Authorized(RoleType.admin, RoleType.user)
  async getOrderByReference(
    @Arg("reference", () => String) reference: string,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const profileId = context.user.id;

    const order = await Order.findOne({
      where: { reference, profile: { id: profileId } },
      relations: {
        profile: true,
        orderItems: {
          variant: {
            product: true,
          },
        },
      },
    });
    if (order) {
      return order;
    }
    throw new GraphQLError("Order not found", {
      extensions: {
        code: "NOT_FOUND",
        entity: "Order",
        http: { status: 404 },
      },
    });
  }

  @Query(() => [Order])
  @Authorized(RoleType.user, RoleType.admin)
  async getMyOrders(@Ctx() context: AuthContextType): Promise<Order[]> {
    if (!context.user) {
      throw new Error("User not authenticated");
    }

    const orders = await Order.find({
      where: { profile: { user: { id: context.user.id } } },
      relations: {
        profile: true,
        orderItems: {
          variant: {
            product: true,
          },
        },
      },
      order: { date: "DESC" },
    });

    return orders;
  }
}
