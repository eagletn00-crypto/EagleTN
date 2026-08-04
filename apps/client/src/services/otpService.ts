/**
 * Eagle.tn - Security & Delivery Verification Module
 * Protection against fraudulent delivery claims.
 */

export const generateDeliveryOTP = (): string => {
  // Generates a 4-digit verification code for order handoff
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const verifyDeliveryOTP = (inputOtp: string, expectedOtp: string): boolean => {
  return inputOtp.trim() === expectedOtp.trim();
};
