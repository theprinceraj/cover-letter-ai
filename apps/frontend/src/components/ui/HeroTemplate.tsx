import type { PropsWithChildren } from "react";

const HeroTemplate: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="min-h-[90vh] max-w-[90vw] w-full pb-20">{children}</div>;
};

export default HeroTemplate;
