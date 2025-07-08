import { useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Search } from "lucide-react";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import type { CurrencyCode } from "react-razorpay/dist/constants/currency";
import type { CREDIT_PACKAGE_TYPE } from "@cover-letter-ai/constants";

export const CreditsShop: React.FC = () => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // fetch this package info from backend dynamically
  const CREDIT_PACKAGES: CREDIT_PACKAGE_TYPE[] = [];

  const handlePurchase = (pkg: any, currency: CurrencyCode) => {
    console.log(pkg);
    // TODO: Create order through backend and get order_id from it
    const order_id = "order_9A33Xe8G7P7P54";
    initiateRazorpayDialog(pkg, currency, order_id);
  };

  const initiateRazorpayDialog = (
    pkg: any,
    currency: CurrencyCode,
    order_id: string
  ) => {
    const options: RazorpayOrderOptions = {
      key: "PUBLIC_RAZORPAY_KEY",
      currency: currency,
      amount: pkg.priceInINR * 100,
      name: "Credits",
      order_id: order_id,
      handler: function (response: any) {
        // called on successful payment
        console.log(response);
        alert("Payment successful");
      },
      modal: {
        ondismiss: function () {
          // called on modal dismissal
          alert("modal dismissed");
        },
      },
    };
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <>
      <Header />
      <main className="py-12 px-4 flex justify-center items-center">
        <div className="min-h-screen w-full xl:w-3/4 mx-auto">
          <h1 className="text-3xl font-bold my-16 md:my-24 text-center">
            Buy Credits
          </h1>
          <div className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-8 w-full">
                {CREDIT_PACKAGES &&
                  CREDIT_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="border border-slate-700 rounded-lg p-6 flex flex-col items-center gap-6 h-full w-full"
                    >
                      <h2 className="text-xl font-extrabold">
                        {pkg.name} Package
                      </h2>
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
                        onClick={() => handlePurchase(pkg, "INR")}
                      >
                        Buy Now
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
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
      </main>
      <Footer />
    </>
  );
};
