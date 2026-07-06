import {
    MAX_JOB_DESCRIPTION_LENGTH,
    MIN_JOB_DESCRIPTION_LENGTH,
    isSupportedResumeFile,
    getEmailErrors,
    getPasswordErrors,
} from "@cover-letter-ai/constants";
import type { GeneratorFormErrors, GeneratorFormValues, SignInFormErrors } from "../types";
import { toast } from "sonner";

export const validateSignInForm = (email: string | null, password: string | null): SignInFormErrors => {
    const errors: SignInFormErrors["errors"] = { email: [], password: [] };

    if (email) {
        errors.email = getEmailErrors(email);
    }

    if (password) {
        errors.password = getPasswordErrors(password);
    }

    return {
        errors: {
            email: errors.email,
            password: errors.password,
        },
        isValid: errors.password.length === 0 && errors.email.length === 0,
    };
};

export const validateGeneratorForm = (values: GeneratorFormValues): GeneratorFormErrors => {
    const errors: GeneratorFormErrors = {};

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
        if (!isSupportedResumeFile(values.resume.name, values.resume.type)) {
            errors.resume = "Please upload a PDF, DOCX, or TXT file";
        }
    }

    return errors;
};

interface ValidateBuyBtnClickProps {
    purchaseInfo: {
        isAuthenticated: boolean;
        isGuest: boolean;
        isEmailVerified: boolean;
        canBuy: boolean;
    };
    openOnboardModal: () => void;
}

export const validateBuyBtnClick = (props: ValidateBuyBtnClickProps) => {
    const { purchaseInfo, openOnboardModal } = props;

    if (purchaseInfo.isGuest) {
        toast.error("Guest users cannot buy credits. Please sign in with a registered account.");
        return 0;
    }
    if (!purchaseInfo.isAuthenticated) {
        openOnboardModal();
        toast.error("Please sign in using your email to buy credits");
        return 0;
    }
    if (!purchaseInfo.isEmailVerified) {
        toast.error("Please verify your email before buying credits.");
        return 0;
    }

    return 1;
};
