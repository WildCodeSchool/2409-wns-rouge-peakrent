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
import { createEmailSchema } from "@/schemas/utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

const generateResetPasswordFormSchema = () => {
  return z.object({
    email: createEmailSchema(),
  });
};

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmit, setAlreadySubmit] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const schema = generateResetPasswordFormSchema();

  const handleSubmit = async () => {
    setAlreadySubmit(true);
    setIsPending(true);
    try {
      const parsedValues = schema.safeParse({ email });
      if (!parsedValues.success) {
        throw new Error("Email invalide");
      }
      setError(null);
      // const { success: emailSend } = await resetPasswordForEmail(email);
      // if (!emailSend) {
      //   setError("Erreur lors de l'envoi de l'email de réinitialisation");
      // } else {
      //   setError(null);
      //   setEmail("");
      //   setAlreadySubmit(false);
      //   toast.success("Email de réinitialisation envoyé");
      // }
    } catch (validationError) {
      if (validationError instanceof Error) {
        setError(validationError.message);
      }
      return;
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const parsedValues = schema.safeParse({ email });
    if (parsedValues.success) {
      setError(null);
    } else {
      setError("Email invalide");
    }
  }, [email, schema]);

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
          aria-disabled="true"
          disabled={isPending}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {error && alreadySubmit && (
          <p className="text-destructive mt-1 text-sm font-semibold capitalize">
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
