"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidationSchema = exports.updateProfileValidationSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileValidationSchema = zod_1.z.object({
    fullName: zod_1.z
        .string({
        invalid_type_error: "Full name must be a string",
    })
        .trim()
        .optional(),
    username: zod_1.z
        .string({
        invalid_type_error: "Username must be a string",
    })
        .trim()
        .optional(),
    email: zod_1.z
        .string({
        invalid_type_error: "Email must be a string",
    })
        .trim()
        .email({
        message: "Invalid email address",
    })
        .optional(),
});
exports.changePasswordValidationSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string({
        required_error: "Current password is required",
        invalid_type_error: "Current password must be a string",
    })
        .trim(),
    newPassword: zod_1.z
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
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
