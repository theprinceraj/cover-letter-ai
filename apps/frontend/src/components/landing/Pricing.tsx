import { useContext, useEffect, useState } from "react";
import { Check, Star, Zap, Crown, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api, useAuth } from "../../hooks/useAuth";
import {
  CREDIT_PACKAGES_ID,
  type CREDIT_PACKAGE_TYPE,
} from "@cover-letter-ai/constants";
import { toast } from "sonner";
import { ModalContext } from "../../Contexts";

type CreditPlan = {
  id: string;
  name: string;
  credits: number;
  priceInINR: number;
  priceInUSD_Cents: number;
  popular?: boolean;
  icon: LucideIcon;
  color: string;
  features: string[];
};

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { fetchWithAuth, isAuthenticated, isGuest } = useAuth();
  const { openSignInModal } = useContext(ModalContext)!;
  const [isINR, setIsINR] = useState(true);
  const [plans, setPlans] = useState<CreditPlan[]>([]);

  useEffect(() => {
    const fetchPackagesList = async () => {
      const response = await api.get<CREDIT_PACKAGE_TYPE[]>(
        "/credits/packages-list"
      );
      if (response.status !== 200) {
        toast.error("Failed to fetch packages list");
        return;
      }
      const data = response.data;
      setPlans([
        {
          id: CREDIT_PACKAGES_ID.BASIC,
          name: "Basic",
          credits:
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.BASIC
            )?.credits ?? 0,
          priceInINR:
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.BASIC
            )?.priceInINR ?? 0,
          priceInUSD_Cents:
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) => pkg.id === CREDIT_PACKAGES_ID.BASIC
            )?.priceInUSD_Cents ?? 0,
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
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) =>
                pkg.id === CREDIT_PACKAGES_ID.STANDARD
            )?.credits ?? 0,
          priceInINR:
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) =>
                pkg.id === CREDIT_PACKAGES_ID.STANDARD
            )?.priceInINR ?? 0,
          priceInUSD_Cents:
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) =>
                pkg.id === CREDIT_PACKAGES_ID.STANDARD
            )?.priceInUSD_Cents ?? 0,
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
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) =>
                pkg.id === CREDIT_PACKAGES_ID.PREMIUM
            )?.credits ?? 0,
          priceInINR:
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) =>
                pkg.id === CREDIT_PACKAGES_ID.PREMIUM
            )?.priceInINR ?? 0,
          priceInUSD_Cents:
            data.find(
              (pkg: CREDIT_PACKAGE_TYPE) =>
                pkg.id === CREDIT_PACKAGES_ID.PREMIUM
            )?.priceInUSD_Cents ?? 0,
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

    fetchPackagesList();
  }, [fetchWithAuth]);

  const formatPrice = (
    priceINR: number | undefined,
    priceUSD: number | undefined
  ) => {
    if (!priceINR || !priceUSD) return "N/A";
    if (isINR) {
      return `₹${priceINR}`;
    } else {
      return `$${priceUSD}`;
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-neutral-800">Simple, </span>
            <span className="text-purple-500">Transparent</span>
            <span className="text-neutral-800"> Pricing</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your job search journey
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span
              className={`text-sm font-medium ${isINR ? "text-orange-500" : "text-neutral-500"}`}
            >
              INR (₹)
            </span>
            <button
              onClick={() => setIsINR(!isINR)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isINR ? "bg-orange-500" : "bg-neutral-400"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isINR ? "translate-x-1" : "translate-x-7"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${!isINR ? "text-orange-500" : "text-neutral-500"}`}
            >
              USD ($)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                  <div className="bg-primary-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-medium">
                    Best Choice
                  </div>
                </div>
              )}

              <div className="p-8">
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
                      {formatPrice(plan.priceInINR, plan.priceInUSD_Cents)}
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
                  onClick={() => {
                    if (isAuthenticated || isGuest) {
                      navigate("/buy-credits");
                    } else {
                      openSignInModal();
                      toast.info("Please sign in to continue");
                    }
                  }}
                >
                  Get Started
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
      </div>
    </section>
  );
};
