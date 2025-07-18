import { LoadIcon } from "@/components/icons/LoadIcon";
import { CREATE_PAYMENT_INTENT } from "@/graphQL/stripe";
import { stripePromise } from "@/lib/stripe";
import { useMutation } from "@apollo/client";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";

const StripeLayout = () => {
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (initialized.current) {
        // Prevent double invocation of useEffect in Strict Mode
        // which can cause issues with Stripe
        return;
      }
      initialized.current = true;
      try {
        setLoading(true);
        const { data } = await createPaymentIntent();
        setClientSecret(data?.createPaymentIntent?.clientSecret ?? null);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [createPaymentIntent]);

  const options = useMemo(() => {
    if (!clientSecret) return undefined;
    return { clientSecret };
  }, [clientSecret]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadIcon size={60} />
      </div>
    );

  if (error) {
    useEffect(() => {
      toast.error(error.message || "Une erreur est survenue");
    }, [error]);
  }

  if (!clientSecret) return <div>Impossible de démarrer le paiement.</div>;

  return (
    <Elements stripe={stripePromise} options={options}>
      <Outlet context={{ clientSecret }} />
    </Elements>
  );
};

export default StripeLayout;
