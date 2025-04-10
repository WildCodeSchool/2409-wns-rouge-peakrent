import { useAdminSidebarStore } from "@/hooks/useAdminSideBar";
import { cn } from "@/lib/utils";
import { ChevronsLeft } from "lucide-react";
import { AdminNav } from "./AdminNav";
import { adminNavItems } from "./navbarConfig";

type SidebarProps = {
  className?: string;
};

export default function AdminSidebar({ className }: SidebarProps) {
  const isMinimized = useAdminSidebarStore((state) => state.isMinimized);
  const toggleFixed = useAdminSidebarStore((state) => state.toggleFixed);

  return (
    <aside
      className={cn(
        `bg-background text-foreground h-[calc(100vh-64px)] relative hidden flex-none border-r transition-[width] duration-500 lg:block`,
        !isMinimized ? "w-[220px]" : "w-[65px]",
        className
      )}
    >
      <ChevronsLeft
        className={cn(
          "bg-background text-foreground absolute -right-3 top-1/2 z-50 cursor-pointer rounded-full border text-3xl",
          isMinimized && "rotate-180"
        )}
        onClick={toggleFixed}
      />
      <div className="space-y-4 py-3">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <AdminNav items={adminNavItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
