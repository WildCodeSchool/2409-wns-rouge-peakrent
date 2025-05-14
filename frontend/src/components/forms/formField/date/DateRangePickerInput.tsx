import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface StringInputProps {
  form: any;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  formClassName?: string;
  readOnly?: boolean;
  from: any;
  to: any;
}

export const DateRangePickerInput = ({
  form,
  name = "date",
  label = "Plage de dates",
  required = true,
  isPending = false,
  inputClassName,
  containerClassName,
  formClassName,
  from,
  to,
}: StringInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", containerClassName)}>
          <LabelSection label={label} required={required} />
          <FormControl className={cn(formClassName)}>
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                disabled={isPending}
                value={from ?? ""}
                onChange={(e) =>
                  field.onChange({ ...field.value, from: e.target.value })
                }
                className={cn("w-full max-w-[200px]", inputClassName)}
              />
              <Input
                type="date"
                disabled={isPending}
                value={to ?? ""}
                onChange={(e) =>
                  field.onChange({ ...field.value, to: e.target.value })
                }
                className={cn("w-full max-w-[200px]", inputClassName)}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
