"use client";

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
import { RESET_PASSWORD, VERIFY_RESET_TOKEN } from "@/graphQL/user";
import { createPasswordSchema } from "@/schemas/authSchemas";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: createPasswordSchema(),
    confirmPassword: z.string().min(1, "Confirmation du mot de passe requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function RecoverPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [verifyToken] = useMutation(gql(VERIFY_RESET_TOKEN));
  const [resetPassword] = useMutation(gql(RESET_PASSWORD));

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Token manquant dans l'URL");
        setIsValidating(false);
        return;
      }

      try {
        const { data } = await verifyToken({
          variables: { token },
        });

        if (data?.verifyResetToken) {
          setIsTokenValid(true);
          setError(null);
        } else {
          setError("Token invalide");
          setIsTokenValid(false);
        }
      } catch (error: any) {
        console.error("Erreur lors de la vérification du token:", error);
        const errorMessage = error?.graphQLErrors?.[0]?.extensions?.code;

        switch (errorMessage) {
          case "INVALID_TOKEN":
            setError("Token expiré ou invalide");
            break;
          case "USER_NOT_FOUND":
            setError("Utilisateur introuvable");
            break;
          default:
            setError("Token invalide");
        }
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, verifyToken]);

  const handleSubmit = async () => {
    if (!token || !isTokenValid) {
      setError("Token manquant ou invalide");
      return;
    }

    setIsPending(true);
    try {
      const parsedValues = resetPasswordSchema.safeParse({
        password,
        confirmPassword,
      });

      if (!parsedValues.success) {
        const errors = parsedValues.error.errors;
        setError(errors[0]?.message || "Données invalides");
        return;
      }

      setError(null);
      const { data } = await resetPassword({
        variables: {
          data: {
            token,
            password,
            confirmPassword,
          },
        },
      });

      if (data?.resetPassword) {
        toast.success("Mot de passe réinitialisé avec succès");
        navigate("/signin", { replace: true });
      }
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation:", error);
      const errorMessage = error?.graphQLErrors?.[0]?.extensions?.code;

      switch (errorMessage) {
        case "INVALID_TOKEN":
          setError("Token expiré ou invalide");
          break;
        case "USER_NOT_FOUND":
          setError("Utilisateur introuvable");
          break;
        case "PASSWORDS_DONT_MATCH":
          setError("Les mots de passe ne correspondent pas");
          break;
        default:
          setError("Erreur lors de la réinitialisation du mot de passe");
      }
    } finally {
      setIsPending(false);
    }
  };

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
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
          {error && (
            <p className="text-destructive text-sm font-semibold mt-2">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/forgot-password" className="text-primary underline">
            Demander un nouveau lien
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8 py-4 gap-4">
      <CardHeader>
        <CardTitle className="text-2xl">
          Réinitialiser votre mot de passe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Nouveau mot de passe
          </label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            placeholder="Entrez votre nouveau mot de passe"
            className="hover:ring-ring hover:ring-1"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirmer le mot de passe
          </label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
            placeholder="Confirmez votre nouveau mot de passe"
            className="hover:ring-ring hover:ring-1"
          />
        </div>

        {error && (
          <p className="text-destructive text-sm font-semibold">{error}</p>
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
          {isPending ? <LoadIcon size={24} /> : "Réinitialiser le mot de passe"}
        </Button>
        <p className="mt-4 text-sm">
          <Link to="/signin" className="text-primary underline">
            Retour à la connexion
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
