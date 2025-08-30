import "./App.css";
import { Route, Routes, useLocation } from "react-router";
import { FRONTEND_ENDPOINTS } from "./constants";
import { Landing } from "./pages/landing";
import { UI } from "./pages/ui";
import { useAuth } from "./hooks/useAuth";
import { AuthContext, GlobalContext } from "./Contexts";
import { useEffect, useMemo, useState } from "react";
import { ACCEPTED_CURRENCY_CODES } from "@cover-letter-ai/constants";
import { Toaster } from "sonner";
import { OnboardModal } from "./components/OnboardModal";
import { useModal } from "./hooks/useModal";
import { CancellationAndRefundPolicy } from "./pages/CancellationAndRefundPolicy";
import { ContactUs } from "./pages/ContactUs";
import { HelmetProvider } from "react-helmet-async";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { Generator } from "./pages/generator";
import { BuyCredits } from "./pages/buy-credits";
import { NotFound } from "./pages/NotFound";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

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
        <HelmetProvider>
            <GlobalContext value={globalCtx}>
                <AuthContext value={auth}>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/ui" element={<UI />} />
                        <Route path={FRONTEND_ENDPOINTS.LANDING} element={<Landing />} />
                        <Route path={FRONTEND_ENDPOINTS.GENERATOR} element={<Generator />} />
                        <Route path={FRONTEND_ENDPOINTS.CREDITS_SHOP} element={<BuyCredits />} />
                        <Route path={FRONTEND_ENDPOINTS.CANCELLATION} element={<CancellationAndRefundPolicy />} />
                        <Route path={FRONTEND_ENDPOINTS.CONTACT} element={<ContactUs />} />
                        <Route path={FRONTEND_ENDPOINTS.PRIVACY} element={<PrivacyPolicy />} />
                        <Route path={FRONTEND_ENDPOINTS.TERMS} element={<TermsOfService />} />

                        {/* Catch unknown routes */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <OnboardModal />
                    <Toaster richColors />
                </AuthContext>
            </GlobalContext>
        </HelmetProvider>
    );
}

export default App;
