import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Contexts";
import { OTPInput } from "./ui/OTPInput";
import Button from "./ui/Button";
import { api } from "../hooks/useAuth";
import { toast } from "sonner";
import axios from "axios";

export const EmailVerificationForm: React.FC = () => {
    const { user, refreshAuth, logout, setIsEmailVerificationModalOpen } = useContext(AuthContext)!;
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [cooldown, setCooldown] = useState(0);

    // Load cooldown from localStorage if it exists to preserve timer on reload
    useEffect(() => {
        const savedCooldownEnd = localStorage.getItem("otp_cooldown_end");
        if (savedCooldownEnd) {
            const remaining = Math.ceil((parseInt(savedCooldownEnd, 10) - Date.now()) / 1000);
            if (remaining > 0) {
                setCooldown(remaining);
            }
        }
    }, []);

    // Handle countdown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    localStorage.removeItem("otp_cooldown_end");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }
        setError(undefined);
        setIsVerifying(true);

        try {
            await api.post("/auth/verify-email", { code: Number(otp) });
            toast.success("Email verified successfully!");
            setIsEmailVerificationModalOpen(false);
            await refreshAuth();
        } catch (err) {
            console.error(err);
            let message = "Verification failed. Please try again.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            setError(message);
            toast.error(message);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setIsResending(true);
        setError(undefined);

        try {
            await api.post("/auth/resend-verification");
            toast.success("Verification code resent successfully!");
            
            // Set cooldown of 60 seconds
            const cooldownDuration = 60;
            setCooldown(cooldownDuration);
            localStorage.setItem("otp_cooldown_end", (Date.now() + cooldownDuration * 1000).toString());
        } catch (err) {
            console.error(err);
            let message = "Failed to resend verification code. Please try again.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            toast.error(message);
        } finally {
            setIsResending(false);
        }
    };

    const handleCancel = () => {
        logout();
        setIsEmailVerificationModalOpen(false);
        toast.info("Logged out.");
    };

    return (
        <div className="text-slate-900 p-2">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Your Email</h2>
                <p className="text-sm text-slate-500">
                    We sent a 6-digit verification code to
                </p>
                <p className="text-sm font-semibold text-primary/80 break-all mt-1">
                    {user?.email || "your registered email"}
                </p>
            </div>

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <OTPInput
                    length={6}
                    value={otp}
                    onChange={(val) => {
                        setOtp(val);
                        if (error) setError(undefined);
                    }}
                    error={error}
                    disabled={isVerifying || isResending}
                />

                <Button
                    type="submit"
                    variant="yellow"
                    className="w-full justify-center py-3"
                    isLoading={isVerifying}
                    disabled={otp.length !== 6 || isVerifying || isResending}
                >
                    Verify Email
                </Button>
            </form>

            <div className="mt-6 flex flex-col gap-3 items-center text-sm">
                <div className="text-slate-500">
                    Didn't receive the code?{" "}
                    {cooldown > 0 ? (
                        <span className="font-semibold text-slate-700">
                            Resend in {cooldown}s
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isVerifying || isResending}
                            className="text-primary hover:text-primary-600 font-semibold underline transition-colors cursor-pointer disabled:opacity-50 disabled:no-underline"
                        >
                            {isResending ? "Resending..." : "Resend code"}
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleCancel}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors mt-2 cursor-pointer font-medium"
                >
                    Cancel & Sign Out
                </button>
            </div>
        </div>
    );
};
