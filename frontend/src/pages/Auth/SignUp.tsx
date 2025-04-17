import { PasswordValidation } from "@/components/forms/formField/string/PasswordValidation";
import { StringInput } from "@/components/forms/formField/string/StringInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { CREATE_USER } from "../../GraphQL/createUser";
import { CheckboxInput } from "@/components/forms/formField";

const signUpSchema = z
  .object({
    firstname: z.string().min(1, "Le prénom est requis"),
    lastname: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(10, "Le mot de passe doit contenir au moins 10 caractères"),
    confirmPassword: z
      .string()
      .min(
        10,
        "La confirmation du mot de passe doit contenir au moins 10 caractères"
      ),
    agreeToPolicy: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const [doCreateUser, { data }] = useMutation(gql(CREATE_USER));

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToPolicy: false,
    },
  });

  const onSubmit = async (formData: SignUpFormValues) => {
    if (!formData.agreeToPolicy) {
      toast.error("Vous devez accepter les conditions d'utilisation");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const result = await doCreateUser({
        variables: {
          data: {
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            firstname: formData.firstname,
            lastname: formData.lastname,
          },
        },
      });
      toast.success("Inscription réussie !");
    } catch (error: any) {
      console.error("Erreur lors de la création du compte:", error);
      if (error.message.includes("password is not strong enough")) {
        toast.error("Le mot de passe n'est pas assez fort");
      } else if (error.message.includes("email must be an email")) {
        toast.error("L'email est invalide");
      } else {
        toast.error(
          error.message || "Une erreur est survenue lors de l'inscription"
        );
      }
    }
  };

  if (data) {
    return (
      <div className="relative min-h-screen bg-background">
        <ImageHandler
          className="block md:hidden absolute w-full h-full object-cover"
          src="/image-8.jpg"
          alt="Image de fond"
        />
        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
          <Card className="w-full max-w-[500px] p-4 mx-auto overflow-hidden bg-white">
            <div className="flex flex-col md:flex-row">
              <div
                className="w-full p-8 relative md:bg-cover md:bg-center rounded-lg"
                style={{
                  backgroundImage: 'url("/image-10.jpg")',
                }}
              >
                <div
                  className="bg-white absolute inset-0 md:bg-black/40 rounded-lg"
                  role="decorative"
                />

                <div className="flex flex-col items-center justify-center text-center h-full relative z-10">
                  <h2 className="text-3xl font-bold mb-6 text-black md:text-white">
                    Inscription réussie !<span className="text-3xl">🎉</span>
                  </h2>
                  <p className="text-black md:text-white mb-8 max-w-md">
                    Votre compte a été créé avec succès. Vous pouvez maintenant
                    vous connecter pour accéder à votre espace.
                  </p>
                  <div className="flex justify-center mt-8 w-1/2 mx-auto">
                    <NavLink to="/signin">
                      <Button
                        size="lg"
                        className="w-full text-sm text-white rounded-lg"
                        variant="primary"
                      >
                        Se connecter
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

  return (
    <div className="relative min-h-screen bg-background">
      <ImageHandler
        className="block md:hidden absolute w-full h-full object-cover"
        src="/image-8.jpg"
        alt="Image de fond"
      />
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <Card className="w-full max-w-[1000px] p-4 mx-auto overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row">
            <div
              className="hidden md:block w-1/2 bg-white p-8 relative bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: 'url("/image-6.jpg")',
              }}
            >
              <div
                className="absolute inset-0 bg-black/60 rounded-lg"
                role="decorative"
              />

              <div className="flex flex-col items-center justify-center text-center h-full relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-white">
                  Bienvenue, aventuriers des sommets
                </h2>
                <p className="text-white mb-8 max-w-md">
                  Rejoignez notre communauté de passionnés de montagne et
                  accédez à tout l&apos;équipement dont vous avez besoin pour
                  vos aventures. Skis, raquettes, crampons ou tentes, louez
                  facilement le matériel adapté à vos expéditions sans
                  contrainte d&apos;achat.
                </p>
                <div>
                  <p className="text-sm text-white mb-4">
                    Vous avez déjà un compte ?
                  </p>
                  <Button
                    size="lg"
                    className="w-full text-sm text-black rounded-lg"
                    variant="outline"
                  >
                    <Link to="/signin">Se connecter</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6 bg-white">
              <h2 className="!text-3xl font-semibold mb-8 text-center">
                Inscription
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="flex block gap-2 w-full">
                    <StringInput
                      form={form}
                      name="firstname"
                      label="Prénom"
                      placeholder=" "
                      required
                      containerClassName="w-full"
                    />
                    <StringInput
                      form={form}
                      name="lastname"
                      label="Nom"
                      placeholder=" "
                      required
                      containerClassName="w-full"
                    />
                  </div>
                  <StringInput
                    form={form}
                    name="email"
                    label="adresse email"
                    placeholder=" "
                    required
                  />
                  <PasswordValidation
                    form={form}
                    label="Mot de passe"
                    isRequired={true}
                    name="password"
                    needValidation={true}
                  />
                  <PasswordValidation
                    form={form}
                    label="Confirmation du mot de passe"
                    isRequired={true}
                    name="confirmPassword"
                  />
                  <div className="flex items-center space-x-2">
                    <CheckboxInput
                      form={form}
                      name="agreeToPolicy"
                      label="J'accepte les conditions d'utilisation"
                      required
                    />
                  </div>
                  <div className="flex justify-center mt-8 w-1/2 mx-auto">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-sm text-white rounded-lg"
                      variant="primary"
                    >
                      S&apos;inscrire
                    </Button>
                  </div>
                  <div className="sm:block md:hidden text-center text-sm text-gray-600">
                    Vous avez déjà un compte ?{" "}
                    <Link to="/signin" className="text-primary hover:underline">
                      Se connecter
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
