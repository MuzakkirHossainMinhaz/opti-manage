import bcrypt from "bcrypt";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUser = async (payload: IUser) => {
  const existingUser = await UserModel.findOne({ email: payload.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS));

  payload.password = hashedPassword;

  const user = await UserModel.create(payload);

  return user;
};

export const UserServices = {
  createUser,
};
