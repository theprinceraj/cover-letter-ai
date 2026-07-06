export interface SignInFormErrors {
    errors: { email: string[]; password: string[] };
    isValid: boolean;
}

export interface GeneratorFormValues {
    jobDescription: string;
    resume: File | null;
    additionalInfo: string;
    tone?: string;
    length?: string;
    experienceLevel?: string;
}


export interface GeneratorFormErrors {
    jobDescription?: string;
    resume?: string;
    additionalInfo?: string;
}

export type GenerationStatus = "idle" | "generating" | "complete" | "error";
