import { Badge } from "@/components/ui/badge";
import {
  Footprints,
  HardHat,
  LifeBuoy,
  Shirt,
  SquareScissors,
} from "lucide-react";

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
    value: "materiel",
    label: "Matériel",
    renderLabel: () => (
      <Badge variant="emerald" className="flex h-6 gap-2">
        <LifeBuoy className="size-4" />
        Matériel
      </Badge>
    ),
  },
  {
    value: "accessoire",
    label: "Accessoire",
    renderLabel: () => (
      <Badge variant="red" className="flex h-6 gap-2">
        <SquareScissors className="size-4" />
        Accessoire
      </Badge>
    ),
  },
  {
    value: "equipement",
    label: "Equipement",
    renderLabel: () => (
      <Badge variant="emerald" className="flex h-6 gap-2">
        <HardHat className="size-4" />
        Equipement
      </Badge>
    ),
  },
];
