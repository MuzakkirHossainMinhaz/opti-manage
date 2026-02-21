"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownershipRequestValidationSchemas = void 0;
const zod_1 = require("zod");
exports.ownershipRequestValidationSchemas = {
    createOwnershipRequestSchema: zod_1.z.object({
        eyeGlassId: zod_1.z.string({
            required_error: "Eye Glass ID is required",
            invalid_type_error: "Eye Glass ID must be a string",
        }),
        message: zod_1.z
            .string({
            invalid_type_error: "Message must be a string",
        })
            .optional(),
    }),
    updateOwnershipRequestStatusSchema: zod_1.z.object({
        status: zod_1.z.enum(["approved", "rejected", "cancelled"], {
            required_error: "Status is required",
            invalid_type_error: "Status must be a valid value",
        }),
    }),
};
