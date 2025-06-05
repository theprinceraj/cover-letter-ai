import React, { useState } from "react";
import { TextArea } from "./ui/TextArea";
import { FileUpload } from "./ui/FileUpload";
import { Button } from "./ui/Button";
import { ProgressIndicator } from "./ui/ProgressIndicator";
import type { FormValues, FormErrors, GenerationStatus } from "../types";
import { validateForm, getCharacterCount } from "../utils/validation";
import { FileText, Save, Download, Eye } from "lucide-react";
import axios from "axios";
import {
  BACKEND_URL,
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
  type APIResponse,
} from "@cover-letter-ai/constants";

export const CoverLetterForm: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStatus("generating");
      setCurrentStep(1);

      // Simulate API call
      let data = new FormData();
      data.append(
        "jobDescription",
        formValues.jobDescription.substring(0, MAX_JOB_DESCRIPTION_LENGTH)
      );
      data.append(
        "additionalInfo",
        formValues.additionalInfo.substring(
          0,
          MAX_OTHER_RELEVANT_INFORMATION_LENGTH
        )
      );
      data.append("resume", formValues.resume as Blob);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BACKEND_URL}/eval/cl`,
        headers: { "Content-Type": "multipart/form-data" },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          setApiResponse(response.data);
          setStatus("complete");
          setCurrentStep(2);
        })
        .catch((error) => {
          console.error(error);
          setStatus("idle"); // Reset status on error
        });
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

  const handlePreview = () => {
    // Implementation for previewing the cover letter would go here

    alert("Cover letter previewed successfully!");
  };

  return (
    <section id="generator" className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Generate Your Cover Letter
          </h2>

          <ProgressIndicator steps={steps} currentStep={currentStep} />

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

              <div className="bg-slate-800 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <FileText className="text-purple-400 mt-1 mr-3" size={24} />
                  <div className="text-left">
                    <h4 className="text-lg font-medium text-white">
                      Job-Winning Cover Letter
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" onClick={handleDownload}>
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="lg" onClick={handlePreview}>
                  <Eye size={18} className="mr-2" />
                  Preview
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
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                  label="Resume"
                  onFileChange={handleFileChange}
                  error={formErrors.resume}
                  currentFile={formValues.resume}
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
