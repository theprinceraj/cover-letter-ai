import { useRef, useEffect } from "react";

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
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
