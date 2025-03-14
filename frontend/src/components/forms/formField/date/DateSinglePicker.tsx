import { useState } from "react";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { enGB as en, fr } from "date-fns/locale";
import { CalendarIcon, X as CloseIcon } from "lucide-react";

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

export function DateSinglePicker({
  form,
  isPending = false,
  name = "date",
  label = "Date",
  placeholder = "Choisir les dates",
  required = true,
  numberOfMonths = 1,
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
  onSelect?: (date: Date | undefined) => void;
  fromYear?: number;
  toYear?: number;
}) {
  const localeToUse = locale === "fr" ? fr : en;
  const [isOpen, setIsOpen] = useState(false);

  const formatFieldValue = (value: string) => {
    if (!value) return "Invalid date";

    if (!/T|Z/.test(value)) {
      value += "T00:00:00";
    }

    const date = new Date(value);

    return isValid(date) ? format(date, "PPP") : "Invalid date";
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <LabelSection label={label} required={required} />
          <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isPending}
                >
                  {field.value ? (
                    <>
                      {formatFieldValue(field.value)}
                      <CloseIcon
                        className="ml-auto size-4 cursor-pointer opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(undefined);
                          if (onSelect) onSelect(undefined);
                          setIsOpen(true);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <span>{placeholder}</span>
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={localeToUse}
                captionLayout="dropdown-buttons"
                fromYear={fromYear}
                toYear={toYear}
                numberOfMonths={numberOfMonths}
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(value) => {
                  field.onChange(value);
                  if (onSelect) onSelect(value);
                  setIsOpen(false);
                }}
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
