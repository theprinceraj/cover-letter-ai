export declare const MAX_JOB_DESCRIPTION_LENGTH = 4499;
export declare const MAX_OTHER_RELEVANT_INFORMATION_LENGTH = 500;
export declare const BACKEND_URL = "http://localhost:3000";
export declare const FRONTEND_URL = "http://localhost:5173";
export declare const GEMINI_RESPONSE_DELIMITER = "Suggestions for Enhancement:";
export declare const DEFAULT_USE_LIMIT = 3;
export interface APIResponse {
    coverLetter: string;
    suggestions: string[];
}
export declare enum AuthProviders {
    GOOGLE = "google",
    EMAIL = "email",
    GUEST = "guest"
}
declare const _default: {
    BACKEND_URL: string;
    FRONTEND_URL: string;
    DEFAULT_USE_LIMIT: number;
    GEMINI_RESPONSE_DELIMITER: string;
    MAX_JOB_DESCRIPTION_LENGTH: number;
    MAX_OTHER_RELEVANT_INFORMATION_LENGTH: number;
    AuthProviders: typeof AuthProviders;
};
export default _default;
