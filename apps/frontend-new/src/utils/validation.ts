import {
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_SPECIAL_CHARACTERS_TEST_REGEX,
} from "@cover-letter-ai/constants";
import type { SignInFormErrors } from "../types";

export const validateSignInForm = (email: string | null, password: string | null): SignInFormErrors => {
    const errors: SignInFormErrors["errors"] = { email: [], password: [] };

    if (email) {
        // Email validation goes here
    }

    if (password) {
        if (password.length < PASSWORD_MIN_LENGTH) {
            errors.password.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
        }

        if (password.length > PASSWORD_MAX_LENGTH) {
            errors.password.push(`Password must be at most ${PASSWORD_MAX_LENGTH} characters long`);
        }

        if (!/[A-Z]/.test(password)) {
            errors.password.push("Password must contain at least one uppercase letter");
        }

        if (!/[a-z]/.test(password)) {
            errors.password.push("Password must contain at least one lowercase letter");
        }

        if (!/\d/.test(password)) {
            errors.password.push("Password must contain at least one digit");
        }

        if (!PASSWORD_SPECIAL_CHARACTERS_TEST_REGEX.test(password)) {
            errors.password.push(
                `Password must contain at least one special character from: ${PASSWORD_SPECIAL_CHARACTERS_TEST_REGEX.source.substring(
                    1,
                    PASSWORD_SPECIAL_CHARACTERS_TEST_REGEX.source.length - 1
                )}`
            );
        }
    }

    return {
        errors: {
            email: errors.email,
            password: errors.password,
        },
        isValid: errors.password.length === 0 && errors.email.length === 0,
    };
};
