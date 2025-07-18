import { Cart } from "@/entities/Cart";
import { OrderItem } from "@/entities/OrderItem";
import { Payment } from "@/entities/Payment";
import { Profile } from "@/entities/Profile";
import { getTotalOrderPrice } from "@/helpers/getTotalOrderPrice";
import { AuthContextType, RoleType } from "@/types";
import { GraphQLError } from "graphql";
import { default as Stripe } from "stripe";
import { Authorized, Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class PaymentResolver {
  @Authorized(RoleType.admin, RoleType.user)
  @Mutation(() => Payment)
  async createPaymentIntent(
    @Ctx() context: AuthContextType
  ): Promise<{ clientSecret: string }> {
    const profileId = context.user.id;
    const cart = await Cart.findOne({
      where: { profile: { id: profileId } },
    });
    const profile = await Profile.findOne({ where: { id: profileId } });
    if (cart === null) {
      throw new GraphQLError("cart not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
          entity: "cart",
        },
      });
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

    const amount = getTotalOrderPrice(orderItems);
    const stripe = new Stripe(process.env.STRIPE_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const payment = new Payment();

    const paymentData = {
      stripePaymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      profile,
    };

    Object.assign(payment, paymentData);
    await payment.save();

    return { clientSecret: paymentIntent.client_secret! };
  }
}
