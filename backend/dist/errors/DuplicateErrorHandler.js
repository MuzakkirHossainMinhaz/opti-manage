"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DuplicateErrorHandler = (error) => {
    // extract the value of the error message
    const match = error.message.match(/"([^"]*)"/);
    // get the value
    const extractedMessage = match && match[1];
    const statusCode = 400;
    return {
        statusCode,
        message: "Duplicate Data Provided",
        errorMessage: `${extractedMessage} is already exists`,
        errorDetails: error,
    };
};
exports.default = DuplicateErrorHandler;
