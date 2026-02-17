import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";

const createUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const updater = req.user;

  if (updater._id.toString() !== id) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden Access");
  }

  const user = await UserServices.updateProfile(id, updater.role, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: user,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  if (req.user._id.toString() !== id) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden Access");
  }

  const { currentPassword, newPassword } = req.body;

  await UserServices.changePassword(id, currentPassword, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: null,
  });
});

const getAllUsers = catchAsync(async (_req, res) => {
  const users = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: users,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  await UserServices.deleteUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null,
  });
});

export const UserControllers = { createUser, updateProfile, changePassword, getAllUsers, deleteUser };
