import { Check } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { CreditPlan } from "../../hooks/useCreditPlans";
import { FRONTEND_ENDPOINTS } from "../../constants";

export const PricingCardsList = ({
  plans,
  handleBuyBtnClick,
  isINR = true,
}: {
  plans: CreditPlan[];
  handleBuyBtnClick: (plan: CreditPlan) => void;
  isINR?: boolean;
}) => {
  const location = useLocation();
  const formatPrice = (
    {
      priceINR,
      priceUSD,
    }: { priceINR: number | undefined; priceUSD: number | undefined },
    isINR: boolean = true
  ) => {
    if (!priceINR || !priceUSD) return "N/A";
    if (isINR) {
      return `₹${priceINR}`;
    } else {
      return `$${priceUSD / 100}`;
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative card border-2 hover-lift hover-glow ${
              plan.popular
                ? "border-primary-500 scale-105"
                : "border-neutral-200 hover:border-purple-300"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary-500 text-white px-3 lg:px-6 py-2 rounded-full text-sm font-medium shadow-medium">
                  Best Choice
                </div>
              </div>
            )}

            <div className="p-8 md:px-5 md:py-8 lg:p-8">
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 rounded-2xl ${plan.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                  {plan.name}
                </h3>

                <div className="text-4xl font-bold mb-2">
                  <span className="text-primary-500">
                    {formatPrice(
                      {
                        priceINR: plan.priceInINR,
                        priceUSD: plan.priceInUSD_Cents,
                      },
                      isINR
                    )}
                  </span>
                </div>

                <p className="text-secondary-600 text-sm">
                  {plan.credits} credits • One-time purchase
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-secondary-700 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => handleBuyBtnClick(plan)}
              >
                {location.pathname === FRONTEND_ENDPOINTS.CREDITS_SHOP
                  ? "Buy Now"
                  : "Get Started"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <p className="text-secondary-600">
          Need more credits?{" "}
          <Link
            to="/contact-us"
            className="text-orange-500 hover:underline focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          >
            Contact us
          </Link>{" "}
          for custom pricing.
        </p>
      </div>
    </>
  );
};
