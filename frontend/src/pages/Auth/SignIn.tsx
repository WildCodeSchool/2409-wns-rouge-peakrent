import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { useMutation } from "@apollo/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SIGNIN } from "../../GraphQL/signin";
import { WHOAMI } from "../../GraphQL/whoami";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signinError, setSigninError] = useState("");
  const navigate = useNavigate();

  const [doSignin] = useMutation(SIGNIN, {
    refetchQueries: [WHOAMI],
  });

  async function doSubmitSignin() {
    try {
      const { data } = await doSignin({
        variables: {
          datas: {
            email,
            password,
          },
        },
      });
      if (data.signIn) {
        navigate(`/`, { replace: true });
      } else {
        setSigninError("Impossible de vous connecter");
      }
    } catch (e) {
      console.error(e);
      setSigninError("Identification échouée");
    }
  }

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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  doSubmitSignin();
                }}
                className="space-y-4"
              >
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Se souvenir de moi pendant 30 jours
                  </label>
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                {signinError && (
                  <p className="text-destructive text-sm">{signinError}</p>
                )}
                <div className="flex justify-center mt-8 w-1/2 mx-auto">
                  <Button
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
                  <Button
                    size="lg"
                    className="w-full text-sm text-black rounded-lg"
                    variant="outline"
                  >
                    <Link to="/signup">S&apos;inscrire</Link>
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
