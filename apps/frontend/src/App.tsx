import "./App.css";
import { FRONTEND_ENDPOINTS } from "./constants";
import { AuthContext, ModalContext } from "./Contexts";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

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

  const auth = useAuth();

  return (
    <>
      <HelmetProvider>
        <AuthContext value={auth}>
          <ModalContext
            value={{ isSignInModalOpen, openSignInModal, closeSignInModal }}
          >
            <div className="min-h-screen bg-white">
              <Router>
                <ScrollToTop />
                <Routes>
                  <Route
                    path={FRONTEND_ENDPOINTS.LANDING}
                    element={<Landing />}
                  />

                  <Route
                    path={FRONTEND_ENDPOINTS.GENERATOR}
                    element={<Generator />}
                  />
                  <Route
                    path={FRONTEND_ENDPOINTS.CONTACT}
                    element={<ContactUs />}
                  />
                  <Route
                    path={FRONTEND_ENDPOINTS.CANCELLATION}
                    element={<CancellationAndRefundPolicy />}
                  />
                  <Route
                    path={FRONTEND_ENDPOINTS.TERMS}
                    element={<TermsOfService />}
                  />
                  <Route
                    path={FRONTEND_ENDPOINTS.PRIVACY}
                    element={<PrivacyPolicy />}
                  />
                  <Route
                    path={FRONTEND_ENDPOINTS.CREDITS_SHOP}
                    element={<CreditsShop />}
                  />
                </Routes>
              </Router>
            </div>
            <SignInModal />
            <Toaster richColors />
          </ModalContext>
        </AuthContext>
      </HelmetProvider>
      <Analytics />
    </>
  );
}
