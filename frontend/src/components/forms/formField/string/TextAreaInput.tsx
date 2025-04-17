import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface TextAreaInputProps {
  form: any;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
}

export const TextAreaInput = ({
  form,
  name = "textarea",
  label = "Textarea",
  placeholder,
  required = false,
  isPending = false,
  className,
  containerClassName,
}: TextAreaInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", containerClassName)}>
          <LabelSection label={label} required={required} />
          <FormControl>
            <Textarea
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
