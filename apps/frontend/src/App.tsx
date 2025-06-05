import "./App.css";
import { CoverLetterForm } from "./components/CoverLetterForm";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <Header />
        <main>
          <Hero />
          <CoverLetterForm />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
