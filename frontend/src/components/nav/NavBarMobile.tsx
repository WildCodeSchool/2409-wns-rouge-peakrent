import { WHOAMI } from "@/graphQL/whoami";
import { gql, useQuery } from "@apollo/client";
import { Activity, Box, Home, LogIn, ShoppingCart, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const NavBarMobile = () => {
  const { data: whoamiData } = useQuery(gql(WHOAMI));
  const me = whoamiData?.whoami;

  const items = [
    { to: "/", label: "Accueil", Icon: Home, aria: "Aller à l'accueil" },
    {
      to: "/products",
      label: "Produits",
      Icon: Box,
      aria: "Aller aux produits",
    },
    {
      to: "/cart",
      label: "Panier",
      Icon: ShoppingCart,
      aria: "Aller au panier",
    },
    {
      to: "/activities",
      label: "Activités",
      Icon: Activity,
      aria: "Aller aux activités",
    },
    me
      ? { to: "/profile", label: "Profil", Icon: User, aria: "Aller au profil" }
      : {
          to: "/signin",
          label: "Connexion",
          Icon: LogIn,
          aria: "Aller à la connexion",
        },
  ];

  return (
    <nav
      className="
        fixed inset-x-0 bottom-2 z-50 md:hidden
        flex justify-center
        pb-[env(safe-area-inset-bottom)]
      "
      aria-label="Navigation mobile"
    >
      <div
        className="
          mx-auto w-[min(640px,96vw)]
          rounded-xl border border-zinc-200/70
          bg-white/90 backdrop-blur-md
          shadow-[0_6px_20px_rgba(0,0,0,0.08)]
          px-2 py-1
        "
      >
        <ul className="grid grid-cols-5">
          {items.map(({ to, label, Icon, aria }) => (
            <li key={to} className="flex">
              <NavLink
                to={to}
                aria-label={aria}
                className={({ isActive }) =>
                  [
                    "group mx-auto flex h-14 w-full flex-col items-center justify-center gap-1",
                    "transition-all duration-200 ease-out rounded-lg",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15",
                    isActive
                      ? "bg-zinc-200/70 text-zinc-900 -translate-y-0.5"
                      : "text-zinc-500 hover:text-zinc-800 active:scale-[0.98]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={isActive ? 24 : 20}
                      className="transition-all duration-200 ease-out"
                    />
                    <span
                      className={[
                        "text-[11px] font-medium leading-none transition-colors",
                        isActive ? "text-zinc-900" : "text-zinc-500",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBarMobile;
