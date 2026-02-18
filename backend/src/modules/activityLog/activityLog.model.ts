import mongoose, { Schema } from "mongoose";
import { IActivityLog } from "./activityLog.interface";

const activityLogSchema = new mongoose.Schema<IActivityLog>(
  {
    action: {
      type: String,
      enum: ["LOGIN", "CREATE", "UPDATE", "DELETE"],
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const ActivityLogModel = mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);
