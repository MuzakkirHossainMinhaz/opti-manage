"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CastErrorHandler = (error) => {
    // extract the value of the error message
    const match = error.message.match(/"([^"]*)"/);
    // get the value
    const extractedMessage = match && match[1];
    const statusCode = 400;
    return {
        statusCode,
        message: "Invalid ID",
        errorMessage: `${extractedMessage} is not a valid ID!`,
        errorDetails: error,
    };
};
exports.default = CastErrorHandler;
