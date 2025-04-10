import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface FloatInputProps {
  form: any; // react-hook-form control
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  min?: number; // Minimum value allowed
  max?: number; // Maximum value allowed
}

export const Float = ({
  form,
  name = "float",
  label = "Float",
  placeholder,
  required = false,
  isPending = false,
  className,
  containerClassName,
  min = 0, // Default to 0 to always allow positive numbers unless otherwise specified
  max,
}: FloatInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", containerClassName)}>
          <LabelSection label={label} required={required} />
          <FormControl>
            <Input
              type="number"
              step="any" // Allows floating-point numbers
              min={min} // Enforce minimum value (default to 0)
              max={max} // Enforce maximum value if provided
              placeholder={placeholder || "placeholder"}
              disabled={isPending}
              className={(cn("hover:ring-ring border hover:ring-1"), className)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
