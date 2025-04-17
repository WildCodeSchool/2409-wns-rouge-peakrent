import { Badge } from "@/components/ui/badge";
import { Footprints, LifeBuoy, Shirt } from "lucide-react";

export const userRoleOptions = [
  {
    value: "admin",
    label: "Admin",
    renderLabel: () => (
      <Badge variant="yellow" className="flex h-6 gap-2">
        <Footprints className="size-4" />
        Admin
      </Badge>
    ),
  },
  {
    value: "user",
    label: "Utilisateur",
    renderLabel: () => (
      <Badge variant="green" className="flex h-6 gap-2">
        <Shirt className="size-4" />
        Utilisateur
      </Badge>
    ),
  },
  {
    value: "super_admin",
    label: "Super Admin",
    renderLabel: () => (
      <Badge variant="red" className="flex h-6 gap-2">
        <LifeBuoy className="size-4" />
        Super Admin
      </Badge>
    ),
  },
];
