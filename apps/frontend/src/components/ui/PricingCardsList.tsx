import PaypalIcon from "../../assets/paypal-icon.svg?react";
import RazorpayIcon from "../../assets/razorpay-icon.svg?react";
import Button from "./Button";
import { Link, useLocation } from "react-router";
import { memo, useMemo, useCallback } from "react";
import { Check } from "lucide-react";
import type { CreditPlan } from "../../hooks/useCreditPlans";
import { FRONTEND_ENDPOINTS } from "../../constants";
import { ACCEPTED_CURRENCY_CODES } from "@cover-letter-ai/constants";

const formatPrice = (
    { priceINR, priceUSD }: { priceINR: number | undefined; priceUSD: number | undefined },
    isINR: boolean = true
) => {
    if (!priceINR || !priceUSD) return "N/A";
    if (isINR) return `₹${priceINR}`;
    else return `$${priceUSD / 100}`;
};

interface PricingCardProps {
    plan: CreditPlan;
    isINR: boolean;
    isPaymentMethodsVisible: boolean;
    buttonText: string;
    onCtaClick: () => void;
    onRazorpayClick: () => void;
    onPaypalClick: () => void;
}

// Memoize individual pricing card to prevent unnecessary re-renders
const PricingCard = memo(
    ({
        plan,
        isINR,
        isPaymentMethodsVisible,
        buttonText,
        onCtaClick,
        onRazorpayClick,
        onPaypalClick,
    }: PricingCardProps) => {
        const formattedPrice = formatPrice({ priceINR: plan.priceInINR, priceUSD: plan.priceInUSD_Cents }, isINR);
        const cardClasses = `bg-dark text-white relative rounded-2xl border-2 hover-lift hover-glow ${
            plan.popular ? "border-primary scale-105" : "border-neutral-200 hover:border-purple-300"
        }`;

        return (
            <div className={cardClasses}>
                {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-primary outline-2 outline-white text-dark px-3 lg:px-6 py-2 rounded-full text-sm font-medium shadow-medium">
                            Best Choice
                        </div>
                    </div>
                )}

                <div className="p-8 md:px-5 md:py-8 lg:p-8">
                    <div className="text-center mb-8">
                        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                            <plan.icon className="size-8 text-dark" />
                        </div>

                        <h3 className="text-2xl font-bold text-neutral-800 mb-2">{plan.name}</h3>

                        <div className="text-4xl font-bold mb-2">
                            <span className="text-primary-500">{formattedPrice}</span>
                        </div>

                        <p className="text-sm">{plan.credits} credits • One-time purchase</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <div className="size-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="size-3 text-dark" />
                                </div>
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <Button variant={plan.popular ? "white" : "dark"} className="w-full" onClick={onCtaClick}>
                        {buttonText}
                    </Button>

                    {/* Payment Buttons Drop-down */}
                    {isPaymentMethodsVisible && (
                        <div className="mt-5 shadow-none transition-all duration-200 ease-in-out animate-slide-up flex flex-col space-y-2">
                            <Button variant="yellow" className="w-full" onClick={onRazorpayClick} disabled={!isINR}>
                                <RazorpayIcon className="h-4" />
                            </Button>
                            <Button variant="yellow" className="w-full" onClick={onPaypalClick} disabled={isINR}>
                                <PaypalIcon className="h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
PricingCard.displayName = "PricingCard";

interface PricingCardListProps {
    plans: CreditPlan[];
    paymentCurrency: ACCEPTED_CURRENCY_CODES;
    setPaymentCurrency: (arg: ACCEPTED_CURRENCY_CODES) => void;
    isPaymentMethodsVisible: boolean;
    handleCtaBtnClick?: () => void;
    handleRazorpayBuyBtnClick?: (plan: CreditPlan) => void;
    handlePaypalBuyBtnClick?: (plan: CreditPlan) => void;
}

export const PricingCardsList = ({
    plans,
    paymentCurrency,
    setPaymentCurrency,
    isPaymentMethodsVisible = false,
    handleCtaBtnClick = () => {},
    handleRazorpayBuyBtnClick,
    handlePaypalBuyBtnClick,
}: PricingCardListProps) => {
    const location = useLocation();
    const isINR = useMemo(() => paymentCurrency === ACCEPTED_CURRENCY_CODES.INR, [paymentCurrency]);
    const buttonText = useMemo(
        () => (location.pathname === FRONTEND_ENDPOINTS.CREDITS_SHOP ? "Buy Now" : "Get Started"),
        [location.pathname]
    );
    const handleCurrencyToggle = useCallback(() => {
        setPaymentCurrency(isINR ? ACCEPTED_CURRENCY_CODES.USD : ACCEPTED_CURRENCY_CODES.INR);
    }, [isINR, setPaymentCurrency]);
    const toggleClasses = `relative w-12 h-6 rounded-full transition-colors ${isINR ? "bg-dark" : "bg-neutral-400"}`;
    const toggleButtonClasses = `absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
        isINR ? "translate-x-1" : "translate-x-7"
    }`;
    const createHandlers = useCallback(
        (plan: CreditPlan) => ({
            onCtaClick: () => handleCtaBtnClick(),
            onRazorpayClick: () => handleRazorpayBuyBtnClick?.(plan),
            onPaypalClick: () => handlePaypalBuyBtnClick?.(plan),
        }),
        [handleCtaBtnClick, handleRazorpayBuyBtnClick, handlePaypalBuyBtnClick]
    );

    return (
        <>
            {/* Currency Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-16">
                <span className={`text-sm font-medium ${isINR ? "text-dark" : "text-neutral-500"}`}>INR (&#8377;)</span>
                <button
                    onClick={handleCurrencyToggle}
                    className={toggleClasses}
                    aria-label={`Switch to ${isINR ? "USD" : "INR"} currency`}>
                    <div className={toggleButtonClasses} />
                </button>
                <span className={`text-sm font-medium ${!isINR ? "text-dark" : "text-neutral-500"}`}>USD (&#36;)</span>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-4 lg:gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => {
                    const handlers = createHandlers(plan);
                    return (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isINR={isINR}
                            isPaymentMethodsVisible={isPaymentMethodsVisible}
                            buttonText={buttonText}
                            onCtaClick={handlers.onCtaClick}
                            onRazorpayClick={handlers.onRazorpayClick}
                            onPaypalClick={handlers.onPaypalClick}
                        />
                    );
                })}
            </div>

            <div className="text-center mt-12">
                <h5>
                    <span>Need more credits?</span>{" "}
                    <span>
                        <Link to={FRONTEND_ENDPOINTS.CONTACT} className="hover:text-blue-600 underline">
                            Contact us
                        </Link>
                    </span>{" "}
                    <span>for custom pricing.</span>
                </h5>
            </div>
        </>
    );
};
