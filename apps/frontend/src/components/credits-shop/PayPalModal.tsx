import { type PayPalButtonsComponentProps, type ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { lazy, memo, Suspense, useMemo } from "react";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";

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

export const PayPalModal = memo(
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
                    environment: environment === "development" ? "sandbox" : "production",
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
