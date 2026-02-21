"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = (payload) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "1d"; // Default to 1 day if not set
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    const options = {};
    if (expiresIn) {
        options.expiresIn = 24 * 60 * 60; // JWT accepts string like '1d' or number (in seconds)
    }
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.createJWT = createJWT;
const verifyJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
};
exports.verifyJWT = verifyJWT;
