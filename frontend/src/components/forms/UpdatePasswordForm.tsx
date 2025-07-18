import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordValidation } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModal } from "@/context/modalProvider";
import { CHANGE_PASSWORD } from "@/graphQL/user";
import {
  ChangePasswordFormSchema,
  generateChangePasswordFormSchema,
} from "@/schemas/userSchemas";
import { gql, useMutation } from "@apollo/client";

export function UpdatePasswordForm() {
  const { closeModal } = useModal();
  const [changePassword, { loading: isChanging }] = useMutation(
    gql(CHANGE_PASSWORD)
  );

  const formSchema = generateChangePasswordFormSchema();
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleChangePassword = async (data: ChangePasswordFormSchema) => {
    try {
      const response = await changePassword({
        variables: { data },
      });

      if (response.data?.changePassword) {
        toast.success("Mot de passe mis à jour avec succès");
        closeModal();
      } else {
        toast.error("Erreur lors de la mise à jour du mot de passe");
      }
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error);
      if (error?.networkError) {
        const errorMessage =
          error?.networkError?.result.errors[0]?.message ||
          "Erreur lors du changement de mot de passe";
        toast.error(errorMessage);
      } else {
        toast.error("Erreur lors du changement de mot de passe");
      }
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleChangePassword)}
        className="space-y-4"
        noValidate
      >
        <PasswordValidation
          form={form}
          name="currentPassword"
          label="Mot de passe actuel"
          isPending={isChanging}
          needValidation={false}
          isRequired
        />
        <PasswordValidation
          form={form}
          name="newPassword"
          label="Nouveau mot de passe"
          isPending={isChanging}
          needValidation={true}
          isRequired
        />
        <PasswordValidation
          form={form}
          name="confirmNewPassword"
          label="Confirmation du nouveau mot de passe"
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
              {isChanging ? <LoadIcon size={24} /> : "Changer le mot de passe"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
