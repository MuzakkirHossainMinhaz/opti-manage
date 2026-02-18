import { z } from "zod";

export const ownershipRequestValidationSchemas = {
  createOwnershipRequestSchema: z.object({
    eyeGlassId: z.string({
      required_error: "Eye Glass ID is required",
      invalid_type_error: "Eye Glass ID must be a string",
    }),
    message: z
      .string({
        invalid_type_error: "Message must be a string",
      })
      .optional(),
  }),
  updateOwnershipRequestStatusSchema: z.object({
    status: z.enum(["approved", "rejected", "cancelled"], {
      required_error: "Status is required",
      invalid_type_error: "Status must be a valid value",
    }),
  }),
};
