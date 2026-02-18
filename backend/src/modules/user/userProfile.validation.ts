import { z } from "zod";

export const updateProfileValidationSchema = z.object({
  fullName: z
    .string({
      invalid_type_error: "Full name must be a string",
    })
    .trim()
    .optional(),
  username: z
    .string({
      invalid_type_error: "Username must be a string",
    })
    .trim()
    .optional(),
  email: z
    .string({
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email({
      message: "Invalid email address",
    })
    .optional(),
});

export const changePasswordValidationSchema = z.object({
  currentPassword: z
    .string({
      required_error: "Current password is required",
      invalid_type_error: "Current password must be a string",
    })
    .trim(),
  newPassword: z
    .string({
      required_error: "New password is required",
      invalid_type_error: "New password must be a string",
    })
    .trim()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(20, {
      message: "Password must be at most 20 characters",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
