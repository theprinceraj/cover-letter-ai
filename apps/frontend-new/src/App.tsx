import "./App.css";
import { Route, Routes } from "react-router";
import { FRONTEND_ENDPOINTS } from "./constants";
import { Landing } from "./pages/landing";
import { UI } from "./pages/ui";
import { useAuth } from "./hooks/useAuth";
import { AuthContext, GlobalContext } from "./Contexts";
import { useMemo, useState } from "react";
import { ACCEPTED_CURRENCY_CODES } from "@cover-letter-ai/constants";
import { Toaster } from "sonner";
import { OnboardModal } from "./components/OnboardModal";
import { useModal } from "./hooks/useModal";

function App() {
    const auth = useAuth();
    const { isOpen: isOnboardModalOpen, closeModal: closeOnboardModal, openModal: openOnboardModal } = useModal(false);

    const [paymentCurrency, setPaymentCurrency] = useState<ACCEPTED_CURRENCY_CODES>(ACCEPTED_CURRENCY_CODES.INR);

    const globalCtx = useMemo(
        () => ({
            isOnboardModalOpen,
            openOnboardModal,
            closeOnboardModal,
            paymentCurrency,
            setPaymentCurrency,
        }),
        [isOnboardModalOpen, closeOnboardModal, openOnboardModal, paymentCurrency]
    );
    return (
        <GlobalContext value={globalCtx}>
            <AuthContext value={auth}>
                <Routes>
                    <Route path="/ui" element={<UI />} />
                    <Route path={FRONTEND_ENDPOINTS.LANDING} element={<Landing />} />
                </Routes>
                <OnboardModal />
                <Toaster richColors />
            </AuthContext>
        </GlobalContext>
    );
}

export default App;
