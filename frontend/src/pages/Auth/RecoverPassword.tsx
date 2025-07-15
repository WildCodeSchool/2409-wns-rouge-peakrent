import { PasswordValidation } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Form } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RESET_PASSWORD, VERIFY_RESET_TOKEN } from "@/graphQL/user";
import {
  createResetPasswordFormSchema,
  ResetPasswordFormValuesType,
} from "@/schemas/authSchemas";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { InvalidTokenCard } from "../../components/cards/InvalidTokenCard";
import { VerificationTokenCard } from "../../components/cards/VerificationTokenCard";

export function RecoverPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, setIsPending] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [verifyToken] = useMutation(gql(VERIFY_RESET_TOKEN));
  const [resetPassword] = useMutation(gql(RESET_PASSWORD));

  const formSchema = createResetPasswordFormSchema();
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<ResetPasswordFormValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("Token manquant");
        setIsValidating(false);
        return;
      }

      try {
        const { data } = await verifyToken({
          variables: { token },
        });

        if (data?.verifyResetToken) {
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
  }, [token, verifyToken]);

  const handleSubmit = async (values: ResetPasswordFormValuesType) => {
    if (!token || !isTokenValid) {
      return;
    }

    setIsPending(true);
    try {
      const { data } = await resetPassword({
        variables: {
          data: {
            token,
            password: values.newPassword,
            confirmPassword: values.newPasswordConfirm,
          },
        },
      });

      if (data?.resetPassword) {
        toast.success("Mot de passe réinitialisé avec succès");
        navigate("/signin", { replace: true });
      }
    } catch (error: any) {
      toast.error("Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setIsPending(false);
    }
  };

  if (isValidating) {
    return <VerificationTokenCard />;
  }

  if (!token || !isTokenValid) {
    return (
      <InvalidTokenCard
        title="Token invalide"
        description="Le lien de réinitialisation est invalide ou a expiré."
        link="/forgot-password"
        linkText="Demander un nouveau lien"
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        noValidate
      >
        <Card className="max-w-md mx-auto mt-8 py-4 gap-4">
          <CardHeader>
            <CardTitle className="text-2xl">
              Réinitialiser votre mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PasswordValidation
              form={form}
              label="Nouveau mot de passe"
              isRequired={true}
              name="newPassword"
              needValidation={true}
            />
            <PasswordValidation
              form={form}
              label="Confirmation du mot de passe"
              isRequired={true}
              name="newPasswordConfirm"
            />
          </CardContent>
          <CardFooter className="flex-col items-start justify-center">
            <div className="ml-auto w-[300px]">
              <div className="flex w-full justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="w-full"
                  onClick={() => form.reset()}
                >
                  Effacer
                </Button>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <LoadIcon size={24} /> : "Valider"}
                </Button>
              </div>
            </div>
            <p className="mt-4 text-sm">
              <Link to="/signin" className="text-primary underline">
                Retour à la connexion
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
