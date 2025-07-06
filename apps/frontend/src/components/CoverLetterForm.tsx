import React, { useContext, useState } from "react";
import { TextArea } from "./ui/TextArea";
import { FileUpload } from "./ui/FileUpload";
import { Button } from "./ui/Button";
import { ProgressIndicator } from "./ui/ProgressIndicator";
import type { FormValues, FormErrors, GenerationStatus } from "../types";
import { validateForm, getCharacterCount } from "../utils/validation";
import { Save, Download, AlertCircle } from "lucide-react";
import axios from "axios";
import {
  BACKEND_URL,
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
  type APIResponse,
} from "@cover-letter-ai/constants";
import { useAuth } from "../hooks/useAuth";
import { ModalContext } from "../Contexts";
import { Spinner } from "./ui/Spinner";
import { CoverLetterPreview } from "./ui/CoverLetterPreview";

export const CoverLetterForm: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, user, guest } = useAuth();
  const [formValues, setFormValues] = useState<FormValues>({
    jobDescription: "",
    resume: null,
    additionalInfo: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [apiResponse, setApiResponse] = useState<APIResponse>({
    coverLetter: "",
    suggestions: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { openSignInModal } = useContext(ModalContext)!;

  const steps = ["Enter Details", "Generate", "Preview"];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormValues((prev) => ({ ...prev, resume: file }));
    // Clear error when user uploads a file
    if (formErrors.resume) {
      setFormErrors((prev) => ({ ...prev, resume: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formValues.resume) {
      setFormErrors((prev) => ({ ...prev, resume: "Resume is required" }));
      return;
    }

    if (!isAuthenticated) {
      setError("Please sign in to generate a cover letter");
      return;
    }

    // Check usage limits
    const currentUser = user || guest;
    if (currentUser && currentUser.exhaustedUses >= currentUser.useLimit) {
      setError(
        "You have reached your usage limit. Please sign up with a new email or contact me on X for more use credits."
      );
      return;
    }

    // Validate form
    const errors = validateForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStatus("generating");
      setCurrentStep(1);

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
        formData.append("resume", formValues.resume as Blob);

        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL ?? BACKEND_URL}/eval/cl`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApiResponse(response.data as APIResponse);
        setStatus("complete");
        setCurrentStep(2);
      } catch (error) {
        console.error("Error generating cover letter:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to generate cover letter"
        );
        setStatus("error");
        setCurrentStep(0);
      }
    }
  };

  const handleSaveDraft = () => {
    // Implementation for saving draft would go here
    alert("Draft saved successfully!");
  };

  const handleDownload = () => {
    // Implementation for downloading the cover letter would go here
    const blob = new Blob([apiResponse.coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
    alert("Cover letter downloaded successfully!");
  };

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
                guest account for one free use.
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
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-md">
              <div className="flex items-center gap-2 text-red-300">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <Spinner
              variant="overlay"
              size="xl"
              message="Generating your personalized cover letter..."
            />
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
                onDownload={handleDownload}
              />

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" onClick={handleDownload}>
                  <Download size={18} className="mr-2" />
                  Download Cover Letter
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.reload()}
                >
                  Generate Another
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
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
                  currentCount={getCharacterCount(formValues.additionalInfo)}
                  disabled={currentStep !== 0}
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                >
                  <Save size={18} className="mr-2" />
                  Save Draft
                </Button>

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
