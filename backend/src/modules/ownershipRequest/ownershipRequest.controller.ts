import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OwnershipRequestServices } from "./ownershipRequest.services";

const createOwnershipRequest = catchAsync(async (req, res) => {
  const ownershipRequest = await OwnershipRequestServices.createOwnershipRequest(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Ownership request created successfully",
    data: ownershipRequest,
  });
});

const getOwnershipRequests = catchAsync(async (req, res) => {
  const ownershipRequests = await OwnershipRequestServices.getOwnershipRequests(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ownership requests fetched successfully",
    data: ownershipRequests,
  });
});

const updateOwnershipRequestStatus = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: any };

  const ownershipRequest = await OwnershipRequestServices.updateOwnershipRequestStatus(req.user, id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ownership request updated successfully",
    data: ownershipRequest,
  });
});

export const OwnershipRequestControllers = {
  createOwnershipRequest,
  getOwnershipRequests,
  updateOwnershipRequestStatus,
};
