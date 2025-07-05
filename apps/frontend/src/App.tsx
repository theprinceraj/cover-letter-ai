import { useState } from "react";
import "./App.css";
import { CoverLetterForm } from "./components/CoverLetterForm";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ModalContext } from "./Contexts";

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <ModalContext
          value={{ isSignInModalOpen, openSignInModal, closeSignInModal }}
        >
          <Header />
          <main>
            <Hero />
            <CoverLetterForm />
          </main>
          <Footer />
        </ModalContext>
      </div>
    </>
  );
}

export default App;
