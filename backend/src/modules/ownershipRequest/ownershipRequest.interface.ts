import { Types } from "mongoose";

export type TOwnershipRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface IOwnershipRequest {
  eyeGlass: Types.ObjectId;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  status: TOwnershipRequestStatus;
  message?: string;
}
