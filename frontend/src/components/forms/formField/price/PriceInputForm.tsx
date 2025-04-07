import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { LabelSection } from "@/components/forms/layout/LabelSection";

export function Price({
  form,
  isPending = false,
  name = "price",
  label = "price",
  placeholder,
  inputClassName,
  containerClassName,
  controlClassName,
  itemClassName,
  buttonsClassName,
  min = 1,
  max = 9999,
  devise = "€",
  required = true,
  withCents = false,
}: {
  form: any;
  isPending?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  inputClassName?: string;
  containerClassName?: string;
  controlClassName?: string;
  itemClassName?: string;
  buttonsClassName?: string;
  min?: number;
  max?: number;
  devise?: "€" | "$" | "£" | "¥" | "₿";
  required?: boolean;
  withCents?: boolean;
}) {

  const handleIncrease = (field: any, amount: number = 1) => {
    const currentValue = withCents
      ? parseFloat(field.value) || 0
      : parseInt(field.value, 10) || 0;

    const newValue = withCents
      ? Math.min(currentValue + amount, max)
      : Math.min(currentValue + amount, max);

    field.onChange(newValue.toFixed(withCents ? 2 : 0));
  };

  const handleDecrease = (field: any, amount: number = 1) => {
    const currentValue = withCents
      ? parseFloat(field.value) || 0
      : parseInt(field.value, 10) || 0;

    const newValue = withCents
      ? Math.max(currentValue - amount, min)
      : Math.max(currentValue - amount, min);

    field.onChange(newValue.toFixed(withCents ? 2 : 0));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    let inputValue = e.target.value;

    if (withCents) {
      inputValue = inputValue.replace(/[^0-9.]/g, "");

      const parts = inputValue.split(".");
      if (parts.length > 2) {
        inputValue = `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
      } else if (parts[1]) {
        parts[1] = parts[1].slice(0, 2);
        inputValue = parts.join(".");
      }
    } else {
      inputValue = inputValue.replace(/[^0-9]/g, "");
    }

    if (inputValue === "") {
      field.onChange(inputValue);
      return;
    }

    if (inputValue === "." || inputValue === "0.") {
      field.onChange(inputValue);
      return;
    }

    let newValue = Number(inputValue) > max ? max : inputValue;
    newValue = Number(newValue) < min ? min : newValue;

    field.onChange(newValue);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "mx-auto flex scale-[0.8] flex-col items-center justify-evenly",
            itemClassName
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full flex-col space-y-2",
              containerClassName
            )}
          >
            <LabelSection
              label={label || "price"}
              required={required}
            />
            <div
              className={cn(
                "flex w-full justify-center gap-1 rounded-lg",
                containerClassName
              )}
            >
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "bg-primary/90 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary hidden min-w-12 rounded-lg p-2 text-xs hover:ring-0 xl:block",
                  buttonsClassName
                )}
                type="button"
                onClick={() => handleDecrease(field, 100)}
                disabled={isPending || parseFloat(field.value) - 100 < min}
              >
                - 100
              </Button>
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "bg-primary/70 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 rounded-lg p-2 text-xs hover:ring-0",
                  buttonsClassName
                )}
                type="button"
                onClick={() => handleDecrease(field, 10)}
                disabled={isPending || parseFloat(field.value) - 10 < min}
              >
                -10
              </Button>
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "bg-primary/50 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 rounded-lg p-2 text-xs hover:ring-0",
                  buttonsClassName
                )}
                type="button"
                onClick={() => handleDecrease(field, 1)}
                disabled={isPending}
              >
                -1
              </Button>
              <div className={cn("relative w-full", controlClassName)}>
                <FormControl>
                  <Input
                    type="text"
                    className={cn(
                      "hover:ring-ring min-w-[100px] text-center font-bold hover:ring-1",
                      inputClassName
                    )}
                    {...field}
                    value={field.value}
                    placeholder={placeholder || "0"}
                    onChange={(e) => handleInputChange(e, field)}
                    disabled={isPending}
                  />
                </FormControl>
                <span className="text-muted-foreground absolute inset-y-0 right-0 flex items-center pr-3">
                  {devise}
                </span>
              </div>
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "bg-primary/50 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 rounded-lg p-2 text-xs hover:ring-0",
                  buttonsClassName
                )}
                type="button"
                onClick={() => handleIncrease(field, 1)}
                disabled={isPending}
              >
                +1
              </Button>
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "bg-primary/70 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 rounded-lg p-2 text-xs hover:ring-0",
                  buttonsClassName
                )}
                type="button"
                onClick={() => handleIncrease(field, 10)}
                disabled={isPending || parseFloat(field.value) + 10 > max}
              >
                +10
              </Button>
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "bg-primary/90  text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary hidden min-w-12 rounded-lg p-2 text-xs hover:ring-0 xl:block",
                  buttonsClassName
                )}
                type="button"
                onClick={() => handleIncrease(field, 100)}
                disabled={isPending || parseFloat(field.value) + 100 > max}
              >
                + 100
              </Button>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
