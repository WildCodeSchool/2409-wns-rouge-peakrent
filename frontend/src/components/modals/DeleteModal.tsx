import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteModal } from "@/context/deleteModalProvider";

import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";

const Modal = () => {
  const {
    isOpen,
    closeModal,
    description,
    title,
    handleDelete,
    isDisabled,
    cancelButtonValue,
    confirmButtonValue,
  } = useDeleteModal();

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-2">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex w-full justify-between gap-2">
          <Button variant="outline" onClick={closeModal} className="w-[45%]">
            {cancelButtonValue}
          </Button>
          <Button
            disabled={isDisabled}
            className="hover:bg-destructive/80 w-[45%]"
            variant="destructive"
            onClick={handleDelete}
          >
            {isDisabled ? <LoadIcon size={24} /> : confirmButtonValue}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
