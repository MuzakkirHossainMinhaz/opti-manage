import bcrypt from "bcrypt";
import { UserModel } from "../modules/user/user.model";

type SeedUser = {
  fullName?: string;
  username: string;
  email: string;
  password: string;
  role: "manager" | "user";
};

export const seedUsers = async () => {
  if (!defaultUsers.length) {
    return;
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

  for (const user of defaultUsers) {
    const existing = await UserModel.findOne({ email: user.email });
    if (existing) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    await UserModel.create({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    });
  }
};

const defaultUsers: SeedUser[] = [
  {
    fullName: "Demo Manager",
    username: "manager",
    email: "manager@example.com",
    password: "Manager123!",
    role: "manager",
  },
  {
    fullName: "Demo User",
    username: "user",
    email: "user@example.com",
    password: "User123!",
    role: "user",
  },
  {
    fullName: "Ryan Dahl",
    username: "dahl",
    email: "dahl@example.com",
    password: "User123!",
    role: "user",
  },
  {
    fullName: "Brendan Eich",
    username: "eich",
    email: "eich@example.com",
    password: "User123!",
    role: "user",
  },
];
