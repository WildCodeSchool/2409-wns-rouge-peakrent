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
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import {
  OrderItem,
  OrderItemsCreateInput,
  OrderItemsUpdateInput,
} from "../entities/OrderItem";
import { Variant } from "../entities/Variant";
import { AuthContextType } from "../types";

@Resolver(OrderItem)
export class OrderItemsResolver {
  @Query(() => [OrderItem])
  @Authorized()
  async getOrderItems(@Ctx() context: AuthContextType): Promise<OrderItem[]> {
    const orderItems = await OrderItem.find({
      relations: { cart: true, variant: true, order: true },
    });
    if (!(context.user.role === "admin")) {
      throw new Error("Unauthorized");
    }
    return orderItems;
  }

  @Query(() => OrderItem)
  @Authorized()
  async getOrderItemsById(
    @Arg("id", () => ID) _id: number
  ): Promise<OrderItem | null> {
    const id = Number(_id);
    const orderItem = await OrderItem.findOne({
      where: { id },
      relations: { cart: true, variant: true, order: true },
    });

    return orderItem;
  }

  @Query(() => [OrderItem])
  @Authorized()
  async getOrderItemsByCartId(
    @Arg("id", () => Int) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItem[] | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({ where: { id } });
    if (!cart) {
      throw new Error("Cart not found.");
    }
    const orderItem = await OrderItem.find({
      where: { cart: { id } },
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

  @Query(() => [OrderItem])
  @Authorized()
  async getOrderItemsByOrderId(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItem[] | null> {
    const id = Number(_id);
    const order = await Order.findOne({ where: { id } });
    if (!order) {
      throw new Error("Order not found.");
    }
    const orderItem = await OrderItem.find({
      where: { order: { id } },
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

  @Mutation(() => OrderItem)
  @Authorized()
  async createOrderItems(
    @Arg("data", () => OrderItemsCreateInput) data: OrderItemsCreateInput
  ): Promise<OrderItem> {
    const { profileId, variantId, quantity, pricePerHour, startsAt, endsAt } =
      data;

    let cart = await Cart.findOne({
      where: { profile: profileId as any },
      relations: ["profile"],
    });

    if (!cart) {
      cart = Cart.create({ profile: profileId as any });
      await cart.save();
    }

    const newOrderItem = new OrderItem();
    Object.assign(newOrderItem, {
      quantity,
      pricePerHour,
      startsAt,
      endsAt,
      cart,
    });
    newOrderItem.variant = { id: variantId } as Variant;

    const errors = await validate(newOrderItem);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    await newOrderItem.save();
    return newOrderItem;
  }

  @Mutation(() => OrderItem, { nullable: true })
  @Authorized()
  async updateOrderItems(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => OrderItemsUpdateInput) data: OrderItemsUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<OrderItem | null> {
    const id = Number(_id);
    const orderItem = await OrderItem.findOne({
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

  @Mutation(() => OrderItem, { nullable: true })
  @Authorized()
  async deleteOrderItems(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItem | null> {
    const id = Number(_id);
    const orderItem = await OrderItem.findOne({
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
