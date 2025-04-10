import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAdmin } from "@/context/adminProvider";
import { useAdminSidebarStore } from "@/hooks/useAdminSideBar";
import { Link, useLocation } from "react-router-dom";
import { AdminNavItem } from "./navbarConfig";

interface AdminNavProps {
  items: AdminNavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function AdminNav({ items, setOpen }: AdminNavProps) {
  const location = useLocation();
  const path = location.pathname;
  const isMinimized = useAdminSidebarStore((state) => state.isMinimized);
  const { itemNumbers } = useAdmin();

  if (!items?.length) {
    return null;
  }

  return (
    <nav
      className="max-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden"
      id="admin-nav"
    >
      <TooltipProvider>
        <Accordion
          type="single"
          collapsible
          className="space-y-2 text-xs lg:text-sm"
        >
          {items.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                {item.subItems && item.subItems.length > 0 ? (
                  <AccordionItem
                    value={item.title}
                    className="rounded-lg border-none"
                  >
                    <AccordionTrigger
                      className={`hover:bg-accent hover:text-accent-foreground items-center justify-between gap-2 rounded-lg p-2 font-semibold hover:no-underline [&[data-state=open]>span-icon]:rotate-0 cursor-pointer ${isMinimized ? "justify-center [&[data-state=closed]>svg]:hidden [&[data-state=open]>svg]:hidden" : ""}
                      ${
                        path.includes(item.title.toLowerCase()) && isMinimized
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "transparent"
                      }`}
                    >
                      <div className="flex gap-4">
                        <span className="span-icon">{item.icon}</span>

                        {!isMinimized ? (
                          <span className="mr-2 truncate">{item.title}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </AccordionTrigger>
                    {item.subItems &&
                      item.subItems.length > 0 &&
                      item.subItems.map((subItem, index) => (
                        <AccordionContent key={index} className="py-0">
                          <Link
                            to={subItem.disabled ? "/" : subItem.href!}
                            className={cn(
                              "hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-2 overflow-hidden rounded-md p-2 text-xs font-normal lg:text-sm cursor-pointer",
                              subItem.href && path.includes(subItem.href)
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                : "transparent",
                              subItem.disabled &&
                                "text-muted-foreground hover:text-muted-foreground cursor-not-allowed opacity-80",
                              !isMinimized && "ml-6 justify-start pl-4",
                              isMinimized && "hidden"
                            )}
                            onClick={() => {
                              if (setOpen) setOpen(false);
                            }}
                          >
                            <span>{subItem.icon}</span>

                            {!isMinimized ? (
                              <div className="flex w-full items-center justify-between">
                                <span className="mr-2 truncate">
                                  {subItem.title}
                                </span>
                                {subItem.href &&
                                itemNumbers[subItem.href] > 0 ? (
                                  <span
                                    className={cn(
                                      "bg-primary text-primary-foreground flex h-5 w-7 items-center justify-center rounded-full text-xs font-semibold ml-auto",
                                      subItem.href &&
                                        path.includes(subItem.href)
                                        ? "bg-primary-foreground text-primary"
                                        : "bg-primary text-primary-foreground"
                                    )}
                                  >
                                    {itemNumbers[subItem.href] > 99
                                      ? "99"
                                      : itemNumbers[subItem.href]}
                                    {itemNumbers[subItem.href] > 99 ? "+" : ""}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </Link>
                        </AccordionContent>
                      ))}
                  </AccordionItem>
                ) : (
                  <Link
                    to={item.disabled ? "/" : item.href!}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-4 overflow-hidden rounded-md p-2 font-semibold cursor-pointer",
                      item.href &&
                        ((item.href === "/admin" && path === item.href) ||
                          (item.href !== "/admin" && path.includes(item.href)))
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "transparent",
                      item.disabled &&
                        "cursor-not-allowed opacity-60 font-normal",
                      !isMinimized && "justify-start"
                    )}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        return;
                      }
                      if (setOpen) setOpen(false);
                    }}
                  >
                    {item.icon}

                    {!isMinimized ? (
                      <span className="truncate">{item.title}</span>
                    ) : (
                      ""
                    )}
                    {item.href && itemNumbers[item.href] > 0 && !isMinimized ? (
                      <span
                        className={cn(
                          "bg-primary text-primary-foreground flex h-5 w-7 items-center justify-center rounded-full text-xs font-semibold ml-auto",
                          item.href && path.includes(item.href)
                            ? "bg-primary-foreground text-primary"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {itemNumbers[item.href] > 99
                          ? "99"
                          : itemNumbers[item.href]}
                        {itemNumbers[item.href] > 99 ? "+" : ""}
                      </span>
                    ) : (
                      ""
                    )}
                  </Link>
                )}
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={
                  !isMinimized ? "hidden" : "inline-block font-semibold"
                }
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </Accordion>
      </TooltipProvider>
    </nav>
  );
}
