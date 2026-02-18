import mongoose, { Schema } from "mongoose";
import { IOwnershipRequest } from "./ownershipRequest.interface";

const ownershipRequestSchema = new mongoose.Schema<IOwnershipRequest>(
  {
    eyeGlass: {
      type: Schema.Types.ObjectId,
      ref: "EyeGlass",
      required: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OwnershipRequestModel = mongoose.model<IOwnershipRequest>("OwnershipRequest", ownershipRequestSchema);
