import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VERIFY_CONFIRM_EMAIL_TOKEN } from "@/graphQL";
import { gql, useMutation } from "@apollo/client";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

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
    return (
      <Card className="max-w-md mx-auto mt-8 py-4 gap-4">
        <CardHeader>
          <CardTitle className="text-2xl">Vérification du token...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <LoadIcon size={24} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!token || !isTokenValid) {
    return (
      <Card className="max-w-md mx-auto mt-8 py-4 gap-4">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">
            Token invalide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Le lien de confirmation d&apos;email est invalide ou a expiré.
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/signin" className="text-primary underline">
            Demander un nouveau lien en vous connectant
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8 py-4">
      <CardContent className="p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Email validé avec succès</h1>
          <p className="text-muted-foreground text-sm">
            Votre adresse email a été confirmée. Vous pouvez maintenant accéder
            à votre compte.
          </p>
        </div>

        <Link to="/signin">
          <Button className="w-full" size="lg" variant="primary">
            Se connecter
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
