export const MAX_JOB_DESCRIPTION_LENGTH = 4499;
export const MAX_OTHER_RELEVANT_INFORMATION_LENGTH = 500;
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";
export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
export const GEMINI_RESPONSE_DELIMITER = "Suggestions for Enhancement:";
export const DEFAULT_USE_LIMIT = 3;

export interface APIResponse {
  coverLetter: string;
  suggestions: string[];
}

export enum AuthProviders {
  GOOGLE = "google",
  EMAIL = "email",
  GUEST = "guest",
}

export default {
  BACKEND_URL,
  FRONTEND_URL,

  DEFAULT_USE_LIMIT,
  GEMINI_RESPONSE_DELIMITER,
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,

  AuthProviders,
};
