import { Icons } from "@/components/icons";
import { Box } from "@/components/ui/box";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

interface PasswordValidationProps {
  form: any;
  label?: string;
  isRequired?: boolean;
  name: string;
  needValidation?: boolean;
  isPending?: boolean;
}

export const PasswordValidation = ({
  name,
  form,
  label,
  isRequired,
  needValidation,
  isPending,
}: PasswordValidationProps) => {
  const password = form.watch(name);
  const isLengthValid = (password?.length ?? 0) >= 12;
  const hasUppercase = /(?=.*[A-Z])/.test(password ?? "");
  const hasLowercase = /(?=.*[a-z])/.test(password ?? "");
  const hasNumber = /(?=.*\d)/.test(password ?? "");
  const hasSpecialChar = /[$&+,:;=?@#|'<>.^*()%!-]/.test(password ?? "");
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>
                {label}
                {isRequired && <span className="text-destructive"> *</span>}
              </FormLabel>
              <Box className="relative">
                <Input
                  className={cn(
                    "hover:ring-ring border pr-12 placeholder:text-xs hover:ring-1"
                  )}
                  autoComplete="on"
                  type={passwordVisibility ? "text" : "password"}
                  {...field}
                  data-testid={name}
                  value={field.value ?? ""}
                  disabled={isPending}
                />
                <Box
                  className="text-muted-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center p-3"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                >
                  {React.createElement(
                    passwordVisibility ? EyeOffIcon : EyeIcon,
                    {
                      className: "size-6",
                    }
                  )}
                </Box>
              </Box>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {needValidation && (
        <div>
          <div className="text-muted-foreground max-w-[400px] py-2 italic">
            <h3>Format du mot de passe requis</h3>
            <div className="flex gap-2 pt-2">
              <ul className="flex w-1/2 flex-col">
                <li className="align-center flex">
                  <span className="">
                    {isLengthValid ? <Icons.validGreen /> : <Icons.validGrey />}
                  </span>
                  12 caractères minimum
                </li>
                <li className="align-center flex">
                  <span className="">
                    {hasNumber ? <Icons.validGreen /> : <Icons.validGrey />}
                  </span>
                  1 chiffre minimum
                </li>
                <li className="align-center flex">
                  <span className="">
                    {hasUppercase ? <Icons.validGreen /> : <Icons.validGrey />}
                  </span>
                  1 majuscule minimum
                </li>
              </ul>
              <ul className="flex w-1/2 flex-col">
                <li className="align-center flex">
                  <span className="">
                    {hasLowercase ? <Icons.validGreen /> : <Icons.validGrey />}
                  </span>
                  1 minuscule minimum
                </li>
                <li className="align-center flex">
                  <span className="">
                    {hasSpecialChar ? (
                      <Icons.validGreen />
                    ) : (
                      <Icons.validGrey />
                    )}
                  </span>
                  1 caractère spécial minimum
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
