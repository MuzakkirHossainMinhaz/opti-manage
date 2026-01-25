import express from "express";
import auth from "../../middlewares/auth";
import { SalesController } from "./sales.controller";
const router = express.Router();

router.post("/create", auth(), SalesController.createSale);
router.get("/", auth(), SalesController.getAllSales);
router.get("/:id", auth(), SalesController.getSalesById);
// router.get("/:category", auth(), SalesController.getSalesByCategory);

export const SalesRoutes = router;
