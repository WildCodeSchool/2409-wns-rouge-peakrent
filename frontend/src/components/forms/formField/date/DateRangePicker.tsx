import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enGB as en, fr } from "date-fns/locale";
import { CalendarIcon, X as CloseIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LabelSection } from "@/components/forms/layout/LabelSection";

export function DateRangePicker({
  form,
  isPending = false,
  name = "date",
  label = "Date",
  placeholder = "Choisir les dates",
  required = true,
  numberOfMonths = 2,
  locale = "fr",
  disabledDates,
  onSelect,
  fromYear = new Date().getFullYear(),
  toYear = new Date().getFullYear() + 5,
}: {
  form: any;
  isPending?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  numberOfMonths?: number;
  locale?: "en" | "fr";
  disabledDates?: (date: Date) => boolean;
  onSelect?: (date: DateRange | undefined) => void;
  fromYear?: number;
  toYear?: number;
}) {
  const localeToUse = locale === "fr" ? fr : en;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <LabelSection label={label} required={required} />
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isPending}
                >
                  {field.value?.from ? (
                    <>
                      {field.value.to ? (
                        <>
                          {format(new Date(field.value.from), "LLL dd, y")} -{" "}
                          {format(new Date(field.value.to), "LLL dd, y")}
                        </>
                      ) : (
                        format(new Date(field.value.from), "LLL dd, y")
                      )}
                      <CloseIcon
                        className="ml-auto size-4 cursor-pointer opacity-50"
                        onClick={() => {
                          field.onChange({ from: undefined, to: undefined });
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="mr-2 size-4" />
                      <span>{placeholder}</span>
                    </>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                locale={localeToUse}
                captionLayout="dropdown-buttons"
                fromYear={fromYear}
                toYear={toYear}
                numberOfMonths={numberOfMonths}
                selected={field.value as unknown as DateRange}
                onSelect={field.onChange}
                disabled={
                  disabledDates
                    ? disabledDates
                    : (date) =>
                        date > new Date() || date < new Date("2020-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
