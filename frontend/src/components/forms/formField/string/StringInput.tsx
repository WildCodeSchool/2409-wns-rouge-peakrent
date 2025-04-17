import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface StringInputProps {
  form: any; // react-hook-form control
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  readOnly?: boolean;
}

export const StringInput = ({
  form,
  name = "string",
  label = "String",
  placeholder,
  required = false,
  isPending = false,
  className,
  containerClassName,
  readOnly = false,
}: StringInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn("", containerClassName)}>
            <LabelSection label={label} required={required} />
            <FormControl>
              <Input
                type="text"
                placeholder={placeholder || "placeholder"}
                disabled={isPending}
                className={
                  (cn("hover:ring-ring border hover:ring-1"), className)
                }
                readOnly={readOnly}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
