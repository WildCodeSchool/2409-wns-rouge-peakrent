import * as React from "react";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronsUpDown, XCircle, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { LabelSection } from "@/components/forms/layout/LabelSection";

import { productTypeOptions } from "./options/productTypes";

/**
 * Variants for the single-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const singleSelectVariants = cva("m-1", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Props for SingleSelect component
 */
interface SingleSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof singleSelectVariants> {
  /**
   * An array of option objects to be displayed in the single-select component.
   * Each option object has a label, value, an optional icon, and optional render component.
   */
  options?: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
    /** Optionnal component to customize the label */
    renderLabel?: () => React.ReactNode;
  }[];

  /** The default selected values when the component mounts. */
  defaultValue?: string;

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the single-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the single-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  labelClassName?: string;

  /**
   * Callback function triggered when the user selects an option.
   * Receives the selected option value.
   */
  handleChange?: (value: string) => void;

  /**
   * Callback function triggered when the user clears the selected options.
   */
  handleResetField?: () => void;

  /**
   * If true, the single-select component is required to have at least one selected value.
   * Optional, defaults to true.
   */
  required?: boolean;

  /**
   * If true, the single-select component is in a pending state (e.g., loading data).
   * Optional, defaults to false.
   */
  isPending?: boolean;

  form: any;
  name?: string;
  label?: string;
}

export const SingleSelectorInput = React.forwardRef<
  HTMLButtonElement,
  SingleSelectProps
>(
  (
    {
      options = productTypeOptions,
      variant,
      defaultValue = "",
      placeholder = "Select options",
      modalPopover = false,
      asChild = false,
      className,
      labelClassName,
      handleChange,
      handleResetField,
      form,
      name = "singleSelector",
      label = "Single Selector",
      required = true,
      isPending = false,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValue = form.getValues(name);
        form.setValue(name, newSelectedValue);
        if (handleChange) {
          handleChange(newSelectedValue);
        }
      }
    };

    const toggleOption = (option: string) => {
      const currentValue = form.getValues(name);
      const newSelectedValue = currentValue === option ? "" : option;
      form.setValue(name, newSelectedValue);
      if (handleChange) {
        handleChange(newSelectedValue);
      }
      setIsPopoverOpen(false);
    };

    const handleClear = () => {
      form.setValue(name, "");
      if (handleChange) {
        handleChange("");
      }
      if (handleResetField) {
        handleResetField();
      }
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="">
            {label && <LabelSection label={label} required={required} />}
            <Popover
              open={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              modal={modalPopover}
            >
              <PopoverTrigger asChild>
                <Button
                  {...props}
                  variant="outline"
                  type="button"
                  onClick={handleTogglePopover}
                  className={cn("flex w-full justify-between", className)}
                  {...field}
                  ref={ref}
                  disabled={isPending}
                >
                  {field.value ? (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1">
                        {(() => {
                          const option = options?.find(
                            (o) => o.value === field.value
                          );
                          const IconComponent =
                            option && "icon" in option ? option.icon : null;
                          return (
                            <React.Fragment>
                              {option?.renderLabel ? (
                                <div>
                                  {typeof option.renderLabel === "function"
                                    ? option.renderLabel()
                                    : option.renderLabel}
                                </div>
                              ) : (
                                <Badge
                                  className={cn(
                                    "",
                                    singleSelectVariants({ variant })
                                  )}
                                >
                                  {IconComponent && (
                                    <IconComponent className="mr-2 size-4" />
                                  )}
                                  <span className={labelClassName}>
                                    {option?.label}
                                  </span>
                                  <XCircle
                                    className="ml-2 size-4 cursor-pointer"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      toggleOption(field.value);
                                    }}
                                  />
                                </Badge>
                              )}
                            </React.Fragment>
                          );
                        })()}
                      </div>
                      {label && (
                        <div className="flex items-center justify-between">
                          <XIcon
                            className="ml-2 size-4 shrink-0 opacity-50"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClear();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground mx-auto flex w-full items-center justify-between">
                      <span className="max-w-full truncate">{placeholder}</span>
                      <ChevronsUpDown className="ml-3 size-4 shrink-0 opacity-50" />
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                onEscapeKeyDown={() => setIsPopoverOpen(false)}
                ref={ref as any}
              >
                <Command>
                  <div className="relative">
                    <CommandInput
                      placeholder={"search" + "..."}
                      value={searchQuery}
                      onValueChange={(value) => setSearchQuery(value)}
                      onKeyDown={handleInputKeyDown}
                    />
                    {searchQuery && (
                      <Button
                        className="absolute right-2 top-1/2 h-fit -translate-y-1/2 p-0 hover:bg-transparent"
                        onClick={() => setSearchQuery("")}
                        type="button"
                        variant="ghost"
                      >
                        <XIcon className="text-muted-foreground size-4" />
                      </Button>
                    )}
                  </div>
                  <CommandEmpty>{"noResult"}</CommandEmpty>
                  <CommandList>
                    <ScrollArea className="max-h-48 overflow-y-auto">
                      <CommandGroup>
                        {options?.map((option) => {
                          const isSelected = field.value === option.value;

                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => toggleOption(option.value)}
                              className="cursor-pointer"
                            >
                              <div
                                className={cn(
                                  "mr-6 flex items-center justify-center",
                                  isSelected
                                    ? "text-primary mr-2"
                                    : "text-muted-foreground"
                                )}
                              >
                                {isSelected && <CheckIcon className="size-4" />}
                              </div>
                              {"icon" in option && option.icon && (
                                <option.icon className="text-muted-foreground mr-2 size-4" />
                              )}
                              {option.renderLabel ? (
                                typeof option.renderLabel === "function" ? (
                                  option.renderLabel()
                                ) : (
                                  option.renderLabel
                                )
                              ) : (
                                <span>{option.label}</span>
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </ScrollArea>
                    <CommandSeparator />
                    <CommandGroup>
                      <div className="flex items-center justify-between">
                        {field.value && (
                          <>
                            <CommandItem
                              onSelect={handleClear}
                              className="flex-1 cursor-pointer justify-center"
                            >
                              {"clear"}
                            </CommandItem>
                            <Separator
                              orientation="vertical"
                              className="flex h-full min-h-6"
                            />
                          </>
                        )}
                        <CommandItem
                          onSelect={() => setIsPopoverOpen(false)}
                          className="max-w-full flex-1 cursor-pointer justify-center"
                        >
                          {"close"}
                        </CommandItem>
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

SingleSelectorInput.displayName = "SingleSelectorInput";
