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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardServices = void 0;
const eyeGlass_model_1 = require("../eyeGlass/eyeGlass.model");
const sales_model_1 = require("../sales/sales.model");
const getManagerDashboardStats = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [allSales, totalProducts, inventoryAgg] = yield Promise.all([
        sales_model_1.SalesModel.find().populate("productId", "name price").populate("sellerId", "username role").lean(),
        eyeGlass_model_1.EyeGlassModel.countDocuments(),
        eyeGlass_model_1.EyeGlassModel.aggregate([
            {
                $group: {
                    _id: null,
                    inventoryValue: { $sum: { $multiply: ["$quantity", "$price"] } },
                },
            },
        ]),
    ]);
    const inventoryValue = ((_a = inventoryAgg[0]) === null || _a === void 0 ? void 0 : _a.inventoryValue) || 0;
    let totalRevenue = 0;
    let totalSales = 0;
    const salesByUserMap = new Map();
    allSales.forEach((sale) => {
        var _a;
        const price = ((_a = sale.productId) === null || _a === void 0 ? void 0 : _a.price) || 0;
        const quantity = sale.quantity || 0;
        const revenue = quantity * price;
        totalRevenue += revenue;
        totalSales += quantity;
        const seller = sale.sellerId;
        if (seller && seller._id) {
            const key = seller._id.toString();
            const existing = salesByUserMap.get(key);
            if (existing) {
                existing.revenue += revenue;
            }
            else {
                salesByUserMap.set(key, {
                    userId: key,
                    username: seller.username,
                    role: seller.role,
                    revenue,
                });
            }
        }
    });
    const salesByUser = Array.from(salesByUserMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    const recentSales = [...allSales]
        .sort((a, b) => {
        const aDate = a.saleDate ? new Date(a.saleDate).getTime() : 0;
        const bDate = b.saleDate ? new Date(b.saleDate).getTime() : 0;
        return bDate - aDate;
    })
        .slice(0, 10);
    return {
        totalRevenue,
        totalSales,
        totalProducts,
        inventoryValue,
        salesByUser,
        recentSales,
    };
});
const getUserDashboardStats = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const todayString = today.toISOString().slice(0, 10);
    const [userSales, recentlyAddedItems] = yield Promise.all([
        sales_model_1.SalesModel.find({
            sellerId: userData._id,
        })
            .sort({ saleDate: -1 })
            .populate("productId", "name price")
            .lean(),
        eyeGlass_model_1.EyeGlassModel.find({ createdBy: userData._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
    ]);
    let todaySalesCount = 0;
    let todayRevenue = 0;
    let totalRevenue = 0;
    userSales.forEach((sale) => {
        var _a;
        const price = ((_a = sale.productId) === null || _a === void 0 ? void 0 : _a.price) || 0;
        const quantity = sale.quantity || 0;
        const revenue = quantity * price;
        totalRevenue += revenue;
        if (sale.saleDate === todayString) {
            todaySalesCount += quantity;
            todayRevenue += revenue;
        }
    });
    const recentSales = userSales.slice(0, 10);
    return {
        todaySalesCount,
        todayRevenue,
        totalRevenue,
        recentSales,
        recentlyAddedItems,
    };
});
exports.DashboardServices = {
    getManagerDashboardStats,
    getUserDashboardStats,
};
