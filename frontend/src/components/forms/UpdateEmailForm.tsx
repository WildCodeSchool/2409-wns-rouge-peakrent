import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordValidation, StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModal } from "@/context/modalProvider";
import { CHANGE_EMAIL } from "@/graphQL/user";
import {
  generateUpdateEmailFormSchema,
  UpdateEmailFormSchema,
} from "@/schemas/userSchemas";
import { gql, useMutation } from "@apollo/client";

export function UpdateEmailForm() {
  const { closeModal } = useModal();
  const [changeEmail, { loading: isChanging }] = useMutation(gql(CHANGE_EMAIL));

  const formSchema = generateUpdateEmailFormSchema();
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<UpdateEmailFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleChangeEmail = async (data: UpdateEmailFormSchema) => {
    try {
      const response = await changeEmail({
        variables: { data },
      });

      if (response.data?.changeEmail) {
        toast.success(
          "Email de confirmation envoyé avec succès, veuillez vérifier votre nouvel email"
        );
        closeModal();
      } else {
        toast.error("Erreur lors de l'envoi de l'email de confirmation");
      }
    } catch (error: any) {
      console.error("Erreur lors du changement d'email:", error);
      if (error?.networkError) {
        const errorMessage =
          error?.networkError?.result.errors[0]?.message ||
          "Erreur lors du changement d'email";
        toast.error(errorMessage);
      } else {
        toast.error("Erreur lors du changement d'email");
      }
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleChangeEmail)}
        className="space-y-4"
        noValidate
      >
        <StringInput
          form={form}
          name="newEmail"
          label="Nouvel email"
          placeholder="nouvel.email@exemple.com"
          isPending={isChanging}
          required
        />
        <PasswordValidation
          form={form}
          name="password"
          label="Mot de passe actuel"
          isPending={isChanging}
          needValidation={false}
          isRequired
        />
        <div className="ml-auto w-[300px]">
          <div className="flex w-full justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isChanging}
              className="w-full"
              onClick={handleReset}
            >
              Effacer
            </Button>
            <Button type="submit" disabled={isChanging} className="w-full">
              {isChanging ? <LoadIcon size={24} /> : "Changer l'email"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
