export interface FormValues {
  jobDescription: string;
  resume: File | null;
  additionalInfo: string;
}

export interface FormErrors {
  jobDescription?: string;
  resume?: string;
  additionalInfo?: string;
}

export type GenerationStatus = "idle" | "generating" | "complete" | "error";

export interface SignInFormErrors {
  errors: { email: string[]; password: string[] };
  isValid: boolean;
}
