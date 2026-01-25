import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { verifyJWT } from "../modules/auth/auth.utils";
import { UserModel } from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";

const auth = () => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization;

    // check if the token is present
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    // check if the token is valid
    const { _id, username, role, exp } = verifyJWT(token);

    // check if the user exists
    const user = await UserModel.findOne({ _id, username, role }).select("-password -createdAt -updatedAt");
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    // check if the token is not expired
    if (Date.now() >= exp * 1000) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    // set user
    req.user = user;

    next();
  });
};

export default auth;
