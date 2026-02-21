/* eslint-disable no-console */
import mongoose from "mongoose";
import { UserModel } from "../modules/user/user.model";
import { seedProduct } from "../utils/seedProducts";
import { seedUsers } from "../utils/seedUsers";

const THREE_HOURS_IN_MS = 3 * 60 * 60 * 1000;

const resetDatabaseAndSeed = async () => {
  try {
    if (!mongoose.connection.db) {
      return;
    }

    console.log("🔁 [CRON] Resetting database and seeding default data...");

    await mongoose.connection.db.dropDatabase();

    await seedUsers();

    const manager = await UserModel.findOne({ role: "manager" }).lean();
    const users = await UserModel.find({ role: "user" }).lean();

    if (manager && users.length) {
      await seedProduct({
        managerId: manager._id.toString(),
        userIds: users.map((u) => u._id.toString()),
      });
    }

    console.log("✅ [CRON] Database reset and seeding completed.");
  } catch (error) {
    console.error("❌ [CRON] Failed to reset and seed database:", error);
  }
};

export const initCronJobs = () => {
  setInterval(resetDatabaseAndSeed, THREE_HOURS_IN_MS);
};
