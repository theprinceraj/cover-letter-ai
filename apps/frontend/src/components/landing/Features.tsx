import React from "react";
import { Brain, Zap, Target, Shield, Globe, Sparkles } from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart AI Analysis",
      description:
        "Our AI analyzes job descriptions and your experience to create perfectly tailored cover letters that speak directly to hiring managers.",
      color: "bg-primary-500",
      hoverClass: "hover:bg-primary-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Generate professional cover letters in under 30 seconds. No more spending hours crafting the perfect application.",
      color: "bg-orange-500",
      hoverClass: "hover:bg-orange-500",
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description:
        "Match your skills and experience to job requirements with surgical precision. Every word counts toward getting you noticed.",
      color: "bg-purple-500",
      hoverClass: "hover:bg-purple-500",
    },
    {
      icon: Shield,
      title: "ATS Optimized",
      description:
        "Ensure your cover letter passes through Applicant Tracking Systems with our ATS-friendly formatting and keyword optimization.",
      color: "bg-green-500",
      hoverClass: "hover:bg-green-500",
    },
    {
      icon: Globe,
      title: "Industry Expertise",
      description:
        "Trained on thousands of successful cover letters across 50+ industries. Get industry-specific insights and terminology.",
      color: "bg-primary-600",
      hoverClass: "hover:bg-primary-600",
    },
    {
      icon: Sparkles,
      title: "Continuous Learning",
      description:
        "Our AI improves with every interaction, learning from successful applications to make your next letter even better.",
      color: "bg-orange-600",
      hoverClass: "hover:bg-orange-600",
    },
  ];

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
