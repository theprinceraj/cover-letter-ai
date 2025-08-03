import "./App.css";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { FRONTEND_ENDPOINTS } from "./constants";
import { AuthContext, GlobalContext } from "./Contexts";
import { useEffect, useMemo, useState } from "react";
import { Generator } from "./pages/Generator";
import { TermsOfService } from "./pages/TermsOfService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { useAuth } from "./hooks/useAuth";
import { CreditsShop } from "./pages/CreditsShop";
import { ContactUs } from "./pages/ContactUs";
import { CancellationAndRefundPolicy } from "./pages/CancellationAndRefundPolicy";
import { Analytics } from "@vercel/analytics/react";
import { Landing } from "./pages/Landing";
import { SignInModal } from "./components/SignInModal";
import { HelmetProvider } from "react-helmet-async";
import { ACCEPTED_CURRENCY_CODES } from "@cover-letter-ai/constants";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export default function App() {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const openSignInModal = () => setIsSignInModalOpen(true);
    const closeSignInModal = () => setIsSignInModalOpen(false);

    const [paymentCurrency, setPaymentCurrency] = useState<ACCEPTED_CURRENCY_CODES>(ACCEPTED_CURRENCY_CODES.INR);
    const auth = useAuth();

    const globalContextValue = useMemo(
        () => ({
            isSignInModalOpen,
            openSignInModal,
            closeSignInModal,
            paymentCurrency,
            setPaymentCurrency,
        }),
        [isSignInModalOpen, paymentCurrency]
    );

    return (
        <>
            <HelmetProvider>
                <AuthContext value={auth}>
                    <GlobalContext value={globalContextValue}>
                        <div className="min-h-screen bg-white">
                            <Router>
                                <ScrollToTop />
                                <Routes>
                                    <Route path={FRONTEND_ENDPOINTS.LANDING} element={<Landing />} />

                                    <Route path={FRONTEND_ENDPOINTS.GENERATOR} element={<Generator />} />
                                    <Route path={FRONTEND_ENDPOINTS.CONTACT} element={<ContactUs />} />
                                    <Route
                                        path={FRONTEND_ENDPOINTS.CANCELLATION}
                                        element={<CancellationAndRefundPolicy />}
                                    />
                                    <Route path={FRONTEND_ENDPOINTS.TERMS} element={<TermsOfService />} />
                                    <Route path={FRONTEND_ENDPOINTS.PRIVACY} element={<PrivacyPolicy />} />
                                    <Route path={FRONTEND_ENDPOINTS.CREDITS_SHOP} element={<CreditsShop />} />
                                </Routes>
                                <SignInModal />
                            </Router>
                        </div>
                        <Toaster richColors />
                    </GlobalContext>
                </AuthContext>
            </HelmetProvider>
            <Analytics />
        </>
    );
}
