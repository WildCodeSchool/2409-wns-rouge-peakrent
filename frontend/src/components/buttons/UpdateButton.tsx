"use client";

import { useModal } from "@/context/modalProvider";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface UpdateButtonProps {
  modalContent: ReactNode;
  ariaLabel: string;
  title?: string;
  modalDescription?: string;
  modalTitle?: string;
  modalMaxWidth?: string;
  className?: string;
  icon?: ReactNode;
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
}

export default function UpdateButton({
  modalContent,
  modalDescription,
  modalTitle,
  modalMaxWidth,
  variant = "outline",
  size = "icon",
  className,
  ariaLabel,
  icon = <Pencil size={18} />,
  title = ariaLabel,
  disabled = false,
}: UpdateButtonProps) {
  const { openModal, setDescription, setTitle, setMaxWidth } = useModal();

  const handleClick = () => {
    setDescription(modalDescription ?? "");
    setTitle(modalTitle ?? "ModalTitleEdit");
    setMaxWidth(modalMaxWidth);
    openModal(modalContent);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={cn(
        "hover:border-input size-8 min-h-8 min-w-8 hover:ring-0",
        className
      )}
      size={size}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
}
