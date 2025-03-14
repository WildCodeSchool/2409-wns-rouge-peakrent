import { Badge } from "@/components/ui/badge";

export const vatTypeOptions = [
  {
    label: "20 %",
    value: "20",
    renderLabel: () => (
      <Badge variant="orange" className="flex h-6 gap-2">
        20 %
      </Badge>
    ),
  },
  {
    label: "0 %",
    value: "0",
    renderLabel: () => (
      <Badge variant="cyan" className="flex h-6 gap-2">
        0 %
      </Badge>
    ),
  },
  {
    label: "TVA sur Marge",
    value: "marge",
    renderLabel: () => (
      <Badge variant="yellow" className="flex h-6 gap-2">
        TVA sur Marge
      </Badge>
    ),
  },
];
