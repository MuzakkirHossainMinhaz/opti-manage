"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkValidation_1 = __importDefault(require("../../middlewares/checkValidation"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = __importDefault(require("./user.validation"));
const userProfile_validation_1 = require("./userProfile.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, auth_1.default)("manager"), (0, checkValidation_1.default)(user_validation_1.default), user_controller_1.UserControllers.createUser);
router.get("/users", (0, auth_1.default)("manager"), user_controller_1.UserControllers.getAllUsers);
router.delete("/users/:id", (0, auth_1.default)("manager"), user_controller_1.UserControllers.deleteUser);
router.patch("/:id/profile", (0, auth_1.default)(), (0, checkValidation_1.default)(userProfile_validation_1.updateProfileValidationSchema), user_controller_1.UserControllers.updateProfile);
router.patch("/:id/change-password", (0, auth_1.default)(), (0, checkValidation_1.default)(userProfile_validation_1.changePasswordValidationSchema), user_controller_1.UserControllers.changePassword);
exports.UserRoutes = router;
