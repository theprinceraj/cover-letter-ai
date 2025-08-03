import { useCallback, useContext, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext, GlobalContext } from "../../Contexts";
import { PricingCardsList } from "../ui/PricingCardsList";
import { useCreditPlans } from "../../hooks/useCreditPlans";
import { LandingSectionTemplate } from "../ui/LandingSectionTemplate";

const PricingTitle = memo(() => (
    <>
        <span className="text-neutral-800">Simple, </span>
        <span className="text-purple-500">Transparent</span>
        <span className="text-neutral-800"> Pricing</span>
    </>
));

PricingTitle.displayName = "PricingTitle";

export const Pricing: React.FC = memo(() => {
    const navigate = useNavigate();

    const { isAuthenticated, isGuest } = useContext(AuthContext)!;
    const { openSignInModal, paymentCurrency, setPaymentCurrency } = useContext(GlobalContext)!;

    const { creditPlans } = useCreditPlans();

    const authState = useMemo(
        () => ({
            isAuthenticated,
            isGuest,
            canNavigateDirectly: isAuthenticated || isGuest,
        }),
        [isAuthenticated, isGuest]
    );

    const handleCtaBtnClick = useCallback(() => {
        if (authState.canNavigateDirectly) {
            navigate("/buy-credits");
        } else {
            openSignInModal();
            toast.info("Please sign in to continue");
        }
    }, [authState.canNavigateDirectly, navigate, openSignInModal]);

    const pricingCardsProps = useMemo(
        () => ({
            paymentCurrency,
            setPaymentCurrency,
            plans: creditPlans,
            isPaymentMethodsVisible: false,
            handleCtaBtnClick,
        }),
        [paymentCurrency, setPaymentCurrency, creditPlans, handleCtaBtnClick]
    );

    const sectionProps = useMemo(
        () => ({
            title: <PricingTitle />,
            description: "Choose the perfect plan for your job search journey",
            id: "pricing",
            bgClasses: "bg-white",
        }),
        []
    );

    return (
        <LandingSectionTemplate {...sectionProps}>
            <PricingCardsList {...pricingCardsProps} />
        </LandingSectionTemplate>
    );
});

Pricing.displayName = "Pricing";
