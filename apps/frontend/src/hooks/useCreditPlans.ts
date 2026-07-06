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
    features: string[];
}

const PLAN_METADATA: Record<CREDIT_PACKAGES_ID, { icon: LucideIcon; popular?: boolean; features: string[] }> = {
    [CREDIT_PACKAGES_ID.BASIC]: {
        icon: Star,
        features: [
            "10 AI-generated cover letters",
            "Industry-specific customization",
            "Mobile & desktop access",
        ],
    },
    [CREDIT_PACKAGES_ID.STANDARD]: {
        icon: Zap,
        popular: true,
        features: [
            "30 AI-generated cover letters",
            "Industry-specific customization",
            "Mobile & desktop access",
        ],
    },
    [CREDIT_PACKAGES_ID.PREMIUM]: {
        icon: Crown,
        features: [
            "50 AI-generated cover letters",
            "Industry-specific customization",
            "Mobile & desktop access",
        ],
    },
};

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
            const mapped = data.map((pkg: CREDIT_PACKAGE_TYPE) => ({
                ...pkg,
                ...(PLAN_METADATA[pkg.id] || { icon: Star, features: [] }),
            }));
            setCreditPlans(mapped);
        };
        fetchCreditPlans();
    }, []);

    return { creditPlans };
};
