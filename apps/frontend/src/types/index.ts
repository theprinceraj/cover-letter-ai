export interface SignInFormErrors {
    errors: { email: string[]; password: string[] };
    isValid: boolean;
}

export interface GeneratorFormValues {
    jobDescription: string;
    resume: File | null;
    additionalInfo: string;
}

export interface GeneratorFormErrors {
    jobDescription?: string;
    resume?: string;
    additionalInfo?: string;
}

export type GenerationStatus = "idle" | "generating" | "complete" | "error";
