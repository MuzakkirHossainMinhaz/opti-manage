import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { EyeGlassRoutes } from "../modules/eyeGlass/eyeGlass.route";
import { SalesRoutes } from "../modules/sales/sales.route";
import { UserRoutes } from "../modules/user/user.route";
import { ActivityLogRoutes } from "../modules/activityLog/activityLog.route";
import { OwnershipRequestRoutes } from "../modules/ownershipRequest/ownershipRequest.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/auth", UserRoutes);
router.use("/eye-glasses", EyeGlassRoutes);
router.use("/sales", SalesRoutes);
router.use("/activity-logs", ActivityLogRoutes);
router.use("/ownership-requests", OwnershipRequestRoutes);
router.use("/dashboard", DashboardRoutes);

export default router;
