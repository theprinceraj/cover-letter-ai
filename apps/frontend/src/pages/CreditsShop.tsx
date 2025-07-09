import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Search } from "lucide-react";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import type { CurrencyCode } from "react-razorpay/dist/constants/currency";
import { type CREDIT_PACKAGE_TYPE } from "@cover-letter-ai/constants";
import { useAuth } from "../hooks/useAuth";
import SadCryGif from "../assets/sad-cry.gif";
import HappyDanceGif from "../assets/happy-dance.gif";
import { ModalContext } from "../Contexts";
import { Toaster, toast } from "sonner";

interface RazorpaySuccessfulPaymentResponse {
  razorpay_signature: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
}

export const CreditsShop: React.FC = () => {
  const { isAuthenticated, fetchWithAuth, refreshAuth } = useAuth();
  const { openSignInModal } = useContext(ModalContext)!;
  const [CREDIT_PACKAGES, setCREDIT_PACKAGES] = useState<CREDIT_PACKAGE_TYPE[]>(
    []
  );
  const { error, isLoading, Razorpay } = useRazorpay();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean | null>(
    null
  );
  const [isPaymentStatusModalOpen, setIsPaymentStatusModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchPackagesList = async () => {
      const response = await fetchWithAuth({
        url: "/credits/packages-list",
        method: "GET",
      });
      setCREDIT_PACKAGES(response);
    };
    fetchPackagesList();
  }, [fetchWithAuth]);

  const handlePurchase = useCallback(
    async (pkg: CREDIT_PACKAGE_TYPE, currency: CurrencyCode) => {
      // Create order through backend and get order_id from it
      let response = await fetchWithAuth({
        url: `/credits/orders`,
        method: "POST",
        data: {
          packageId: pkg.id,
          currencyCodeInISOFormat: currency,
        },
      });
      initiateRazorpayDialog(pkg, currency, response.order.id);
    },
    [fetchWithAuth]
  );

  const handlePaymentSuccess = useCallback(
    async (razorpayResponse: RazorpaySuccessfulPaymentResponse) => {
      console.log(razorpayResponse);
      let response = await fetchWithAuth({
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
    (pkg: CREDIT_PACKAGE_TYPE, currency: CurrencyCode, order_id: string) => {
      const options: RazorpayOrderOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        currency: currency,
        amount: pkg.priceInINR * 100,
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

  const packageCards = useMemo(() => {
    return CREDIT_PACKAGES.map((pkg) => (
      <div
        key={pkg.id}
        className="border border-slate-700 rounded-lg p-6 flex flex-col items-center gap-6 h-full w-full"
      >
        <h2 className="text-xl font-extrabold">{pkg.name} Package</h2>
        <p className="mb-2 font-bold text-slate-300">
          <span className="text-9xl">{pkg.priceInINR}</span> INR
        </p>
        <p className="mb-2 font-bold text-slate-300/40">
          &asymp; {pkg.priceInUSD_Cents / 100} USD
        </p>

        <p className="text-lg font-bold flex items-center gap-2">
          <Search className="size-4" />
          {pkg.credits} <span className="text-sm">Credits</span>
        </p>

        {/* Container for Razorpay Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth={true}
          onClick={() => {
            if (isAuthenticated) {
              handlePurchase(pkg, "INR");
            } else {
              openSignInModal();
              toast.error("Please sign in using your email to buy credits");
            }
          }}
        >
          Buy Now
        </Button>
      </div>
    ));
  }, [CREDIT_PACKAGES, handlePurchase]);

  return (
    <>
      <Header />
      <main className="py-12 px-4 flex justify-center items-center">
        <div className="min-h-screen w-full xl:w-3/4 mx-auto">
          <h1 className="text-3xl font-bold my-16 md:my-24 text-center">
            Buy Credits
          </h1>
          <div className="w-full">
            {isLoading && CREDIT_PACKAGES.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-8 w-full">
                {CREDIT_PACKAGES! && packageCards}
              </div>
            )}
          </div>
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
        </div>
        <Toaster richColors />
      </main>
      <Footer />
    </>
  );
};
