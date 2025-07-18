import { TokenValidationCard } from "@/components/cards/TokenValidationCard";
import { VERIFY_CONFIRM_EMAIL_TOKEN } from "@/graphQL";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { InvalidTokenCard } from "../../components/cards/InvalidTokenCard";
import { VerificationTokenCard } from "../../components/cards/VerificationTokenCard";

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [verifyAccount] = useMutation(gql(VERIFY_CONFIRM_EMAIL_TOKEN));

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("Token manquant");
        setIsValidating(false);
        return;
      }

      try {
        const { data } = await verifyAccount({
          variables: { token },
        });

        if (data?.verifyConfirmEmailToken) {
          setIsTokenValid(true);
        } else {
          toast.error("Token invalide");
          setIsTokenValid(false);
        }
      } catch (error: any) {
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, verifyAccount]);

  if (isValidating) {
    return <VerificationTokenCard />;
  }

  if (!token || !isTokenValid) {
    return (
      <InvalidTokenCard
        title="Token invalide"
        description="Le lien de confirmation d'email est invalide ou a expiré."
        link="/signin"
        linkText="Demander un nouveau lien en vous connectant"
      />
    );
  }

  return (
    <TokenValidationCard
      title="Email vérifié avec succès"
      description="Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant accéder à votre compte."
      buttonText="Se connecter"
      buttonLink="/signin"
    />
  );
}
