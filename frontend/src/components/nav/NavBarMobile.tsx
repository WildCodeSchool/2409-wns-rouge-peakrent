import { WHOAMI } from "@/graphQL/whoami";
import { gql, useQuery } from "@apollo/client";
import { Activity, Box, Home, LogIn, ShoppingCart, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const NavBarMobile = () => {
  const { data: whoamiData } = useQuery(gql(WHOAMI));
  const me = whoamiData?.whoami;

  const navItems = [
    {
      path: "/",
      name: "Accueil",
      icon: <Home size={20} />,
      ariaLabel: "Navigation vers la page d'accueil",
    },
    {
      path: "/products",
      name: "Produits",
      icon: <Box size={20} />,
      ariaLabel: "Navigation vers la page produit",
    },
    {
      path: "/cart",
      name: "Panier",
      icon: <ShoppingCart size={20} />,
      ariaLabel: "Navigation vers la page panier",
    },
    {
      path: "/activities",
      name: "Activités",
      icon: <Activity size={20} />,
      ariaLabel: "Navigation vers la page activité",
    },
  ];

  return (
    <nav className="flex justify-evenly bg-white items-center fixed bottom-0 w-full md:hidden z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          aria-label={item.ariaLabel}
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3 text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
      {me ? (
        <NavLink
          to="/profile"
          aria-label="Navigation vers la page profil"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3 text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          <User size={20} />
          Profil
        </NavLink>
      ) : (
        <NavLink
          to="/signin"
          aria-label="Navigation vers la page de connexion"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3 text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          <LogIn size={20} />
          Connexion
        </NavLink>
      )}
    </nav>
  );
};

export default NavBarMobile;
