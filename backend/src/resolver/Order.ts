import { validate } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Order, OrderCreateInput, OrderUpdateInput } from "../entities/Order";
import { Profile } from "../entities/Profile";
import { AuthContextType } from "../types";

@Resolver(Order)
export class OrderResolver {
  @Query(() => [Order])
  @Authorized("admin")
  async getOrders(): Promise<Order[]> {
    const order = await Order.find({ relations: { profile: true } });
    return order;
  }

  @Query(() => Order)
  @Authorized("admin", "user")
  async getOrderById(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    const order = await Order.findOne({
      where: { id },
      relations: { profile: true },
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

  @Mutation(() => Order)
  @Authorized("admin")
  async createOrder(
    @Arg("data", () => OrderCreateInput) data: OrderCreateInput
  ): Promise<Order> {
    const newOrder = new Order();
    const profile = await Profile.findOne({
      where: { id: data.profileId },
    });
    if (!profile) {
      throw new Error(`profile not found`);
    }
    Object.assign(newOrder, data, {
      profile: data.profileId,
      store: data.storeId,
    });
    const errors = await validate(newOrder);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newOrder.save();
      return newOrder;
    }
  }

  @Mutation(() => Order, { nullable: true })
  @Authorized("admin")
  async updateOrder(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => OrderUpdateInput) data: OrderUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    if (data.profileId) {
      const profile = await Profile.findOne({
        where: { id: data.profileId },
      });
      if (!profile) {
        throw new Error(`profile not found`);
      }
    }
    const order = await Order.findOne({
      where: { id },
      relations: { profile: true },
    });

    if (order !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === order.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      Object.assign(order, data, {
        profile: data.profileId,
        store: data.storeId,
      });
      const errors = await validate(order);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await order.save();
        return order;
      }
    } else {
      throw new Error("Order not found.");
    }
  }

  @Mutation(() => Order, { nullable: true })
  @Authorized("admin")
  async deleteOrder(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    const order = await Order.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (order !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === order.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      await order.remove();
      return order;
    } else {
      throw new Error("Order not found.");
    }
  }
}
