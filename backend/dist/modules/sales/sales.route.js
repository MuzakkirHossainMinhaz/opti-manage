"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const sales_controller_1 = require("./sales.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(), sales_controller_1.SalesController.createSale);
router.get("/", (0, auth_1.default)(), sales_controller_1.SalesController.getAllSales);
router.get("/:id", (0, auth_1.default)(), sales_controller_1.SalesController.getSalesById);
// router.get("/:category", auth(), SalesController.getSalesByCategory);
exports.SalesRoutes = router;
