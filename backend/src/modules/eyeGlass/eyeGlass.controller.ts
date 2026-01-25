import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EyeGlassServices } from "./eyeGlass.services";

const createEyeGlass = catchAsync(async (req, res) => {
  const eyeGlasses = await EyeGlassServices.createEyeGlass(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Eye Glass created successfully",
    data: eyeGlasses,
  });
});

const deleteEyeGlassByIds = catchAsync(async (req, res) => {
  const { eyeGlassIds } = req.body;
  const eyeGlasses = await EyeGlassServices.deleteEyeGlassByIds(req.user, eyeGlassIds);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Eye Glass deleted successfully",
    data: eyeGlasses,
  });
});

const deleteAllEyeGlasses = catchAsync(async (req, res) => {
  const eyeGlasses = await EyeGlassServices.deleteAllEyeGlasses(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Eye Glasses deleted successfully",
    data: eyeGlasses,
  });
});

const updateEyeGlassById = catchAsync(async (req, res) => {
  const eyeGlassId = req.params.eyeGlassId as string;
  const eyeGlass = await EyeGlassServices.updateEyeGlassById(eyeGlassId, req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Eye Glass updated successfully",
    data: eyeGlass,
  });
});

const getAllEyeGlasses = catchAsync(async (req, res) => {
  const queryParams = req.query;
  const { page, limit, price, templeLength, bridgeWidth } = queryParams;
  const { eyeGlasses, total } = await EyeGlassServices.getAllEyeGlasses(req.user, {
    ...queryParams,
    price: price
      ? String(price)
          .split(",")
          .map((item) => Number(item))
      : undefined,
    templeLength: templeLength
      ? String(templeLength)
          .split(",")
          .map((item) => Number(item))
      : undefined,
    bridgeWidth: bridgeWidth
      ? String(bridgeWidth)
          .split(",")
          .map((item) => Number(item))
      : undefined,
  });

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Eye Glasses fetched successfully",
    meta: {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      total,
      totalPages: Math.ceil(total / (Number(limit) || 10)),
    },
    data: eyeGlasses,
  });
});

const getEyeGlassById = catchAsync(async (req, res) => {
  const eyeGlassId = req.params.eyeGlassId as string;
  const eyeGlass = await EyeGlassServices.getEyeGlassById(eyeGlassId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Eye Glass fetched successfully",
    data: eyeGlass,
  });
});

export const EyeGlassControllers = {
  createEyeGlass,
  deleteEyeGlassByIds,
  deleteAllEyeGlasses,
  updateEyeGlassById,
  getAllEyeGlasses,
  getEyeGlassById,
};
