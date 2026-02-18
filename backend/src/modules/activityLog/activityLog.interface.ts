import { Types } from "mongoose";

export type TActivityAction = "LOGIN" | "CREATE" | "UPDATE" | "DELETE";

export interface IActivityLog {
  action: TActivityAction;
  target: string;
  user: Types.ObjectId;
  timestamp: Date;
}
