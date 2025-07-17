import UpdateButton from "@/components/buttons/UpdateButton";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createFirstnameSchema,
  createLastnameSchema,
} from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StringInput } from "./formField/string/StringInput";
import { UpdateEmailForm } from "./UpdateEmailForm";

interface EditProfileProps {
  firstname: string;
  lastname: string;
  email: string;
  onSave: (data: {
    firstname: string;
    lastname: string;
    email: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const profileEditSchema = z.object({
  firstname: createFirstnameSchema(),
  lastname: createLastnameSchema(),
  email: z.string().email("Email invalide"),
});
type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export default function EditProfile({
  firstname,
  lastname,
  email,
  onSave,
  onCancel,
}: EditProfileProps) {
  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: { firstname, lastname, email },
    mode: "onTouched",
  });
  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (values: ProfileEditFormValues) => {
    await onSave(values);
  };

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
        />
        <StringInput
          form={form}
          name="lastname"
          label="Nom"
          placeholder=" "
          required
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
              ariaLabel={"editEmailAriaLabel"}
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
              value={"********"}
              readOnly
              disabled={true}
              className="flex-1 bg-gray-100"
              tabIndex={-1}
            />
            <UpdateButton
              ariaLabel={"editPasswordAriaLabel"}
              variant="primary"
              modalTitle="Modifier le mot de passe"
              modalContent={<></>}
              className="ml-2"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadIcon size={24} /> : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
