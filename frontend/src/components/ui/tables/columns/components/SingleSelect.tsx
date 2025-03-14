import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDoubleClick } from "@/hooks/useDoubleClick";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { VariantProps } from "class-variance-authority";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SingleSelectorInput } from "@/components/forms/formField/select/SingleSelectorTemplateInputForm";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";

import { getNestedValueFunction } from "../utils/getNestedValue";

interface SingleSelectProps {
  row: any;
  accessorKey: string;
  typeofValue: "string" | "number" | "boolean";
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    renderLabel?: () => React.ReactNode;
  }[];
  setValue?: (value: string, id: string | number) => void;
  getVariantFunction: (
    value: string
  ) => VariantProps<typeof badgeVariants>["variant"];
  className?: string;
  textClassName?: string;
}

export default function SingleSelect({
  row,
  accessorKey,
  typeofValue,
  options,
  setValue,
  getVariantFunction,
  className,
  textClassName,
}: SingleSelectProps) {
  const datas = row.original;
  const currentValue = getNestedValueFunction(datas, accessorKey);
  const [editing, setEditing] = useState(false);
  const selectorRef = useRef<HTMLButtonElement>(null);

  const selectSchemaForm = () =>
    z.object({
      value:
        typeofValue === "string"
          ? z.string().default(currentValue?.toLowerCase().replace(/ /g, "_"))
          : typeofValue === "boolean"
            ? z.boolean().default(currentValue)
            : z.number().default(currentValue),
    });

  const formSchema = selectSchemaForm();
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<{
    value: string | number | boolean;
  }>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSelectChange = (newValue: string) => {
    if (!setValue) {
      return;
    }
    setValue(newValue, datas.id);
    setEditing(false);
  };

  const handleClickWithDoubleClickDetection = useDoubleClick(undefined, () =>
    setEditing(true)
  );

  const ref = useClickOutside<HTMLDivElement | HTMLButtonElement>(() => {
    setEditing(false);
  }, [selectorRef]);

  const optionSelected = options?.find(
    (option) => option.value === currentValue
  );

  const renderLabel = (): React.ReactNode => {
    if (optionSelected && optionSelected.renderLabel) {
      return optionSelected?.renderLabel();
    }
    return (
      <Badge
        variant={getVariantFunction(currentValue)}
        className={cn(
          "text-md mx-auto flex w-[180px] max-w-[180px] rounded-lg px-1 capitalize",
          className
        )}
      >
        <span className={cn(textClassName)}>{currentValue || "---"}</span>
      </Badge>
    );
  };

  return (
    <Form {...form} key={"value" + datas.id + accessorKey}>
      <form className="space-y-4" noValidate autoComplete="off">
        <div
          onClick={handleClickWithDoubleClickDetection}
          className={cn(
            "text-md flex w-[180px] max-w-[180px] justify-center text-center ",
            className
          )}
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          {editing && setValue ? (
            <SingleSelectorInput
              label={""}
              required={false}
              className="px-2"
              form={form}
              name="value"
              options={options || []}
              placeholder={"Select an option"}
              handleChange={handleSelectChange}
              ref={selectorRef}
            />
          ) : (
            renderLabel()
          )}
        </div>
      </form>
    </Form>
  );
}
