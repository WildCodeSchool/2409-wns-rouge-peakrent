import { CheckboxInput } from "@/components/forms/formField";
import { PasswordValidation } from "@/components/forms/formField/string/PasswordValidation";
import { StringInput } from "@/components/forms/formField/string/StringInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { createPasswordSchema } from "@/schemas/authSchemas";
import { createEmailSchema } from "@/schemas/utils/string/createEmailSchema";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { SIGNIN } from "../../graphQL/signin";
import { WHOAMI } from "../../graphQL/whoami";

const signInSchema = z.object({
  email: createEmailSchema({
    requiredError: "L'adresse email est requise",
    invalidFormatError: "Format d'email invalide",
    maxLengthError: "L'adresse email ne doit pas excéder 320 caractères",
  }),
  password: createPasswordSchema(),
  rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInPage() {
  const navigate = useNavigate();

  const [doSignin] = useMutation(gql(SIGNIN), {
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (formData: SignInFormValues) => {
    try {
      const { data } = await doSignin({
        variables: {
          datas: {
            email: formData.email,
            password: formData.password,
          },
        },
      });
      if (data.signIn) {
        navigate(`/`, { replace: true });
      } else {
        toast.error("Impossible de vous connecter");
      }
    } catch (e) {
      console.error(e);
      toast.error("Identification échouée");
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <ImageHandler
        className="block md:hidden absolute w-full h-full object-cover"
        src="/image-9.jpg"
        alt="Image de fond"
      />
      <div className="container relative z-10 mx-auto px-4 py-8 md:py-16">
        <Card className="w-full max-w-[1000px] p-4 mx-auto overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 bg-white">
              <h2 className="!text-3xl font-semibold mb-8 text-center">
                Connexion
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <StringInput
                    label="Email"
                    form={form}
                    name="email"
                    placeholder="email"
                    required
                  />
                  <PasswordValidation
                    form={form}
                    label="Mot de passe"
                    isRequired={true}
                    name="password"
                  />
                  <div className="flex items-center space-x-2">
                    <CheckboxInput
                      form={form}
                      name="rememberMe"
                      label="Se souvenir de moi"
                      onlyLabel={true}
                    />
                  </div>
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="flex justify-center mt-8 w-1/2 mx-auto">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-sm text-white rounded-lg"
                      variant="primary"
                    >
                      Se connecter
                    </Button>
                  </div>
                  <div className="sm:block md:hidden text-center text-sm text-gray-600">
                    Vous n&apos;avez pas de compte ?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                      S&apos;inscrire
                    </Link>
                  </div>
                </form>
              </Form>
            </div>

            <div
              className="hidden md:block w-1/2 bg-slate-100 p-8 relative bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: 'url("/image-7.jpg")',
              }}
            >
              <div className="absolute inset-0 bg-slate-900/60 rounded-lg" />

              <div className="flex flex-col items-center justify-center text-center h-full relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-white">
                  Retrouvez vos équipements de montagne
                </h2>
                <p className="text-slate-200 mb-8 max-w-md">
                  Accédez à votre espace personnel pour réserver facilement
                  votre matériel de montagne. Skis, raquettes, équipement
                  d&apos;escalade... Tout ce dont vous avez besoin pour vos
                  aventures en altitude est disponible en quelques clics, sans
                  contrainte d&apos;achat.
                </p>
                <div>
                  <p className="text-sm text-slate-200 mb-4">
                    Vous n&apos;avez pas de compte ?
                  </p>
                  <NavLink to="/signup">
                    <Button
                      size="lg"
                      className="w-full text-sm text-black rounded-lg"
                      variant="outline"
                    >
                      S&apos;inscrire
                    </Button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
