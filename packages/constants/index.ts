export const OTP_EXPIRATION_TIME_IN_SECONDS = 600; // 10 minutes
export const OTP_CODE_LENGTH = 6;
export const OTP_CODE_MIN = 111111;
export const OTP_CODE_MAX = 999999;
export const EMAIL_MAX_LENGTH = 255;
export const EMAIL_MIN_LENGTH = 3;
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

export enum CREDIT_PACKAGES_ID {
  BASIC = "basic",
  STANDARD = "standard",
  PREMIUM = "premium",
}

export const CREDIT_PACKAGES = [
  {
    id: CREDIT_PACKAGES_ID.BASIC,
    name: "Basic",
    credits: 10,
    priceInINR: 49,
    priceInUSD_Cents: 59,
  },
  {
    id: CREDIT_PACKAGES_ID.STANDARD,
    name: "Standard",
    credits: 30,
    priceInINR: 139,
    priceInUSD_Cents: 169,
  },
  {
    id: CREDIT_PACKAGES_ID.PREMIUM,
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
  CREDIT_PACKAGES_ID,
};
