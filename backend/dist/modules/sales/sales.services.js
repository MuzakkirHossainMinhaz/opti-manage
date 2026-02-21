"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const eyeGlass_model_1 = require("../eyeGlass/eyeGlass.model");
const sales_model_1 = require("./sales.model");
const activityLog_services_1 = require("../activityLog/activityLog.services");
const createSale = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findById(payload.productId);
    if (!eyeGlass) {
        throw new AppError_1.default(404, "Eye Glass not found");
    }
    const quantity = eyeGlass.quantity - payload.quantity;
    if (quantity < 0) {
        throw new AppError_1.default(400, "Insufficient quantity");
    }
    const sale = yield sales_model_1.SalesModel.create(Object.assign(Object.assign({}, payload), { sellerId: userData._id }));
    if (!sale) {
        throw new AppError_1.default(500, "Failed to create sale");
    }
    if (quantity === 0) {
        yield eyeGlass_model_1.EyeGlassModel.findByIdAndDelete(payload.productId);
    }
    else {
        eyeGlass.quantity = quantity;
        yield eyeGlass.save();
    }
    yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "CREATE", `Sale ${sale._id.toString()} created for product ${payload.productId.toString()}`);
    return yield sales_model_1.SalesModel.findById(sale._id).populate("sellerId", "name email").populate("productId", "name price");
});
const getAllSales = (userData, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 0;
    const filter = {};
    if (userData.role === "user") {
        filter.sellerId = userData._id;
    }
    const skip = limit > 0 ? (page - 1) * limit : 0;
    let mongoQuery = sales_model_1.SalesModel.find(filter).populate("sellerId", "name email").populate("productId", "name price");
    if (limit > 0) {
        mongoQuery = mongoQuery.skip(skip).limit(limit);
    }
    const [sales, total] = yield Promise.all([mongoQuery, sales_model_1.SalesModel.countDocuments(filter)]);
    const effectiveLimit = limit || total || 1;
    return {
        sales,
        total,
        page,
        limit: effectiveLimit,
        totalPages: Math.ceil((total || 1) / effectiveLimit),
    };
});
const getSalesById = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
    const sale = yield sales_model_1.SalesModel.findById(id).populate("sellerId", "name email").populate("productId", "name price");
    if (!sale) {
        throw new AppError_1.default(404, "Sale not found");
    }
    if (userData.role === "user" && sale.sellerId && sale.sellerId._id.toString() !== userData._id.toString()) {
        throw new AppError_1.default(403, "You do not have permission to view this sale");
    }
    return sale;
});
const getSalesByCategory = (userData, category) => __awaiter(void 0, void 0, void 0, function* () {
    let sales;
    if (category === "all" || category === "") {
        sales = yield sales_model_1.SalesModel.find();
    }
    else if (category === "daily") {
        sales = yield sales_model_1.SalesModel.find({
            saleDate: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999),
            },
        });
    }
    else if (category === "weekly") {
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
        sales = yield sales_model_1.SalesModel.find({
            saleDate: {
                $gte: firstDayOfWeek.setHours(0, 0, 0, 0),
                $lt: lastDayOfWeek.setHours(23, 59, 59, 999),
            },
        });
    }
    else if (category === "monthly") {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        sales = yield sales_model_1.SalesModel.find({
            saleDate: {
                $gte: firstDayOfMonth.setHours(0, 0, 0, 0),
                $lt: lastDayOfMonth.setHours(23, 59, 59, 999),
            },
        });
    }
    else if (category === "yearly") {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);
        sales = yield sales_model_1.SalesModel.find({
            saleDate: {
                $gte: firstDayOfYear.setHours(0, 0, 0, 0),
                $lt: lastDayOfYear.setHours(23, 59, 59, 999),
            },
        });
    }
    else {
        throw new AppError_1.default(400, "Invalid category");
    }
    if (userData.role === "user") {
        sales = sales.filter((sale) => sale.sellerId._id.toString() === userData._id.toString());
    }
    return sales;
});
exports.SalesServices = {
    createSale,
    getAllSales,
    getSalesById,
    getSalesByCategory,
};
