import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { useMutation } from "@apollo/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CREATE_USER } from "../../GraphQL/createUser";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [doCreateUser, { data }] = useMutation(CREATE_USER);

  async function doSubmitSignup() {
    if (!agreeToPolicy) {
      setSignupError("Vous devez accepter les conditions d'utilisation");
      return;
    }
    try {
      await doCreateUser({
        variables: {
          data: {
            email,
            password,
            confirmPassword,
            firstname,
            lastname,
          },
        },
      });
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("password is not strong enough")) {
        setSignupError("Le mot de passe n'est pas assez fort");
      } else if (e.message.includes("email must be an email")) {
        setSignupError("L'email est invalide");
      } else {
        setSignupError(e.message);
      }
    }
  }

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
                    <Button
                      size="lg"
                      className="w-full text-sm text-white rounded-lg"
                      variant="primary"
                    >
                      <Link to="/signin">Se connecter</Link>
                    </Button>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  doSubmitSignup();
                }}
                className="space-y-4"
              >
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="prénom"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-1/2"
                  />
                  <Input
                    type="text"
                    placeholder="nom"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-1/2"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="policy"
                    checked={agreeToPolicy}
                    onCheckedChange={(checked) =>
                      setAgreeToPolicy(checked as boolean)
                    }
                  />
                  <label htmlFor="policy" className="text-sm text-gray-600">
                    J&apos;accepte les conditions d&apos;utilisation
                  </label>
                </div>
                {signupError && (
                  <p className="text-destructive text-sm">{signupError}</p>
                )}
                <div className="flex justify-center mt-8 w-1/2 mx-auto">
                  <Button
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
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
