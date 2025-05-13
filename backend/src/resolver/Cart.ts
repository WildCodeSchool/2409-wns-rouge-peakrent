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
import { Cart, CartCreateInput, CartUpdateInput } from "../entities/Cart";
import { Order, ValidateCartInput } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Profile } from "../entities/Profile";
import { checkStockByVariantAndStore } from "../helpers/checkStockByVariantAndStore";
import { getTotalOrderPrice } from "../helpers/getTotalOrderPrice";
import { AuthContextType, OrderStatusType } from "../types";

@Resolver(Cart)
export class CartResolver {
  @Query(() => [Cart])
  @Authorized("admin")
  async getCart(@Ctx() context: AuthContextType): Promise<Cart[]> {
    const cart = await Cart.find({ relations: { profile: true } });
    if (!(context.user.role === "admin")) {
      throw new Error("Unauthorized");
    }
    return cart;
  }

  @Authorized(["admin"])
  @Query(() => [Cart])
  async getCarts(): Promise<Cart[]> {
    return await Cart.find({
      relations: {
        profile: true,
      },
    });
  }

  @Authorized("admin", "user")
  @Query(() => Cart)
  async getCartById(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Cart | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({
      where: { id },
      relations: { profile: true },
    });

    if (
      !(context.user.role === "admin" || context.user.id === cart.profile.id)
    ) {
      throw new Error("Unauthorized");
    }

    return cart;
  }

  @Authorized("user", "admin")
  @Query(() => Cart, { nullable: true })
  async getCartByProfile(
    @Arg("profileId", () => Int) profileId: number
  ): Promise<Cart | null> {
    return await Cart.findOne({
      where: { profile: { id: profileId } },
      relations: { profile: true },
    });
  }

  @Authorized("admin", "user")
  @Mutation(() => Cart)
  async createCart(
    @Arg("data", () => CartCreateInput) data: CartCreateInput
  ): Promise<Cart> {
    const profile = await Profile.findOne({
      where: { id: data.profileId },
    });
    if (!profile) {
      throw new Error(`profile not found`);
    }
    const newCart = new Cart();
    Object.assign(newCart, data, { profile: data.profileId });
    const errors = await validate(newCart);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newCart.save();
      return newCart;
    }
  }

  @Authorized("admin", "user")
  @Mutation(() => Cart, { nullable: true })
  async updateCart(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => CartUpdateInput) data: CartUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Cart | null> {
    const id = Number(_id);
    if (data.profileId) {
      const profile = await Profile.findOne({
        where: { id: data.profileId },
      });
      if (!profile) {
        throw new Error(`profile not found`);
      }
    }
    const cart = await Cart.findOne({
      where: { id },
    });

    if (cart !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === cart.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      Object.assign(cart, data, { profile: data.profileId });
      const errors = await validate(cart);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await cart.save();
        return cart;
      }
    } else {
      throw new Error("cart not found.");
    }
  }

  @Authorized("admin", "user")
  @Mutation(() => Cart, { nullable: true })
  async deleteCart(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Cart | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({
      where: { id },
    });
    if (cart !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === cart.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      await cart.remove();
      return cart;
    } else {
      throw new Error("cart not found.");
    }
  }

  // a compléter ave Stripe
  @Authorized("admin", "user")
  @Mutation(() => Cart, { nullable: true })
  async validateCart(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => ValidateCartInput) data: ValidateCartInput,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }
    const cart = await Cart.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (cart !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === cart.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      const orderItems = await OrderItem.find({
        where: { cart: { id } },
        relations: { cart: true, variant: true },
      });
      if (orderItems.length > 0) {
        for (const orderItem of orderItems) {
          if (
            (await checkStockByVariantAndStore(
              orderItem.variant.id,
              data.storeId,
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
        const order = new Order();
        const orderData = {
          profileId: cart.profile.id,
          status: OrderStatusType.confirmed,
          paymentMethod: data.paymentMethod,
          reference: data.reference,
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

        await cart.remove();
        return order;
      } else {
        throw new Error("no items found in this cart.");
      }
    } else {
      throw new Error("cart not found.");
    }
  }
}
