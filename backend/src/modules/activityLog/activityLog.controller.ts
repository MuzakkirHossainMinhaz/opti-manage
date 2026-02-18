import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ActivityLogServices } from "./activityLog.services";

const getActivityLogs = catchAsync(async (req, res) => {
  if (req.user.role !== "manager") {
    throw new AppError(httpStatus.FORBIDDEN, "Only managers can view activity logs");
  }

  const logs = await ActivityLogServices.getActivityLogs();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Activity logs fetched successfully",
    data: logs,
  });
});

export const ActivityLogControllers = {
  getActivityLogs,
};
