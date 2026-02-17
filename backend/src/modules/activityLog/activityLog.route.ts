import { Router } from "express";
import auth from "../../middlewares/auth";
import { ActivityLogControllers } from "./activityLog.controller";

const router = Router();

router.get("/", auth(), ActivityLogControllers.getActivityLogs);

export const ActivityLogRoutes = router;

