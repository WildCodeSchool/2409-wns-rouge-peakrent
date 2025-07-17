import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { CONFIRM_NEW_EMAIL } from "@/graphQL";
import { gql, useMutation } from "@apollo/client";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { InvalidTokenCard } from "../../components/cards/InvalidTokenCard";
import { VerificationTokenCard } from "../../components/cards/VerificationTokenCard";

export function ConfirmNewEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [confirmNewEmail] = useMutation(gql(CONFIRM_NEW_EMAIL));

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("Token manquant");
        setIsValidating(false);
        return;
      }

      try {
        const { data } = await confirmNewEmail({
          variables: { data: { token } },
        });

        if (data?.confirmNewEmail) {
          setIsTokenValid(true);
          toast.success("Adresse email mise à jour avec succès");
        } else {
          toast.error("Token invalide");
          setIsTokenValid(false);
        }
      } catch (error: any) {
        console.error("Erreur lors de la confirmation:", error);
        setIsTokenValid(false);
        if (error.graphQLErrors) {
          const errorMessage =
            error.graphQLErrors[0]?.message || "Erreur lors de la confirmation";
          toast.error(errorMessage);
        } else {
          toast.error("Erreur lors de la confirmation de l'email");
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, confirmNewEmail]);

  if (isValidating) {
    return <VerificationTokenCard />;
  }

  if (!token || !isTokenValid) {
    return (
      <InvalidTokenCard
        title="Token invalide"
        description="Le lien de confirmation de changement d'email est invalide ou a expiré."
        link="/profile/edit"
        linkText="Demander un nouveau lien en modifiant votre profil"
      />
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8 py-4">
      <CardContent className="p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Email mis à jour avec succès</h1>
          <p className="text-muted-foreground text-sm">
            Votre nouvelle adresse email a été confirmée et mise à jour avec
            succès.
          </p>
        </div>

        <Link to="/profile">
          <Button className="w-full" size="lg" variant="primary">
            Retour au profil
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
