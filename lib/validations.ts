import { z } from "zod";

export const LeadCaptureSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  loan_type: z.enum([
    "personal",
    "home",
    "business",
    "car",
    "education",
    "medical",
    "cibil_fix",
    "balance_transfer",
    "itr_filing",
  ]),
  loan_amount: z.string().optional(),
  employment_type: z
    .enum(["salaried", "self_employed", "business_owner"])
    .optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/)
    .optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export const SendOTPSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
});

export const VerifyOTPSchema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  token: z.string().length(6, "OTP must be 6 digits"),
  name: z.string().optional(),
  loan_type: z.string().optional(),
});

export const ConsultationSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Enter a valid email address").optional(),
  consultation_type: z.enum(["cibil_fix", "loan"]),
  loan_type: z.string().optional(),
  cibil_score: z.number().int().min(300).max(900).optional(),
  time_preference: z
    .enum(["asap", "morning", "afternoon", "evening"])
    .default("asap"),
  notes: z.string().max(500).optional(),
});

export const CibilCheckSchema = z.object({
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN (e.g. ABCDE1234F)"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const PaymentInitiateSchema = z.object({
  plan: z.enum(["basic", "premium"]),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
  phone: z.string().regex(/^\d{10}$/),
  name: z.string().optional(),
});

export type LeadCapture = z.infer<typeof LeadCaptureSchema>;
export type SendOTP = z.infer<typeof SendOTPSchema>;
export type VerifyOTP = z.infer<typeof VerifyOTPSchema>;
export type Consultation = z.infer<typeof ConsultationSchema>;
export type CibilCheck = z.infer<typeof CibilCheckSchema>;
export type PaymentInitiate = z.infer<typeof PaymentInitiateSchema>;
