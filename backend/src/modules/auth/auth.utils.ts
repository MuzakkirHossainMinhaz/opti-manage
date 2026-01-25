import jwt, { SignOptions } from "jsonwebtoken";
import { IJWTPayload } from "./auth.interface";

export const createJWT = (payload: IJWTPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "1d"; // Default to 1 day if not set

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  const options: SignOptions = {};
  if (expiresIn) {
    options.expiresIn = 24 * 60 * 60; // JWT accepts string like '1d' or number (in seconds)
  }

  return jwt.sign(payload, secret, options);
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as IJWTPayload;
};
