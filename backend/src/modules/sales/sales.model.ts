import mongoose from "mongoose";
import { ISales } from "./sales.interface";

const salesSchema = new mongoose.Schema<ISales>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product ID is required"],
      ref: "EyeGlass",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    buyerName: {
      type: String,
      required: [true, "Name of the buyer is required"],
    },
    saleDate: {
      type: String,
      required: [true, "Date of the sale is required"],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Seller ID is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SalesModel = mongoose.model<ISales>("Sales", salesSchema);
