/**
 * BillEase Suite - Authentication System
 * Demo credentials and user management
 */

export interface UserRegistration {
  // Business Information
  businessName: string;
  businessType: string;
  branches: string;
  dateOfEstablishment: string;
  gstNumber: string;
  panNumber: string;
  
  // Contact Information
  email: string;
  phone: string;
  alternativePhone: string;
  telephone: string;
  website: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  pinCode: string;
  
  // Account Credentials
  username: string;
  password: string;
  passKey: string;
}

export interface DemoCredentials {
  username: string;
  email: string;
  password: string;
}

// Demo credentials for testing
export const DEMO_CREDENTIALS: DemoCredentials = {
  username: "demo_user",
  email: "demo@billease.com",
  password: "Demo@123",
};

// Business type options
export const BUSINESS_TYPES = [
  "Retail Store",
  "Wholesale",
  "Manufacturing",
  "Service Provider",
  "Restaurant / Cafe",
  "Healthcare",
  "Education",
  "E-commerce",
  "Consulting",
  "Trading",
  "Construction",
  "IT / Software",
  "Other",
];

// Indian states for dropdown
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
];

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const validatePinCode = (pin: string): boolean => {
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pin);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character (!@#$%^&*)" };
  }
  return { valid: true, message: "Password is strong" };
};
