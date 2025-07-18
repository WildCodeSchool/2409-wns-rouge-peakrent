import { useDeleteModal } from "@/context/deleteModalProvider";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  onDeleteFunction: (ids?: string[] | number[]) => Promise<boolean>;
  elementIds: string[] | number[];
  className?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  ariaLabel: string;
  disabled?: boolean;
  children?: React.ReactNode;
  modalTitle?: string;
  modalDescription?: string;
  type?: "submit" | "reset" | "button" | undefined;
  confirmButtonValue?: string;
}

export default function DeleteButton({
  onDeleteFunction,
  elementIds,
  variant = "destructive",
  size = "icon",
  className,
  ariaLabel,
  disabled = false,
  children,
  modalTitle,
  modalDescription,
  type = "button",
  confirmButtonValue,
}: DeleteButtonProps) {
  const { setDescription, setTitle, openModal, setConfirmButtonValue } =
    useDeleteModal();

  const handleClick = () => {
    if (modalTitle) {
      setTitle(modalTitle);
    }
    if (modalDescription) {
      setDescription(modalDescription);
    }
    if (confirmButtonValue) {
      setConfirmButtonValue(confirmButtonValue);
    }
    openModal(elementIds, onDeleteFunction);
  };

  return (
    <Button
      type={type}
      onClick={handleClick}
      variant={variant}
      className={cn("size-8 min-h-8 min-w-8", className)}
      size={size}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children || <Trash2 size={18} />}
    </Button>
  );
}
