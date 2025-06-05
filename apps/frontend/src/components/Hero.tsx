export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Gradient background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 -right-1/4 w-1/2 h-1/2 bg-blue-900/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Create Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Perfect Cover Letter
            </span>{" "}
            with AI
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300">
            Professional, personalized cover letters in seconds. Stand out from
            the competition with AI-powered writing tailored to your experience.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#generator"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg shadow-purple-500/20 transition-all duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
