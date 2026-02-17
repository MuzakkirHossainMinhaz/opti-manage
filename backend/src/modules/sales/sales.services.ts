import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { EyeGlassModel } from "../eyeGlass/eyeGlass.model";
import { ISales } from "./sales.interface";
import { SalesModel } from "./sales.model";
import { ActivityLogServices } from "../activityLog/activityLog.services";

const createSale = async (userData: JwtPayload, payload: Omit<ISales, "sellerId">) => {
  const eyeGlass = await EyeGlassModel.findById(payload.productId);

  if (!eyeGlass) {
    throw new AppError(404, "Eye Glass not found");
  }

  const quantity = eyeGlass.quantity - payload.quantity;
  if (quantity < 0) {
    throw new AppError(400, "Insufficient quantity");
  }

  const sale = await SalesModel.create({
    ...payload,
    sellerId: userData._id as any,
  });
  if (!sale) {
    throw new AppError(500, "Failed to create sale");
  }

  if (quantity === 0) {
    await EyeGlassModel.findByIdAndDelete(payload.productId);
  } else {
    eyeGlass.quantity = quantity;
    await eyeGlass.save();
  }

  await ActivityLogServices.createActivityLog(
    { _id: userData._id as any, username: userData.username as string, role: userData.role as string },
    "CREATE",
    `Sale ${sale._id.toString()} created for product ${payload.productId.toString()}`,
  );

  return await SalesModel.findById(sale._id).populate("sellerId", "name email").populate("productId", "name price");
};

const getAllSales = async (userData: JwtPayload) => {
  let sales = await SalesModel.find().populate("sellerId", "name email").populate("productId", "name price");

  if (userData.role === "user") {
    sales = sales.filter((sale: ISales) => sale.sellerId._id.toString() === userData._id.toString());
  }

  return sales;
};

const getSalesById = async (userData: JwtPayload, id: string) => {
  const sale = await SalesModel.findById(id).populate("sellerId", "name email").populate("productId", "name price");
  if (!sale) {
    throw new AppError(404, "Sale not found");
  }

  if (userData.role === "user" && sale.sellerId && sale.sellerId._id.toString() !== userData._id.toString()) {
    throw new AppError(403, "You do not have permission to view this sale");
  }

  return sale;
};

const getSalesByCategory = async (userData: any, category: string) => {
  let sales;

  if (category === "all" || category === "") {
    sales = await SalesModel.find();
  } else if (category === "daily") {
    sales = await SalesModel.find({
      saleDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });
  } else if (category === "weekly") {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));

    sales = await SalesModel.find({
      saleDate: {
        $gte: firstDayOfWeek.setHours(0, 0, 0, 0),
        $lt: lastDayOfWeek.setHours(23, 59, 59, 999),
      },
    });
  } else if (category === "monthly") {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    sales = await SalesModel.find({
      saleDate: {
        $gte: firstDayOfMonth.setHours(0, 0, 0, 0),
        $lt: lastDayOfMonth.setHours(23, 59, 59, 999),
      },
    });
  } else if (category === "yearly") {
    const currentDate = new Date();
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);

    sales = await SalesModel.find({
      saleDate: {
        $gte: firstDayOfYear.setHours(0, 0, 0, 0),
        $lt: lastDayOfYear.setHours(23, 59, 59, 999),
      },
    });
  } else {
    throw new AppError(400, "Invalid category");
  }

  if (userData.role === "user") {
    sales = sales.filter((sale: ISales) => sale.sellerId._id.toString() === userData._id.toString());
  }

  return sales;
};

export const SalesServices = {
  createSale,
  getAllSales,
  getSalesById,
  getSalesByCategory,
};
