import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { IAuth, IJWTPayload } from "./auth.interface";
import { createJWT } from "./auth.utils";

const loginUser = async (payload: IAuth) => {
  // check if the user exists
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

  return { token };
};

export const AuthServices = {
  loginUser,
};
