import { Layout } from "../Layout";
import { Link } from "react-router";
import { FRONTEND_ENDPOINTS } from "../constants";
import Button from "../components/ui/Button";
import { Suspense } from "react";
import { ArrowDownLeftIcon, StarsIcon } from "lucide-react";

export const NotFound: React.FC = () => {
    return (
        <Layout className="bg-gradient-to-b from-primary/60 to-primary/40" hasHeader hasFooter>
            <div className="w-full flex items-center justify-center overflow-clip md:-mt-10 lg:-mt-30 2xl:-mt-40 -mb-12 md:-mb-24">
                <Suspense fallback={<div className="h-[80vh] block bg-gray-200 animate-pulse" />}>
                    <img
                        src={"/404-vector.webp"}
                        className="w-full md:w-11/12 lg:w-1/2"
                        alt="Not Found Image"
                        loading="lazy"
                    />
                </Suspense>
            </div>
            <div>
                <h2 className="text-center text-2xl md:text-4xl font-semibold text-dark text-pretty">
                    Uh-oh... I think we took <br /> a wrong turn
                </h2>
                <div className="my-3 md:my-4 flex flex-col items-center justify-center text-balance space-y-4">
                    <p className="text-center font-medium text-gray-700">
                        Let's get you back to where the productive things live.
                    </p>
                    <div className="w-full flex items-center justify-center space-x-4">
                        <Link to={FRONTEND_ENDPOINTS.LANDING}>
                            <Button variant="dark" size="md" IconLucide={ArrowDownLeftIcon}>
                                Home
                            </Button>
                        </Link>
                        <Link to={FRONTEND_ENDPOINTS.GENERATOR}>
                            <Button variant="white" size="md" IconLucide={StarsIcon}>
                                Generator
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
