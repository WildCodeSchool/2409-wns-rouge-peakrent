import Modal from "@/components/modals/Modal";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ModalContextType = {
  isOpen: boolean;
  openModal: (initialForm: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode;
  setModalContent: React.Dispatch<React.SetStateAction<ReactNode>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  maxWidth?: string;
  setMaxWidth: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * useModal
 *
 * A custom hook that provides access to the modal context, enabling you to manage the modal's state and content.
 * It must be used within a `ModalProvider` component, as it relies on the context provided by the provider.
 *
 * The hook allows you to control the modal's visibility, content, description, title, and maximum width.
 * You can also trigger the modal to open or close programmatically.
 *
 * @returns {ModalContextType} The modal context object containing state and functions for managing the modal.
 * - `isOpen`: Boolean indicating if the modal is open.
 * - `openModal`: Function to open the modal with provided content.
 * - `closeModal`: Function to close the modal.
 * - `modalContent`: The content displayed inside the modal.
 * - `setModalContent`: Function to set the modal's content.
 * - `description`: String representing the modal's description.
 * - `setDescription`: Function to update the modal's description.
 * - `title`: String representing the modal's title.
 * - `setTitle`: Function to update the modal's title.
 * - `maxWidth`: Optional string that determines the modal's maximum width.
 * - `setMaxWidth`: Function to update the modal's maximum width.
 *
 * @throws {Error} If `useModal` is used outside of a `ModalProvider`, it throws an error indicating the hook is being used incorrectly.
 *
 * @example
 * import { useModal } from './useModal';
 *
 * function MyComponent() {
 *   const {
 *     isOpen,
 *     openModal,
 *     closeModal,
 *     modalContent,
 *     setModalContent,
 *     description,
 *     setDescription,
 *     title,
 *     setTitle,
 *     maxWidth,
 *     setMaxWidth
 *   } = useModal();
 *
 *   return (
 *     <div>
 *       <button onClick={() => openModal(<p>Modal Content</p>)}>Open Modal</button>
 *       {isOpen && (
 *         <div>
 *           <h2>{title}</h2>
 *           <p>{description}</p>
 *           <div>{modalContent}</div>
 *           <button onClick={closeModal}>Close Modal</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

/**
 * ModalProvider
 *
 * A context provider component that manages modal state and provides modal-related functionality across the application.
 * It wraps around the children components and provides the modal context to all components in the tree.
 *
 * @param {ReactNode} children - The components wrapped by the ModalProvider to give access to modal functionality.
 *
 * @example
 * import { ModalProvider } from './ModalProvider';
 *
 * function App() {
 *   return (
 *     <ModalProvider>
 *       <MyComponent />
 *     </ModalProvider>
 *   );
 * }
 */

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [maxWidth, setMaxWidth] = useState<string>();

  const openModal = (initialModalContent: React.ReactNode) => {
    window.history.pushState({ modalOpen: true }, "", "");
    window.history.pushState({ dummy: true }, "", "");
    window.addEventListener("popstate", closeModal, { once: true });

    setModalContent(initialModalContent);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
    setMaxWidth(undefined);
    setDescription("");

    window.history.back();
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        modalContent,
        setModalContent,
        description,
        setDescription,
        title,
        setTitle,
        maxWidth,
        setMaxWidth,
      }}
    >
      <Modal />
      {children}
    </ModalContext.Provider>
  );
}
