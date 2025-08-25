import { Link, useLocation } from "react-router-dom";
import { memo, useMemo, useCallback } from "react";
import PaypalIcon from "../../assets/paypal-icon.svg?react";
import RazorpayIcon from "../../assets/razorpay-icon.svg?react";
import { Check } from "lucide-react";
import type { CreditPlan } from "../../hooks/useCreditPlans";
import { FRONTEND_ENDPOINTS } from "../../constants";
import { Button } from "./Button";
import { ACCEPTED_CURRENCY_CODES } from "@cover-letter-ai/constants";

const formatPrice = (
    { priceINR, priceUSD }: { priceINR: number | undefined; priceUSD: number | undefined },
    isINR: boolean = true
) => {
    if (!priceINR || !priceUSD) return "N/A";
    if (isINR) {
        return `₹${priceINR}`;
    } else {
        return `$${priceUSD / 100}`;
    }
};

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
    }: {
        plan: CreditPlan;
        isINR: boolean;
        isPaymentMethodsVisible: boolean;
        buttonText: string;
        onCtaClick: () => void;
        onRazorpayClick: () => void;
        onPaypalClick: () => void;
    }) => {
        const formattedPrice = useMemo(
            () =>
                formatPrice(
                    {
                        priceINR: plan.priceInINR,
                        priceUSD: plan.priceInUSD_Cents,
                    },
                    isINR
                ),
            [plan.priceInINR, plan.priceInUSD_Cents, isINR]
        );

        const cardClasses = useMemo(
            () =>
                `relative card border-2 hover-lift hover-glow ${
                    plan.popular ? "border-primary-500 scale-105" : "border-neutral-200 hover:border-purple-300"
                }`,
            [plan.popular]
        );

        const buttonClasses = useMemo(
            () =>
                `w-full py-4 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular ? "btn-primary" : "btn-outline"
                }`,
            [plan.popular]
        );

        const iconClasses = useMemo(
            () => `w-16 h-16 rounded-2xl ${plan.color} flex items-center justify-center mx-auto mb-4`,
            [plan.color]
        );

        const checkIconClasses = useMemo(
            () => `size-5 rounded-full ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`,
            [plan.color]
        );

        return (
            <div className={cardClasses}>
                {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-primary-500 text-white px-3 lg:px-6 py-2 rounded-full text-sm font-medium shadow-medium">
                            Best Choice
                        </div>
                    </div>
                )}

                <div className="p-8 md:px-5 md:py-8 lg:p-8">
                    <div className="text-center mb-8">
                        <div className={iconClasses}>
                            <plan.icon className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-neutral-800 mb-2">{plan.name}</h3>

                        <div className="text-4xl font-bold mb-2">
                            <span className="text-primary-500">{formattedPrice}</span>
                        </div>

                        <p className="text-secondary-600 text-sm">{plan.credits} credits • One-time purchase</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <div className={checkIconClasses}>
                                    <Check className="size-3 text-white" />
                                </div>
                                <span className="text-secondary-700 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button className={buttonClasses} onClick={onCtaClick}>
                        {buttonText}
                    </button>

                    {/* Payment Buttons Drop-down */}
                    {isPaymentMethodsVisible && (
                        <div className="mt-5 shadow-none transition-all duration-300 ease-in-out animate-slide-up">
                            <Button
                                variant="primary"
                                fullWidth={true}
                                className="bg-white border-secondary-200 border-2 hover:bg-secondary-200 mb-1"
                                onClick={onRazorpayClick}
                                disabled={!isINR}>
                                <RazorpayIcon className="h-4" />
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth={true}
                                className="bg-white border-secondary-200 border-2 hover:bg-secondary-200"
                                onClick={onPaypalClick}
                                disabled={isINR}>
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

export const PricingCardsList = ({
    plans,
    paymentCurrency,
    setPaymentCurrency,
    isPaymentMethodsVisible = false,
    handleCtaBtnClick = () => {},
    handleRazorpayBuyBtnClick,
    handlePaypalBuyBtnClick,
}: {
    plans: CreditPlan[];
    paymentCurrency: ACCEPTED_CURRENCY_CODES;
    setPaymentCurrency: (arg: ACCEPTED_CURRENCY_CODES) => void;
    isPaymentMethodsVisible: boolean;
    handleCtaBtnClick?: () => void;
    handleRazorpayBuyBtnClick?: (plan: CreditPlan) => void;
    handlePaypalBuyBtnClick?: (plan: CreditPlan) => void;
}) => {
    const location = useLocation();

    const isINR = useMemo(() => paymentCurrency === ACCEPTED_CURRENCY_CODES.INR, [paymentCurrency]);

    const buttonText = useMemo(
        () => (location.pathname === FRONTEND_ENDPOINTS.CREDITS_SHOP ? "Buy Now" : "Get Started"),
        [location.pathname]
    );

    const handleCurrencyToggle = useCallback(() => {
        setPaymentCurrency(isINR ? ACCEPTED_CURRENCY_CODES.USD : ACCEPTED_CURRENCY_CODES.INR);
    }, [isINR, setPaymentCurrency]);

    const toggleClasses = useMemo(
        () => `relative w-12 h-6 rounded-full transition-colors ${isINR ? "bg-orange-500" : "bg-neutral-400"}`,
        [isINR]
    );

    const toggleButtonClasses = useMemo(
        () =>
            `absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isINR ? "translate-x-1" : "translate-x-7"
            }`,
        [isINR]
    );

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
                <span className={`text-sm font-medium ${isINR ? "text-orange-500" : "text-neutral-500"}`}>
                    INR (&#8377;)
                </span>
                <button
                    onClick={handleCurrencyToggle}
                    className={toggleClasses}
                    aria-label={`Switch to ${isINR ? "USD" : "INR"} currency`}>
                    <div className={toggleButtonClasses} />
                </button>
                <span className={`text-sm font-medium ${!isINR ? "text-orange-500" : "text-neutral-500"}`}>
                    USD (&#36;)
                </span>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-5xl mx-auto">
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
                <p className="text-secondary-600">
                    Need more credits?{" "}
                    <Link
                        to={FRONTEND_ENDPOINTS.CONTACT}
                        className="text-orange-500 hover:underline focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded">
                        Contact us
                    </Link>{" "}
                    for custom pricing.
                </p>
            </div>
        </>
    );
};
