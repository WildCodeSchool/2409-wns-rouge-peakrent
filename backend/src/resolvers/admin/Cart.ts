import { Cart, CartUpdateInputAdmin } from "@/entities/Cart";
import { Profile } from "@/entities/Profile";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Cart)
export class CartResolverAdmin {
  @Authorized(["admin"])
  @Query(() => [Cart])
  async getCarts(): Promise<Cart[]> {
    return await Cart.find({
      relations: {
        profile: true,
        orderItems: {
          variant: {
            product: {
              categories: true,
              activities: true,
            },
          },
        },
      },
    });
  }

  @Authorized("admin")
  @Query(() => Cart)
  async getCartByIdAdmin(
    @Arg("id", () => ID) _id: number
  ): Promise<Cart | null> {
    const id = Number(_id);
    const cart = await Cart.findOne({
      where: { id },
      relations: { profile: true },
    });

    return cart;
  }

  @Authorized("admin")
  @Mutation(() => Cart)
  async updateCartAdmin(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => CartUpdateInputAdmin) data: CartUpdateInputAdmin
  ): Promise<Cart | null> {
    const id = Number(_id);
    if (data.profileId) {
      const profile = await Profile.findOne({
        where: { id: data.profileId },
      });
      if (!profile) {
        throw new GraphQLError("profile not Found", {
          extensions: {
            code: "NOT_FOUND",
            entity: "Profile",
            http: { status: 404 },
          },
        });
      }
    }
    const cart = await Cart.findOne({
      where: { id },
    });

    if (cart !== null) {
      Object.assign(cart, data, { profile: data.profileId });
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
}
