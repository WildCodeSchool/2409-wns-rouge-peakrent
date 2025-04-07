import { Badge } from "@/components/ui/badge";
import { Brush, Footprints, LifeBuoy, Package, Shirt } from "lucide-react";

export const productTypeOptions = [
  {
    value: "Chaussures",
    label: "Chaussures",
    renderLabel: () => (
      <Badge variant="blue" className="flex h-6 gap-2">
        <Footprints className="size-4" />
        Chaussures
      </Badge>
    ),
  },
  {
    value: "vetement",
    label: "Vêtement",
    renderLabel: () => (
      <Badge variant="orange" className="flex h-6 gap-2">
        <Shirt className="size-4" />
        Vêtement
      </Badge>
    ),
  },
  {
    value: "accessoire",
    label: "Accessoire",
    renderLabel: () => (
      <Badge variant="red" className="flex h-6 gap-2">
        <Package className="size-4" />
        Accessoire
      </Badge>
    ),
  },
  {
    value: "lifestyle",
    label: "Lifestyle",
    renderLabel: () => (
      <Badge variant="emerald" className="flex h-6 gap-2">
        <LifeBuoy className="size-4" />
        Lifestyle
      </Badge>
    ),
  },
  {
    value: "nettoyage",
    label: "Nettoyage",
    renderLabel: () => (
      <Badge variant="cyan" className="flex h-6 gap-2">
        <Brush className="size-4" />
        Nettoyage
      </Badge>
    ),
  },
];