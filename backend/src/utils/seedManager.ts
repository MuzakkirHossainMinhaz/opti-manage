import bcrypt from "bcrypt";
import { UserModel } from "../modules/user/user.model";

export const seedManager = async () => {
  const userCount = await UserModel.countDocuments();
  if (userCount > 0) {
    return;
  }

  const username = process.env.SEED_MANAGER_USERNAME;
  const email = process.env.SEED_MANAGER_EMAIL;
  const password = process.env.SEED_MANAGER_PASSWORD;

  if (!username || !email || !password) {
    throw new Error("Seed manager user credentials are not set in environment variables.");
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

  await UserModel.create({
    username,
    email,
    password: hashedPassword,
    role: "manager",
  });
};
