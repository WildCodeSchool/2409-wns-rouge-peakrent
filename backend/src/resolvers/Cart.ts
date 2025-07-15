import { Cart, CartUpdateInput } from "@/entities/Cart";
import { Order, ValidateCartInput } from "@/entities/Order";
import { OrderItem } from "@/entities/OrderItem";
import { checkStockByVariantAndStore } from "@/helpers/checkStockByVariantAndStore";
import { generateOrderReference } from "@/helpers/generateOrderReference";
import { getTotalOrderPrice } from "@/helpers/getTotalOrderPrice";
import { AuthContextType, OrderStatusType, RoleType } from "@/types";
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

  // TODO A supprimer ? on peut supprimer les orderItems à 'intérieur mais pas d'intérêt à supprimer le cart
  // @Authorized(RoleType.admin, RoleType.user)
  // @Mutation(() => Cart, { nullable: true })
  // async deleteCart(
  //   @Arg("id", () => ID) _id: number,
  //   @Ctx() context: AuthContextType
  // ): Promise<Cart | null> {
  //   const id = Number(_id);
  //   const cart = await Cart.findOne({
  //     where: { id },
  //   });
  //   if (cart !== null) {
  //     if (
  //       !(context.user.role === "admin" || context.user.id === cart.profile.id)
  //     ) {
  //       throw new Error("Unauthorized");
  //     }
  //     await cart.remove();
  //     return cart;
  //   } else {
  //     throw new Error("cart not found.");
  //   }
  // }

  // a compléter ave Stripe
  @Authorized(RoleType.admin, RoleType.user)
  @Mutation(() => Order, { nullable: true })
  async validateCart(
    @Arg("data", () => ValidateCartInput) data: ValidateCartInput,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const profileId = context.user.id;
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }
    const cart = await Cart.findOne({
      where: { profile: { id: profileId } },
    });
    if (cart !== null) {
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

      const storeId = 1;

      if (orderItems.length > 0) {
        for (const orderItem of orderItems) {
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
        }

        const reference = generateOrderReference(new Date().toString());

        //TODO A compléter avec stripe, si OrderPaymentType.onSite on valide l'order, sinon on on renvoit vers Stripe
        // if(data.paymentMethod !== OrderPaymentType.onSite) {

        // }

        const order = new Order();
        const orderData = {
          profileId,
          date: new Date(),
          status: OrderStatusType.confirmed,
          paymentMethod: data.paymentMethod,
          reference: reference,
          paidAt: new Date(),
          address1: cart.address1,
          address2: cart.address2,
          country: cart.country,
          city: cart.city,
          zipCode: cart.zipCode,
        };

        // A Verifier
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const totalPrice = getTotalOrderPrice(orderItems);

        Object.assign(order, orderData, { profile: orderData.profileId });
        await order.save();

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

        await cart.save();

        return order;
      } else {
        throw new GraphQLError("No items found in this cart", {
          extensions: {
            code: "EMPTY_CART",
            entity: "cart",
          },
        });
      }
    } else {
      throw new GraphQLError("cart not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
          entity: "cart",
        },
      });
    }
  }
}
