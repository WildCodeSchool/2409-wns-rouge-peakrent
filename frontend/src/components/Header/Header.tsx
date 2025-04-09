import { useQuery } from "@apollo/client";
import { CiHome, CiLogin, CiShoppingCart, CiUser } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { WHOAMI } from "../../GraphQL/whoami";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  const { data: whoamiData } = useQuery(WHOAMI);
  const me = whoamiData?.whoami;

  return (
    <header className="flex justify-between items-center fixed top-0 left-0 right-0 z-50 border-b border-light-gray bg-white gap-2">
      <NavLink
        to="/"
        aria-label="Navigation vers la page d'accueil"
        className="flex items-center gap-2 w-1/5 justify-center lg:justify-start bg-(--primary)"
      >
        <img
          src="LogoPeakrent.png"
          className="h-auto w-20 sm:w-12 md:w-16 lg:w-20 object-contain"
        />
        <h1 className="hidden lg:block text-white logo text-[2.3vw]">
          PeakRent
        </h1>
      </NavLink>

      <div className="flex items-center justify-between grow gap-20">
        <nav className="hidden md:flex items-center gap-5 lg:gap-9">
          <NavLink
            to={"/"}
            aria-label={"Navigation vers la page d'accueil"}
            className="btn-secondary"
          >
            <CiHome size={30} />
          </NavLink>
          <NavLink
            to={"/activities"}
            aria-label={"Navigation vers la page activités"}
            className="relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Activités
          </NavLink>
          <NavLink
            to={""}
            aria-label={"Navigation vers la page produit"}
            className="relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Produits
          </NavLink>
          <NavLink
            to={"/pack"}
            aria-label={"Navigation vers la liste des packs"}
            className="relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Packs
          </NavLink>
        </nav>

        <SearchBar />
      </div>

      <div className="hidden md:flex items-center gap-5 pr-4">
        <NavLink
          to="/cart"
          aria-label="Navigation vers la page panier"
          className="btn-secondary "
        >
          <CiShoppingCart size={30} />
        </NavLink>

        {me ? (
          <NavLink
            to="/account"
            aria-label="Navigation vers la page profile"
            className="btn-primary"
          >
            <CiUser size={20} />
          </NavLink>
        ) : (
          <NavLink
            to="/signin"
            aria-label="Navigation vers la page de connexion"
            className="btn-primary"
          >
            <CiLogin size={20} />
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
