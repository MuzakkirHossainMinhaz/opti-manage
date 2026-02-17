import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { IAuth, IJWTPayload } from "./auth.interface";
import { createJWT } from "./auth.utils";
import { ActivityLogServices } from "../activityLog/activityLog.services";

const loginUser = async (payload: IAuth) => {
  const user = await UserModel.findOne({ username: payload.username }).select("+password -createdAt -updatedAt");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await UserModel.isPasswordMatched(payload?.password, user?.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect password");
  }

  // create token
  const jwtPayload: IJWTPayload = {
    _id: user._id,
    role: user.role,
    username: user.username,
  };
  const token = createJWT(jwtPayload);

  await ActivityLogServices.createActivityLog(
    { _id: user._id, username: user.username, role: user.role },
    "LOGIN",
    `User ${user.username} logged in`,
  );

  return { token };
};

export const AuthServices = {
  loginUser,
};
