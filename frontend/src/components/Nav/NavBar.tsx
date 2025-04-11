import { SIGNOUT } from "@/GraphQL/signout";
import { cn } from "@/lib/utils";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CiHome, CiLogin, CiShoppingCart, CiUser } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import { WHOAMI } from "../../GraphQL/whoami";
import SearchBar from "../SearchBar/SearchBar";
import { buttonVariants } from "../ui/button";

const NavBar = () => {
  const { data: whoamiData } = useQuery(gql(WHOAMI));
  const me = whoamiData?.whoami;

  const [doSignout] = useMutation(gql(SIGNOUT), {
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  const onSignout = async () => {
    doSignout();
  };

  const navItems: { name: string; path: string; ariaLabel: string }[] = [
    {
      name: "Activités",
      path: "/activities",
      ariaLabel: "Navigation vers la page activité",
    },
    {
      name: "Produits",
      path: "/products",
      ariaLabel: "Navigation vers la page produit",
    },
    {
      name: "Packs",
      path: "/packs",
      ariaLabel: "Navigation vers la liste des packs",
    },
  ];

  const dropDownItems: { name: string; path: string; ariaLabel: string }[] = [
    {
      name: "Profile",
      path: "/account",
      ariaLabel: "Navigation vers la page profile",
    },
    {
      name: "Mes commandes",
      path: "/orders",
      ariaLabel: "Navigation vers la page mes commandes",
    },
  ];

  return (
    <header className="flex justify-center items-center sticky top-0 left-0 right-0 z-50 bg-white h-14">
      <NavLink
        to="/"
        aria-label="Navigation vers la page d'accueil"
        className="flex items-center justify-center lg:justify-start bg-primary lg:pr-2 h-full"
      >
        <img
          src="/LogoPeakrent.png"
          className="h-full w-auto max-h-full object-contain"
        />
        <p className="hidden lg:block text-white font-logo text-[2.3vw] ml-1">
          PeakRent
        </p>
      </NavLink>

      <div className="flex items-center justify-between grow gap-20 md:gap-10 lg:gap-20 h-full border-b border-light-gray">
        <nav className="hidden md:flex items-center gap-5 lg:gap-9">
          <NavLink
            to={"/"}
            aria-label={"Navigation vers la page d'accueil"}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "py-2 px-4 cursor-pointer text-center ml-2"
            )}
          >
            <CiHome size={30} className="flex-none" />
          </NavLink>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              aria-label={item.ariaLabel}
              className="relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <SearchBar />
      </div>

      <div className="hidden md:flex items-center gap-5 pr-2 h-full border-b border-light-gray">
        <NavLink
          to="/cart"
          aria-label="Navigation vers la page panier"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "py-2 px-4 cursor-pointer text-center"
          )}
        >
          <CiShoppingCart size={30} className="flex-none" />
        </NavLink>

        {me ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span
                className={cn(
                  buttonVariants({ variant: "primary", size: "icon" }),
                  "py-2 px-4 cursor-pointer text-center"
                )}
              >
                <CiUser size={20} className="flex-none" />
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="mt-2 border-1 border-gray-300 rounded-lg bg-white"
            >
              {dropDownItems.map((item) => (
                <div key={item.path}>
                  <Link to={item.path} aria-label={item.ariaLabel}>
                    <DropdownMenuItem className="py-2 px-4 cursor-pointer text-center hover:bg-primary hover:text-white">
                      {item.name}
                    </DropdownMenuItem>
                  </Link>
                  <div className="border-t border-gray-300"></div>
                </div>
              ))}

              <DropdownMenuItem
                onClick={onSignout}
                aria-label="déconnexion"
                className="py-2 px-4 cursor-pointer text-center hover:bg-primary hover:text-white"
              >
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <NavLink
            to="/signin"
            aria-label="Navigation vers la page de connexion"
            className={cn(
              buttonVariants({ variant: "primary", size: "icon" }),
              "py-2 px-4 cursor-pointer text-center"
            )}
          >
            <CiLogin size={30} className="flex-none" />
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default NavBar;
