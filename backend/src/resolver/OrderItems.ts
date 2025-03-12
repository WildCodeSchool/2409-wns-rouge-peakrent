import { validate } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Equal } from "typeorm";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import {
  OrderItems,
  OrderItemsCreateInput,
  OrderItemsUpdateInput,
} from "../entities/OrderItems";
import { AuthContextType } from "../types";

@Resolver(OrderItems)
export class OrderItemsResolver {
  @Query(() => [OrderItems])
  @Authorized()
  async getOrderItems(@Ctx() context: AuthContextType): Promise<OrderItems[]> {
    const orderItems = await OrderItems.find({
      relations: { cart: true, variant: true, order: true },
    });
    if (!(context.user.role === "admin")) {
      throw new Error("Unauthorized");
    }
    return orderItems;
  }

  @Query(() => OrderItems)
  @Authorized()
  async getOrderItemsById(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItems | null> {
    const id = Number(_id);
    const orderItem = await OrderItems.findOne({
      where: { id },
      relations: { cart: true, variant: true, order: true },
    });

    return orderItem;
  }

  @Query(() => [OrderItems])
  @Authorized()
  async getOrderItemsByCartId(
    @Arg("id", () => Int) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItems[] | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({ where: { id } });
    if (!cart) {
      throw new Error("Cart not found.");
    }
    const orderItem = await OrderItems.find({
      where: { cart: Equal(id) },
      relations: { cart: true, variant: true },
    });
    if (
      !(
        context.user.role === "admin" ||
        context.user.id === orderItem[0].cart.profile.id
      )
    ) {
      throw new Error("Unauthorized");
    }
    return orderItem;
  }

  @Query(() => [OrderItems])
  @Authorized()
  async getOrderItemsByOrderId(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItems[] | null> {
    const id = Number(_id);
    const order = await Order.findOne({ where: { id } });
    if (!order) {
      throw new Error("Order not found.");
    }
    const orderItem = await OrderItems.find({
      where: { order: Equal(id) },
      relations: { variant: true, order: true },
    });

    if (
      !(
        context.user.role === "admin" ||
        context.user.id === orderItem[0].order.profile.id
      )
    ) {
      throw new Error("Unauthorized");
    }
    return orderItem;
  }

  @Mutation(() => OrderItems)
  @Authorized()
  async createOrderItems(
    @Arg("data", () => OrderItemsCreateInput) data: OrderItemsCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<OrderItems> {
    const newOrderItems = new OrderItems();
    Object.assign(newOrderItems, data);
    const errors = await validate(newOrderItems);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newOrderItems.save();
      return newOrderItems;
    }
  }

  @Mutation(() => OrderItems, { nullable: true })
  @Authorized()
  async updateOrderItems(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => OrderItemsUpdateInput) data: OrderItemsUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<OrderItems | null> {
    const id = Number(_id);
    const orderItem = await OrderItems.findOne({
      where: { id },
      relations: { cart: true, variant: true, order: true },
    });
    if (orderItem !== null) {
      if (
        !(
          context.user.role === "admin" ||
          context.user.id === orderItem[0].cart.profile.userId ||
          context.user.id === orderItem[0].order.profile.userId
        )
      ) {
        throw new Error("Unauthorized");
      }
      Object.assign(orderItem, data);
      const errors = await validate(orderItem);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await orderItem.save();
        return orderItem;
      }
    } else {
      return null;
    }
  }

  @Mutation(() => OrderItems, { nullable: true })
  @Authorized()
  async deleteOrderItems(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItems | null> {
    const id = Number(_id);
    const orderItem = await OrderItems.findOne({
      where: { id },
      relations: { cart: true, variant: true, order: true },
    });
    if (orderItem !== null) {
      if (
        !(
          context.user.role === "admin" ||
          context.user.id === orderItem[0].cart.profile.userId ||
          context.user.id === orderItem[0].order.profile.userId
        )
      ) {
        throw new Error("Unauthorized");
      }
      await orderItem.remove();
      return orderItem;
    } else {
      throw new Error("orderItems not found.");
    }
  }
}
