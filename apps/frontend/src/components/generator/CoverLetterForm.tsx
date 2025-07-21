import React, { useCallback, useContext, useState } from "react";
import { TextArea } from "../ui/TextArea";
import { FileUpload } from "../ui/FileUpload";
import { Button } from "../ui/Button";
import { ProgressIndicator } from "../ui/ProgressIndicator";
import type { FormValues, FormErrors, GenerationStatus } from "../../types";
import { validateForm, getCharacterCount } from "../../utils/validation";
import { Download, AlertCircle } from "lucide-react";
import {
  DEFAULT_USE_LIMIT_FOR_GUEST,
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
  type APIResponse,
} from "@cover-letter-ai/constants";
import { AuthContext, ModalContext } from "../../Contexts";
import { Spinner } from "../ui/Spinner";
import { CoverLetterPreview } from "../ui/CoverLetterPreview";
import Turnstile, { useTurnstile } from "react-turnstile";
import { toast } from "sonner";

const TurnstileWidget: React.FC<{
  setCaptchaToken: (token: string | null) => void;
  setError: (error: string | null) => void;
}> = ({ setCaptchaToken, setError }) => {
  useTurnstile();
  return (
    <Turnstile
      sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
      execution="render"
      onVerify={(token) => {
        setCaptchaToken(token);
      }}
      onExpire={() => {
        setCaptchaToken(null);
      }}
      onUnsupported={() => {
        setError("Captcha verification is not supported on this browser");
      }}
      fixedSize={true}
      className="w-auto m-auto"
      theme="dark"
    />
  );
};

const handleDownload = (coverLetter: string) => {
  // Implementation for downloading the cover letter
  const blob = new Blob([coverLetter], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cover-letter.txt";
  a.click();
  URL.revokeObjectURL(url);
  toast("Cover letter downloaded successfully!");
};

const statusToStep: Record<GenerationStatus, number> = {
  idle: 0,
  generating: 1,
  complete: 2,
  error: 0,
};
const steps = ["Enter Details", "Generate", "Preview"];

export const CoverLetterForm: React.FC = () => {
  const {
    fetchWithAuth,
    isAuthenticated,
    isLoading: authLoading,
    user,
    guest,
    incrementExhaustedUses,
  } = useContext(AuthContext)!;
  const [formValues, setFormValues] = useState<FormValues>({
    jobDescription: "",
    resume: null,
    additionalInfo: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [apiResponse, setApiResponse] = useState<APIResponse>({
    coverLetter: "",
    suggestions: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { openSignInModal } = useContext(ModalContext)!;

  const currentStep = statusToStep[status];

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (formErrors[name as keyof FormErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [formErrors]
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      setFormValues((prev) => ({ ...prev, resume: file }));
      // Clear error when user uploads a file
      if (formErrors.resume) {
        setFormErrors((prev) => ({ ...prev, resume: undefined }));
      }
    },
    [formErrors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!formValues.resume)
        return setFormErrors((prev) => ({
          ...prev,
          resume: "Resume is required",
        }));

      if (!isAuthenticated)
        return setError("Please sign in to generate a cover letter");

      if (!captchaToken)
        return setError(
          "You need to complete the captcha to generate a cover letter"
        );

      // Check usage limits
      const currentUser = user || guest;
      if (currentUser && currentUser.exhaustedUses >= currentUser.useLimit)
        return setError(
          "You have reached your usage limit. Please sign up with a new email or contact me on X for more use credits."
        );

      // Validate form
      const errors = validateForm(formValues);
      setFormErrors(errors);

      if (Object.keys(errors).length === 0) {
        setStatus("generating");

        try {
          const formData = new FormData();
          formData.append(
            "jobDescription",
            formValues.jobDescription.substring(0, MAX_JOB_DESCRIPTION_LENGTH)
          );
          formData.append(
            "additionalInfo",
            formValues.additionalInfo.substring(
              0,
              MAX_OTHER_RELEVANT_INFORMATION_LENGTH
            )
          );
          formData.append("captchaToken", captchaToken);
          formData.append("resume", formValues.resume as Blob);

          const response = await fetchWithAuth({
            url: "/eval/cl",
            method: "POST",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.error) {
            setError(response.message);
            setStatus("error");
            return;
          }

          setApiResponse(response as APIResponse);
          setStatus("complete");
          incrementExhaustedUses();
        } catch (error) {
          console.error("Error generating cover letter:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Failed to generate cover letter"
          );
          setStatus("error");
        }
      }
    },
    [captchaToken, formValues, user, guest]
  );

  if (!isAuthenticated && !authLoading) {
    return (
      <section id="generator" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
              <span className="text-2xl font-bold text-white mb-4">
                Authentication Required
              </span>
              <p className="text-slate-300 mb-6">
                Please sign in to generate your cover letter. You can use a
                guest account for {DEFAULT_USE_LIMIT_FOR_GUEST} free uses.
              </p>
              <Button variant="primary" size="lg" onClick={openSignInModal}>
                Sign In to Continue
              </Button>
            </h2>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <section id="generator" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="generator" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Generate Your Cover Letter
          </h2>

          <ProgressIndicator steps={steps} currentStep={currentStep} />

          {error && (
            <div
              className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-md"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 text-red-300">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {status === "complete" ? (
            <div className="mt-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                Your Cover Letter is Ready!
              </h3>
              <p className="text-slate-300 mb-8">
                Tailored specifically to the job description you provided.
              </p>

              {/* Inline Cover Letter Preview */}
              <CoverLetterPreview
                coverLetter={apiResponse.coverLetter}
                suggestions={apiResponse.suggestions}
                onDownload={() => handleDownload(apiResponse.coverLetter)}
              />

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleDownload(apiResponse.coverLetter)}
                >
                  <Download size={18} className="mr-2" />
                  Download Cover Letter
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setFormValues({
                      jobDescription: "",
                      resume: null,
                      additionalInfo: "",
                    });
                    setFormErrors({});
                    setApiResponse({ coverLetter: "", suggestions: [] });
                    setError(null);
                    setCaptchaToken(null);
                    setStatus("idle");
                  }}
                >
                  Generate Another
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
              <div>
                <div className="relative">
                  <TextArea
                    label="Job Description"
                    name="jobDescription"
                    value={formValues.jobDescription}
                    maxCount={MAX_JOB_DESCRIPTION_LENGTH}
                    onChange={handleTextChange}
                    placeholder="Paste the job description here"
                    rows={6}
                    error={formErrors.jobDescription}
                    showCount={true}
                    currentCount={getCharacterCount(formValues.jobDescription)}
                    disabled={currentStep !== 0}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUpload
                      label="Resume"
                      onFileChange={handleFileChange}
                      error={formErrors.resume}
                      currentFile={formValues.resume}
                      disabled={currentStep !== 0}
                      required
                    />

                    <TextArea
                      label="Additional Information"
                      name="additionalInfo"
                      value={formValues.additionalInfo}
                      maxCount={MAX_OTHER_RELEVANT_INFORMATION_LENGTH}
                      onChange={handleTextChange}
                      placeholder="Add any specific details you'd like to highlight"
                      rows={4}
                      optional={true}
                      showCount={true}
                      currentCount={getCharacterCount(
                        formValues.additionalInfo
                      )}
                      disabled={currentStep !== 0}
                    />
                  </div>
                  <TurnstileWidget
                    setCaptchaToken={setCaptchaToken}
                    setError={setError}
                  />
                  {status === "generating" && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/90">
                      <Spinner
                        variant="default"
                        size="xl"
                        message="Generating your personalized cover letter..."
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 w-full m-auto flex justify-center items-center gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={status === "generating"}
                  disabled={status === "generating"}
                >
                  Generate Cover Letter
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
