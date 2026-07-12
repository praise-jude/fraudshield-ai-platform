import { z } from "zod";

export const ORG_TYPES = [
  { value: "bank", label: "Bank" },
  { value: "fintech", label: "Fintech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "insurance", label: "Insurance" },
  { value: "crypto_exchange", label: "Crypto Exchange" },
  { value: "payment_gateway", label: "Payment Gateway" },
  { value: "other", label: "Other" },
] as const;

const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

export const signUpSchema = z
  .object({
    orgName: z.string().min(2, "Organization name is required"),
    orgType: z.enum(["bank", "fintech", "ecommerce", "insurance", "crypto_exchange", "payment_gateway", "other"]),
    businessRegistrationNumber: z.string().optional(),
    country: z.string().min(2, "Country is required"),
    state: z.string().optional(),
    address: z.string().optional(),
    officialEmail: z.string().email("Enter a valid organization email"),
    phone: z.string().optional(),
    website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    fullName: z.string().min(2, "Your name is required"),
    workEmail: z.string().email("Enter a valid work email"),
    jobTitle: z.string().min(1, "Job title is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, "You must accept the Terms & Privacy Policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
