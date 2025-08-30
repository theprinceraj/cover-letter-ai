import type React from "react";
import { Layout } from "../Layout";
import NotFoundVectorImg from "../assets/404-vector.webp";
import { Link } from "react-router";
import { FRONTEND_ENDPOINTS } from "../constants";
import Button from "../components/ui/Button";

export const NotFound: React.FC = () => {
    return (
        <Layout className="bg-gradient-to-b from-primary/60 to-primary/40" hasHeader hasFooter>
            <div className="w-[40%] overflow-clip mx-auto -mt-20 lg:-mt-30 -mb-20">
                <img src={NotFoundVectorImg} className="w-full" alt="Not Found Image" />
            </div>
            <div>
                <h2 className="text-center text-4xl font-semibold text-dark text-pretty">
                    Uh-oh... I think we took <br /> a wrong turn
                </h2>
                <div className="my-4 flex flex-col items-center justify-center space-y-4">
                    <p className="text-center font-medium text-gray-700">
                        Let's get you back to where the productive things live.
                    </p>
                    <Button variant="dark">
                        <Link to={FRONTEND_ENDPOINTS.LANDING}>Home</Link>
                    </Button>
                </div>
            </div>
        </Layout>
    );
};
