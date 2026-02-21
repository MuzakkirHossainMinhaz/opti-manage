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
exports.OwnershipRequestServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const eyeGlass_model_1 = require("../eyeGlass/eyeGlass.model");
const activityLog_services_1 = require("../activityLog/activityLog.services");
const ownershipRequest_model_1 = require("./ownershipRequest.model");
const createOwnershipRequest = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findById(payload.eyeGlassId);
    if (!eyeGlass || !eyeGlass.createdBy) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Eye Glass not found");
    }
    if (eyeGlass.createdBy.toString() === userData._id.toString()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already own this eye glass");
    }
    const existingPending = yield ownershipRequest_model_1.OwnershipRequestModel.findOne({
        eyeGlass: eyeGlass._id,
        fromUser: userData._id,
        status: "pending",
    });
    if (existingPending) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already have a pending request for this eye glass");
    }
    const ownershipRequest = yield ownershipRequest_model_1.OwnershipRequestModel.create({
        eyeGlass: eyeGlass._id,
        fromUser: userData._id,
        toUser: eyeGlass.createdBy,
        status: "pending",
        message: payload.message,
    });
    yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "CREATE", `Ownership request ${ownershipRequest._id.toString()} created for eye glass ${eyeGlass._id.toString()}`);
    return ownershipRequest;
});
const getOwnershipRequests = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (userData.role === "user") {
        filter.$or = [{ fromUser: userData._id }, { toUser: userData._id }];
    }
    const requests = yield ownershipRequest_model_1.OwnershipRequestModel.find(filter)
        .sort({ createdAt: -1 })
        .populate("eyeGlass", "name")
        .populate("fromUser", "username role")
        .populate("toUser", "username role");
    return requests;
});
const updateOwnershipRequestStatus = (userData, id, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (userData.role !== "manager") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only managers can update ownership requests");
    }
    const ownershipRequest = yield ownershipRequest_model_1.OwnershipRequestModel.findById(id);
    if (!ownershipRequest) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Ownership request not found");
    }
    ownershipRequest.status = status;
    yield ownershipRequest.save();
    if (status === "approved") {
        const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findById(ownershipRequest.eyeGlass);
        if (!eyeGlass) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Eye Glass not found");
        }
        eyeGlass.createdBy = ownershipRequest.fromUser;
        yield eyeGlass.save();
        yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "UPDATE", `Ownership of eye glass ${eyeGlass._id.toString()} transferred to user ${ownershipRequest.fromUser.toString()}`);
    }
    yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "UPDATE", `Ownership request ${ownershipRequest._id.toString()} updated to status ${status}`);
    return ownershipRequest;
});
exports.OwnershipRequestServices = {
    createOwnershipRequest,
    getOwnershipRequests,
    updateOwnershipRequestStatus,
};
