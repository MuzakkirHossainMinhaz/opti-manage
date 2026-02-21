"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const CastErrorHandler_1 = __importDefault(require("../errors/CastErrorHandler"));
const DuplicateErrorHandler_1 = __importDefault(require("../errors/DuplicateErrorHandler"));
const ValidationErrorHandler_1 = __importDefault(require("../errors/ValidationErrorHandler"));
const ZodErrorHandler_1 = __importDefault(require("../errors/ZodErrorHandler"));
const ErrorHandler = (error, _req, res, _next) => {
    //setting default values
    let statusCode = 500;
    let message = "Internal Server Error";
    let errorMessage = "";
    let errorDetails;
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, ZodErrorHandler_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorMessage = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorMessage;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError") {
        const simplifiedError = (0, ValidationErrorHandler_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorMessage = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorMessage;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "CastError") {
        const simplifiedError = (0, CastErrorHandler_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorMessage = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorMessage;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        const simplifiedError = (0, DuplicateErrorHandler_1.default)(error);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorMessage = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorMessage;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if (error instanceof AppError_1.default) {
        if (error.message === "Unauthorized Access") {
            statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
            message = error.message;
            errorMessage = "You do not have the necessary permissions to access this resource.";
            errorDetails = null;
        }
        else {
            statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
            message = error.message;
        }
    }
    else if (error instanceof Error) {
        message = error.message;
    }
    // custom error response
    res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        errorDetails,
        stack: message === "Unauthorized Access" ? null : process.env.NODE_ENV === "DEVELOPMENT" ? error === null || error === void 0 ? void 0 : error.stack : null,
    });
};
exports.default = ErrorHandler;
