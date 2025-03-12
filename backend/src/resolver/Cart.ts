import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { AuthContextType, OrderStatusType } from "../types";
import { validate } from "class-validator";
import { OrderItems } from "../entities/OrderItems";
import { Cart, CartCreateInput, CartUpdateInput } from "../entities/Cart";
import { Profile } from "../entities/Profile";
import { Equal } from "typeorm";
import { Order, ValidateCartInput } from "../entities/Order";

@Resolver(Cart)
export class CartResolver {
  @Query(() => [Cart])
  @Authorized()
  async getCart(): Promise<Cart[]> {
    const cart = await Cart.find({ relations: { profile_id: true } });
    return cart;
  }

  @Authorized("user")
  @Query(() => Cart)
  async getCartById(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Cart | null> {
   
    const id = Number(_id);
    const cart = await Cart.findOne({
      where: { id },
      relations: { profile_id: true },
    });

    if (!(context.user.role === "admin" || context.user.id === cart.profile_id.user_id)) {
      throw new Error("Unauthorized");
    }

    return cart;
  }

  @Authorized("user")
  @Mutation(() => Cart)
  async createCart(
    @Arg("data", () => CartCreateInput) data: CartCreateInput
  ): Promise<Cart> {
    const profile = await Profile.findOne({
      where: { user_id: data.profile_id },
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

  @Authorized("user")
  @Mutation(() => Cart, { nullable: true })
  async updateCart(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => CartUpdateInput) data: CartUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Cart | null> {
    const id = Number(_id);
    if (data.profile_id) {
      const profile = await Profile.findOne({
        where: { user_id: data.profile_id },
      });
      if (!profile) {
        throw new Error(`profile not found`);
      }
    }
    const cart = await Cart.findOne({
      where: { id },
    });

    if (cart !== null) {
      
    if (!(context.user.role === "admin" || context.user.id === cart.profile_id.user_id)) {
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

  @Authorized("user")
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
      if (!(context.user.role === "admin" || context.user.id === cart.profile_id.user_id)) {
        throw new Error("Unauthorized");
      }
      await cart.remove();
      return cart;
    } else {
      throw new Error("cart not found.");
    }
  }

  // a compléter ave Stripe
  @Authorized("user")
  @Mutation(() => Cart, { nullable: true })
  async validateCart(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => ValidateCartInput) data: ValidateCartInput,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({
      where: { id },
      relations: { profile_id: true },
    });
    if (cart !== null) {
      if (!(context.user.role === "admin" || context.user.id === cart.profile_id.user_id)) {
        throw new Error("Unauthorized");
      }
      const orderItems = await OrderItems.find({
        where: { cart_id: Equal(id) },
        relations: { variant_id: true },
      });
      if (orderItems !== null) {
        const errors = await validate(orderItems);
        if (errors.length > 0) {
          throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
        const order = new Order();
        const orderData = {
          profile_id: cart.profile_id,
          status: OrderStatusType.confirmed,
          payment_method: data.payment_method,
          reference: data.reference,
          paid_at: new Date(),
          address_1: cart.address_1,
          address_2: cart.address_2,
          country: cart.country,
          city: cart.city,
          zip_code: cart.zip_code,
        };

        // A Verifier
        const totalPrice = orderItems.reduce((sum, item) => {
          const start = new Date(item.starts_at);
          const end = new Date(item.ends_at);
          const durationHours =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return sum + item.variant_id?.price_per_hour * durationHours;
        }, 0);

        Object.assign(order, orderData);
        await order.save();

        await Promise.all(
          orderItems.map(async (item) => {
            item.cart_id = null;
            item.order_id = order;
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
