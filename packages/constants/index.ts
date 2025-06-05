export const MAX_JOB_DESCRIPTION_LENGTH = 4499;
export const MAX_OTHER_RELEVANT_INFORMATION_LENGTH = 500;
export const BACKEND_URL = "http://localhost:3000";
export const FRONTEND_URL = "http://localhost:5173";
export const GEMINI_RESPONSE_DELIMITER = "Suggestions for Enhancement:";

export interface APIResponse {
  coverLetter: string;
  suggestions: string[];
}

export default {
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
  BACKEND_URL,
  FRONTEND_URL,
  GEMINI_RESPONSE_DELIMITER,
};
