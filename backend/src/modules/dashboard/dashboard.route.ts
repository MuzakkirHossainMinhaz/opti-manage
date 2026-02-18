import { Router } from "express";
import auth from "../../middlewares/auth";
import { DashboardControllers } from "./dashboard.controller";

const router = Router();

router.get("/", auth(), DashboardControllers.getDashboardStats);

export const DashboardRoutes = router;
