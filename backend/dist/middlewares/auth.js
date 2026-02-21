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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth_utils_1 = require("../modules/auth/auth.utils");
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...roles) => {
    return (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // check if the token is present
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access");
        }
        // check if the token is valid
        const { _id, username, role, exp } = (0, auth_utils_1.verifyJWT)(token);
        // check if the user exists
        const user = yield user_model_1.UserModel.findOne({ _id, username, role }).select("-password -createdAt -updatedAt");
        if (!user) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access");
        }
        // check if the token is not expired
        if (Date.now() >= exp * 1000) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access");
        }
        // set user
        req.user = user;
        if (roles.length && !roles.includes(user.role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Forbidden Access");
        }
        next();
    }));
};
exports.default = auth;
