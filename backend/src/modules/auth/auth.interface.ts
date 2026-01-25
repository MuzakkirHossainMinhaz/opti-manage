import { Types } from "mongoose";

export interface IAuth {
  username: string;
  password: string;
}

export interface IJWTPayload {
  _id: Types.ObjectId;
  username: string;
  role: "manager" | "user";
  [key: string]: any;
}
