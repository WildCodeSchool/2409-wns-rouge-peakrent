"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SingleSelectorInput, StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModal } from "@/context/modalProvider";
import { CREATE_PROFILE, UPDATE_PROFILE } from "@/GraphQL/profiles";
import { nameRegex } from "@/schemas/regex";
import {
  createEmailSchema,
  createEnumSchema,
  createPasswordSchema,
  createStringSchema,
} from "@/schemas/utils";
import { addUser, updateUser } from "@/stores/admin/user.store";
import { getRoleOptionsLabels } from "@/utils/getVariants/getRoleVariant";
import { gql, useMutation } from "@apollo/client";

const createSchema = (datas: any) =>
  z.object({
    firstname: createStringSchema({
      minLength: 2,
      minLengthError: "Le prénom doit contenir au moins 2 caractères",
      maxLength: 50,
      maxLengthError: "Le prénom doit contenir au plus 50 caractères",
      regex: nameRegex,
      regexError: "Format de prénom invalide",
      trim: true,
      defaultValue: datas?.firstname,
      required: true,
      requiredError: "Le prénom est requis",
    }),
    lastname: createStringSchema({
      minLength: 2,
      minLengthError: "Le nom doit contenir au moins 2 caractères",
      maxLength: 50,
      maxLengthError: "Le nom doit contenir au plus 50 caractères",
      regex: nameRegex,
      regexError: "Format de nom invalide",
      trim: true,
      defaultValue: datas?.lastname,
      required: true,
      requiredError: "Le nom est requis",
    }),
    email: createEmailSchema({
      defaultValue: datas?.email,
      requiredError: "L'email est requis",
      invalidFormatError: "Format d'email invalide",
    }),
    ...(!datas && {
      password: createPasswordSchema(),
    }),
    role: createEnumSchema(
      ["user", "admin", "superadmin"],
      "Le rôle est requis",
      "Role invalide",
      datas?.role
    ),
  });

type UserFormSchema = z.infer<ReturnType<typeof createSchema>>;

export function UserForm({ datas }: { datas?: any }) {
  const { closeModal } = useModal();
  const [createProfile, { data: newProfile, loading: isCreating }] =
    useMutation(gql(CREATE_PROFILE));

  const [updateProfile, { data: updatedProfile, loading: isUpdating }] =
    useMutation(gql(UPDATE_PROFILE));

  const formSchema = createSchema(datas);
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
      variables: { id: datas.id, data: datasToUpdate },
    });
    if (response.data) {
      toast.success("Profil modifié avec succès");
      updateUser(Number(datas.id), response.data.updateUserByAdmin);
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
