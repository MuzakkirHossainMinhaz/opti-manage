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
exports.ActivityLogServices = void 0;
const activityLog_model_1 = require("./activityLog.model");
const createActivityLog = (userData, action, target) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData || !userData._id) {
        return;
    }
    yield activityLog_model_1.ActivityLogModel.create({
        action,
        target,
        user: userData._id,
        timestamp: new Date(),
    });
});
const getActivityLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const logs = yield activityLog_model_1.ActivityLogModel.find().sort({ timestamp: -1 }).populate("user", "username role");
    return logs;
});
exports.ActivityLogServices = {
    createActivityLog,
    getActivityLogs,
};
