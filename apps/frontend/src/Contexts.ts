import { createContext } from "react";
import type { UseAuthReturn } from "./hooks/useAuth";

interface ModalContextType {
  isSignInModalOpen: boolean;
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const AuthContext = createContext<UseAuthReturn | undefined>(undefined);
