import mongoose, { Schema } from "mongoose";
import { IEyeGlass } from "./eyeGlass.interface";

const eyeGlassSchema = new mongoose.Schema<IEyeGlass>(
  {
    photo: {
      type: String,
      required: [true, "Photo is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    frameMaterial: {
      type: String,
      enum: ["metal", "plastic", "wood", "silicone", "leather", "acetate", "carbon-fiber", "other"],
      required: [true, "Frame Material is required"],
    },
    frameShape: {
      type: String,
      enum: [
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
      required: [true, "Frame Shape is required"],
    },
    lensType: {
      type: String,
      enum: ["single-vision", "bifocal", "trifocal", "progressive", "uv-protective", "aspheric", "polarized", "other"],
      required: [true, "Lens Type is required"],
    },
    templeType: {
      type: String,
      enum: ["straight", "curved", "flexible", "adjustable", "other"],
      required: [true, "Temple Type is required"],
    },
    templeLength: {
      type: Number,
      required: [true, "Temple Length is required"],
    },
    bridgeWidth: {
      type: Number,
      required: [true, "Bridge Width is required"],
    },
    lensWidth: {
      type: Number,
      required: [true, "Lens Width is required"],
    },
    lensHeight: {
      type: Number,
      required: [true, "Lens Height is required"],
    },
    lensMaterial: {
      type: String,
      enum: ["polycarbonate", "high-index", "plastic", "glass", "trivex", "other"],
      required: [true, "Lens Material is required"],
    },
    brand: {
      type: String,
      enum: ["ray-ban", "oakley", "prada", "gucci", "dior", "coach", "other"],
      required: [true, "Brand is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const EyeGlassModel = mongoose.model<IEyeGlass>("EyeGlass", eyeGlassSchema);
