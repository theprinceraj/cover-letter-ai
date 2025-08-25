import React, { useCallback, useContext, useState } from "react";
import { TextArea } from "../../components/ui/TextArea";
import { FileUpload } from "../../components/ui/FileUpload";
import Button from "../../components/ui/Button";
import { ProgressIndicator } from "../../components/ui/ProgressIndicator";
import type { GeneratorFormValues, GeneratorFormErrors, GenerationStatus } from "../../types";
import { validateGeneratorForm } from "../../utils/validation";
import { Download, AlertCircle } from "lucide-react";
import {
    DEFAULT_USE_LIMIT_FOR_GUEST,
    MAX_JOB_DESCRIPTION_LENGTH,
    MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
    type EvalService_Eval_Response,
} from "@cover-letter-ai/constants";
import { AuthContext, GlobalContext } from "../../Contexts";
import { Spinner } from "../../components/ui/Spinner";
import { CoverLetterPreview } from "../../components/ui/CoverLetterPreview";
import Turnstile, { useTurnstile } from "react-turnstile";
import { toast } from "sonner";
import { cleanMarkdownText } from "../../utils/text";

const handleDownload = (coverLetter: string): void => {
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
            className="w-full mx-auto"
            theme="dark"
        />
    );
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
    const [formValues, setFormValues] = useState<GeneratorFormValues>({
        jobDescription: "",
        resume: null,
        additionalInfo: "",
    });
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<GeneratorFormErrors>({});
    const [status, setStatus] = useState<GenerationStatus>("idle");
    const [apiResponse, setApiResponse] = useState<EvalService_Eval_Response>({
        coverLetter: "",
        suggestions: [],
    });
    const [error, setError] = useState<string | null>(null);
    const { openOnboardModal } = useContext(GlobalContext)!;

    const currentStep = statusToStep[status];

    const handleTextChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormValues((prev) => ({ ...prev, [name]: value }));
            // Clear error when user starts typing
            if (formErrors[name as keyof GeneratorFormValues]) {
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

            if (!isAuthenticated) return setError("Please sign in to generate a cover letter");

            if (!captchaToken) return setError("You need to complete the captcha to generate a cover letter");

            // Check usage limits
            const currentUser = user || guest;
            if (currentUser && currentUser.exhaustedUses >= currentUser.useLimit)
                return setError("You have reached your usage limit. Please purchase more credits.");

            // Validate form
            const errors = validateGeneratorForm(formValues);
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
                        formValues.additionalInfo.substring(0, MAX_OTHER_RELEVANT_INFORMATION_LENGTH)
                    );
                    formData.append("captchaToken", captchaToken);
                    formData.append("resume", formValues.resume as Blob);

                    const response = await fetchWithAuth<EvalService_Eval_Response | { error: true; message: string }>({
                        url: "/eval/cl",
                        method: "POST",
                        data: formData,
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    if ("error" in response) {
                        setError(response.message);
                        setStatus("error");
                        return;
                    }

                    setApiResponse(response);
                    setStatus("complete");
                    incrementExhaustedUses();
                } catch (error) {
                    console.error("Error generating cover letter:", error);
                    setError(error instanceof Error ? error.message : "Failed to generate cover letter");
                    setStatus("error");
                }
            }
        },
        [fetchWithAuth, captchaToken, formValues, user, guest, incrementExhaustedUses, isAuthenticated]
    );

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <section id="generator" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
                <div className="bg-white text-secondary-900 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-10 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                        <p className="text-slate-900 mt-8 md:text-xl font-semibold text-balance">
                            Loading your <span className="text-orange-500">wonderful magic</span> tool...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!isAuthenticated && !authLoading) {
        return (
            <section id="generator" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
                <div className="bg-primary text-secondary-900 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-10 text-center flex flex-col items-center justify-center">
                        <h2 className="text-xl sm:text-2xl mb-6">
                            <AlertCircle className="mx-auto mb-4" size={48} />
                            <span className="text-2xl font-semibold">Authentication Required</span>
                            <p className="my-6">
                                Please sign in to generate your cover letter. You can use a guest account for{" "}
                                <span className="font-semibold underline">{DEFAULT_USE_LIMIT_FOR_GUEST} free uses</span>
                                .
                            </p>
                        </h2>
                        <Button variant="dark" size="lg" onClick={openOnboardModal}>
                            Sign In to Continue
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="generator" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-white md:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Generate Your Cover Letter</h2>

                <ProgressIndicator steps={steps} currentStep={currentStep} />

                {error && (
                    <div
                        className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-md text-secondary-900"
                        aria-live="polite">
                        <div className="flex items-center gap-2 text-red-300">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {status === "complete" ? (
                    <div className="mt-8 text-center flex flex-col items-center justify-center">
                        <div className="flex justify-center mb-6">
                            <div className="size-16 bg-emerald-600 rounded-full flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-2">Your Cover Letter is Ready!</h3>
                        <p className="mb-8">Tailored specifically to the job description you provided.</p>

                        {/* Inline Cover Letter Preview */}
                        <CoverLetterPreview
                            coverLetter={apiResponse.coverLetter}
                            suggestions={apiResponse.suggestions}
                            onDownload={() => handleDownload(cleanMarkdownText(apiResponse.coverLetter))}
                        />

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="dark"
                                size="md"
                                IconLucide={Download}
                                onClick={() => handleDownload(cleanMarkdownText(apiResponse.coverLetter))}>
                                Download Cover Letter
                            </Button>
                            <Button
                                variant="white"
                                size="md"
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
                                }}>
                                Generate Another
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="relative z-0">
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
                                currentCount={formValues.jobDescription.length}
                                disabled={currentStep !== 0}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-6">
                                <FileUpload
                                    label="Resume"
                                    onFileChange={handleFileChange}
                                    error={formErrors.resume}
                                    currentFile={formValues.resume}
                                    disabled={currentStep !== 0}
                                    required
                                />

                                <div className="md:-mb-2">
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
                                        currentCount={formValues.additionalInfo.length}
                                        disabled={currentStep !== 0}
                                    />
                                </div>
                            </div>
                            <TurnstileWidget setCaptchaToken={setCaptchaToken} setError={setError} />
                            {status === "generating" && (
                                <div className="absolute -inset-1 z-10 flex items-center justify-center bg-dark">
                                    <Spinner
                                        variant="default"
                                        size="xl"
                                        message="Generating your personalized cover letter..."
                                    />
                                </div>
                            )}
                        </div>
                        <div className="w-full mt-4 m-auto flex justify-center items-center gap-4">
                            <Button
                                type="submit"
                                variant="white"
                                size="md"
                                isLoading={status === "generating"}
                                disabled={status === "generating"}>
                                Generate Cover Letter
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};
