import express from "express";
import stripe from "stripe";
import app from "./express";

const endpointSecret =
  process.env.NODE_ENV === "prod"
    ? process.env.PROD_WEBHOOK_ENDPOINT
    : process.env.DEV_WEBHOOK_ENDPOINT;

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    // insert stripe_webhooks
    let event;
    if (endpointSecret) {
      const signature = request.headers["stripe-signature"] as string;
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }

      if (
        event.type === "payment_intent.succeeded" ||
        event.type === "payment_intent.canceled" ||
        event.type === "payment_intent.requires_payment_method"
      ) {
        const paymentIntent = event.data.object;
        const responsePayment = await fetch("http://backend:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${process.env.ADMIN_GRAPHQL_TOKEN}`,
          },
          body: JSON.stringify({
            query: `
                mutation updatePaymentAndOrder($paymentIntent: JSONObject!) {
                  updatePaymentAndOrder(paymentIntent: $paymentIntent) {
                    id
                    status
                    order {
                    status
                    }
                  }
                }
              `,
            variables: { paymentIntent },
          }),
        });
        const json = await responsePayment.json();
        console.log("Réponse JSON :", json);
      }
      response.json({ received: true });
    } else {
      response.status(400).send("Endpoint secret not configured");
    }
  }
);
