import { Button } from "@/components/ui/button";

export function InputSubmitForm({
  children,
  className,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button type="submit" disabled={disabled} className={className}>
      {children ?? "Submit"}
    </Button>
  );
}

export function InputResetForm({
  children,
  className,
  disabled,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {children ?? "Reset"}
    </Button>
  );
}
