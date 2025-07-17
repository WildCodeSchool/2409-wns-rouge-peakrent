import { InvalidTokenCard } from "@/components/cards/InvalidTokenCard";
import { VerificationTokenCard } from "@/components/cards/VerificationTokenCard";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { CONFIRM_NEW_EMAIL, WHOAMI } from "@/graphQL";
import { gql, useMutation } from "@apollo/client";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function ConfirmNewEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const hasValidated = useRef(false);

  const [confirmNewEmail] = useMutation(gql(CONFIRM_NEW_EMAIL), {
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  useEffect(() => {
    const validateToken = async () => {
      if (hasValidated.current || !token) {
        setIsValidating(false);
        return;
      }

      hasValidated.current = true;

      try {
        const { data } = await confirmNewEmail({
          variables: { data: { token } },
        });

        if (data?.confirmNewEmail) {
          setIsTokenValid(true);
          toast.success("Adresse email mise à jour avec succès");
          navigate("/profile", { replace: true });
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
  }, [token, confirmNewEmail, navigate]);

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
            succès. Vous êtes maintenant connecté.
          </p>
        </div>

        <Link to="/profile">
          <Button className="w-full" size="lg" variant="primary">
            Aller à mon profil
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
