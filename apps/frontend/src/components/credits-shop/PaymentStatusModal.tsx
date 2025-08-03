import SadCryGif from "../../assets/sad-cry.gif";
import HappyDanceGif from "../../assets/happy-dance.gif";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { memo, useMemo } from "react";

export const PaymentStatusModal = memo(
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
