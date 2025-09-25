import { Payment } from "../entities/Payment";
import { StripePaymentStatusType } from "../types";
import { GraphQLError } from "graphql";
import Stripe from "stripe";

export const updatePayment = async (
  paymentIntent: Stripe.PaymentIntent
): Promise<Payment> => {
  // relations to activate @afterUpdate
  const payment = await Payment.findOne({
    where: { stripePaymentIntentId: paymentIntent.id },
    relations: ["order"],
  });
  if (!payment) {
    throw new GraphQLError("payment not found", {
      extensions: {
        code: "NOT_FOUND",
        http: { status: 404 },
        entity: "payment",
      },
    });
  }

  if (paymentIntent.last_payment_error) {
    payment.lastPaymentError = true;
  } else {
    payment.lastPaymentError = false;
  }

  payment.status = paymentIntent.status as StripePaymentStatusType;
  await payment.save();

  return payment;
};
