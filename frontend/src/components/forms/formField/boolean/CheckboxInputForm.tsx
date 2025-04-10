import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { LabelSection } from "@/components/forms/layout/LabelSection";

interface CheckboxInputProps {
  form: any; // react-hook-form control
  name?: string;
  label?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxInput = ({
  form,
  name = "checkbox",
  label = "Checkbox",
  required = false,
  isPending = false,
  className,
  containerClassName,
  onCheckedChange,
}: CheckboxInputProps) => {
  const handleCheckedChange = (checked: boolean) => {
    form.setValue(name, checked);
    if (onCheckedChange) {
      onCheckedChange(checked);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", containerClassName)}>
          <div className="flex items-center space-x-2">
            <LabelSection label={label} required={required} />
            <FormControl>
              <Checkbox
                disabled={isPending}
                checked={field.value}
                onCheckedChange={handleCheckedChange}
                className={cn(className)}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
