import { FormLabel } from "@/components/ui/form";

export function LabelSection({
  label,
  required,
}: {
  label?: string;
  required?: boolean;
}) {
  return (
    <FormLabel className="flex">
      {label}
      {required ? (
        <span className="text-destructive ml-1">*</span>
      ) : (
        <span className="text-muted-foreground ml-1">
          {" "}
          (optional)
        </span>
      )}
    </FormLabel>
  );
}
