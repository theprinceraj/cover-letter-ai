import { DEFAULT_USE_LIMIT_FOR_GUEST } from "@cover-letter-ai/constants";
import { UserCheck2Icon } from "lucide-react";
import GoogleIcon from "../assets/google-icon.svg?react";
import { useContext, useState } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { validateSignInForm } from "../utils/validation";
import type { SignInFormErrors } from "../types";
import { AuthContext, ModalContext } from "../Contexts";
import { EmailVerificationForm } from "./EmailVerificationForm";

export const SignInModal = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    isLoading,
    login,
    signup,
    loginGuest,
    refreshAuth,
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
      }
      closeSignInModal();
      refreshAuth();
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
      refreshAuth();
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
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="cursor-pointer text-sm text-slate-500 hover:text-primary-500 transition-colors duration-200"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <hr className="my-5 text-slate-200/30" />

        {/* Google Login */}
        <Button
          variant="outline"
          fullWidth={true}
          className="mb-2"
          // disabled={isLoading}
          disabled={true}
        >
          <div className="flex items-center gap-2 text-md">
            <GoogleIcon className="size-5" />
            <p>Sign In</p>
            <p>(Coming Soon)</p>
          </div>
        </Button>

        {/* Guest Login */}
        <Button
          variant="secondary"
          fullWidth={true}
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          <p className="flex items-center gap-2">
            <span className="text-md">
              Guest Login ({DEFAULT_USE_LIMIT_FOR_GUEST}{" "}
              {DEFAULT_USE_LIMIT_FOR_GUEST > 1 ? "Uses" : "Use"})
            </span>
            <UserCheck2Icon className="size-5" />
          </p>
        </Button>
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
