import React from "react";
import {
  Brain,
  Zap,
  FileText,
  Lightbulb,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description:
      "Leverage AI to create professional cover letters tailored to your job description and resume.",
    color: "bg-primary-500",
    hoverClass: "hover:bg-primary-500",
  },
  {
    icon: FileText,
    title: "Resume Integration",
    description:
      "Upload your PDF resume for automatic analysis and incorporation of your experience and skills.",
    color: "bg-orange-500",
    hoverClass: "hover:bg-orange-500",
  },
  {
    icon: Zap,
    title: "Fast & Personalized",
    description:
      "Generate customized cover letters in seconds, perfectly matched to job requirements.",
    color: "bg-purple-500",
    hoverClass: "hover:bg-purple-500",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description:
      "Receive AI-generated enhancement suggestions to make your cover letter even stronger.",
    color: "bg-green-500",
    hoverClass: "hover:bg-green-500",
  },
  {
    icon: CreditCard,
    title: "Flexible Credits",
    description:
      "Use our credit system for generations, with options for guests and premium packages.",
    color: "bg-primary-600",
    hoverClass: "hover:bg-primary-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description:
      "Protected authentication with email verification and guest modes for easy starting.",
    color: "bg-orange-600",
    hoverClass: "hover:bg-orange-600",
  },
];

export const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-white to-neutral-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary-500">Powerful Features</span>
            <span className="text-neutral-800"> That Get Results</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Everything you need to create compelling cover letters that land
            interviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 feature-card transition-all duration-300 ${feature.hoverClass}`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center group-hover:scale-110 justify-center mb-6 transition-all duration-100 group-hover:border-2 group-hover:border-white`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-neutral-800 group-hover:text-white">
                {feature.title}
              </h3>

              <p className="text-secondary-600 leading-relaxed group-hover:text-white">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
