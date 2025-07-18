import { Payment } from "@/entities/Payment";
import { updatePayment } from "@/service/paymentService";
import { RoleType } from "@/types";
import { GraphQLJSONObject } from "graphql-scalars";
import { default as Stripe } from "stripe";
import { Arg, Authorized, Mutation, Resolver } from "type-graphql";

@Resolver()
export class PaymentResolver {
  @Authorized(RoleType.admin, RoleType.superadmin)
  @Mutation(() => Payment)
  async updatePaymentAndOrder(
    @Arg("paymentIntent", () => GraphQLJSONObject)
    paymentIntent: Stripe.PaymentIntent
  ): Promise<Payment> {
    const payment = await updatePayment(paymentIntent);
    return payment;
  }
}
