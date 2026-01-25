import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SalesServices } from "./sales.services";

const createSale = catchAsync(async (req, res) => {
  const sale = await SalesServices.createSale(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Sale created successfully",
    data: sale,
  });
});

const getAllSales = catchAsync(async (req, res) => {
  const sales = await SalesServices.getAllSales(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sales fetched successfully",
    data: sales,
  });
});

const getSalesById = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const sale = await SalesServices.getSalesById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sale fetched successfully",
    data: sale,
  });
});

const getSalesByCategory = catchAsync(async (req, res) => {
  const category = req.params.category as string;
  const sales = await SalesServices.getSalesByCategory(req.user, category);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sales fetched successfully",
    data: sales,
  });
});

export const SalesController = {
  createSale,
  getAllSales,
  getSalesById,
  getSalesByCategory,
};
