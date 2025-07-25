import type { PropsWithChildren } from "react";

export const LandingSectionTemplate = ({
  id,
  children,
  title,
  description,
  bgClasses,
}: PropsWithChildren<{
  title: React.ReactNode;
  description: string;
  id: string;
  bgClasses?: string;
}>) => {
  let bgClassesToUse = bgClasses;
  console.log("bgClasses", bgClasses?.substring(0, 3));
  if (bgClasses && bgClasses.substring(0, 3) !== "bg-") {
    bgClassesToUse = "";
  }
  return (
    <section id={id} className={`py-20 ${bgClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-balance text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-balance text-base md:text-lg lg:text-xl text-secondary-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div>{children}</div>
      </div>
    </section>
  );
};
