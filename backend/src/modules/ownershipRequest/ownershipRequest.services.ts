import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { EyeGlassModel } from "../eyeGlass/eyeGlass.model";
import { ActivityLogServices } from "../activityLog/activityLog.services";
import { IOwnershipRequest, TOwnershipRequestStatus } from "./ownershipRequest.interface";
import { OwnershipRequestModel } from "./ownershipRequest.model";

const createOwnershipRequest = async (
  userData: any,
  payload: { eyeGlassId: string; message?: string },
): Promise<IOwnershipRequest> => {
  const eyeGlass = await EyeGlassModel.findById(payload.eyeGlassId);

  if (!eyeGlass || !eyeGlass.createdBy) {
    throw new AppError(httpStatus.NOT_FOUND, "Eye Glass not found");
  }

  if (eyeGlass.createdBy.toString() === userData._id.toString()) {
    throw new AppError(httpStatus.BAD_REQUEST, "You already own this eye glass");
  }

  const existingPending = await OwnershipRequestModel.findOne({
    eyeGlass: eyeGlass._id,
    fromUser: userData._id,
    status: "pending",
  });

  if (existingPending) {
    throw new AppError(httpStatus.BAD_REQUEST, "You already have a pending request for this eye glass");
  }

  const ownershipRequest = await OwnershipRequestModel.create({
    eyeGlass: eyeGlass._id,
    fromUser: userData._id,
    toUser: eyeGlass.createdBy,
    status: "pending",
    message: payload.message,
  });

  await ActivityLogServices.createActivityLog(
    { _id: userData._id, username: userData.username, role: userData.role },
    "CREATE",
    `Ownership request ${ownershipRequest._id.toString()} created for eye glass ${eyeGlass._id.toString()}`,
  );

  return ownershipRequest;
};

const getOwnershipRequests = async (userData: any) => {
  const filter: Record<string, unknown> = {};

  if (userData.role === "user") {
    filter.$or = [{ fromUser: userData._id }, { toUser: userData._id }];
  }

  const requests = await OwnershipRequestModel.find(filter)
    .sort({ createdAt: -1 })
    .populate("eyeGlass", "name")
    .populate("fromUser", "username role")
    .populate("toUser", "username role");

  return requests;
};

const updateOwnershipRequestStatus = async (userData: any, id: string, status: TOwnershipRequestStatus) => {
  if (userData.role !== "manager") {
    throw new AppError(httpStatus.FORBIDDEN, "Only managers can update ownership requests");
  }

  const ownershipRequest = await OwnershipRequestModel.findById(id);

  if (!ownershipRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Ownership request not found");
  }

  ownershipRequest.status = status;
  await ownershipRequest.save();

  if (status === "approved") {
    const eyeGlass = await EyeGlassModel.findById(ownershipRequest.eyeGlass);

    if (!eyeGlass) {
      throw new AppError(httpStatus.NOT_FOUND, "Eye Glass not found");
    }

    eyeGlass.createdBy = ownershipRequest.fromUser;
    await eyeGlass.save();

    await ActivityLogServices.createActivityLog(
      { _id: userData._id, username: userData.username, role: userData.role },
      "UPDATE",
      `Ownership of eye glass ${eyeGlass._id.toString()} transferred to user ${ownershipRequest.fromUser.toString()}`,
    );
  }

  await ActivityLogServices.createActivityLog(
    { _id: userData._id, username: userData.username, role: userData.role },
    "UPDATE",
    `Ownership request ${ownershipRequest._id.toString()} updated to status ${status}`,
  );

  return ownershipRequest;
};

export const OwnershipRequestServices = {
  createOwnershipRequest,
  getOwnershipRequests,
  updateOwnershipRequestStatus,
};
