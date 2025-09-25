import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface SwitchInputProps {
  form: any; // react-hook-form control
  name?: string;
  label?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
  onlyLabel?: boolean;
}

export const SwitchInput = ({
  form,
  name = "switch",
  label = "Switch",
  required = false,
  isPending = false,
  className,
  containerClassName,
  onCheckedChange,
  onlyLabel = false,
}: SwitchInputProps) => {
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
          <LabelSection
            label={label}
            required={required}
            onlyLabel={onlyLabel}
          />
          <FormControl>
            <Switch
              disabled={isPending}
              checked={field.value}
              onCheckedChange={handleCheckedChange}
              className={cn(className)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
