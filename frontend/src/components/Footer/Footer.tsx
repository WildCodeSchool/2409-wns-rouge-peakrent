import { WHOAMI } from "@/GraphQL/whoami";
import { useQuery } from "@apollo/client";
import {
  CiBoxList,
  CiFacebook,
  CiHome,
  CiInstagram,
  CiLogin,
  CiMail,
  CiShoppingCart,
  CiUser,
  CiWavePulse1,
} from "react-icons/ci";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const { data: whoamiData } = useQuery(WHOAMI);
  const me = whoamiData?.whoami;
  return (
    <>
      <footer className="hidden md:flex bg-white gap-5 border-t border-light-gray fixed bottom-0 w-full min-h-36 p-4 text-sm">
        <div className="w-1/5">
          <ul className="flex gap-2">
            <li className="btn">
              <CiFacebook size={25} />
            </li>
            <li className="btn">
              <CiMail size={25} />
            </li>
            <li className="btn">
              <CiInstagram size={25} />
            </li>
          </ul>
        </div>
        <div className="w-1/4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat rem
        </div>
        <div className="w-1/4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat rem
        </div>
      </footer>

      <nav className="flex justify-evenly bg-white items-center fixed bottom-0 w-full md:hidden">
        <NavLink
          to="/"
          aria-label="Navigation vers la page d'accueil"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3 text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          <CiHome size={20} />
          <span className="text-xs">Accueil</span>
        </NavLink>
        <NavLink
          to="/product"
          aria-label="Navigation vers la page produit"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3  text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          <CiBoxList size={20} />
          Produits
        </NavLink>
        <NavLink
          to="/cart"
          aria-label="Navigation vers la page panier"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3  text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          <CiShoppingCart size={20} />
          Panier
        </NavLink>
        <NavLink
          to="/activities"
          aria-label="Navigation vers la page activités"
          className={({ isActive }) =>
            `flex flex-col justify-center items-center transition-all duration-200 rounded-4xl p-3  text-sm ${
              isActive && "bg-black translate-y-[-20px] text-white"
            }`
          }
        >
          <CiWavePulse1 size={20} />
          Activité
        </NavLink>
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
            Connection
          </NavLink>
        )}
      </nav>
    </>
  );
};

export default Footer;
