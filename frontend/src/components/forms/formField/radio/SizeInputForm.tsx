import { Dispatch, SetStateAction } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatSize } from "@/utils/formatSize";

import { RadioGroup, RadioGroupItemSize } from "@/components/ui/radio-group";

export function Size({
  form,
  isPending = false,
  reference = {
    variant: [
      { id: "1", size: "36", wtb: true },
      { id: "2", size: "37", wtb: false },
      { id: "3", size: "38", wtb: false },
    ],
  },
  bestPriceAndLastPurchase = [],
  setBestPrice = () => {},
  setLastPurchase = () => {},
}: {
  form: any;
  isPending?: boolean;
  reference?: any;
  bestPriceAndLastPurchase?: any;
  setBestPrice?: Dispatch<SetStateAction<number | null | undefined>>;
  setLastPurchase?: Dispatch<SetStateAction<number | null | undefined>>;
}) {
  const sortedVariants = reference?.variant?.sort((a: any, b: any) => {
    return a.size.localeCompare(b.size, undefined, { numeric: true });
  });

  return (
    <FormField
      control={form.control}
      name="size"
      render={({ field }) => (
        <FormItem>
          <div className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {"size"}
            <span className="text-destructive"> *</span>
          </div>
          <FormControl>
            <RadioGroup
              onValueChange={(val) => {
                field.onChange(val);
                if (val) {
                  const variant = bestPriceAndLastPurchase?.find(
                    (variant: any) => variant.id === Number(val)
                  );
                  setBestPrice(variant?.best_price);
                  setLastPurchase(variant?.last_price);
                }
              }}
              defaultValue={String(field.value)}
              className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))]"
              disabled={isPending}
            >
              {sortedVariants?.map((variant: any) => (
                <FormItem
                  key={variant?.id}
                  className={`hover:bg-primary hover:text-primary-foreground relative flex size-[50px] min-w-[50px] cursor-pointer items-center justify-center space-y-0 rounded-lg border
                      ${String(field.value) === String(variant?.id) ? "bg-primary text-primary-foreground" : "bg-background"}`}
                >
                  <FormLabel className="m-0 flex size-full items-center justify-center font-normal">
                    {variant?.wtb && (
                      <span className="absolute right-1 top-1 size-2 rounded-full bg-yellow-500"></span>
                    )}
                    {formatSize(variant?.size)}
                  </FormLabel>
                  <FormControl className="absolute left-0 top-0 size-full rounded-none border-0">
                    <RadioGroupItemSize value={String(variant?.id)} />
                  </FormControl>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
