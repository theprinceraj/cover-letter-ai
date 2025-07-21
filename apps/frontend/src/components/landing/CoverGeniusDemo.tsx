import { useState } from "react";
import { Play, Pause, RefreshCw, Copy, Check } from "lucide-react";

export const CoverGeniusDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const steps = [
    {
      title: "1. Paste Job Description",
      content:
        "Software Engineer position at TechCorp requiring React, Node.js, and 3+ years experience...",
    },
    {
      title: "2. AI Analysis",
      content:
        "✨ Analyzing requirements...\n🎯 Matching your skills...\n📝 Crafting personalized content...",
    },
    {
      title: "3. Generated Cover Letter",
      content: `Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position at TechCorp. With over 4 years of experience in React and Node.js development, I am confident in my ability to contribute to your innovative team.\n\nIn my previous role at StartupXYZ, I successfully led the development of a scalable web application using React and Node.js, resulting in a 40% increase in user engagement. My expertise in modern JavaScript frameworks aligns perfectly with TechCorp's tech stack.\n\nI am particularly drawn to TechCorp's commitment to cutting-edge technology and would welcome the opportunity to discuss how my skills can drive your projects forward.\n\nThank you for considering my application.\n\nBest regards,\n[Your Name]`,
    },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(steps[2].content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <section id="demo" className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-neutral-800">See </span>
            <span className="text-orange-500">CoverGenius</span>
            <span className="text-neutral-800"> in Action</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Watch how our AI tool transforms a job posting into a personalized
            cover letter
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card overflow-hidden">
            {/* Demo Controls */}
            <div className="bg-purple-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    disabled={isPlaying}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50 focus:ring-2 focus:ring-white/50"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Demo</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all focus:ring-2 focus:ring-white/50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="text-white text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-neutral-100 h-2">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>

            {/* Demo Content */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2 text-neutral-800">
                  {steps[currentStep].title}
                </h3>
              </div>

              <div className="bg-neutral-50 rounded-lg p-6 min-h-[300px] relative">
                {currentStep === 1 ? (
                  <div className="space-y-4">
                    {steps[currentStep].content
                      .split("\n")
                      .map((line, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-secondary-700">{line}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="font-mono text-secondary-700 whitespace-pre-wrap">
                    {steps[currentStep].content}
                  </div>
                )}

                {currentStep === 2 && (
                  <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 btn-primary px-4 py-2 flex items-center space-x-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
