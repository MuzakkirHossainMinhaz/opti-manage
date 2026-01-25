import { z } from "zod";

// Zod schema for create the eye-glasses model
const createEyeGlassSchema = z.object({
  // Define the properties of the eye-glasses model
  photo: z
    .string({
      required_error: "Photo is required",
      invalid_type_error: "Photo must be a string",
    })
    .url({
      message: "Photo must be a valid URL",
    }),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(1, {
      message: "Price must be greater than or equal to 1",
    }),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .min(1, {
      message: "Quantity must be greater than or equal to 1",
    }),
  frameMaterial: z.enum(["metal", "plastic", "wood", "silicone", "leather", "acetate", "carbon-fiber", "other"], {
    required_error: "Frame Material is required",
    invalid_type_error: "Frame Material must be a string",
  }),
  frameShape: z.enum(
    ["rimless", "oval", "circle", "rectangle", "square", "round", "cat-eye", "heart", "triangle", "butterfly", "other"],
    {
      required_error: "Frame Shape is required",
      invalid_type_error: "Frame Shape must be a string",
    },
  ),
  lensType: z.enum(
    ["single-vision", "bifocal", "trifocal", "progressive", "uv-protective", "aspheric", "polarized", "other"],
    {
      required_error: "Lens Type is required",
      invalid_type_error: "Lens Type must be a string",
    },
  ),
  templeType: z.enum(["straight", "curved", "flexible", "adjustable", "other"], {
    required_error: "Temple Type is required",
    invalid_type_error: "Temple Type must be a string",
  }),
  templeLength: z.number({
    required_error: "Temple Length is required",
    invalid_type_error: "Temple Length must be a number",
  }),
  bridgeWidth: z.number({
    required_error: "Bridge Width is required",
    invalid_type_error: "Bridge Width must be a number",
  }),
  lensWidth: z.number({
    required_error: "Lens Width is required",
    invalid_type_error: "Lens Width must be a number",
  }),
  lensHeight: z.number({
    required_error: "Lens Height is required",
    invalid_type_error: "Lens Height must be a number",
  }),
  lensMaterial: z.enum(["polycarbonate", "high-index", "plastic", "glass", "trivex", "other"], {
    required_error: "Lens Material is required",
    invalid_type_error: "Lens Material must be a string",
  }),
  brand: z.enum(["ray-ban", "oakley", "prada", "gucci", "dior", "coach", "other"], {
    required_error: "Brand is required",
    invalid_type_error: "Brand must be a string",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be a string",
  }),
  color: z.string({
    required_error: "Color is required",
    invalid_type_error: "Color must be a string",
  }),
});

// Zod schema for update the eye-glasses model
const updateEyeGlassSchema = z.object({
  // Define the properties of the eye-glasses model
  photo: z
    .string({
      invalid_type_error: "Photo must be a string",
    })
    .url({
      message: "Photo must be a valid URL",
    })
    .optional(),
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .optional(),
  price: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .min(1, {
      message: "Price must be greater than or equal to 1",
    })
    .optional(),
  quantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .min(1, {
      message: "Quantity must be greater than or equal to 1",
    })
    .optional(),
  frameMaterial: z
    .enum(["metal", "plastic", "wood", "silicone", "leather", "acetate", "carbon-fiber", "other"], {
      invalid_type_error: "Frame Material must be a string",
    })
    .optional(),
  frameShape: z
    .enum(
      [
        "rimless",
        "oval",
        "circle",
        "rectangle",
        "square",
        "round",
        "cat-eye",
        "heart",
        "triangle",
        "butterfly",
        "other",
      ],
      {
        invalid_type_error: "Frame Shape must be a string",
      },
    )
    .optional(),
  lensType: z
    .enum(["single-vision", "bifocal", "trifocal", "progressive", "uv-protective", "aspheric", "polarized", "other"], {
      invalid_type_error: "Lens Type must be a string",
    })
    .optional(),
  templeType: z
    .enum(["straight", "curved", "flexible", "adjustable", "other"], {
      invalid_type_error: "Temple Type must be a string",
    })
    .optional(),
  templeLength: z
    .number({
      invalid_type_error: "Temple Length must be a number",
    })
    .optional(),
  bridgeWidth: z
    .number({
      invalid_type_error: "Bridge Width must be a number",
    })
    .optional(),
  lensWidth: z
    .number({
      invalid_type_error: "Lens Width must be a number",
    })
    .optional(),
  lensHeight: z
    .number({
      invalid_type_error: "Lens Height must be a number",
    })
    .optional(),
  lensMaterial: z
    .enum(["polycarbonate", "high-index", "plastic", "glass", "trivex", "other"], {
      invalid_type_error: "Lens Material must be a string",
    })
    .optional(),
  brand: z
    .enum(["ray-ban", "oakley", "prada", "gucci", "dior", "coach", "other"], {
      invalid_type_error: "Brand must be a string",
    })
    .optional(),
  gender: z
    .enum(["male", "female"], {
      invalid_type_error: "Gender must be a string",
    })
    .optional(),
  color: z
    .string({
      invalid_type_error: "Color must be a string",
    })
    .optional(),
});

// Export the Zod schema for use in your application
export const eyeGlassValidationSchemas = {
  createEyeGlassSchema,
  updateEyeGlassSchema,
};
