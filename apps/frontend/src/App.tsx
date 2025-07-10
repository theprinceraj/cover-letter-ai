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

export default function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  const auth = useAuth();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <AuthContext value={auth}>
          <ModalContext
            value={{ isSignInModalOpen, openSignInModal, closeSignInModal }}
          >
            <Router>
              <Routes>
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
          </ModalContext>
        </AuthContext>
      </div>
    </>
  );
}
