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
import { Equal } from "typeorm";
import { Cart, CartCreateInput, CartUpdateInput } from "../entities/Cart";
import { Order, ValidateCartInput } from "../entities/Order";
import { OrderItems } from "../entities/OrderItems";
import { Profile } from "../entities/Profile";
import { AuthContextType, OrderStatusType } from "../types";

@Resolver(Cart)
export class CartResolver {
  @Query(() => [Cart])
  @Authorized()
  async getCart(@Ctx() context: AuthContextType): Promise<Cart[]> {
    const cart = await Cart.find({ relations: { profileId: true } });
    if (!(context.user.role === "admin")) {
      throw new Error("Unauthorized");
    }
    return cart;
  }

  @Authorized()
  @Query(() => Cart)
  async getCartById(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Cart | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({
      where: { id },
      relations: { profileId: true },
    });

    if (
      !(context.user.role === "admin" || context.user.id === cart.profileId.id)
    ) {
      throw new Error("Unauthorized");
    }

    return cart;
  }

  @Authorized()
  @Mutation(() => Cart)
  async createCart(
    @Arg("data", () => CartCreateInput) data: CartCreateInput
  ): Promise<Cart> {
    const profile = await Profile.findOne({
      where: { id: data.profile_id },
    });
    if (!profile) {
      throw new Error(`profile not found`);
    }
    const newCart = new Cart();
    Object.assign(newCart, data);
    const errors = await validate(newCart);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newCart.save();
      return newCart;
    }
  }

  @Authorized()
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
        !(
          context.user.role === "admin" || context.user.id === cart.profileId.id
        )
      ) {
        throw new Error("Unauthorized");
      }
      Object.assign(cart, data);
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

  @Authorized()
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
        !(
          context.user.role === "admin" || context.user.id === cart.profileId.id
        )
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
  @Authorized()
  @Mutation(() => Cart, { nullable: true })
  async validateCart(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => ValidateCartInput) data: ValidateCartInput,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({
      where: { id },
      relations: { profileId: true },
    });
    if (cart !== null) {
      if (
        !(
          context.user.role === "admin" || context.user.id === cart.profileId.id
        )
      ) {
        throw new Error("Unauthorized");
      }
      const orderItems = await OrderItems.find({
        where: { cartId: Equal(id) },
        relations: { variantId: true },
      });
      if (orderItems !== null) {
        const errors = await validate(orderItems);
        if (errors.length > 0) {
          throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
        const order = new Order();
        const orderData = {
          profile_id: cart.profileId,
          status: OrderStatusType.confirmed,
          payment_method: data.payment_method,
          reference: data.reference,
          paid_at: new Date(),
          address_1: cart.address1,
          address_2: cart.address2,
          country: cart.country,
          city: cart.city,
          zip_code: cart.zipCode,
        };

        // A Verifier
        const totalPrice = orderItems.reduce((sum, item) => {
          const start = new Date(item.startsAt);
          const end = new Date(item.endsAt);
          const durationHours =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return sum + item.variantId?.price_per_hour * durationHours;
        }, 0);

        Object.assign(order, orderData);
        await order.save();

        await Promise.all(
          orderItems.map(async (item) => {
            item.cartId = null;
            item.orderId = order;
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
