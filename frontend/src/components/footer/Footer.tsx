import { useUser } from "@/context/userProvider";
import { SIGNOUT } from "@/graphQL/signout";
import { WHOAMI } from "@/graphQL/whoami";
import { cn } from "@/lib/utils";
import { gql, useMutation } from "@apollo/client";
import { CiFacebook, CiInstagram, CiMail } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { buttonVariants } from "../ui/button";

const Footer = () => {
  const location = useLocation();
  const { user: userData } = useUser();

  const [doSignout] = useMutation(gql(SIGNOUT), {
    onCompleted: () => {
      window.location.href = "/";
    },
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  const onSignout = async () => {
    doSignout();
  };

  if (location.pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-background border-t border-border w-full py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/LogoPeakrent.svg"
                alt="PeakRent Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-logo text-primary">PeakRent</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre partenaire pour la location d&apos;équipements de montagne
              et d&apos;aventure. Découvrez nos activités et produits pour des
              expériences inoubliables.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-foreground">
              Navigation
            </div>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Accueil
              </Link>
              <Link
                to="/activities"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Activités
              </Link>
              <Link
                to="/products"
                aria-label="Aller sur la page produits"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Produits
              </Link>
              <Link
                to="/cart"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Panier
              </Link>
            </nav>
          </div>

          {/* Compte */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-foreground">
              Mon Compte
            </div>
            <nav className="flex flex-col space-y-2">
              {userData ? (
                <>
                  <Link
                    to="/profile"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={onSignout}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Contact et réseaux sociaux */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-foreground">Contact</div>
            <div className="flex space-x-4">
              <Link
                to="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "p-2 h-auto"
                )}
                aria-label="Facebook"
              >
                <CiFacebook size={20} />
              </Link>
              <Link
                to="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "p-2 h-auto"
                )}
                aria-label="Instagram"
              >
                <CiInstagram size={20} />
              </Link>
              <Link
                to="mailto:contact@peakrent.com"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "p-2 h-auto"
                )}
                aria-label="Email"
              >
                <CiMail size={20} />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              contact@peakrent.com
            </p>
          </div>

          {/* Légal */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-foreground">Légal</div>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/cgu"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                CGU
              </Link>
              <Link
                to="/cgv"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                CGV
              </Link>
              <Link
                to="/politique-confidentialite"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Politique de confidentialité
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PeakRent. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
