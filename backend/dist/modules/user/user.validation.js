"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    fullName: zod_1.z
        .string({
        invalid_type_error: "Full name must be a string",
    })
        .trim()
        .optional(),
    username: zod_1.z
        .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    })
        .trim(),
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .trim()
        .email({
        message: "Invalid email address",
    }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
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
exports.default = userValidationSchema;
