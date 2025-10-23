import {
  Resolver,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  Int,
} from "type-graphql";
import { resetAndSeedTestData } from "../../services/testResetService";
import { ContextType, StripePaymentStatusType } from "@/types";
import { Cart } from "@/entities/Cart";
import { OrderItem } from "@/entities/OrderItem";
import { Variant } from "@/entities/Variant";
import { Payment } from "@/entities/Payment";

@ObjectType()
class TestOk {
  @Field() ok!: boolean;
}

@Resolver()
export class TestResolver {
  @Mutation(() => TestOk, { description: "⚠️ TEST ONLY: reset DB + seed" })
  async resetTestData(): Promise<TestOk> {
    if (process.env.NODE_ENV !== "dev") {
      throw new Error("resetTestData is only available with NODE_ENV=dev");
    }
    const r = await resetAndSeedTestData();
    return { ok: !!r.ok };
  }

  @Mutation(() => TestOk, {
    description: "⚠️ TEST ONLY: add item to current user's cart",
  })
  async addItemToCartTest(
    @Ctx() ctx: ContextType,
    @Arg("variantId", () => Int) variantId: number,
    @Arg("from") from: Date,
    @Arg("to") to: Date,
    @Arg("quantity", () => Int, { defaultValue: 1 }) quantity: number
  ): Promise<TestOk> {
    if (process.env.NODE_ENV !== "dev") throw new Error("TEST ONLY");
    if (!ctx.user) throw new Error("Auth required");

    const profileId = ctx.user.id;
    let cart = await Cart.findOne({ where: { profile: { id: profileId } } });
    if (!cart) {
      cart = new Cart();
      Object.assign(cart, { profile: profileId });
      await cart.save();
    }

    const variant = await Variant.findOne({
      where: { id: variantId },
      relations: { product: true },
    });
    if (!variant) throw new Error("Variant not found");

    const item = new OrderItem();
    Object.assign(item, {
      cart,
      variant,
      quantity,
      pricePerDay: variant.pricePerDay,
      startsAt: from,
      endsAt: to,
    });
    await item.save();

    return { ok: true };
  }

  @Mutation(() => TestOk, {
    description: "⚠️ TEST ONLY: ensure a Payment exists for current user",
  })
  async ensureTestPayment(
    @Ctx() ctx: ContextType,
    @Arg("clientSecret") clientSecret: string
  ): Promise<TestOk> {
    if (process.env.NODE_ENV !== "dev") throw new Error("TEST ONLY");
    if (!ctx.user) throw new Error("Auth required");

    let payment = await Payment.findOne({ where: { clientSecret } });
    if (!payment) {
      payment = new Payment();
      Object.assign(payment, {
        clientSecret,
        status: StripePaymentStatusType.ToBePaid,
        profile: ctx.user.id,
      });
      await payment.save();
    }
    return { ok: true };
  }
}
