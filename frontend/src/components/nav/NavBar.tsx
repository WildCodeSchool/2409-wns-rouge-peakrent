import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/userProvider";
import { SIGNOUT } from "@/graphQL/signout";
import { cn } from "@/lib/utils";
import { gql, useMutation } from "@apollo/client";
import { Home, LogIn, ShieldUser, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { WHOAMI } from "../../graphQL/whoami";
import SearchBar from "../searchBar/SearchBar";
import { buttonVariants } from "../ui/button";
import NavCartLink from "./NavCartLink";

const NavBar = () => {
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
      name: "Profil",
      path: "/profile",
      ariaLabel: "Navigation vers la page profil",
    },
    ...(userData?.role === "admin" || userData?.role === "superadmin"
      ? [
          {
            name: "Admin",
            path: "/admin",
            ariaLabel: "Navigation vers la page admin",
          },
        ]
      : []),
  ];

  return (
    <header className="flex justify-center items-center sticky top-0 left-0 right-0 z-50 bg-white h-14">
      <NavLink
        to="/"
        aria-label="Navigation vers la page d'accueil"
        className="flex items-center justify-center xl:justify-start bg-primary xl:pr-2 h-full"
      >
        <img
          src="/LogoPeakrent.svg"
          className="h-full w-auto max-h-full object-contain"
        />
        <p className="hidden xl:block text-white font-logo text-[2.3vw] ml-1">
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
            <Home size={24} className="flex-none" />
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
        {userData?.id ? (
          <>
            <NavCartLink />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className={cn(
                    buttonVariants({ variant: "primary", size: "icon" }),
                    "py-2 px-4 cursor-pointer text-center"
                  )}
                >
                  <User size={20} className="flex-none" />
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
          </>
        ) : (
          <NavLink
            to="/signin"
            aria-label="Navigation vers la page de connexion"
            className={cn(
              buttonVariants({ variant: "primary", size: "icon" }),
              "py-2 px-4 cursor-pointer text-center"
            )}
          >
            <LogIn size={20} className="flex-none" />
          </NavLink>
        )}
      </div>
      {(userData?.role === "admin" || userData?.role === "superadmin") && (
        <div className="flex md:hidden items-center pr-2 border-b border-light-gray h-full">
          <NavLink
            to="/admin"
            aria-label="Navigation vers la page admin"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "py-2 px-4 cursor-pointer text-center"
            )}
          >
            <ShieldUser size={24} className="flex-none" />
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default NavBar;
