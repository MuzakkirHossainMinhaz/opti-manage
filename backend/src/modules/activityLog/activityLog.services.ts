import { ActivityLogModel } from "./activityLog.model";
import { IActivityLog, TActivityAction } from "./activityLog.interface";

type TActivityUser = {
  _id?: any;
  username?: string;
  role?: string;
};

const createActivityLog = async (userData: TActivityUser, action: TActivityAction, target: string) => {
  if (!userData || !userData._id) {
    return;
  }

  await ActivityLogModel.create({
    action,
    target,
    user: userData._id,
    timestamp: new Date(),
  } as unknown as IActivityLog);
};

const getActivityLogs = async () => {
  const logs = await ActivityLogModel.find().sort({ timestamp: -1 }).populate("user", "username role");

  return logs;
};

export const ActivityLogServices = {
  createActivityLog,
  getActivityLogs,
};
