"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnershipRequestRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkValidation_1 = __importDefault(require("../../middlewares/checkValidation"));
const ownershipRequest_controller_1 = require("./ownershipRequest.controller");
const ownershipRequest_validation_1 = require("./ownershipRequest.validation");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(), (0, checkValidation_1.default)(ownershipRequest_validation_1.ownershipRequestValidationSchemas.createOwnershipRequestSchema), ownershipRequest_controller_1.OwnershipRequestControllers.createOwnershipRequest);
router.get("/", (0, auth_1.default)(), ownershipRequest_controller_1.OwnershipRequestControllers.getOwnershipRequests);
router.patch("/:id/status", (0, auth_1.default)("manager"), (0, checkValidation_1.default)(ownershipRequest_validation_1.ownershipRequestValidationSchemas.updateOwnershipRequestStatusSchema), ownershipRequest_controller_1.OwnershipRequestControllers.updateOwnershipRequestStatus);
exports.OwnershipRequestRoutes = router;
