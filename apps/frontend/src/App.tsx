import "./App.css";
import { AuthContext, ModalContext } from "./Contexts";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
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

export default function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  const auth = useAuth();

  return (
    <>
      <AuthContext value={auth}>
        <ModalContext
          value={{ isSignInModalOpen, openSignInModal, closeSignInModal }}
        >
          <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
            <Router>
              <Routes>
                <Route path="/landing" element={<Landing />} />

                <Route path="/" element={<Home />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route
                  path="/cancellation-and-refund-policy"
                  element={<CancellationAndRefundPolicy />}
                />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/buy-credits" element={<CreditsShop />} />
              </Routes>
            </Router>
          </div>
          <SignInModal />
          <Toaster richColors />
        </ModalContext>
      </AuthContext>
      <Analytics />
    </>
  );
}
