import { Mail } from "lucide-react";
import { OTP_CODE_LENGTH } from "@cover-letter-ai/constants";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button } from "./ui/Button";
import { AuthContext } from "../Contexts";
import { OTPInput } from "./ui/OTPInput";

const formatCooldown = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const EmailVerificationForm = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResent, setIsResent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user, setIsEmailVerificationModalOpen, refreshAuth, fetchWithAuth } =
    useContext(AuthContext)!;

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
      const response = await fetchWithAuth<{
        success: boolean;
        message: string;
      }>({
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
        err instanceof Error
          ? err.message
          : "Failed to resend verification code. Please try again.";
      setError(errorMessage);

      // If it's a cooldown error, extract the remaining time
      if (
        errorMessage.includes("Please wait") &&
        errorMessage.includes("seconds")
      ) {
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
  }, [resendCooldown, fetchWithAuth]);

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
      const response = await fetchWithAuth<{
        success: boolean;
        message: string;
      }>({
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
      setIsEmailVerificationModalOpen(false);
      refreshAuth();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Verify Your Email
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <OTPInput
          length={6}
          value={otp}
          onChange={setOtp}
          error={error}
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={otp.length !== 6 || isLoading}
        >
          Verify Email
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-400 mb-3">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResent
              ? "Code resent successfully!"
              : resendCooldown > 0
                ? `Resend code in ${formatCooldown(resendCooldown)}`
                : "Resend verification code"}
          </button>
        </div>
      </form>
    </div>
  );
};
