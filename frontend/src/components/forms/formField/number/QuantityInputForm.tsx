import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export function Quantity({
  form,
  isPending = false,
  name = "quantity",
  label,
  placeholder,
  onChange,
  inputClassName,
  containerClassName,
  controlClassName,
  itemClassName,
  buttonsClassName,
  dozenClassName,
  min = 1,
  max = 99,
  required = true,
  withDozen = false,
}: {
  form: any;
  isPending?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: number | string) => void;
  inputClassName?: string;
  containerClassName?: string;
  controlClassName?: string;
  itemClassName?: string;
  buttonsClassName?: string;
  dozenClassName?: string;
  min?: number;
  max?: number;
  required?: boolean;
  withDozen?: boolean;
}) {
  const handleIncrease = (field: any, amount: number = 1) => {
    const currentQuantity = parseInt(field.value, 10);
    const newValue = !isNaN(currentQuantity)
      ? currentQuantity + amount > max
        ? min
        : currentQuantity + amount
      : min;
    field.onChange(newValue);
    if (onChange) onChange(newValue);
  };

  const handleDecrease = (field: any, amount: number = 1) => {
    const currentQuantity = parseInt(field.value, 10);
    const newValue = !isNaN(currentQuantity)
      ? currentQuantity - amount < min
        ? max
        : currentQuantity - amount
      : max;
    field.onChange(newValue);
    if (onChange) onChange(newValue);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");

    if (inputValue === "") {
      field.onChange(inputValue);
      if (onChange) onChange(inputValue);
      return;
    }

    const newValue: number = Math.max(
      min,
      Math.min(parseInt(inputValue, 10), max)
    );

    field.onChange(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col justify-evenly", itemClassName)}>
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label || "quantity"}
            {required ? (
              <span className="text-destructive ml-1">*</span>
            ) : (
              <span className="text-muted-foreground ml-1">
                {" "}
                ({"optional"})
              </span>
            )}
          </div>
          <div
            className={cn(
              "flex h-[60px] w-full max-w-[180px] justify-center gap-2 rounded-lg border p-2",
              containerClassName
            )}
          >
            {withDozen && (
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "hover:bg-primary hover:text-primary-foreground min-w-14 rounded-lg p-2 text-xs",
                  dozenClassName
                )}
                type="button"
                onClick={() => handleDecrease(field, 10)}
                disabled={isPending || field.value - 10 < min}
                aria-label="Retirer 10"
              >
                - 10
              </Button>
            )}
            <Button
              variant="outline"
              size={"icon"}
              className={cn(
                "hover:bg-primary hover:text-primary-foreground rounded-lg p-2 text-xs",
                buttonsClassName
              )}
              aria-label="Retirer 1"
              type="button"
              onClick={() => handleDecrease(field)}
              disabled={isPending}
            >
              {withDozen ? "-1" : <Minus />}
            </Button>
            <FormControl className={cn("", controlClassName)}>
              <Input
                type="text"
                className={cn(
                  "hover:ring-ring max-w-16 text-center font-bold  hover:ring-1",
                  inputClassName
                )}
                {...field}
                onChange={(e) => handleInputChange(e, field)}
                value={field.value}
                placeholder={placeholder || "0"}
                disabled={isPending}
                aria-label="Quantité"
              />
            </FormControl>
            <Button
              variant="outline"
              size={"icon"}
              className={cn(
                "hover:bg-primary hover:text-primary-foreground rounded-lg p-2 text-xs",
                buttonsClassName
              )}
              type="button"
              onClick={() => handleIncrease(field)}
              disabled={isPending}
              aria-label="Ajouter 1"
            >
              {withDozen ? "+1" : <Plus />}
            </Button>
            {withDozen && (
              <Button
                variant="outline"
                size={"icon"}
                className={cn(
                  "hover:bg-primary hover:text-primary-foreground min-w-14 rounded-lg p-2 text-xs",
                  dozenClassName
                )}
                type="button"
                onClick={() => handleIncrease(field, 10)}
                disabled={isPending || field.value + 10 > max}
                aria-label="Ajouter 10"
              >
                + 10
              </Button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
