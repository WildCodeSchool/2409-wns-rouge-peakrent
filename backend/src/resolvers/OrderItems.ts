import { Cart } from "@/entities/Cart";
import { Order } from "@/entities/Order";
import {
  OrderItem,
  OrderItemsCreateInput,
  OrderItemsUpdateInput,
} from "@/entities/OrderItem";
import { Variant } from "@/entities/Variant";
import { checkStockByVariantAndStore } from "@/helpers/checkStockByVariantAndStore";
import { AuthContextType } from "@/types";
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

@Resolver(OrderItem)
export class OrderItemsResolver {
  @Query(() => OrderItem)
  @Authorized("user", "admin")
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
  @Authorized("user", "admin")
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

  @Mutation(() => OrderItem)
  @Authorized("user", "admin")
  async createOrderItems(
    @Arg("data", () => OrderItemsCreateInput)
    data: OrderItemsCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<OrderItem> {
    const profileId = context.user.id;
    const {
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

    //TODO simplifier en mettant un before update / insert ?
    if (new Date(startsAt) > new Date(endsAt)) {
      throw new GraphQLError(
        "The end date cannot be earlier than the start date.",
        {
          extensions: {
            code: "BAD_USER_INPUT",
            entity: "OrderItem",
          },
        }
      );
    }
    if (!variant) {
      throw new GraphQLError("Variant does not exist", {
        extensions: {
          code: "NOT_FOUND",
          entity: "Variant",
          http: { status: 404 },
        },
      });
    }

    const storeId = 1;

    const availableQuantity = await checkStockByVariantAndStore(
      storeId,
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

    if (!cartId && !orderId) {
      let cart = await Cart.findOne({
        where: { profile: { id: profileId } },
        relations: ["profile"],
      });
      // TODO créer le panier avec le user directement comme il n'est jamais supprimé ?
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
  @Authorized("user", "admin")
  async updateOrderItem(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => OrderItemsUpdateInput)
    data: OrderItemsUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<OrderItem | null> {
    const id = Number(_id);
    const profileId = context.user.id;
    const orderItem = await OrderItem.findOne({
      where: {
        id,
        cart: { id: Not(IsNull()), profile: { id: profileId } },
      },
      relations: { variant: { product: true } },
    });

    if (orderItem !== null) {
      const startsAt = data.startsAt ? data.startsAt : orderItem.startsAt;
      const endsAt = data.endsAt ? data.endsAt : orderItem.endsAt;
      const quantity = data.quantity ? data.quantity : orderItem.quantity;

      if (new Date(startsAt) > new Date(endsAt)) {
        throw new GraphQLError(
          "The end date cannot be earlier than the start date.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              entity: "OrderItem",
            },
          }
        );
      }

      const storeId = 1;

      const availableQuantity = await checkStockByVariantAndStore(
        storeId,
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
  @Authorized("admin", "user")
  async deleteOrderItemForCart(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Partial<OrderItem> | null> {
    const id = Number(_id);
    const profileId = context.user.id;
    const orderItem = await OrderItem.findOne({
      where: {
        id,
        cart: { id: Not(IsNull()), profile: { id: profileId } },
      },
      relations: { variant: { product: true } },
    });

    if (orderItem !== null) {
      await orderItem.remove();
      return { id };
    } else {
      throw new Error("orderItems not found.");
    }
  }

  @Mutation(() => [ID], { nullable: true })
  @Authorized("admin", "user")
  async deleteOrderItemsCart(
    @Ctx() context: AuthContextType
  ): Promise<number[] | null> {
    const profileId = context.user.id;

    const orderItems = await OrderItem.find({
      where: { cart: { id: Not(IsNull()), profile: { id: profileId } } },
    });

    if (orderItems.length > 0) {
      const deletedIds = orderItems.map((orderItem) => orderItem.id);

      await OrderItem.remove(orderItems);
      return deletedIds;
    } else {
      throw new GraphQLError(`Order item not found for this user`, {
        extensions: {
          code: "NOT_FOUND",
          entity: "orderItem",
          http: { status: 404 },
        },
      });
    }
  }
}
