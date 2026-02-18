import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DashboardServices } from "./dashboard.services";

const getDashboardStats = catchAsync(async (req, res) => {
  const user = req.user;

  const data =
    user.role === "manager"
      ? await DashboardServices.getManagerDashboardStats(user)
      : await DashboardServices.getUserDashboardStats(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard statistics fetched successfully",
    data,
  });
});

export const DashboardControllers = {
  getDashboardStats,
};
