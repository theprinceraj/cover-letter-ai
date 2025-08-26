import { createContext } from "react";
import type { UseAuthReturn } from "./hooks/useAuth";
import type { ACCEPTED_CURRENCY_CODES } from "@cover-letter-ai/constants";

interface GlobalContextType {
    isOnboardModalOpen: boolean;
    openOnboardModal: () => void;
    closeOnboardModal: () => void;
    paymentCurrency: ACCEPTED_CURRENCY_CODES;
    setPaymentCurrency: (arg: ACCEPTED_CURRENCY_CODES) => void;
}
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const AuthContext = createContext<UseAuthReturn | undefined>(undefined);
