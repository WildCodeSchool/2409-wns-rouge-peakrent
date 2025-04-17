import { Box } from "@/components/ui/box";
import { useFormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

export const FormControlPassword = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    fieldPropsWithoutShowLabel: React.ComponentPropsWithoutRef<typeof Input>;
  }
>(({ fieldPropsWithoutShowLabel, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);

  return (
    <Slot {...props}>
      <Box className="relative">
        <Input
          className={cn(
            "border-primary/40 hover:ring-ring border pr-12 placeholder:text-xs hover:ring-1"
          )}
          autoComplete="on"
          ref={ref as React.Ref<HTMLInputElement>}
          id={formItemId}
          aria-describedby={
            !error
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          aria-label="toggle password visibility"
          {...fieldPropsWithoutShowLabel}
          type={passwordVisibility ? "text" : "password"}
        />
        <Box
          className="text-muted-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center p-3"
          onClick={() => setPasswordVisibility(!passwordVisibility)}
        >
          {React.createElement(passwordVisibility ? EyeOffIcon : EyeIcon, {
            className: "size-6",
          })}
        </Box>
      </Box>
    </Slot>
  );
});

FormControlPassword.displayName = "FormControlPassword";
