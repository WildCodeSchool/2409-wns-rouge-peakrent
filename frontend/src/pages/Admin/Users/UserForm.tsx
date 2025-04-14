import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SingleSelectorInput, StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModal } from "@/context/modalProvider";
import { CREATE_PROFILE, UPDATE_PROFILE } from "@/GraphQL/profiles";
import { addUser, updateUser } from "@/stores/admin/user.store";
import { getRoleOptionsLabels } from "@/utils/getVariants/getRoleVariant";
import { gql, useMutation } from "@apollo/client";
import {
  generateUserFormSchema,
  UserFormSchema,
} from "./generateUserFormSchema";
import { Profile } from "@/gql/graphql";

export function UserForm({ datas }: { datas?: Profile }) {
  const { closeModal } = useModal();
  const [createProfile, { loading: isCreating }] = useMutation(
    gql(CREATE_PROFILE)
  );

  const [updateProfile, { loading: isUpdating }] = useMutation(
    gql(UPDATE_PROFILE)
  );

  const formSchema = generateUserFormSchema(datas);
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleCreateProfile = async (datasToCreate: UserFormSchema) => {
    const response = await createProfile({
      variables: { data: datasToCreate },
    });
    if (response.data) {
      toast.success("Profil créé avec succès");
      addUser(response.data.createUserByAdmin);
      closeModal();
    } else {
      toast.error("Erreur lors de la création du profil");
    }
  };

  const handleUpdateProfile = async (datasToUpdate: UserFormSchema) => {
    const response = await updateProfile({
      variables: { id: datas?.id, data: datasToUpdate },
    });
    if (response.data) {
      toast.success("Profil modifié avec succès");
      updateUser(Number(datas?.id), response.data.updateUserByAdmin);
      closeModal();
    } else {
      toast.error("Erreur lors de la modification du profil");
    }
  };

  const onSubmit = async (formDatas: UserFormSchema) => {
    try {
      if (datas) {
        await handleUpdateProfile(formDatas);
      } else {
        await handleCreateProfile(formDatas);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("errorMessage");
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <StringInput
          form={form}
          name="firstname"
          label="Prénom"
          placeholder="Prénom"
          isPending={isCreating || isUpdating}
          required
        />
        <StringInput
          form={form}
          name="lastname"
          label="Nom"
          placeholder="Nom"
          isPending={isCreating || isUpdating}
          required
        />
        <StringInput
          form={form}
          name="email"
          label="Email"
          placeholder="Email"
          isPending={isCreating || isUpdating}
          required
        />
        {!datas && (
          <StringInput
            form={form}
            name="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            isPending={isCreating || isUpdating}
            required
          />
        )}
        <SingleSelectorInput
          form={form}
          name="role"
          label="Role"
          placeholder="Role"
          options={getRoleOptionsLabels()}
          isPending={isCreating || isUpdating}
          required
        />
        <div className="ml-auto w-[300px]">
          <div className="flex w-full justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isCreating || isUpdating}
              className="w-full"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-full"
            >
              {isCreating || isUpdating ? <LoadIcon size={24} /> : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
