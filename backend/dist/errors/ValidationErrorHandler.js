"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationErrorHandler = (error) => {
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation Error",
        errorMessage: error.message,
        errorDetails: error.errors,
    };
};
exports.default = ValidationErrorHandler;
