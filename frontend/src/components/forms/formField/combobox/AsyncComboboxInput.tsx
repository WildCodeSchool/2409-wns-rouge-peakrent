import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { DynamicSearchTemplate } from "./search/DynamicSearchTemplate";
import { FetchResultsResponse } from "./search/Search";

interface Identifiable {
  id: string | number;
}

type CustomerInputProps<T extends Identifiable> = {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  fetchResults: (query: string) => Promise<FetchResultsResponse<T[]>>;
  renderItem: (item: T) => JSX.Element;
  skeletonItems?: JSX.Element;
  AddButton?: JSX.Element;
  required?: boolean;
  isPending?: boolean;
  handleResetField?: () => void;
  handleChange?: (item: T) => void;
  compareFn?: (a: T, b: T) => boolean;
  defaultSelected?: T;
  defaultFetch?: (query: string) => Promise<FetchResultsResponse<T[]>>;
};

export function AsyncComboboxInput<T extends Identifiable>({
  form,
  name,
  label,
  placeholder = "Select...",
  fetchResults,
  renderItem,
  skeletonItems,
  AddButton,
  required = true,
  isPending = false,
  handleResetField,
  handleChange = () => {},
  compareFn,
  defaultSelected = undefined,
}: CustomerInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(defaultSelected);
  const [searchQuery, setSearchQuery] = useState("");
  const [datas, setDatas] = useState<T[]>([]);

  const defaultHandleResetField = () => {
    form.setValue(name, undefined);
    setSelected(undefined);
  };

  useEffect(() => {
    if (defaultSelected) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);

  handleResetField = handleResetField || defaultHandleResetField;

  const handleChangeDefault = (item: T) => {
    handleChange(item);
    setSelected(item);
    form.setValue(name, item.id.toString()); // Store reference id
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex w-full justify-between gap-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <LabelSection label={label} required={required} />
            <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between truncate",
                      !field.value && "text-muted-foreground"
                    )}
                    {...field}
                    disabled={isPending}
                  >
                    {field.value ? (
                      renderItem(selected as T)
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    {field.value ? (
                      <X
                        className="ml-2 size-4 shrink-0 opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetField();
                        }}
                      />
                    ) : (
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <DynamicSearchTemplate
                  form={form}
                  name={name}
                  fetchResults={fetchResults}
                  handleSelectItem={handleChangeDefault}
                  setIsOpen={setIsOpen}
                  setSelected={setSelected}
                  selected={selected}
                  renderItem={renderItem}
                  compareFn={compareFn}
                  skeletonItems={skeletonItems}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  datas={datas}
                  setDatas={setDatas}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      {AddButton ? <>{AddButton}</> : null}
    </div>
  );
}
