import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { GraphQLError } from "graphql";
import { RoleType, AuthContextType } from "@/types";
import { Cart } from "@/entities/Cart";
import { Voucher } from "@/entities/Voucher";
import { OrderItem } from "@/entities/OrderItem";
import { getTotalOrderPrice } from "@/helpers/getTotalOrderPrice";
import { computeDiscountAmount } from "@/helpers/computeDiscountAmount";

@Resolver()
export class CartVoucherResolver {
  @Mutation(() => Cart)
  @Authorized(RoleType.user, RoleType.admin)
  async applyVoucherToMyCart(
    @Arg("code") code: string,
    @Ctx() context: AuthContextType
  ): Promise<Cart> {
    const profileId = context.user.id;

    const cart = await Cart.findOne({
      where: { profile: { id: profileId } },
      relations: { voucher: true },
    });
    if (!cart) {
      throw new GraphQLError("cart not found", {
        extensions: { code: "NOT_FOUND", entity: "cart" },
      });
    }

    const voucher = await Voucher.findOne({
      where: { code: code.toUpperCase() },
    });
    if (!voucher) {
      throw new GraphQLError("voucher not found", {
        extensions: { code: "NOT_FOUND", entity: "voucher" },
      });
    }

    const items = await OrderItem.find({ where: { cart: { id: cart.id } } });
    if (items.length === 0) {
      throw new GraphQLError("No items in cart", {
        extensions: { code: "NO_ORDER_ITEMS" },
      });
    }

    const subtotal = getTotalOrderPrice(items);
    const discount = computeDiscountAmount(subtotal, voucher);
    if (discount <= 0) {
      throw new GraphQLError("Voucher not applicable", {
        extensions: { code: "VOUCHER_NOT_APPLICABLE" },
      });
    }

    cart.voucher = voucher;
    await cart.save();
    return cart;
  }

  @Mutation(() => Cart)
  @Authorized(RoleType.user, RoleType.admin)
  async removeVoucherFromMyCart(
    @Ctx() context: AuthContextType
  ): Promise<Cart> {
    const profileId = context.user.id;
    const cart = await Cart.findOne({
      where: { profile: { id: profileId } },
      relations: { voucher: true },
    });
    if (!cart) {
      throw new GraphQLError("cart not found", {
        extensions: { code: "NOT_FOUND", entity: "cart" },
      });
    }
    cart.voucher = null as any;
    await cart.save();
    return cart;
  }
}
