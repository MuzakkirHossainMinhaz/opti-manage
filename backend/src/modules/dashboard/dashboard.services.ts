import { JwtPayload } from "jsonwebtoken";
import { EyeGlassModel } from "../eyeGlass/eyeGlass.model";
import { SalesModel } from "../sales/sales.model";

const getManagerDashboardStats = async (_userData: JwtPayload) => {
  const [totalRevenueResult, totalSales, totalInventory, totalProducts, salesByUser] = await Promise.all([
    SalesModel.aggregate([{ $group: { _id: null, revenue: { $sum: { $multiply: ["$quantity", "$productPrice"] } } } }]),
    SalesModel.countDocuments(),
    EyeGlassModel.aggregate([
      {
        $group: {
          _id: null,
          inventoryValue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]),
    EyeGlassModel.countDocuments(),
    SalesModel.aggregate([
      {
        $group: {
          _id: "$sellerId",
          revenue: { $sum: { $multiply: ["$quantity", "$productPrice"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const totalRevenue = totalRevenueResult[0]?.revenue || 0;
  const inventoryValue = totalInventory[0]?.inventoryValue || 0;

  const salesByUserPopulated = await SalesModel.populate(salesByUser, {
    path: "_id",
    select: "username role",
    model: "User",
  });

  return {
    totalRevenue,
    totalSales,
    totalProducts,
    inventoryValue,
    salesByUser: salesByUserPopulated.map((item: any) => ({
      userId: item._id?._id,
      username: item._id?.username,
      role: item._id?.role,
      revenue: item.revenue,
    })),
  };
};

const getUserDashboardStats = async (userData: JwtPayload) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  const [todaySalesAgg, recentSales, recentlyAddedItems, totalRevenueAgg] = await Promise.all([
    SalesModel.aggregate([
      {
        $match: {
          sellerId: userData._id as any,
          saleDate: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: { $multiply: ["$quantity", "$productPrice"] } },
        },
      },
    ]),
    SalesModel.find({
      sellerId: userData._id as any,
    })
      .sort({ saleDate: -1 })
      .limit(10)
      .populate("productId", "name price")
      .lean(),
    EyeGlassModel.find({ createdBy: userData._id as any }).sort({ createdAt: -1 }).limit(10).lean(),
    SalesModel.aggregate([
      { $match: { sellerId: userData._id as any } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$quantity", "$productPrice"] } },
        },
      },
    ]),
  ]);

  const todayStats = todaySalesAgg[0] || { totalQuantity: 0, totalRevenue: 0 };
  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

  return {
    todaySalesCount: todayStats.totalQuantity || 0,
    todayRevenue: todayStats.totalRevenue || 0,
    totalRevenue,
    recentSales,
    recentlyAddedItems,
  };
};

export const DashboardServices = {
  getManagerDashboardStats,
  getUserDashboardStats,
};

