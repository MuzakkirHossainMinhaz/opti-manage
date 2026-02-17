import { Model } from "mongoose";

export interface IUser {
  fullName?: string;
  username: string;
  email: string;
  password: string;
  role: "manager" | "user";
}

export interface UserModels extends Model<IUser> {
  isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
}
