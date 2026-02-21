"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationSchemas = void 0;
const zod_1 = require("zod");
const authLoginValidationSchema = zod_1.z.object({
    username: zod_1.z
        .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    })
        .trim(),
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
exports.authValidationSchemas = {
    authLoginValidationSchema,
};
