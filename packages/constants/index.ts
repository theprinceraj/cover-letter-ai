export const MAX_JOB_DESCRIPTION_LENGTH = 4499;
export const MAX_OTHER_RELEVANT_INFORMATION_LENGTH = 500;
export const BACKEND_URL = "http://localhost:3000";
export const FRONTEND_URL = "http://localhost:5173";
export const GEMINI_RESPONSE_DELIMITER = "Suggestions for Enhancement:";
export const DEFAULT_USE_LIMIT_FOR_GUEST = 3;
export const DEFAULT_USE_LIMIT_FOR_REGISTERED_USER = 10;

export interface APIResponse {
  coverLetter: string;
  suggestions: string[];
}

export enum AUTH_PROVIDERS {
  GOOGLE = "GOOGLE",
  EMAIL = "EMAIL",
  GUEST = "GUEST",
}

export const CREDIT_PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    credits: 10,
    priceInINR: 49,
    priceInUSD_Cents: 59,
  },
  {
    id: "standard",
    name: "Standard",
    credits: 30,
    priceInINR: 139,
    priceInUSD_Cents: 169,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 50,
    priceInINR: 199,
    priceInUSD_Cents: 239,
  },
];

export type CREDIT_PACKAGE_TYPE = (typeof CREDIT_PACKAGES)[number];

export default {
  BACKEND_URL,
  FRONTEND_URL,

  DEFAULT_USE_LIMIT_FOR_GUEST,
  DEFAULT_USE_LIMIT_FOR_REGISTERED_USER,
  GEMINI_RESPONSE_DELIMITER,
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,

  AUTH_PROVIDERS,

  CREDIT_PACKAGES,
};
