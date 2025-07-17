import { LoadIcon } from "@/components/icons/LoadIcon";
import { CREATE_PAYMENT_INTENT } from "@/graphQL/stripe";
import { stripePromise } from "@/lib/stripe";
import { useMutation } from "@apollo/client";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const StripeLayout = () => {
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setLoading(true);
        const { data } = await createPaymentIntent();
        setClientSecret(data?.createPaymentIntent?.clientSecret ?? null);
      } catch (err) {
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

  // if (error) {
  //   useEffect(() => {
  //     toast.error(error.message || "Une erreur est survenue");
  //     navigate("/cart/checkout");
  //   }, [error, navigate]);
  // }

  if (!clientSecret) return <div>Impossible de démarrer le paiement.</div>;

  return (
    <Elements stripe={stripePromise} options={options}>
      <Outlet context={{ clientSecret }} />
    </Elements>
  );
};

export default StripeLayout;
