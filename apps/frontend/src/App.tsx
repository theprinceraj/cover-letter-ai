import "./App.css";
import { ModalContext } from "./Contexts";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { TermsOfService } from "./pages/TermsOfService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";

export default function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <ModalContext
          value={{ isSignInModalOpen, openSignInModal, closeSignInModal }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </Router>
        </ModalContext>
      </div>
    </>
  );
}
