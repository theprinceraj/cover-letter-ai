export const BACKEND_URL = "http://localhost:3000";
export const FRONTEND_URL = "http://localhost:5173";

export const DEFAULT_USE_LIMIT_FOR_GUEST = 3;
export const DEFAULT_USE_LIMIT_FOR_REGISTERED_USER = 10;
export const GEMINI_RESPONSE_DELIMITER = "Suggestions for Enhancement:";

export const MAX_OTHER_RELEVANT_INFORMATION_LENGTH = 500;
export const MIN_JOB_DESCRIPTION_LENGTH = 100;
export const MAX_JOB_DESCRIPTION_LENGTH = 4499;
export const OTP_EXPIRATION_TIME_IN_SECONDS = 600; // 10 minutes
export const OTP_CODE_LENGTH = 6;
export const OTP_CODE_MIN = 100000;
export const OTP_CODE_MAX = 999999;
export const EMAIL_MAX_LENGTH = 255;
export const EMAIL_MIN_LENGTH = 3;

export const PASSWORD_MIN_LENGTH = 7;
export const PASSWORD_MAX_LENGTH = 20;
export const PASSWORD_MIN_UPPER_CASE_LETTERS = 1;
export const PASSWORD_MIN_LOWER_CASE_LETTERS = 1;
export const PASSWORD_MIN_DIGITS = 1;
export const PASSWORD_MIN_SPECIAL_CHARACTERS = 1;
export const PASSWORD_SPECIAL_CHARACTERS_TEST_REGEX = /[!@#$%^&*]/;
export const PASSWORD_TEST_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,20}$/;

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
    priceInINR: 79,
    priceInUSD_Cents: 99,
  },
  {
    id: CREDIT_PACKAGES_ID.STANDARD,
    name: "Standard",
    credits: 30,
    priceInINR: 149,
    priceInUSD_Cents: 179,
  },
  {
    id: CREDIT_PACKAGES_ID.PREMIUM,
    name: "Premium",
    credits: 50,
    priceInINR: 199,
    priceInUSD_Cents: 299,
  },
];

export enum ACCEPTED_CURRENCY_CODES {
  INR = "INR",
}

export enum CREDIT_ORDER_STATUS {
  CREATED = "created",
  ATTEMPTED = "attempted",
  PAID = "paid",
}

export type CREDIT_PACKAGE_TYPE = (typeof CREDIT_PACKAGES)[number];

export default {
  BACKEND_URL,
  FRONTEND_URL,

  DEFAULT_USE_LIMIT_FOR_GUEST,
  DEFAULT_USE_LIMIT_FOR_REGISTERED_USER,
  GEMINI_RESPONSE_DELIMITER,

  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
  MIN_JOB_DESCRIPTION_LENGTH,
  MAX_JOB_DESCRIPTION_LENGTH,
  OTP_EXPIRATION_TIME_IN_SECONDS,
  OTP_CODE_LENGTH,
  OTP_CODE_MIN,
  OTP_CODE_MAX,
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,

  AUTH_PROVIDERS,

  CREDIT_PACKAGES,
  CREDIT_PACKAGES_ID,
  CREDIT_ORDER_STATUS,
  ACCEPTED_CURRENCY_CODES,
};
