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
exports.EyeGlassServices = void 0;
const queryBuilder_1 = require("../../builder/queryBuilder");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sales_model_1 = require("../sales/sales.model");
const eyeGlass_model_1 = require("./eyeGlass.model");
const activityLog_services_1 = require("../activityLog/activityLog.services");
const createEyeGlass = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.createdBy = userData._id;
    const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.create(payload);
    yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "CREATE", `EyeGlass ${eyeGlass._id.toString()} created by ${userData.username}`);
    return eyeGlass;
});
const deleteEyeGlassByIds = (userData, eyeGlassIds) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlasses = [];
    for (const eyeGlassId of eyeGlassIds) {
        if (userData.role !== "manager") {
            const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findOneAndDelete({
                _id: eyeGlassId,
                createdBy: userData._id,
            });
            if (!eyeGlass) {
                throw new AppError_1.default(400, "Eye Glass not found or you do not have permission to delete it.");
            }
            if (eyeGlass) {
                eyeGlasses.push(eyeGlass);
                yield sales_model_1.SalesModel.deleteMany({ eyeGlassId: eyeGlass._id });
                yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "DELETE", `EyeGlass ${eyeGlass._id.toString()} deleted by ${userData.username}`);
            }
        }
        else {
            const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findByIdAndDelete(eyeGlassId);
            if (eyeGlass) {
                eyeGlasses.push(eyeGlass);
                yield sales_model_1.SalesModel.deleteMany({ eyeGlassId: eyeGlass._id });
                yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "DELETE", `EyeGlass ${eyeGlass._id.toString()} deleted by ${userData.username}`);
            }
        }
    }
    return eyeGlasses;
});
const updateEyeGlassById = (eyeGlassId, userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let eyeGlass;
    if (userData.role === "user") {
        eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findOneAndUpdate({ _id: eyeGlassId, createdBy: userData._id }, payload, {
            new: true,
        });
    }
    else {
        eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findByIdAndUpdate(eyeGlassId, payload, { new: true });
    }
    if (!eyeGlass) {
        throw new AppError_1.default(400, "Eye Glass not found or you do not have permission to update it.");
    }
    yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: userData._id, username: userData.username, role: userData.role }, "UPDATE", `EyeGlass ${eyeGlass._id.toString()} updated by ${userData.username}`);
    return eyeGlass;
});
const getAllEyeGlasses = (_userData, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { eyeGlasses, total } = yield (0, queryBuilder_1.queryBuilder)(queryParams, eyeGlass_model_1.EyeGlassModel);
    return { eyeGlasses, total };
});
const reassignEyeGlassOwner = (eyeGlassId, managerData, newOwnerId) => __awaiter(void 0, void 0, void 0, function* () {
    if (managerData.role !== "manager") {
        throw new AppError_1.default(403, "Only managers can reassign ownership");
    }
    const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findById(eyeGlassId);
    if (!eyeGlass) {
        throw new AppError_1.default(404, "Eye Glass not found");
    }
    eyeGlass.createdBy = newOwnerId;
    yield eyeGlass.save();
    yield activityLog_services_1.ActivityLogServices.createActivityLog({ _id: managerData._id, username: managerData.username, role: managerData.role }, "UPDATE", `Ownership of eye glass ${eyeGlass._id.toString()} reassigned to user ${newOwnerId.toString()}`);
    return eyeGlass;
});
const getEyeGlassById = (eyeGlassId) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlass = yield eyeGlass_model_1.EyeGlassModel.findById(eyeGlassId).populate({
        path: "createdBy",
        select: "-createdAt -updatedAt",
    });
    return eyeGlass;
});
exports.EyeGlassServices = {
    createEyeGlass,
    deleteEyeGlassByIds,
    updateEyeGlassById,
    getAllEyeGlasses,
    getEyeGlassById,
    reassignEyeGlassOwner,
};
