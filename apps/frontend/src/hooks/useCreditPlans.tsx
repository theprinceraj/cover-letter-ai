import { useEffect, useState } from "react";
import { api } from "./useAuth";
import {
    CREDIT_PACKAGES_ID,
    type CREDIT_PACKAGE_TYPE,
    type CreditsService_GetPackagesList_Response,
} from "@cover-letter-ai/constants";
import { toast } from "sonner";
import { Star, Zap, Crown, type LucideIcon } from "lucide-react";

export interface CreditPlan {
    id: CREDIT_PACKAGES_ID;
    name: string;
    credits: number;
    priceInINR: number;
    priceInUSD_Cents: number;
    popular?: boolean;
    icon: LucideIcon;
    color: string;
    features: string[];
}

export const useCreditPlans = () => {
    const [creditPlans, setCreditPlans] = useState<CreditPlan[]>([]);

    useEffect(() => {
        const fetchCreditPlans = async () => {
            const response = await api.get<CreditsService_GetPackagesList_Response>("/credits/packages-list");
            if (response.status !== 200) {
                toast.error("Failed to fetch packages list");
                return;
            }
            const data = response.data;
            setCreditPlans([
                {
                    id: CREDIT_PACKAGES_ID.BASIC,
                    name: "Basic",
                    credits: data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.BASIC)?.credits ?? 0,
                    priceInINR:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.BASIC)?.priceInINR ?? 0,
                    priceInUSD_Cents:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.BASIC)
                            ?.priceInUSD_Cents ?? 0,
                    icon: Star,
                    color: "bg-green-500",
                    features: [
                        "10 AI-generated cover letters",
                        "Industry-specific customization",
                        "Mobile & desktop access",
                    ],
                },
                {
                    id: CREDIT_PACKAGES_ID.STANDARD,
                    name: "Standard",
                    credits:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.STANDARD)?.credits ?? 0,
                    priceInINR:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.STANDARD)?.priceInINR ??
                        0,
                    priceInUSD_Cents:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.STANDARD)
                            ?.priceInUSD_Cents ?? 0,
                    icon: Zap,
                    color: "bg-primary-500",
                    popular: true,
                    features: [
                        "30 AI-generated cover letters",
                        "Industry-specific customization",
                        "Mobile & desktop access",
                    ],
                },
                {
                    id: CREDIT_PACKAGES_ID.PREMIUM,
                    name: "Premium",
                    credits:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.PREMIUM)?.credits ?? 0,
                    priceInINR:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.PREMIUM)?.priceInINR ?? 0,
                    priceInUSD_Cents:
                        data.find((pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.PREMIUM)
                            ?.priceInUSD_Cents ?? 0,
                    icon: Crown,
                    color: "bg-orange-500",
                    features: [
                        "50 AI-generated cover letters",
                        "Industry-specific customization",
                        "Mobile & desktop access",
                    ],
                },
            ]);
        };
        fetchCreditPlans();
    }, []);

    return { creditPlans };
};
