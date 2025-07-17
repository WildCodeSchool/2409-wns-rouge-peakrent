import { InvalidTokenCard } from "@/components/cards/InvalidTokenCard";
import { TokenValidationCard } from "@/components/cards/TokenValidationCard";
import { VerificationTokenCard } from "@/components/cards/VerificationTokenCard";
import { CONFIRM_NEW_EMAIL, WHOAMI } from "@/graphQL";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type Status = "idle" | "validating" | "success" | "error" | "no-token";

export function ConfirmNewEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("idle");
  const hasValidatedRef = useRef(false);

  const [confirmNewEmail] = useMutation(gql(CONFIRM_NEW_EMAIL), {
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token || hasValidatedRef.current) {
        setStatus("no-token");
        return;
      }

      hasValidatedRef.current = true;
      setStatus("validating");

      try {
        const { data } = await confirmNewEmail({
          variables: { data: { token } },
        });

        if (data?.confirmNewEmail) {
          toast.success("Adresse email mise à jour avec succès");
          setStatus("success");
        } else {
          toast.error("Token invalide");
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    validateToken();
  }, [token, confirmNewEmail]);

  switch (status) {
    case "validating":
    case "idle":
      return <VerificationTokenCard />;
    case "no-token":
    case "error":
      return (
        <InvalidTokenCard
          title="Token invalide"
          description="Le lien de confirmation de changement d'email est invalide ou a expiré."
          link="/profile/edit"
          linkText="Demander un nouveau lien en modifiant votre profil"
        />
      );
    case "success":
      return (
        <TokenValidationCard
          title="Email mis à jour avec succès"
          description="Votre nouvelle adresse email a été confirmée et mise à jour avec succès."
          buttonText="Voir mon profil"
          buttonLink="/profile"
        />
      );
  }
}
