import { loadStripe } from "@stripe/stripe-js";

const stripeKey =
  import.meta.env.VITE_PUBLIC_STRIPE_KEY || "pk_test_oKhSR5nslBRnBZpjO6KuzZeX";

export const stripePromise = loadStripe(stripeKey);
