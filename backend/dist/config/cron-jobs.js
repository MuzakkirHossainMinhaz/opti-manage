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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = void 0;
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../modules/user/user.model");
const seedProducts_1 = require("../utils/seedProducts");
const seedUsers_1 = require("../utils/seedUsers");
const THREE_HOURS_IN_MS = 3 * 60 * 60 * 1000;
const resetDatabaseAndSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.connection.db) {
            return;
        }
        console.log("🔁 [CRON] Resetting database and seeding default data...");
        yield mongoose_1.default.connection.db.dropDatabase();
        yield (0, seedUsers_1.seedUsers)();
        const manager = yield user_model_1.UserModel.findOne({ role: "manager" }).lean();
        const users = yield user_model_1.UserModel.find({ role: "user" }).lean();
        if (manager && users.length) {
            yield (0, seedProducts_1.seedProduct)({
                managerId: manager._id.toString(),
                userIds: users.map((u) => u._id.toString()),
            });
        }
        console.log("✅ [CRON] Database reset and seeding completed.");
    }
    catch (error) {
        console.error("❌ [CRON] Failed to reset and seed database:", error);
    }
});
const initCronJobs = () => {
    setInterval(resetDatabaseAndSeed, THREE_HOURS_IN_MS);
};
exports.initCronJobs = initCronJobs;
