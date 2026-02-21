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
exports.seedUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../modules/user/user.model");
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!defaultUsers.length) {
        return;
    }
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    for (const user of defaultUsers) {
        const existing = yield user_model_1.UserModel.findOne({ email: user.email });
        if (existing) {
            continue;
        }
        const hashedPassword = yield bcrypt_1.default.hash(user.password, saltRounds);
        yield user_model_1.UserModel.create({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            password: hashedPassword,
            role: user.role,
        });
    }
});
exports.seedUsers = seedUsers;
const defaultUsers = [
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
