import { Cart, CartUpdateInput } from "@/entities/Cart";
import { Order, ValidateCartInput } from "@/entities/Order";
import { OrderItem } from "@/entities/OrderItem";
import { Payment } from "@/entities/Payment";
import { checkStockByVariantAndStore } from "@/helpers/checkStockByVariantAndStore";
import { generateOrderReference } from "@/helpers/generateOrderReference";
import {
  AuthContextType,
  OrderPaymentType,
  OrderStatusType,
  RoleType,
  StripePaymentStatusType,
} from "@/types";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Cart)
export class CartResolver {
  // TODO Voir pour before insert / before update pour la vérification des dates + disponibilité des items ?
  // Ajouter la création de Cart directement à la création d'un user plutôt qu'à l'ajout des orderItms dans le panier ?

  @Query(() => Cart, { nullable: true })
  @Authorized(RoleType.admin, RoleType.user)
  async getCart(
    @Ctx() context: AuthContextType,
    @Arg("withOrderItems", () => Boolean, { defaultValue: false })
    withOrderItems?: boolean
  ): Promise<Cart | null> {
    const profileId = context.user.id;

    const relations: any = {};

    if (withOrderItems) {
      relations.orderItems = {
        variant: {
          product: true,
        },
      };
    }

    const cart = await Cart.findOne({
      where: { profile: { id: profileId } },
      relations,
    });

    return cart;
  }

  @Authorized(RoleType.admin, RoleType.user)
  @Mutation(() => Cart, { nullable: true })
  async updateCart(
    @Arg("data", () => CartUpdateInput) data: CartUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Cart | null> {
    const id = context.user.id;

    const cart = await Cart.findOne({
      where: { profile: { id } },
    });

    if (cart !== null) {
      Object.assign(cart, data);
      const errors = await validate(cart);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await cart.save();
        return cart;
      }
    } else {
      throw new GraphQLError("Cart not Found", {
        extensions: {
          code: "NOT_FOUND",
          entity: "Cart",
          http: { status: 404 },
        },
      });
    }
  }

  @Authorized(RoleType.admin, RoleType.user)
  @Mutation(() => Order, { nullable: true })
  async validateCart(
    @Arg("data", () => ValidateCartInput) data: ValidateCartInput,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const profileId = context.user.id;
    const cart = await Cart.findOne({
      where: { profile: { id: profileId } },
    });

    if (cart === null) {
      throw new GraphQLError("cart not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
          entity: "cart",
        },
      });
    }

    if (!cart.address1 || !cart.city || !cart.country) {
      throw new GraphQLError(
        "The cart must include an address, city, and country to be converted into an order.",
        {
          extensions: {
            code: "INVALID_CART_ADDRESS",
            entity: "Cart",
          },
        }
      );
    }

    const orderItems = await OrderItem.find({
      where: { cart: { id: cart.id } },
      relations: { cart: true, variant: true },
    });

    if (orderItems.length === 0) {
      throw new GraphQLError("No order items found in cart", {
        extensions: { code: "NO_ORDER_ITEMS" },
      });
    }

    const storeId = 1;

    for (const orderItem of orderItems) {
      if (!orderItem.startsAt || !orderItem.endsAt) {
        throw new GraphQLError(
          `Missing booking dates for item ${orderItem.id}`,
          {
            extensions: { code: "INVALID_ORDER_ITEM", entity: "OrderItem" },
          }
        );
      }
      if (
        (await checkStockByVariantAndStore(
          storeId,
          orderItem.variant.id,
          orderItem.startsAt,
          orderItem.endsAt
        )) === 0
      ) {
        throw new GraphQLError(
          `Store is out of stock for item ${orderItem.id}`,
          {
            extensions: {
              code: "OUT_OF_STOCK",
              entity: "StoreVariant",
            },
          }
        );
      }

      const reference = generateOrderReference(new Date().toString());
      const status =
        data.paymentMethod === OrderPaymentType.onSite
          ? OrderStatusType.confirmed
          : OrderStatusType.pending;

      const payment = await Payment.findOne({
        where: { clientSecret: data.clientSecret },
      });

      if (payment === null) {
        throw new GraphQLError(
          `No payment found matching the provided clientSecret.`,
          {
            extensions: {
              code: "NOT_FOUND",
              http: { status: 404 },
              entity: "payment",
            },
          }
        );
      }

      const order = new Order();
      const orderData = {
        profileId,
        date: new Date(),
        status,
        paymentMethod: data.paymentMethod,
        reference: reference,
        paidAt: new Date(),
        address1: cart.address1,
        address2: cart.address2,
        country: cart.country,
        city: cart.city,
        zipCode: cart.zipCode,
        payment,
      };
      Object.assign(order, orderData, { profile: orderData.profileId });

      const errorsOrder = await validate(Order);
      if (errorsOrder.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errorsOrder)}`);
      }

      await order.save();

      if (data.paymentMethod === OrderPaymentType.onSite) {
        payment.status = StripePaymentStatusType.ToBePaid;
      }

      payment.order = order;

      await payment.save();

      await Promise.all(
        orderItems.map(async (item) => {
          item.cart = null;
          item.order = order;
          await item.save();
        })
      );

      Object.assign(cart, {
        address1: null,
        address2: null,
        country: null,
        city: null,
        zipCode: null,
      });

      const errorsCart = await validate(cart);
      if (errorsCart.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errorsCart)}`);
      }

      await cart.save();

      return order;
    }
  }
}
