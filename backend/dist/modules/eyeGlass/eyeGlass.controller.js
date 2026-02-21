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
exports.EyeGlassControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const eyeGlass_services_1 = require("./eyeGlass.services");
const createEyeGlass = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlasses = yield eyeGlass_services_1.EyeGlassServices.createEyeGlass(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Eye Glass created successfully",
        data: eyeGlasses,
    });
}));
const deleteEyeGlassByIds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eyeGlassIds } = req.body;
    const eyeGlasses = yield eyeGlass_services_1.EyeGlassServices.deleteEyeGlassByIds(req.user, eyeGlassIds);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Eye Glass deleted successfully",
        data: eyeGlasses,
    });
}));
const updateEyeGlassById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlassId = req.params.eyeGlassId;
    const eyeGlass = yield eyeGlass_services_1.EyeGlassServices.updateEyeGlassById(eyeGlassId, req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Eye Glass updated successfully",
        data: eyeGlass,
    });
}));
const getAllEyeGlasses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryParams = req.query;
    const { page, limit, price, templeLength, bridgeWidth } = queryParams;
    const { eyeGlasses, total } = yield eyeGlass_services_1.EyeGlassServices.getAllEyeGlasses(req.user, Object.assign(Object.assign({}, queryParams), { price: price
            ? String(price)
                .split(",")
                .map((item) => Number(item))
            : undefined, templeLength: templeLength
            ? String(templeLength)
                .split(",")
                .map((item) => Number(item))
            : undefined, bridgeWidth: bridgeWidth
            ? String(bridgeWidth)
                .split(",")
                .map((item) => Number(item))
            : undefined }));
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Eye Glasses fetched successfully",
        meta: {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            total,
            totalPages: Math.ceil(total / (Number(limit) || 10)),
        },
        data: eyeGlasses,
    });
}));
const getEyeGlassById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlassId = req.params.eyeGlassId;
    const eyeGlass = yield eyeGlass_services_1.EyeGlassServices.getEyeGlassById(eyeGlassId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Eye Glass fetched successfully",
        data: eyeGlass,
    });
}));
const reassignEyeGlassOwner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eyeGlassId = req.params.eyeGlassId;
    const { newOwnerId } = req.body;
    const eyeGlass = yield eyeGlass_services_1.EyeGlassServices.reassignEyeGlassOwner(eyeGlassId, req.user, newOwnerId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Eye Glass ownership reassigned successfully",
        data: eyeGlass,
    });
}));
exports.EyeGlassControllers = {
    createEyeGlass,
    deleteEyeGlassByIds,
    updateEyeGlassById,
    getAllEyeGlasses,
    getEyeGlassById,
    reassignEyeGlassOwner,
};
