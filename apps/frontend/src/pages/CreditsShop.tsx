import {
    ACCEPTED_CURRENCY_CODES,
    PAYMENT_GATEWAYS,
    type CREDIT_ORDER_STATUS,
    type CREDIT_PACKAGE_TYPE,
} from "@cover-letter-ai/constants";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import type { CurrencyCode } from "react-razorpay/dist/constants/currency";
import { toast } from "sonner";
import SadCryGif from "../assets/sad-cry.gif";
import HappyDanceGif from "../assets/happy-dance.gif";
import { useCallback, useContext, useState, useMemo, memo, lazy, Suspense } from "react";
import { AuthContext, GlobalContext } from "../Contexts";
import { useCreditPlans, type CreditPlan } from "../hooks/useCreditPlans";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Header } from "../components/Header";
import { HeroTemplate } from "../components/ui/HeroTemplate";
import { PricingCardsList } from "../components/ui/PricingCardsList";
import { SEO } from "../components/seo/SEO";
import { type PayPalButtonsComponentProps, type ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

// Lazy load PayPal components to reduce initial bundle size
const PayPalScriptProvider = lazy(() =>
    import("@paypal/react-paypal-js").then((module) => ({
        default: module.PayPalScriptProvider,
    }))
);

const PayPalButtons = lazy(() =>
    import("@paypal/react-paypal-js").then((module) => ({
        default: module.PayPalButtons,
    }))
);

type CreateOrderFn = NonNullable<PayPalButtonsComponentProps["createOrder"]>;
type onApprovedPaymentFn = NonNullable<PayPalButtonsComponentProps["onApprove"]>;

interface RazorpaySuccessfulPaymentResponse {
    razorpay_signature: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
}

const PayPalModal = memo(
    ({
        isVisible,
        onClose,
        currency,
        clientId,
        environment,
        onCreateOrder,
        onApprove,
        onError,
    }: {
        isVisible: boolean;
        onClose: () => void;
        currency: string;
        clientId: string;
        environment: "development" | "sandbox" | undefined;
        onCreateOrder: PayPalButtonsComponentProps["createOrder"];
        onApprove: PayPalButtonsComponentProps["onApprove"];
        onError: PayPalButtonsComponentProps["onError"];
    }) => {
        const onCancel = () => {
            toast.error("Payment was cancelled by the user");
        };

        const paypalOptions = useMemo(
            () =>
                ({
                    clientId,
                    currency,
                    environment: environment ? environment : "sandbox",
                }) as ReactPayPalScriptOptions,
            [clientId, currency, environment]
        );

        if (!isVisible) return null;

        return (
            <Suspense
                fallback={
                    <Modal isOpen={true} onClose={onClose}>
                        <Spinner size="xl" />
                    </Modal>
                }>
                <PayPalScriptProvider options={paypalOptions}>
                    <Modal isOpen={isVisible} onClose={onClose}>
                        <PayPalButtons
                            createOrder={onCreateOrder}
                            onApprove={onApprove}
                            onError={onError}
                            onCancel={onCancel}
                        />
                    </Modal>
                </PayPalScriptProvider>
            </Suspense>
        );
    }
);

PayPalModal.displayName = "PayPalModal";

const PaymentStatusModal = memo(
    ({
        isOpen,
        onClose,
        isSuccess,
        onButtonClick,
    }: {
        isOpen: boolean;
        onClose: () => void;
        isSuccess: boolean | null;
        onButtonClick: () => void;
    }) => {
        const modalContent = useMemo(() => {
            if (isSuccess === true) {
                return {
                    gif: HappyDanceGif,
                    alt: "Happy Dance",
                    message: "Payment successful. Enjoy your newly added credits!",
                    messageClass: "text-green-500",
                    buttonText: "Close",
                    gifClass: "h-full w-auto -ml-1 md:-ml-2 lg:-ml-3 xl:-ml-4",
                };
            } else {
                return {
                    gif: SadCryGif,
                    alt: "Sad Cry",
                    message: "Payment failed.",
                    messageClass: "text-red-500",
                    buttonText: "Try Again",
                    gifClass: "h-full w-auto",
                };
            }
        }, [isSuccess]);

        if (!isOpen) return null;

        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Payment Status"
                contentClassName="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-36 md:h-48 overflow-clip">
                        <img src={modalContent.gif} alt={modalContent.alt} className={modalContent.gifClass} />
                    </div>
                    <div className={`text-center text-base ${modalContent.messageClass}`}>{modalContent.message}</div>
                </div>
                <Button variant="primary" size="md" onClick={onButtonClick}>
                    {modalContent.buttonText}
                </Button>
            </Modal>
        );
    }
);

PaymentStatusModal.displayName = "PaymentStatusModal";

export const CreditsShop: React.FC = memo(() => {
    const { isAuthenticated, isGuest, isEmailVerified, fetchWithAuth, refreshAuth } = useContext(AuthContext)!;

    const { openSignInModal, paymentCurrency, setPaymentCurrency } = useContext(GlobalContext)!;

    const { creditPlans } = useCreditPlans();
    const { error, isLoading, Razorpay } = useRazorpay();

    const [isPaymentMethodsVisible, setIsPaymentMethodsVisible] = useState<boolean>(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean | null>(null);
    const [isPaymentStatusModalOpen, setIsPaymentStatusModalOpen] = useState<boolean>(false);
    const [isPaypalBtnsVisible, setIsPaypalBtnsVisible] = useState<boolean>(false);
    const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null);
    const envVars = useMemo(
        () => ({
            razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
            paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
            environment: import.meta.env.VITE_ENVIRONMENT,
        }),
        []
    );

    const canPurchase = useMemo(
        () => ({
            isAuthenticated,
            isNotGuest: !isGuest,
            isEmailVerified,
            canBuy: isAuthenticated && !isGuest && isEmailVerified,
        }),
        [isAuthenticated, isGuest, isEmailVerified]
    );

    const handleRazorpayPaymentSuccess = useCallback(
        async (razorpayResponse: RazorpaySuccessfulPaymentResponse) => {
            try {
                const response = await fetchWithAuth<
                    { success: boolean; creditsAdded: number } | { error: true; message: string }
                >({
                    url: `/credits/orders/verify-payment/razorpay/${razorpayResponse.razorpay_order_id}`,
                    method: "POST",
                    data: {
                        razorpay_signature: razorpayResponse.razorpay_signature,
                        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    },
                });

                if ("error" in response) {
                    toast.error(response.message);
                    setIsPaymentSuccess(false);
                } else {
                    setIsPaymentSuccess(response?.success === true);
                }
                setIsPaymentStatusModalOpen(true);
            } catch (error) {
                console.error(error);
                toast.error("Payment verification failed");
                setIsPaymentSuccess(false);
                setIsPaymentStatusModalOpen(true);
            }
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
                key: envVars.razorpayKeyId,
                currency: currency,
                amount: plan.priceInINR * 100,
                name: "Credits",
                order_id: order_id,
                handler: handleRazorpayPaymentSuccess,
                modal: {
                    ondismiss: handlePaymentFailure,
                },
            };
            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        },
        [envVars.razorpayKeyId, handlePaymentFailure, handleRazorpayPaymentSuccess, Razorpay]
    );

    const handleRazorpayPurchase = useCallback(
        async (pkg: CreditPlan, currency: CurrencyCode) => {
            try {
                const response = await fetchWithAuth<
                    | {
                          order: {
                              id: string;
                              amountToBePaidInMinorUnits: number;
                              currency: ACCEPTED_CURRENCY_CODES;
                              status: CREDIT_ORDER_STATUS;
                              orderCreatedAt: Date;
                          };
                          pkg: CREDIT_PACKAGE_TYPE;
                      }
                    | { error: true; message: string }
                >({
                    url: `/credits/orders`,
                    method: "POST",
                    data: {
                        packageId: pkg.id,
                        currencyCodeInISOFormat: currency,
                        paymentGateway: PAYMENT_GATEWAYS.RAZORPAY,
                    },
                });

                if ("error" in response) {
                    toast.error(response.message);
                    return;
                }

                if ("order" in response && response.order?.id) {
                    initiateRazorpayDialog(pkg, currency, response.order.id);
                } else {
                    toast.error("Failed to create order. Please try again later.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to create order. Please try again later.");
            }
        },
        [fetchWithAuth, initiateRazorpayDialog]
    );

    const handleRazorpayBuyBtnClick = useCallback(
        (plan: CreditPlan) => {
            if (!canPurchase.isAuthenticated) {
                openSignInModal();
                toast.error("Please sign in using your email to buy credits");
                return;
            }
            if (!canPurchase.isNotGuest) {
                toast.error("Guest users cannot buy credits. Please sign in with a registered account.");
                return;
            }
            if (!canPurchase.isEmailVerified) {
                toast.error("Please verify your email before buying credits.");
                return;
            }
            handleRazorpayPurchase(plan, ACCEPTED_CURRENCY_CODES.INR);
        },
        [canPurchase, openSignInModal, handleRazorpayPurchase]
    );

    // PayPal Related Functions
    const handlePaypalBuyBtnClick = useCallback(
        (plan: CreditPlan) => {
            if (!canPurchase.canBuy) {
                if (!canPurchase.isAuthenticated) {
                    openSignInModal();
                    toast.error("Please sign in using your email to buy credits");
                } else if (!canPurchase.isNotGuest) {
                    toast.error("Guest users cannot buy credits. Please sign in with a registered account.");
                } else if (!canPurchase.isEmailVerified) {
                    toast.error("Please verify your email before buying credits.");
                }
                return;
            }
            setSelectedPlan(plan);
            setIsPaypalBtnsVisible(true);
        },
        [canPurchase, openSignInModal]
    );

    const handlePaypalCreateOrder: CreateOrderFn = useCallback(async () => {
        const response = await fetchWithAuth<
            | {
                  order: {
                      id: string;
                      amountToBePaidInMinorUnits: number;
                      currency: ACCEPTED_CURRENCY_CODES;
                      status: CREDIT_ORDER_STATUS;
                      orderCreatedAt: Date;
                  };
                  pkg: CREDIT_PACKAGE_TYPE;
              }
            | { error: true; message: string }
        >({
            url: `/credits/orders`,
            method: "POST",
            data: {
                packageId: selectedPlan?.id,
                currencyCodeInISOFormat: paymentCurrency,
                paymentGateway: PAYMENT_GATEWAYS.PAYPAL,
            },
        });
        if ("error" in response) {
            toast.error(response.message);
            return "null";
        }

        if ("order" in response && response.order?.id) {
            return response.order.id;
        } else {
            toast.error("Failed to create order. Please try again later.");
            return "null";
        }
    }, [selectedPlan, paymentCurrency, fetchWithAuth]);

    const handlePaypalPaymentSuccess: onApprovedPaymentFn = useCallback(
        async (data) => {
            try {
                const response = await fetchWithAuth<
                    { success: boolean; creditsAdded: number } | { error: true; message: string }
                >({
                    url: `/credits/orders/verify-payment/paypal/${data.orderID}`,
                    method: "POST",
                });

                if ("error" in response) {
                    toast.error(response.message);
                    setIsPaymentSuccess(false);
                } else {
                    setIsPaymentSuccess(response?.success === true);
                }
                setIsPaymentStatusModalOpen(true);
            } catch (error) {
                console.error(error);
                toast.error("Payment verification failed");
                setIsPaymentSuccess(false);
                setIsPaymentStatusModalOpen(true);
            }
        },
        [fetchWithAuth]
    );

    const handlePaymentMethodsToggle = useCallback(() => {
        setIsPaymentMethodsVisible((prev) => !prev);
    }, []);

    const handleClosePaypalModal = useCallback(() => {
        setIsPaypalBtnsVisible(false);
        setSelectedPlan(null);
    }, []);

    const handleCloseErrorModal = useCallback(() => {
        setIsErrorModalOpen(false);
    }, []);

    const handlePaymentStatusButtonClick = useCallback(() => {
        setIsPaymentStatusModalOpen(false);
        setIsPaymentSuccess(null);
        if (isPaymentSuccess === true) {
            refreshAuth();
        }
    }, [isPaymentSuccess, refreshAuth]);

    const handleClosePaymentStatusModal = useCallback(() => {
        setIsPaymentStatusModalOpen(false);
    }, []);

    const isLoadingState = useMemo(() => isLoading && creditPlans.length === 0, [isLoading, creditPlans.length]);

    const pricingCardsProps = useMemo(
        () => ({
            plans: creditPlans,
            paymentCurrency,
            setPaymentCurrency,
            isPaymentMethodsVisible,
            handleCtaBtnClick: handlePaymentMethodsToggle,
            handleRazorpayBuyBtnClick,
            handlePaypalBuyBtnClick,
        }),
        [
            creditPlans,
            paymentCurrency,
            setPaymentCurrency,
            isPaymentMethodsVisible,
            handlePaymentMethodsToggle,
            handleRazorpayBuyBtnClick,
            handlePaypalBuyBtnClick,
        ]
    );

    return (
        <>
            <SEO
                title="Buy Credits - CoverGenius AI"
                description="Purchase credits to generate more AI-powered cover letters. Choose from a variety of credit packages to suit your needs."
                name="CoverGenius AI"
                type="website"
            />
            <Header />
            <HeroTemplate>
                <>
                    <h1 className="text-3xl text-slate-950 font-bold mb-16 md:mb-24 text-center">Buy Credits Now</h1>
                    <div className="w-full pb-16">
                        {isLoadingState ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="xl" />
                            </div>
                        ) : (
                            creditPlans && <PricingCardsList {...pricingCardsProps} />
                        )}
                    </div>

                    {/* PayPal Modal */}
                    <PayPalModal
                        isVisible={isPaypalBtnsVisible}
                        onClose={handleClosePaypalModal}
                        currency={paymentCurrency}
                        clientId={envVars.paypalClientId}
                        environment={envVars.environment}
                        onCreateOrder={handlePaypalCreateOrder}
                        onApprove={handlePaypalPaymentSuccess}
                        onError={handlePaymentFailure}
                    />

                    {/* Payment Status Modal */}
                    <PaymentStatusModal
                        isOpen={isPaymentStatusModalOpen}
                        onClose={handleClosePaymentStatusModal}
                        isSuccess={isPaymentSuccess}
                        onButtonClick={handlePaymentStatusButtonClick}
                    />

                    {/* Razorpay Error Modal */}
                    {error && (
                        <Modal isOpen={isErrorModalOpen} onClose={handleCloseErrorModal} title="Error Occurred">
                            <div className="text-red-500">Failed to load Razorpay. Please try again later.</div>
                            <Button variant="primary" onClick={handleCloseErrorModal}>
                                Close
                            </Button>
                        </Modal>
                    )}
                </>
            </HeroTemplate>
            <Footer />
        </>
    );
});

CreditsShop.displayName = "CreditsShop";
