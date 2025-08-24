import { MailIcon } from "lucide-react";
import { OTP_CODE_LENGTH, type AuthService_VerificationEmail_Response } from "@cover-letter-ai/constants";
import React, { useState, useEffect, useContext, useCallback } from "react";
import Button from "./ui/Button";
import { AuthContext } from "../Contexts";
import { OTPInput } from "./ui/OTPInput";
import { Modal } from "./ui/Modal";
import type { UseAuthReturn } from "../hooks/useAuth";

export const EmailVerifyModal: React.FC = () => {
    const auth = useContext(AuthContext)!;

    return (
        <Modal
            isOpen={auth.isEmailVerificationModalOpen}
            onClose={() => auth.setIsEmailVerificationModalOpen(false)}
            showCloseButton={false}
            closeOnBackdropClick={false}
            closeOnEscape={false}
            contentClassName="overflow-y-clip">
            <EmailVerificationForm auth={auth} />
        </Modal>
    );
};

const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
};

const EmailVerificationForm: React.FC<{ auth: UseAuthReturn }> = ({ auth }) => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isResent, setIsResent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleResendCode = useCallback(async () => {
        if (resendCooldown > 0) return;
        setIsLoading(true);
        setError("");

        try {
            const response = await auth.fetchWithAuth<AuthService_VerificationEmail_Response>({
                url: "/auth/resend-verification",
                method: "POST",
            });

            if ("success" in response && response.success) {
                setIsResent(true);
                setResendCooldown(60);
                setTimeout(() => setIsResent(false), 10000);
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to resend verification code. Please try again.";
            setError(errorMessage);

            // If it's a cooldown error, extract the remaining time
            if (errorMessage.includes("Please wait") && errorMessage.includes("seconds")) {
                const timeMatch = errorMessage.match(/(\d+)/);
                if (timeMatch && timeMatch.length > 0) {
                    const time = parseInt(timeMatch[0]);
                    setResendCooldown(time);
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [resendCooldown, auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== OTP_CODE_LENGTH) {
            setError("Please enter a complete 6-digit verification code");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter only numbers");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await auth.fetchWithAuth<AuthService_VerificationEmail_Response>({
                url: "/auth/verify-email",
                method: "POST",
                data: {
                    code: parseInt(otp),
                },
            });
            if ("error" in response) {
                setError(response.message);
                return;
            }
            auth.setIsEmailVerificationModalOpen(false);
            auth.refreshAuth();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!auth.user) return null;

    return (
        <div className="flex flex-col items-center justify-center py-4 px-8">
            <div className="text-center mb-4 md:mb-8">
                <div className="size-12 md:size-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailIcon className="size-5 md:size-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <OTPInput length={6} value={otp} onChange={setOtp} error={error} disabled={isLoading} />

                <Button type="submit" isLoading={isLoading} disabled={otp.length !== 6 || isLoading} className="w-full">
                    Verify Email
                </Button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="text-sm md:text-base hover:underline hover:underline-offset-2 transition-all duration-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        {isResent
                            ? "Code resent successfully!"
                            : resendCooldown > 0
                              ? `Resend code in ${formatCooldown(resendCooldown)}`
                              : "Didn't receive the code? Resend verification code"}
                    </button>
                </div>
            </form>
        </div>
    );
};
