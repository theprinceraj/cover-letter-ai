import React, { useState, useEffect, useContext } from "react";
import { ChevronRight, Sparkles, FileText, Send } from "lucide-react";
import { Button } from "../ui/Button";
import { ModalContext } from "../../Contexts";
import { toast } from "sonner";

export const Hero: React.FC = () => {
  const { openSignInModal } = useContext(ModalContext)!;

  const [currentText, setCurrentText] = useState("");

  const textSequence = [
    "Dear Hiring Manager,",
    "I am writing to express my strong interest in...",
    "My experience in software development...",
    "I would welcome the opportunity to...",
    "Thank you for your consideration.",
  ];

  useEffect(() => {
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentWord = textSequence[currentIndex];

      if (isDeleting) {
        setCurrentText(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setCurrentText(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % textSequence.length;
      }

      setTimeout(typeWriter, speed);
    };

    typeWriter();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-neutral-50">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-100 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-100 rounded-full opacity-15 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-full mb-6 shadow-soft">
              <Sparkles className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-orange-700">
                AI-Powered Writing Assistant
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-15">
              <span className="text-primary-500">Craft Perfect</span>
              <br />
              <span className="text-neutral-800">Cover Letters</span>
              <br />
              <span className="text-2xl md:text-3xl text-secondary-600">
                in Seconds
              </span>
            </h1>

            <p className="text-xl text-secondary-600 mb-8 max-w-2xl">
              Transform your job applications with AI tool that understands your
              story. Create compelling, personalized cover letters that get you
              noticed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                className="px-8 py-4 flex items-center justify-center"
                onClick={() => {
                  openSignInModal();
                  toast.info("Please sign in to continue");
                }}
              >
                Start Writing Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <a
                className="btn-secondary px-8 py-4 flex items-center justify-center"
                href="#demo"
              >
                Watch Demo
              </a>
            </div>
          </div>

          {/* Right Column - Interactive Demo */}
          <DemoView currentText={currentText} />
        </div>
      </div>
    </section>
  );
};

const DemoView = ({ currentText }: { currentText: string }) => (
  <div className="relative">
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error-500 rounded-full"></div>
          <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
          <div className="w-3 h-3 bg-success-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-neutral-500">
          <FileText className="w-4 h-4" />
          <span>cover-letter.docx</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-3 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full w-3/4"></div>
        <div className="h-3 bg-gradient-to-r from-secondary-200 to-accent-200 rounded-full w-full"></div>
        <div className="h-3 bg-gradient-to-r from-accent-200 to-primary-200 rounded-full w-5/6"></div>

        <div className="bg-neutral-50 rounded-lg p-4 min-h-[120px] flex items-center">
          <div className="font-mono text-neutral-700">
            {currentText}
            <span className="animate-pulse">|</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span>AI Writing...</span>
          </div>
          <button className="btn-primary px-4 py-2 text-sm flex items-center">
            <Send className="w-4 h-4 mr-2" />
            Apply Now
          </button>
        </div>
      </div>
    </div>

    {/* Floating Elements */}
    <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-medium animate-bounce">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    </div>
    <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-medium animate-bounce delay-1000">
      🚀 Instant Results
    </div>
  </div>
);
