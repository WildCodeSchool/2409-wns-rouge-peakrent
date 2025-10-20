import { Home } from "lucide-react";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link, useLocation } from "react-router-dom";

export default function BreadcrumbSection({
  homePath = "/",
}: {
  homePath?: string;
}) {
  const path = useLocation();

  // Split the path into an array of path names
  const currentPathNames: string[] = path.pathname.split("/").filter((p) => p);

  const maxVisibleItems = 5;
  const invisibleItems =
    currentPathNames.length > maxVisibleItems
      ? currentPathNames.slice(0, -2)
      : [];

  // Generate the full path up to the given index
  const generateFullPath = (index: number) => {
    if (index >= 0 && index < currentPathNames.length) {
      return "/" + currentPathNames.slice(0, index + 1).join("/");
    }
    return homePath;
  };

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList>
        {/* Render the home icon if there are path names */}
        {currentPathNames.length > 0 && (
          <>
            <BreadcrumbItem>
              <Link to={homePath} aria-label="Retour à la page d'accueil">
                <Home className="size-4" />
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Render the invisible items into the dropdown menu*/}
        {invisibleItems.length > 0 && (
          <>
            <BreadcrumbItem className="capitalize">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {invisibleItems.map((name, index) => {
                    return (
                      <DropdownMenuItem key={index}>
                        <Link
                          to={generateFullPath(index)}
                          className="w-full capitalize"
                          aria-label={`Aller à ${name}`}
                        >
                          {name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Render the rest of visible items */}
        {currentPathNames.slice(invisibleItems.length).map((name, index) => {
          const actualIndex = invisibleItems.length + index;
          const href = generateFullPath(actualIndex);
          const isLastItem =
            index === currentPathNames.slice(invisibleItems.length).length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="capitalize">
                {isLastItem ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <Link to={href} aria-label={`Aller à ${name}`}>
                    {name}
                  </Link>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
