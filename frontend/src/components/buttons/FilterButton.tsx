import { useModal } from "@/context/modalProvider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  modalContent: ReactNode;
  ariaLabel: string;
  title?: string;
  modalDescription?: string;
  modalTitle?: string;
  modalMaxWidth?: string;
  className?: string;
  text?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary"
    | "validate"
    | null
    | undefined;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
}

export default function FilterButton({
  modalContent,
  modalDescription,
  modalTitle,
  modalMaxWidth,
  variant = "outline",
  size = "icon",
  className,
  ariaLabel,
  text,
  title = ariaLabel,
  disabled = false,
  type = "button",
}: FilterButtonProps) {
  const { openModal, setDescription, setTitle, setMaxWidth } = useModal();

  const handleClick = () => {
    setDescription(modalDescription ?? "");
    setTitle(modalTitle ?? "ModalTitleEdit");
    setMaxWidth(modalMaxWidth);
    openModal(modalContent);
  };

  return (
    <Button
      type={type}
      onClick={handleClick}
      variant={variant}
      className={cn(
        "hover:border-input size-9 min-h-9 min-w-9 hover:ring-0",
        className
      )}
      size={size}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
