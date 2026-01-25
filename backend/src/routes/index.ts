import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { EyeGlassRoutes } from "../modules/eyeGlass/eyeGlass.route";
import { SalesRoutes } from "../modules/sales/sales.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/auth", UserRoutes);
router.use("/eye-glasses", EyeGlassRoutes);
router.use("/sales", SalesRoutes);

export default router;
