import type { FormValues, FormErrors } from "../types";

export const validateForm = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  // Job description validation (required, min 100 chars)
  if (!values.jobDescription) {
    errors.jobDescription = "Job description is required";
  } else if (values.jobDescription.length < 100) {
    errors.jobDescription = "Job description must be at least 100 characters";
  }

  // Resume validation (optional, but validate file type if provided)
  if (values.resume) {
    const fileType = values.resume.type;
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(fileType)) {
      errors.resume = "Please upload a PDF or DOCX file";
    }
  }

  return errors;
};

export const getCharacterCount = (text: string): number => {
  return text.length;
};
