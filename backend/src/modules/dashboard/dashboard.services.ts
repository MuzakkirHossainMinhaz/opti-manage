import { JwtPayload } from "jsonwebtoken";
import { EyeGlassModel } from "../eyeGlass/eyeGlass.model";
import { SalesModel } from "../sales/sales.model";

const getManagerDashboardStats = async (userData: JwtPayload) => {
  const [allSales, totalProducts, inventoryAgg] = await Promise.all([
    SalesModel.find().populate("productId", "name price").populate("sellerId", "username role").lean(),
    EyeGlassModel.countDocuments(),
    EyeGlassModel.aggregate([
      {
        $group: {
          _id: null,
          inventoryValue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]),
  ]);

  const inventoryValue = inventoryAgg[0]?.inventoryValue || 0;

  let totalRevenue = 0;
  let totalSales = 0;

  const salesByUserMap = new Map<string, { userId: string; username: string; role: string; revenue: number }>();

  allSales.forEach((sale: any) => {
    const price = sale.productId?.price || 0;
    const quantity = sale.quantity || 0;
    const revenue = quantity * price;

    totalRevenue += revenue;
    totalSales += quantity;

    const seller = sale.sellerId as any;
    if (seller && seller._id) {
      const key = seller._id.toString();
      const existing = salesByUserMap.get(key);
      if (existing) {
        existing.revenue += revenue;
      } else {
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
      const aDate = a.saleDate ? new Date(a.saleDate as string).getTime() : 0;
      const bDate = b.saleDate ? new Date(b.saleDate as string).getTime() : 0;
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
};

const getUserDashboardStats = async (userData: JwtPayload) => {
  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);

  const [userSales, recentlyAddedItems] = await Promise.all([
    SalesModel.find({
      sellerId: userData._id as any,
    })
      .sort({ saleDate: -1 })
      .populate("productId", "name price")
      .lean(),
    EyeGlassModel.find({ createdBy: userData._id as any })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  let todaySalesCount = 0;
  let todayRevenue = 0;
  let totalRevenue = 0;

  userSales.forEach((sale: any) => {
    const price = sale.productId?.price || 0;
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
};

export const DashboardServices = {
  getManagerDashboardStats,
  getUserDashboardStats,
};
