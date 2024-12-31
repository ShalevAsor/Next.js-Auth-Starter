import { TIME } from "./time";

/**
 * Authentication related constants
 */
export const AUTH = {
  VERIFICATION_TOKEN: {
    EXPIRES_IN: TIME.HOUR, // 1 hour
  },
  RESET_PASSWORD_TOKEN: {
    EXPIRES_IN: TIME.HOUR,
  },
  TWO_FACTOR_TOKEN: {
    EXPIRES_IN: TIME.MINUTE * 15,
  },
} as const;
