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
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.UserModel.findOne({ email: payload.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS));
    payload.password = hashedPassword;
    const user = yield user_model_1.UserModel.create(payload);
    return user;
});
const updateProfile = (userId, updaterRole, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = {};
    if (payload.fullName !== undefined) {
        updateData.fullName = payload.fullName;
    }
    if (updaterRole === "manager") {
        if (payload.username !== undefined) {
            updateData.username = payload.username;
        }
        if (payload.email !== undefined) {
            updateData.email = payload.email;
        }
    }
    const user = yield user_model_1.UserModel.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId).select("+password");
    if (!user || !user.password) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access");
    }
    const isPasswordMatched = yield user_model_1.UserModel.isPasswordMatched(currentPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Current password is incorrect");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS));
    user.password = hashedPassword;
    yield user.save();
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.UserModel.find().select("-password");
    return users;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findByIdAndDelete(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
});
exports.UserServices = {
    createUser,
    updateProfile,
    changePassword,
    getAllUsers,
    deleteUser,
};
