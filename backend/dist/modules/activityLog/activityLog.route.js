"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const activityLog_controller_1 = require("./activityLog.controller");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(), activityLog_controller_1.ActivityLogControllers.getActivityLogs);
exports.ActivityLogRoutes = router;
