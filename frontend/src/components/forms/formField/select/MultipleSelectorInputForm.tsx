import * as React from "react";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cva, VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  ChevronsUpDown,
  WandSparkles,
  XCircle,
  XIcon,
} from "lucide-react";

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

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva("m-1", {
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

type Option = {
  /** The text to display for the option. */
  label: string;
  /** The unique value associated with the option. */
  value: string;
  /** Optional icon component to display alongside the option. */
  icon?: React.ComponentType<{ className?: string }>;
  renderLabel?: () => React.ReactNode;
};

type Group = {
  /** The label of the group. */
  label: string;
  /** The options in this group. */
  options: Option[];
};

type BaseMultiSelectProps = {
  /**
   * Number of columns to display the options in.
   * Optional, defaults to 1, max is 10.
   */
  columns?: number;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * The maximum number of items that can be selected. When set, the multi-select
   * component will prevent selecting more than the specified number of items.
   * Optional, defaults to undefined (no limit)
   */
  maxSelections?: number;

  /**
   * If true, displays a "Select All" option at the top of the list to select all items.
   * Optional, defaults to true.
   */
  enableSelectAll?: boolean;

  /**
   * Callback function triggered when the user selects an option.
   * Receives the selected option value.
   */
  handleChange?: (values: string[]) => void;

  /**
   * Callback function triggered when the user clears the selected options.
   */
  handleResetField?: () => void;

  /**
   * If true, the multi-select component is required to have at least one selected value.
   * Optional, defaults to true.
   */
  required?: boolean;

  /**
   * If true, the multi-select component is in a pending state (e.g., loading data).
   * Optional, defaults to false.
   */
  isPending?: boolean;

  form: any;
  name: string;
  label: string;
} & VariantProps<typeof multiSelectVariants>;

type MultiSelectWithGroups = BaseMultiSelectProps & {
  /**
   * Groups of options to display in the multi-select component.
   * Each group has a label and an array of options.
   */
  groups: Group[];
  options?: never;
};

type MultiSelectWithOptions = BaseMultiSelectProps & {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: Option[];
  groups?: never;
};

type MultiSelectProps = MultiSelectWithGroups | MultiSelectWithOptions;

export const MultipleSelectorInput = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      groups,
      columns = 1,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      maxSelections,
      enableSelectAll = false,
      handleChange,
      handleResetField,
      form,
      name,
      label,
      required = true,
      isPending = false,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...form.getValues(name)];
        newSelectedValues.pop();
        form.setValue(name, newSelectedValues);
        if (handleChange) {
          handleChange(newSelectedValues);
        }
      }
    };

    const toggleOption = (option: string) => {
      if (maxSelections === 1) {
        const newSelectedValue = form.getValues(name)?.includes(option)
          ? []
          : [option];
        form.setValue(name, newSelectedValue);
        if (handleChange) {
          handleChange(newSelectedValue);
        }
        setIsPopoverOpen(false);
      } else {
        const newSelectedValues = form.getValues(name)?.includes(option)
          ? form.getValues(name)?.filter((value: string) => value !== option)
          : [...form.getValues(name), option];

        if (maxSelections && newSelectedValues.length > maxSelections) {
          return;
        }

        form.setValue(name, newSelectedValues);
        if (handleChange) {
          handleChange(newSelectedValues);
        }
      }
    };

    const handleClear = () => {
      form.setValue(name, []);
      if (handleChange) {
        handleChange([]);
      }
      if (handleResetField) {
        handleResetField();
      }
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = form.getValues(name)?.slice(0, maxCount);
      form.setValue(name, newSelectedValues);
      if (handleChange) {
        handleChange(newSelectedValues);
      }
    };

    const toggleAll = () => {
      const allOptions = groups
        ? groups.flatMap((group) => group.options)
        : options;
      if (form.getValues(name)?.length === allOptions.length) {
        handleClear();
      } else {
        const allValues = allOptions.map((option) => option.value);
        form.setValue(name, allValues);
        if (handleChange) {
          handleChange(allValues);
        }
      }
    };

    const renderOptions = (optionsToRender: Option[]) => {
      return (
        <div
          className={cn("grid gap-[0.15rem]", {
            "grid-cols-1": columns === 1 || !columns,
            "grid-cols-2": columns === 2,
            "grid-cols-3": columns === 3,
            "grid-cols-4": columns === 4,
            "grid-cols-5": columns === 5,
            "grid-cols-6": columns === 6,
            "grid-cols-7": columns === 7,
            "grid-cols-8": columns === 8,
            "grid-cols-9": columns === 9,
            "grid-cols-10": columns === 10,
          })}
        >
          {optionsToRender.map((option) => {
            const isSelected = form.getValues(name)?.includes(option.value);

            return (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
                className={cn(
                  "cursor-pointer",
                  isSelected && "bg-accent rounded-md border pr-2"
                )}
              >
                {maxSelections === 1 ? (
                  <div
                    className={cn(
                      "mr-6 flex items-center justify-center",
                      isSelected ? "text-primary mr-2" : "text-muted-foreground"
                    )}
                  >
                    {isSelected && <CheckIcon className="size-4" />}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className="size-4" />
                  </div>
                )}
                {option.icon && (
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
        </div>
      );
    };

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="">
            <LabelSection label={label} required={required} />
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
                >
                  {field.value?.length > 0 ? (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1">
                        {field.value
                          ?.slice(0, maxCount)
                          .map((value: string) => {
                            const allOptions = groups
                              ? groups.flatMap((group) => group.options)
                              : options;
                            const option = allOptions.find(
                              (o) => o.value === value
                            );
                            const IconComponent = option?.icon;
                            return (
                              <React.Fragment key={value}>
                                {option?.renderLabel ? (
                                  <div>
                                    {typeof option.renderLabel === "function"
                                      ? option.renderLabel()
                                      : option.renderLabel}
                                  </div>
                                ) : (
                                  <Badge
                                    className={cn(
                                      isAnimating ? "animate-bounce" : "",
                                      multiSelectVariants({ variant })
                                    )}
                                    style={{
                                      animationDuration: `${animation}s`,
                                    }}
                                  >
                                    {IconComponent && (
                                      <IconComponent className="mr-2 size-4" />
                                    )}
                                    {option?.label}
                                    <XCircle
                                      className="ml-2 size-4 cursor-pointer"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        toggleOption(value);
                                      }}
                                    />
                                  </Badge>
                                )}
                              </React.Fragment>
                            );
                          })}
                        {field.value?.length > maxCount && (
                          <Badge
                            className={cn(
                              "text-foreground border-foreground/1 bg-transparent hover:bg-transparent",
                              isAnimating ? "animate-bounce" : "",
                              multiSelectVariants({ variant })
                            )}
                            style={{ animationDuration: `${animation}s` }}
                          >
                            {`+ ${field.value?.length - maxCount} more`}
                            <XCircle
                              className="ml-2 size-4 cursor-pointer"
                              onClick={(event) => {
                                event.stopPropagation();
                                clearExtraOptions();
                              }}
                            />
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <XIcon
                          className="ml-2 size-4 shrink-0 opacity-50"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClear();
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground mx-auto flex w-full items-center justify-between">
                      {placeholder}
                      <ChevronsUpDown className="ml-3 size-4 shrink-0 opacity-50" />
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                onEscapeKeyDown={() => setIsPopoverOpen(false)}
              >
                <Command>
                  <div className="relative">
                    <CommandInput
                      placeholder="search..."
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
                  <CommandEmpty>no result</CommandEmpty>
                  <CommandList>
                    <ScrollArea className="max-h-48 overflow-y-auto">
                      {groups ? (
                        groups.map((group, index) => (
                          <React.Fragment key={group.label}>
                            <CommandGroup heading={group.label}>
                              {renderOptions(group.options)}
                            </CommandGroup>
                            {index < groups.length - 1 && <CommandSeparator />}
                          </React.Fragment>
                        ))
                      ) : (
                        <CommandGroup>{renderOptions(options)}</CommandGroup>
                      )}
                    </ScrollArea>
                    {enableSelectAll && (
                      <CommandGroup>
                        <CommandItem
                          key="all"
                          onSelect={toggleAll}
                          className="cursor-pointer"
                        >
                          <div
                            className={cn(
                              "border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
                              field.value?.length ===
                                (groups
                                  ? groups.flatMap((group) => group.options)
                                      .length
                                  : options.length)
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className="size-4" />
                          </div>
                          <span>(select all)</span>
                        </CommandItem>
                      </CommandGroup>
                    )}
                    <CommandSeparator />
                    <CommandGroup>
                      <div className="flex items-center justify-between">
                        {field.value?.length > 0 && (
                          <>
                            <CommandItem
                              onSelect={handleClear}
                              className="flex-1 cursor-pointer justify-center"
                            >
                              clear
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
                          close
                        </CommandItem>
                      </div>
                      {maxSelections &&
                        maxSelections !== 1 &&
                        field.value?.length === maxSelections && (
                          <>
                            <CommandSeparator className="my-1" />
                            <div
                              onClick={() => setIsPopoverOpen(false)}
                              className="text-destructive flex max-w-full flex-1 cursor-pointer justify-center p-1 capitalize"
                            >
                              max Selection Reached
                            </div>
                          </>
                        )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
              {animation > 0 && field.value?.length > 0 && (
                <WandSparkles
                  className={cn(
                    "text-foreground bg-background my-2 size-3 cursor-pointer",
                    isAnimating ? "" : "text-muted-foreground"
                  )}
                  onClick={() => setIsAnimating(!isAnimating)}
                />
              )}
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

MultipleSelectorInput.displayName = "MultipleSelectorInput";
