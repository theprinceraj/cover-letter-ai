import { useRef, useEffect } from "react";

interface OTPInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length, value, onChange, error, disabled = false }) => {
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

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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

    const otpInputFieldStyle = `size-10 md:size-12 text-center text-lg font-semibold bg-primary/20 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all duration-200 ${error ? "border-red-500" : "border-slate-700"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"}`;

    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-3">
                Enter 6-digit verification code
                <span className="text-red-400 ml-1">*</span>
            </label>

            <div className="flex gap-1 md:gap-3 justify-center mb-4">
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
                        className={otpInputFieldStyle}
                    />
                ))}
            </div>

            {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

            <div className="text-center text-xs md:text-sm text-pretty">
                <p className="mt-1">Please check your inbox and spam folder for the code</p>
            </div>
        </div>
    );
};
