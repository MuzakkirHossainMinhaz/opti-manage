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
exports.OwnershipRequestControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ownershipRequest_services_1 = require("./ownershipRequest.services");
const createOwnershipRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownershipRequest = yield ownershipRequest_services_1.OwnershipRequestServices.createOwnershipRequest(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Ownership request created successfully",
        data: ownershipRequest,
    });
}));
const getOwnershipRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownershipRequests = yield ownershipRequest_services_1.OwnershipRequestServices.getOwnershipRequests(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Ownership requests fetched successfully",
        data: ownershipRequests,
    });
}));
const updateOwnershipRequestStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const ownershipRequest = yield ownershipRequest_services_1.OwnershipRequestServices.updateOwnershipRequestStatus(req.user, id, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Ownership request updated successfully",
        data: ownershipRequest,
    });
}));
exports.OwnershipRequestControllers = {
    createOwnershipRequest,
    getOwnershipRequests,
    updateOwnershipRequestStatus,
};
