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
import { AuthContextType } from "../types";
import { validate } from "class-validator";
import {
  OrderItems,
  OrderItemsCreateInput,
  OrderItemsUpdateInput,
} from "../entities/OrderItems";
import { Cart } from "../entities/Cart";
import { Equal } from "typeorm";
import { Order } from "../entities/Order";

@Resolver(OrderItems)
export class OrderItemsResolver {
  @Query(() => [OrderItems])
  @Authorized()
  async getOrderItems(@Ctx() context: AuthContextType): Promise<OrderItems[]> {
    const orderItems = await OrderItems.find({
      relations: { cart_id: true, variant_id: true, order_id: true },
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
      relations: { cart_id: true, variant_id: true, order_id: true },
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
      where: { cart_id: Equal(id) },
      relations: { cart_id: true, variant_id: true },
    });
    if (
      !(
        context.user.role === "admin" ||
        context.user.id === orderItem[0].cart_id.profile_id.user_id
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
      where: { order_id: Equal(id) },
      relations: { variant_id: true, order_id: true },
    });

    if (
      !(
        context.user.role === "admin" ||
        context.user.id === orderItem[0].order_id.profile_id.user_id
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
      relations: { cart_id: true, variant_id: true, order_id: true },
    });
    if (orderItem !== null) {
      if (
        !(
          context.user.role === "admin" ||
          context.user.id === orderItem[0].cart_id.profile_id.user_id ||
          context.user.id === orderItem[0].order_id.profile_id.user_id
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
      relations: { cart_id: true, variant_id: true, order_id: true },
    });
    if (orderItem !== null) {
      if (
        !(
          context.user.role === "admin" ||
          context.user.id === orderItem[0].cart_id.profile_id.user_id ||
          context.user.id === orderItem[0].order_id.profile_id.user_id
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
