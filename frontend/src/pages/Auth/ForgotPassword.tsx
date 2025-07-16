import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FORGOT_PASSWORD } from "@/graphQL";
import { createEmailSchema } from "@/schemas/utils";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const generateResetPasswordFormSchema = () => {
  return z.object({
    email: createEmailSchema(),
  });
};

const errorMessages = {
  USER_NOT_FOUND: "Utilisateur introuvable",
  EMAIL_ALREADY_SENT: "Email déjà envoyé",
  INTERNAL_SERVER_ERROR: "Erreur lors de l'envoi de l'email",
};

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const schema = generateResetPasswordFormSchema();
  const [forgotPassword] = useMutation(gql(FORGOT_PASSWORD));

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      const parsedValues = schema.safeParse({ email });
      if (!parsedValues.success) {
        if (!email || !email.trim()) {
          setError("Email requis");
        } else {
          setError("Email invalide");
        }
        return;
      }
      const { data } = await forgotPassword({
        variables: {
          data: { email },
        },
      });

      if (data && data?.forgotPassword) {
        setError(null);
        setEmail("");
        toast.success("Email de réinitialisation envoyé");
      }
    } catch (error: any) {
      setError(
        errorMessages[
          error?.networkError?.result.errors[0]?.extensions
            ?.code as keyof typeof errorMessages
        ] ?? error?.message
      );
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (!email || !email.trim()) {
      setError("Email requis");
      return;
    }
    const parsedValues = schema.safeParse({ email });
    if (parsedValues.success) {
      setError(null);
    } else {
      setError("Email invalide");
    }
  }, [email]);

  return (
    <Card className="max-w-md mx-auto mt-8 py-4 gap-4">
      <CardHeader className="">
        <CardTitle className="text-2xl">
          Réinitialiser votre mot de passe
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <label htmlFor="email"> Entrez votre email </label>
        <Input
          type="text"
          className="hover:ring-ring hover:ring-1"
          name="email"
          id="email"
          aria-disabled={isPending}
          disabled={isPending}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {error && (
          <p className="text-destructive mt-1 text-sm font-semibold">
            {error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start justify-center">
        <Button
          size="lg"
          className="w-full"
          variant="primary"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? <LoadIcon size={24} /> : "Envoyer l'email"}
        </Button>
        <p className="mt-4 text-sm">
          {"Je me souviens de mon mot de passe: "}
          <Link to="/signin" className="text-primary ml-1 underline">
            {"Me connecter"}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
