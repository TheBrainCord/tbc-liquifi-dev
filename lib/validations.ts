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

export type LeadCapture = z.infer<typeof LeadCaptureSchema>;
export type SendOTP = z.infer<typeof SendOTPSchema>;
export type VerifyOTP = z.infer<typeof VerifyOTPSchema>;
