import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ModalContext, AuthContext } from "../../Contexts";
import { PricingCardsList } from "../ui/PricingCardsList";
import { useCreditPlans } from "../../hooks/useCreditPlans";
import { LandingSectionTemplate } from "../ui/LandingSectionTemplate";

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useContext(AuthContext)!;
  const { openSignInModal } = useContext(ModalContext)!;
  const [isINR, setIsINR] = useState(true);
  const { creditPlans } = useCreditPlans();

  const handleBuyBtnClick = useCallback(() => {
    if (isAuthenticated || isGuest) {
      navigate("/buy-credits");
    } else {
      openSignInModal();
      toast.info("Please sign in to continue");
    }
  }, [isAuthenticated, isGuest, navigate, openSignInModal]);

  return (
    <LandingSectionTemplate
      title={
        <>
          <span className="text-neutral-800">Simple, </span>
          <span className="text-purple-500">Transparent</span>
          <span className="text-neutral-800"> Pricing</span>
        </>
      }
      description="Choose the perfect plan for your job search journey"
      id="pricing"
      bgClasses="bg-white"
    >
      {/* Currency Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <span
          className={`text-sm font-medium ${isINR ? "text-orange-500" : "text-neutral-500"}`}
        >
          INR (&#8377;)
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
          USD (&#36;)
        </span>
      </div>

      <PricingCardsList
        plans={creditPlans}
        handleBuyBtnClick={handleBuyBtnClick}
        isINR={isINR}
      />
    </LandingSectionTemplate>
  );
};
