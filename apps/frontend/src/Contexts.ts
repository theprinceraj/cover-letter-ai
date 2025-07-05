import { createContext } from "react";

interface ModalContextType {
  isSignInModalOpen: boolean;
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
