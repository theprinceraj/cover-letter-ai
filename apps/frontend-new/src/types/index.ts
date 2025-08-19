export interface SignInFormErrors {
    errors: { email: string[]; password: string[] };
    isValid: boolean;
}
