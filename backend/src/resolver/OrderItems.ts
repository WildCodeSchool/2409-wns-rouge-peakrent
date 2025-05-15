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
} from "type-graphql";
import { IsNull, Not } from "typeorm";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import {
  OrderItem,
  OrderItemsCreateInput,
  OrderItemsUpdateInput,
  OrderItemsUpdateInputForUser,
} from "../entities/OrderItem";
import { Profile } from "../entities/Profile";
import { Variant } from "../entities/Variant";
import { checkStockByVariantAndStore } from "../helpers/checkStockByVariantAndStore";
import { AuthContextType, OrderItemStatusType } from "../types";

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
  async getOrderItemsCartByProfileId(
    @Arg("id", () => Int) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<OrderItem[] | null> {
    const id = Number(_id);
    const profile = await Profile.findOne({ where: { id } });
    if (!profile) {
      throw new GraphQLError("profile not found", {
        extensions: {
          code: "NOT_FOUND",
          entity: "Profile",
          http: { status: 404 },
        },
      });
    }
    const orderItem = await OrderItem.find({
      where: { cart: { id: Not(IsNull()), profile: { id } } },
      relations: {
        cart: true,
        variant: {
          product: true,
        },
      },
    });
    if (
      !(
        context.user.role === "admin" ||
        context.user.id === orderItem[0].cart.profile.id
      )
    ) {
      throw new GraphQLError("Unauthorized", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 403 },
        },
      });
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
    const {
      profileId,
      variantId,
      quantity,
      pricePerHour,
      startsAt,
      endsAt,
      orderId,
      cartId,
    } = data;

    let dataOrderItems: {
      quantity: number;
      pricePerHour: number;
      startsAt: Date;
      endsAt: Date;
      cart?: Cart;
      order?: Order;
    } = {
      quantity,
      pricePerHour,
      startsAt,
      endsAt,
    };
    const variant = await Variant.findOne({
      where: { id: variantId },
      relations: ["product"],
    });

    if (!variant) {
      throw new GraphQLError("Variant does not exist", {
        extensions: {
          code: "NOT_FOUND",
          entity: "Variant",
          http: { status: 404 },
        },
      });
    }

    const availableQuantity = await checkStockByVariantAndStore(
      1,
      variantId,
      startsAt,
      endsAt
    );

    if (availableQuantity - quantity < 0) {
      throw new GraphQLError(`Store is out of stock`, {
        extensions: {
          code: "OUT_OF_STOCK",
          entity: "StoreVariant",
        },
      });
    }

    if (cartId || !orderId) {
      let cart = await Cart.findOne({
        where: { profile: { id: profileId } },
        relations: ["profile"],
      });

      if (!cart) {
        cart = Cart.create({ profile: { id: profileId } });
        await cart.save();
      }
      dataOrderItems = {
        ...dataOrderItems,
        cart,
      };
    }

    if (orderId) {
      const order = await Order.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new GraphQLError("Order does not exist", {
          extensions: {
            code: "NOT_FOUND",
            entity: "Order",
            http: { status: 404 },
          },
        });
      }

      dataOrderItems = {
        ...dataOrderItems,
        order,
      };
    }

    const newOrderItem = new OrderItem();
    Object.assign(newOrderItem, dataOrderItems);
    newOrderItem.variant = variant;

    const errors = await validate(newOrderItem);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    await newOrderItem.save();
    return newOrderItem;
  }

  @Mutation(() => OrderItem, { nullable: true })
  @Authorized("admin")
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
      const variantId = data.variantId ? data.variantId : orderItem.variant.id;
      const startsAt = data.startsAt ? data.startsAt : orderItem.startsAt;
      const endsAt = data.endsAt ? data.endsAt : orderItem.endsAt;
      const quantity = data.quantity ? data.quantity : orderItem.quantity;

      const availableQuantity = await checkStockByVariantAndStore(
        1,
        variantId,
        startsAt,
        endsAt
      );

      if (availableQuantity - quantity < 0) {
        throw new GraphQLError(`Store is out of stock`, {
          extensions: {
            code: "OUT_OF_STOCK",
            entity: "StoreVariant",
          },
        });
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
      throw new GraphQLError(`OrderItem not found`, {
        extensions: {
          code: "NOT_FOUND",
          entity: "orderItems",
          http: { status: 404 },
        },
      });
    }
  }

  @Mutation(() => OrderItem, { nullable: true })
  @Authorized()
  async updateOrderItemsForUser(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => OrderItemsUpdateInputForUser)
    data: OrderItemsUpdateInputForUser,
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
          context.user.id === orderItem.cart.profile.user.id ||
          context.user.id === orderItem.order.profile.user.id
        )
      ) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 403 },
          },
        });
      }

      const startsAt = data.startsAt ? data.startsAt : orderItem.startsAt;
      const endsAt = data.endsAt ? data.endsAt : orderItem.endsAt;
      const quantity = data.quantity ? data.quantity : orderItem.quantity;

      const availableQuantity = await checkStockByVariantAndStore(
        1,
        orderItem.variant.id,
        startsAt,
        endsAt
      );

      if (availableQuantity - quantity < 0) {
        throw new GraphQLError(`Store is out of stock`, {
          extensions: {
            code: "OUT_OF_STOCK",
            entity: "StoreVariant",
          },
        });
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
      throw new GraphQLError(`OrderItem not found`, {
        extensions: {
          code: "NOT_FOUND",
          entity: "orderItems",
          http: { status: 404 },
        },
      });
    }
  }

  @Mutation(() => OrderItem, { nullable: true })
  @Authorized("admin")
  async cancelOrderItemForOrder(
    @Arg("orderItemId", () => ID) orderItemId: number,
    @Arg("orderId", () => ID) orderId: number
  ): Promise<Partial<OrderItem> | null> {
    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      throw new GraphQLError(`Order not found`, {
        extensions: {
          code: "NOT_FOUND",
          entity: "order",
          http: { status: 404 },
        },
      });
    }

    const orderItem = await OrderItem.findOne({ where: { id: orderItemId } });

    if (!orderItem) {
      throw new GraphQLError(`Order item not found`, {
        extensions: {
          code: "NOT_FOUND",
          entity: "orderItem",
          http: { status: 404 },
        },
      });
    }

    orderItem.statut = OrderItemStatusType.canceled;
    await orderItem.save();

    return orderItem;
  }

  @Mutation(() => OrderItem, { nullable: true })
  @Authorized()
  async deleteOrderItemForCart(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Partial<OrderItem> | null> {
    const id = Number(_id);
    const orderItem = await OrderItem.findOne({
      where: { id },
    });
    if (orderItem !== null) {
      if (
        !(
          context.user.role === "admin" ||
          context.user.id === orderItem.cart.profile.user.id ||
          context.user.id === orderItem.order.profile.user.id
        )
      ) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 403 },
          },
        });
      }
      await orderItem.remove();
      return { id };
    } else {
      throw new Error("orderItems not found.");
    }
  }
}
