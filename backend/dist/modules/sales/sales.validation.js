"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const salesValidationSchema = zod_1.z.object({
    productId: zod_1.z.string({
        required_error: "Product Id is required",
        invalid_type_error: "Product Id must be a string",
    }),
    quantity: zod_1.z
        .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
    })
        .min(1, {
        message: "Quantity must be greater than or equal to 1",
    }),
    buyerName: zod_1.z.string({
        required_error: "Buyer Name is required",
        invalid_type_error: "Buyer Name must be a string",
    }),
    saleDate: zod_1.z.string({
        required_error: "Sale Date is required",
        invalid_type_error: "Sale Date must be a string",
    }),
    sellerId: zod_1.z.string({
        required_error: "Seller Id is required",
        invalid_type_error: "Seller Id must be a string",
    }),
});
exports.default = salesValidationSchema;
