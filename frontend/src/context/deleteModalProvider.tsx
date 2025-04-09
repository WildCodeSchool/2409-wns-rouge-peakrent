import { type Table } from "@tanstack/react-table";
import React, { createContext, useContext, useEffect, useState } from "react";

import DeleteModal from "@/components/modals/DeleteModal";

type ModalContextType = {
  isOpen: boolean;
  openModal: (
    ids: string[] | number[],
    onDelete: (ids: string[] | number[]) => Promise<boolean>,
    table?: Table<any>
  ) => void;
  closeModal: () => void;
  handleDelete: () => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  isDisabled: boolean;
  cancelButtonValue: string | undefined;
  setCancelButtonValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  confirmButtonValue: string | undefined;
  setConfirmButtonValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * useDeleteModal
 *
 * A custom hook that provides access to the delete modal context. It allows you to manage the modal's state,
 * content, and behavior (e.g., confirming deletion, setting titles, etc.).
 * This hook must be used within a `DeleteModalProvider` component to function correctly.
 *
 * @returns {ModalContextType} - The modal context object containing state and functions for managing the delete modal.
 * - `isOpen`: Boolean indicating if the delete modal is open.
 * - `openModal`: Function to open the modal, passing the IDs of the items to be deleted, a delete handler, and an optional table reference.
 * - `closeModal`: Function to close the modal.
 * - `handleDelete`: Function to handle the deletion process, triggering the `onDelete` callback.
 * - `description`: The description text displayed in the modal.
 * - `setDescription`: Function to update the modal's description.
 * - `title`: The title of the modal.
 * - `setTitle`: Function to update the modal's title.
 * - `isDisabled`: Boolean indicating whether the delete button is disabled.
 * - `cancelButtonValue`: The text for the cancel button in the modal.
 * - `setCancelButtonValue`: Function to set the cancel button text.
 * - `confirmButtonValue`: The text for the confirm button in the modal (usually "delete").
 * - `setConfirmButtonValue`: Function to set the confirm button text.
 *
 * @throws {Error} If `useDeleteModal` is used outside of a `DeleteModalProvider`, it throws an error indicating the hook is being used incorrectly.
 *
 * @example
 * import { useDeleteModal } from './useDeleteModal';
 *
 * function MyComponent() {
 *   const {
 *     isOpen,
 *     openModal,
 *     closeModal,
 *     handleDelete,
 *     description,
 *     setDescription,
 *     title,
 *     setTitle,
 *     isDisabled,
 *     cancelButtonValue,
 *     setCancelButtonValue,
 *     confirmButtonValue,
 *     setConfirmButtonValue
 *   } = useDeleteModal();
 *
 *   const onDelete = async (ids) => {
 *     // Handle delete logic
 *     return true;
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => openModal([1, 2], onDelete)}>Delete Items</button>
 *       {isOpen && (
 *         <DeleteModal
 *           title={title}
 *           description={description}
 *           cancelButtonValue={cancelButtonValue}
 *           confirmButtonValue={confirmButtonValue}
 *           isDisabled={isDisabled}
 *           onConfirm={handleDelete}
 *           onCancel={closeModal}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 */

export const useDeleteModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

/**
 * DeleteModalProvider
 *
 * A provider component that manages the state and behavior of the delete modal. It controls the modal's visibility, content,
 * and actions, including managing the items to be deleted and the associated delete handler.
 * This component must wrap your application (or a part of it) to provide the modal context for the `useDeleteModal` hook.
 *
 * @param {React.ReactNode} children - The child components wrapped by the `DeleteModalProvider`.
 *
 * @returns {JSX.Element} The provider component that exposes modal management functions to the rest of the application.
 *
 * @example
 * import { DeleteModalProvider } from './DeleteModalProvider';
 *
 * function App() {
 *   return (
 *     <DeleteModalProvider>
 *       <MyComponent />
 *     </DeleteModalProvider>
 *   );
 * }
 */

export function DeleteModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<
    ((id: string[] | number[]) => Promise<boolean>) | null
  >(null);
  const [elementId, setElementId] = useState<string[] | number[] | null>(null);
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [cancelButtonValue, setCancelButtonValue] = useState<string>();
  const [confirmButtonValue, setConfirmButtonValue] = useState<string>();
  const [table, setTable] = useState<Table<any>>();

  useEffect(() => {
    if (isOpen) {
      setTitle(title.length > 0 ? title : "Supprimer");
      setDescription(
        description.length > 0
          ? description
          : "Voulez-vous vraiment supprimer ?"
      );
      setCancelButtonValue(cancelButtonValue || "Annuler");
      setConfirmButtonValue(confirmButtonValue || "Supprimer");
    }
  }, [isOpen]);

  const openModal = (
    ids: string[] | number[],
    onDelete: (ids: string[] | number[]) => Promise<boolean>,
    table?: Table<any>
  ) => {
    window.history.pushState({ modalOpen: true }, "", "");
    window.history.pushState({ dummy: true }, "", "");
    window.addEventListener("popstate", closeModal, { once: true });

    setIsOpen(true);
    setElementId(ids);
    setOnDelete(() => onDelete);
    setTable(table);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDescription("");
    setTitle("");
    setConfirmButtonValue("delete");
    setElementId(null);
    setOnDelete(null);
    setTable(undefined);

    window.history.back();
  };

  const handleDelete = async () => {
    setIsDisabled(true);
    if (elementId && onDelete) {
      const isDelete = await onDelete(elementId);
      if (isDelete) {
        table?.toggleAllRowsSelected(false);
        closeModal();
      }
    }
    setIsDisabled(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        handleDelete,
        description,
        setDescription,
        title,
        setTitle,
        isDisabled,
        confirmButtonValue,
        setConfirmButtonValue,
        cancelButtonValue,
        setCancelButtonValue,
      }}
    >
      <DeleteModal />
      {children}
    </ModalContext.Provider>
  );
}
