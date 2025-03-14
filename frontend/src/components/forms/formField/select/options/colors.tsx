import { Badge } from "@/components/ui/badge";

export const colorOptions = [
  {
    value: "noir",
    label: "noir",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="black" className="flex h-6 gap-2">
        {withText && "Noir"}
      </Badge>
    ),
  },
  {
    value: "bleu",
    label: "bleu",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="blue" className="flex h-6 gap-2">
        {withText && "Bleu"}
      </Badge>
    ),
  },
  {
    value: "blanc",
    label: "blanc",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="white" className="flex h-6 gap-2">
        {withText && "Blanc"}
      </Badge>
    ),
  },
  {
    value: "rouge",
    label: "rouge",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="red" className="flex h-6 gap-2">
        {withText && "Rouge"}
      </Badge>
    ),
  },
  {
    value: "gris",
    label: "gris",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="blueGray" className="flex h-6 gap-2">
        {withText && "Gris"}
      </Badge>
    ),
  },
  {
    value: "beige",
    label: "beige",
    renderLabel: (withText: boolean = true) => (
      <Badge
        variant="white"
        className="text-maroon-500 flex h-6 gap-2 border-orange-200 bg-orange-100"
      >
        {withText && "Beige"}
      </Badge>
    ),
  },
  {
    value: "orange",
    label: "orange",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="orange" className="flex h-6 gap-2">
        {withText && "Orange"}
      </Badge>
    ),
  },
  {
    value: "vert",
    label: "vert",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="green" className="flex h-6 gap-2">
        {withText && "Vert"}
      </Badge>
    ),
  },
  {
    value: "violet",
    label: "violet",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="purple" className="flex h-6 gap-2">
        {withText && "Violet"}
      </Badge>
    ),
  },
  {
    value: "jaune",
    label: "jaune",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="yellow" className="flex h-6 gap-2">
        {withText && "Jaune"}
      </Badge>
    ),
  },
  // {
  //   value: "Multicolore",
  //   label: "Multicolore",
  //   renderLabel: () => (
  //     <Badge variant="rainbow" className="flex h-6 gap-2">
  //       Multicolore
  //     </Badge>
  //   ),
  // },
  {
    value: "marron",
    label: "marron",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="maroon" className="flex h-6 gap-2">
        {withText && "Marron"}
      </Badge>
    ),
  },
  {
    value: "rose",
    label: "rose",
    renderLabel: (withText: boolean = true) => (
      <Badge variant="pink" className="flex h-6 gap-2">
        {withText && "Rose"}
      </Badge>
    ),
  },
];
