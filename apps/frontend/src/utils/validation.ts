import {
  MAX_JOB_DESCRIPTION_LENGTH,
  MIN_JOB_DESCRIPTION_LENGTH,
} from "@cover-letter-ai/constants";
import type { FormValues, FormErrors } from "../types";

export const validateForm = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  // Job description validation
  if (!values.jobDescription) {
    errors.jobDescription = "Job description is required";
  } else if (values.jobDescription.length < MIN_JOB_DESCRIPTION_LENGTH) {
    errors.jobDescription = `Job description must be at least ${MIN_JOB_DESCRIPTION_LENGTH} characters`;
  } else if (values.jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    errors.jobDescription = `Job description must be less than ${MAX_JOB_DESCRIPTION_LENGTH} characters`;
  }

  // Resume validation
  if (values.resume) {
    const fileType = values.resume.type;
    const validTypes = ["application/pdf"];

    if (!validTypes.includes(fileType)) {
      errors.resume = "Please upload a PDF file";
    }
  }

  return errors;
};

export const getCharacterCount = (text: string): number => {
  return text.length;
};
