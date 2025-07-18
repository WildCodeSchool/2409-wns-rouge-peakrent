import UpdateButton from "@/components/buttons/UpdateButton";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/userProvider";
import { UPDATE_USER_PROFILE } from "@/graphQL/profiles";
import { WHOAMI } from "@/graphQL/whoami";
import {
  createFirstnameSchema,
  createLastnameSchema,
} from "@/schemas/authSchemas";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { StringInput } from "./formField/string/StringInput";
import { UpdateEmailForm } from "./UpdateEmailForm";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

const profileEditSchema = z.object({
  firstname: createFirstnameSchema(),
  lastname: createLastnameSchema(),
  email: z.string().email("Email invalide"),
});
type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export default function EditProfile() {
  const navigate = useNavigate();

  const { profile, loading } = useUser();

  const [updateProfile] = useMutation(gql(UPDATE_USER_PROFILE), {
    refetchQueries: [{ query: gql(WHOAMI) }],
    awaitRefetchQueries: true,
  });

  const defaultValues = {
    firstname: profile?.firstname || "",
    lastname: profile?.lastname || "",
    email: profile?.email || "",
  };

  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, formState, reset } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (values: ProfileEditFormValues) => {
    try {
      await updateProfile({
        variables: {
          data: {
            firstname: values.firstname,
            lastname: values.lastname,
          },
        },
      });
      toast.success("Profil mis à jour avec succès");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  useEffect(() => {
    if (profile) {
      reset(defaultValues);
    }
  }, [profile]);

  if (loading) {
    return <div>Chargement…</div>;
  }
  if (!profile) {
    return <div>Profil introuvable.</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md mx-auto bg-white p-6 rounded shadow-md"
      >
        <StringInput
          form={form}
          name="firstname"
          label="Prénom"
          placeholder=" "
          required
          isPending={isSubmitting}
        />
        <StringInput
          form={form}
          name="lastname"
          label="Nom"
          placeholder=" "
          required
          isPending={isSubmitting}
        />
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <div className="flex items-center">
            <Input
              id="email"
              type="email"
              value={form.getValues("email")}
              disabled={true}
              readOnly
              className="flex-1 bg-gray-100"
            />
            <UpdateButton
              ariaLabel="Modifier l'email"
              variant="primary"
              modalTitle="Modifier l'email"
              modalContent={<UpdateEmailForm />}
              className="ml-2"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <div className="flex items-center">
            <Input
              id="password"
              type="password"
              value="********"
              readOnly
              disabled={true}
              className="flex-1 bg-gray-100"
              tabIndex={-1}
            />
            <UpdateButton
              ariaLabel="Modifier le mot de passe"
              variant="primary"
              modalTitle="Modifier le mot de passe"
              modalContent={<UpdatePasswordForm />}
              className="ml-2"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <LoadIcon size={24} /> : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
