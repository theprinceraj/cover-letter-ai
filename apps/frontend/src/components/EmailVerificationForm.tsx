import { Mail } from "lucide-react";
import { OTP_CODE_LENGTH } from "@cover-letter-ai/constants";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Button } from "./ui/Button";
import { AuthContext } from "../Contexts";

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) return; // Only allow single digits

    const newValue = value.split("");
    newValue[index] = digit;
    const result = newValue.join("");
    onChange(result);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (pastedData.length === length) {
      onChange(pastedData);
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-200 mb-3">
        Enter 6-digit verification code
        <span className="text-purple-400 ml-1">*</span>
      </label>

      <div className="flex gap-3 justify-center mb-4">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-12 text-center text-lg font-semibold bg-slate-800 border ${
              error ? "border-red-500" : "border-slate-700"
            } rounded-lg shadow-sm text-slate-200 placeholder-slate-500 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition-all duration-200 ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center mb-4">{error}</p>
      )}

      <div className="text-center text-sm text-slate-400 mb-6">
        <p>We've sent a verification code to your email address</p>
        <p className="mt-1">
          Please check your inbox and spam folder for the code
        </p>
      </div>
    </div>
  );
};

export const EmailVerificationForm = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResent, setIsResent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user, setIsEmailVerificationModalOpen, refreshAuth, fetchWithAuth } =
    useContext(AuthContext)!;
  if (!user) return null;

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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
      const response = await fetchWithAuth({
        url: "/auth/verify-email",
        method: "POST",
        data: {
          code: parseInt(otp),
        },
      });
      if (response.error) {
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

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetchWithAuth({
        url: "/auth/resend-verification",
        method: "POST",
      });

      if (response.success) {
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
  };

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

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
