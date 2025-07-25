import { DEFAULT_USE_LIMIT_FOR_GUEST } from "@cover-letter-ai/constants";
import { UserCheck2Icon } from "lucide-react";
import GoogleIcon from "../assets/google-icon.svg?react";
import { useContext, useState } from "react";
import { Button, type ButtonProps } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { validateSignInForm } from "../utils/validation";
import type { SignInFormErrors } from "../types";
import { AuthContext, ModalContext } from "../Contexts";
import { EmailVerificationForm } from "./EmailVerificationForm";
import { toast } from "sonner";

export const SignInModal = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    isLoading,
    login,
    signup,
    loginGuest,
    isEmailVerificationModalOpen,
    setIsEmailVerificationModalOpen,
  } = useContext(AuthContext)!;
  const { isSignInModalOpen, closeSignInModal } = useContext(ModalContext)!;

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { errors, isValid } =
      e.target.name === "email"
        ? validateSignInForm(e.target.value, null)
        : validateSignInForm(null, e.target.value);
    if (!isValid) {
      e.target.setCustomValidity(
        errors[e.target.type as keyof SignInFormErrors["errors"]].join("\n")
      );
    } else {
      e.target.setCustomValidity("");
    }
  };

  const handleSignInFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setApiError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignUp) {
        await signup(email, password);
        setIsEmailVerificationModalOpen(true);
      } else {
        await login(email, password);
        toast.success("Logged in successfully");
      }
      closeSignInModal();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  };

  const handleGuestLogin = async () => {
    try {
      setApiError(null);
      await loginGuest();
      closeSignInModal();
      toast.success("Logged in as guest");
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  };

  return (
    <>
      {/* Sign In Modal */}
      <Modal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        title={isSignUp ? "Sign Up" : "Sign In"}
      >
        <form className="text-slate-900" onSubmit={handleSignInFormSubmit}>
          <div className="flex flex-col gap-4">
            {apiError && (
              <div className="text-red-500 text-sm text-center">{apiError}</div>
            )}
            <input
              type="email"
              className="p-4 outline-1 outline-slate-200 rounded-md"
              placeholder="Email"
              name="email"
              onChange={handleInputOnChange}
              autoComplete="email"
              required
            />
            <input
              type="password"
              className="p-4 outline-1 outline-slate-200 rounded-md"
              placeholder="Password"
              name="password"
              onChange={handleInputOnChange}
              autoComplete="current-password"
              required
            />
            <SignInModalButton
              type="submit"
              isLoading={isLoading}
              variant="primary"
              text={isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            />
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="cursor-pointer text-sm text-slate-500 hover:text-primary-500 transition-colors duration-100"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <hr className="my-5 text-slate-300/30" />

        <div className="flex flex-col gap-2">
          {/* Google Login */}
          <SignInModalButton
            variant="outline"
            disabled={true}
            onClick={() => {}}
            IconElement={<GoogleIcon className="size-5" />}
            text="Sign In (Coming Soon)"
          />

          {/* Guest Login */}
          <SignInModalButton
            variant="secondary"
            isLoading={isLoading}
            onClick={handleGuestLogin}
            IconElement={<UserCheck2Icon className="size-5" />}
            text={`Guest Login (${DEFAULT_USE_LIMIT_FOR_GUEST} free credits)`}
          />
        </div>
      </Modal>
      {/* Email Verification Modal */}
      <Modal
        isOpen={isEmailVerificationModalOpen}
        onClose={() => setIsEmailVerificationModalOpen(false)}
        showCloseButton={false}
        closeOnBackdropClick={false}
        closeOnEscape={false}
      >
        <EmailVerificationForm />
      </Modal>
    </>
  );
};

interface SignInModalButtonProps extends Omit<ButtonProps, "children"> {
  IconElement?: React.ReactNode;
  text: string;
}

const SignInModalButton = ({
  variant,
  IconElement,
  text,
  isLoading,
  disabled,
  onClick,
}: SignInModalButtonProps) => {
  return (
    <Button
      variant={variant}
      fullWidth={true}
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
    >
      <p className="flex items-center justify-center gap-2">
        {IconElement}
        <span className="text-sm sm:text-md">{text}</span>
      </p>
    </Button>
  );
};
