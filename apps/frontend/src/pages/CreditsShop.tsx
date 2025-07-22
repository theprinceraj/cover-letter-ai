import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import type { CurrencyCode } from "react-razorpay/dist/constants/currency";
import { toast } from "sonner";
import SadCryGif from "../assets/sad-cry.gif";
import HappyDanceGif from "../assets/happy-dance.gif";
import { useCallback, useContext, useState } from "react";
import { ModalContext, AuthContext } from "../Contexts";
import { useCreditPlans, type CreditPlan } from "../hooks/useCreditPlans";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Header } from "../components/Header";
import { HeroTemplate } from "../components/ui/HeroTemplate";
import { PricingCardsList } from "../components/ui/PricingCardsList";

interface RazorpaySuccessfulPaymentResponse {
  razorpay_signature: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
}

export const CreditsShop: React.FC = () => {
  const {
    isAuthenticated,
    isGuest,
    isEmailVerified,
    fetchWithAuth,
    refreshAuth,
  } = useContext(AuthContext)!;
  const { openSignInModal } = useContext(ModalContext)!;
  const { creditPlans } = useCreditPlans();
  const { error, isLoading, Razorpay } = useRazorpay();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean | null>(
    null
  );
  const [isPaymentStatusModalOpen, setIsPaymentStatusModalOpen] =
    useState<boolean>(false);

  const handlePaymentSuccess = useCallback(
    async (razorpayResponse: RazorpaySuccessfulPaymentResponse) => {
      const response = await fetchWithAuth<
        any | { error: true; message: string }
      >({
        url: `/credits/orders/verify-payment/${razorpayResponse.razorpay_order_id}`,
        method: "POST",
        data: {
          razorpay_signature: razorpayResponse.razorpay_signature,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        },
      });
      setIsPaymentSuccess(response?.success === true ? true : false);
      setIsPaymentStatusModalOpen(true);
    },
    [fetchWithAuth]
  );

  const handlePaymentFailure = useCallback(() => {
    setIsPaymentSuccess(false);
    setIsPaymentStatusModalOpen(true);
  }, []);

  const initiateRazorpayDialog = useCallback(
    (plan: CreditPlan, currency: CurrencyCode, order_id: string) => {
      const options: RazorpayOrderOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        currency: currency,
        amount: plan.priceInINR * 100,
        name: "Credits",
        order_id: order_id,
        handler: handlePaymentSuccess,
        modal: {
          ondismiss: handlePaymentFailure,
        },
      };
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    },
    [handlePaymentFailure, handlePaymentSuccess]
  );

  const handlePurchase = useCallback(
    async (pkg: CreditPlan, currency: CurrencyCode) => {
      // Create order through backend and get order_id from it
      const response = await fetchWithAuth<
        any | { error: true; message: string }
      >({
        url: `/credits/orders`,
        method: "POST",
        data: {
          packageId: pkg.id,
          currencyCodeInISOFormat: currency,
        },
      });
      if (response.order?.id) {
        initiateRazorpayDialog(pkg, currency, response.order.id);
      } else if (response.error) {
        toast.error(response.message);
      } else {
        toast.error("Failed to create order. Please try again later.");
      }
    },
    [fetchWithAuth, initiateRazorpayDialog]
  );

  const handleBuyBtnClick = (plan: CreditPlan) => {
    if (!isAuthenticated) {
      openSignInModal();
      toast.error("Please sign in using your email to buy credits");
      return;
    }
    if (isGuest) {
      toast.error(
        "Guest users cannot buy credits. Please sign in with a registered account."
      );
      return;
    }
    if (!isEmailVerified) {
      toast.error("Please verify your email before buying credits.");
      return;
    }
    handlePurchase(plan, "INR");
  };

  return (
    <>
      <Header />
      <HeroTemplate>
        <>
          <h1 className="text-3xl text-slate-950 font-bold mb-16 md:mb-24 text-center">
            Buy Credits Now
          </h1>
          <div className="w-full">
            {isLoading && creditPlans.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="xl" />
              </div>
            ) : (
              creditPlans && (
                <PricingCardsList
                  plans={creditPlans}
                  handleBuyBtnClick={handleBuyBtnClick}
                  isINR={true}
                />
              )
            )}
          </div>
          {/* Payment Status Modal */}
          {isPaymentStatusModalOpen && (
            <Modal
              isOpen={isPaymentStatusModalOpen}
              onClose={() => setIsPaymentStatusModalOpen(false)}
              title="Payment Status"
              contentClassName="flex flex-col items-center gap-4"
            >
              {isPaymentSuccess === true ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-36 md:h-48 overflow-clip">
                    <img
                      src={HappyDanceGif}
                      alt="Happy Dance"
                      className="h-full w-auto -ml-1 md:-ml-2 lg:-ml-3 xl:-ml-4"
                    />
                  </div>
                  <div className="text-center text-base text-green-500">
                    Payment successful. Enjoy your newly added credits!
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-36 md:h-48 overflow-clip">
                    <img
                      src={SadCryGif}
                      alt="Sad Cry"
                      className="h-full w-auto"
                    />
                  </div>
                  <p className="text-center text-base text-red-500">
                    Payment failed.
                  </p>
                </div>
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsPaymentStatusModalOpen(false);
                  setIsPaymentSuccess(null);
                  if (isPaymentSuccess === true) {
                    refreshAuth();
                  }
                }}
              >
                {isPaymentSuccess === true ? "Close" : "Try Again"}
              </Button>
            </Modal>
          )}
          {/* Razorpay Error Modal */}
          {error && (
            <Modal
              isOpen={isErrorModalOpen}
              onClose={() => setIsErrorModalOpen(false)}
              title="Error Occured"
            >
              <div className="text-red-500">
                Failed to load Razorpay. Please try again later.
              </div>
              <Button
                variant="primary"
                onClick={() => setIsErrorModalOpen(false)}
              >
                Close
              </Button>
            </Modal>
          )}
        </>
      </HeroTemplate>
      <Footer />
    </>
  );
};
