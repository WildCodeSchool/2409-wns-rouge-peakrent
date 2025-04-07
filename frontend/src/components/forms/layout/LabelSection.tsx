import { FormLabel } from "@/components/ui/form";

export function LabelSection({
  label,
  required,
  onlyLabel = false,
}: {
  label?: string;
  required?: boolean;
  onlyLabel?: boolean;
}) {
  return (
    <FormLabel className="flex">
      {label}
      {required && !onlyLabel ? (
        <span className="text-destructive ml-1">*</span>
      ) : !required && !onlyLabel ? (
        <span className="text-muted-foreground ml-1">(optional)</span>
      ) : null}
    </FormLabel>
  );
}
