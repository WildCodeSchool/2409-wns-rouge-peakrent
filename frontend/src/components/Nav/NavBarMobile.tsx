import { WHOAMI } from "@/GraphQL/whoami";
import { gql, useQuery } from "@apollo/client";
import {
  CiBoxList,
  CiHome,
  CiLogin,
  CiShoppingCart,
  CiUser,
  CiWavePulse1,
} from "react-icons/ci";
import { NavLink } from "react-router-dom";

const NavBarMobile = () => {
  const { data: whoamiData } = useQuery(gql(WHOAMI));
  const me = whoamiData?.whoami;

  const navItems = [
    {
      path: "/",
      name: "Accueil",
      icon: <CiHome size={20} />,
      ariaLabel: "Navigation vers la page d'accueil",
    },
    {
      path: "/products",
      name: "Produits",
      icon: <CiBoxList size={20} />,
      ariaLabel: "Navigation vers la page produit",
    },
    {
      path: "/cart",
      name: "Panier",
      icon: <CiShoppingCart size={20} />,
      ariaLabel: "Navigation vers la page panier",
    },
    {
      path: "/activities",
      name: "Activités",
      icon: <CiWavePulse1 size={20} />,
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
          to="/account"
          aria-label="Navigation vers la page profile"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3 text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          <CiUser size={20} />
          Profile
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
          <CiLogin size={20} />
          Connexion
        </NavLink>
      )}
    </nav>
  );
};

export default NavBarMobile;
