import bcrypt from "bcrypt";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUser = async (payload: IUser) => {
  const existingUser = await UserModel.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS));

  payload.password = hashedPassword;

  const user = await UserModel.create(payload);

  return user;
};

const updateProfile = async (userId: string, updaterRole: "manager" | "user", payload: Partial<IUser>) => {
  const updateData: Partial<IUser> = {};

  if (payload.fullName !== undefined) {
    updateData.fullName = payload.fullName;
  }

  if (updaterRole === "manager") {
    if (payload.username !== undefined) {
      updateData.username = payload.username;
    }
    if (payload.email !== undefined) {
      updateData.email = payload.email;
    }
  }

  const user = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user || !user.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const isPasswordMatched = await UserModel.isPasswordMatched(currentPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS));
  user.password = hashedPassword;
  await user.save();
};

const getAllUsers = async () => {
  const users = await UserModel.find().select("-password");
  return users;
};

const deleteUser = async (userId: string) => {
  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
};

export const UserServices = {
  createUser,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser,
};
