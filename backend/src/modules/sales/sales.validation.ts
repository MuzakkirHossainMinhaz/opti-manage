import { z } from "zod";

const salesValidationSchema = z.object({
  productId: z.string({
    required_error: "Product Id is required",
    invalid_type_error: "Product Id must be a string",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .min(1, {
      message: "Quantity must be greater than or equal to 1",
    }),
  buyerName: z.string({
    required_error: "Buyer Name is required",
    invalid_type_error: "Buyer Name must be a string",
  }),
  saleDate: z.string({
    required_error: "Sale Date is required",
    invalid_type_error: "Sale Date must be a string",
  }),
  sellerId: z.string({
    required_error: "Seller Id is required",
    invalid_type_error: "Seller Id must be a string",
  }),
});

export default salesValidationSchema;
