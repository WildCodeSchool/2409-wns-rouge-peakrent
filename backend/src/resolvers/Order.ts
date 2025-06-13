import { Order } from "@/entities/Order";
import { AuthContextType } from "@/types";
import { Arg, Authorized, Ctx, ID, Query, Resolver } from "type-graphql";

@Resolver(Order)
export class OrderResolver {
  @Query(() => Order)
  @Authorized("admin", "user")
  async getOrderById(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    const order = await Order.findOne({
      where: { id },
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
      if (
        !(context.user.role === "admin" || context.user.id === order.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      return order;
    }
    throw new Error("order not found");
  }

  @Query(() => [Order])
  @Authorized("user", "admin")
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
