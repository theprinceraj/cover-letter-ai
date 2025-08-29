import {
    ACCEPTED_CURRENCY_CODES,
    PAYMENT_GATEWAYS,
    type CreditsService_OrderUsingPayPal_Response,
    type CreditsService_OrderUsingRazorpay_Response,
    type CreditsService_OrderVerification_Response,
} from "@cover-letter-ai/constants";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import type { CurrencyCode } from "react-razorpay/dist/constants/currency";
import { toast } from "sonner";
import { useCallback, useContext, useState, useMemo, memo } from "react";
import { AuthContext, GlobalContext } from "../../Contexts";
import { useCreditPlans, type CreditPlan } from "../../hooks/useCreditPlans";
import Button from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Spinner } from "../../components/ui/Spinner";
import { PricingCardsList, type PricingCardListProps } from "../../components/ui/PricingCardsList";
import { SEO } from "../../components/ui/seo";
import { type PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { PayPalModal } from "./PayPalModal";
import { PaymentStatusModal } from "./PaymentStatusModal";
import { Layout } from "../../Layout";
import { validateBuyBtnClick } from "../../utils/validation";

type CreateOrderFn = NonNullable<PayPalButtonsComponentProps["createOrder"]>;
type onApprovedPaymentFn = NonNullable<PayPalButtonsComponentProps["onApprove"]>;

interface RazorpaySuccessfulPaymentResponse {
    razorpay_signature: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
}

export const BuyCredits: React.FC = memo(() => {
    const { isAuthenticated, isGuest, isEmailVerified, fetchWithAuth, refreshAuth } = useContext(AuthContext)!;
    const { openOnboardModal, paymentCurrency, setPaymentCurrency } = useContext(GlobalContext)!;
    const { creditPlans } = useCreditPlans();
    const { error, isLoading, Razorpay } = useRazorpay();
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

    const purchaseInfo = useMemo(
        () => ({
            isAuthenticated,
            isGuest,
            isEmailVerified,
            canBuy: isAuthenticated && !isGuest && isEmailVerified,
        }),
        [isAuthenticated, isGuest, isEmailVerified]
    );

    const handleRazorpayPaymentSuccess = useCallback(
        async (razorpayResponse: RazorpaySuccessfulPaymentResponse) => {
            try {
                const response = await fetchWithAuth<
                    CreditsService_OrderVerification_Response | { error: true; message: string }
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
                    CreditsService_OrderUsingRazorpay_Response | { error: true; message: string }
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

    const handleBuyBtnClick = useCallback(
        (provider: "razorpay" | "paypal", plan: CreditPlan) => {
            const res = validateBuyBtnClick({ openOnboardModal, purchaseInfo });
            if (res !== 1) {
                return;
            }
            if (provider === "razorpay") {
                handleRazorpayPurchase(plan, ACCEPTED_CURRENCY_CODES.INR);
            } else if (provider === "paypal") {
                setSelectedPlan(plan);
                setIsPaypalBtnsVisible(true);
            }
        },
        [handleRazorpayPurchase, openOnboardModal, purchaseInfo]
    );

    const handlePaypalCreateOrder: CreateOrderFn = useCallback(async () => {
        const response = await fetchWithAuth<
            CreditsService_OrderUsingPayPal_Response | { error: true; message: string }
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
                    CreditsService_OrderVerification_Response | { error: true; message: string }
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

    const handleClosePaypalModal = () => {
        setIsPaypalBtnsVisible(false);
        setSelectedPlan(null);
    };

    const handleCloseErrorModal = () => setIsErrorModalOpen(false);

    const handlePaymentStatusButtonClick = useCallback(() => {
        setIsPaymentStatusModalOpen(false);
        setIsPaymentSuccess(null);
        if (isPaymentSuccess === true) {
            refreshAuth();
        }
    }, [isPaymentSuccess, refreshAuth]);

    const handleClosePaymentStatusModal = () => setIsPaymentStatusModalOpen(false);

    const isLoadingState = useMemo(() => isLoading && creditPlans.length === 0, [isLoading, creditPlans.length]);

    const pricingCardsProps: PricingCardListProps = useMemo(
        () => ({
            plans: creditPlans,
            paymentCurrency,
            setPaymentCurrency,
            handleBuyBtnClick,
        }),
        [creditPlans, paymentCurrency, setPaymentCurrency, handleBuyBtnClick]
    );

    return (
        <>
            <SEO
                title="Buy Credits - CoverGenius AI"
                description="Purchase credits to generate more AI-powered cover letters. Choose from a variety of credit packages to suit your needs."
                name="CoverGenius AI"
                type="website"
            />
            <Layout hasHeader hasFooter className="bg-primary" containerClassName="md:px-0">
                <h1 className="text-3xl text-dark font-bold my-16 lg:-mt-5 lg:mb-10 text-center">Buy Credits Now</h1>
                <div className="w-full pb-16 lg:pb-0">
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
                        <Button variant="yellow" onClick={handleCloseErrorModal}>
                            Close
                        </Button>
                    </Modal>
                )}
            </Layout>
        </>
    );
});

BuyCredits.displayName = "BuyCredits";
