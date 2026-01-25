/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "../errors/AppError";
import CastErrorHandler from "../errors/CastErrorHandler";
import DuplicateErrorHandler from "../errors/DuplicateErrorHandler";
import ValidationErrorHandler from "../errors/ValidationErrorHandler";
import ZodErrorHandler from "../errors/ZodErrorHandler";

const ErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  //setting default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorMessage: string = "";
  let errorDetails: any;

  if (error instanceof ZodError) {
    const simplifiedError = ZodErrorHandler(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
    errorDetails = simplifiedError?.errorDetails;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = ValidationErrorHandler(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
    errorDetails = simplifiedError?.errorDetails;
  } else if (error?.name === "CastError") {
    const simplifiedError = CastErrorHandler(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
    errorDetails = simplifiedError?.errorDetails;
  } else if (error?.code === 11000) {
    const simplifiedError = DuplicateErrorHandler(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
    errorDetails = simplifiedError?.errorDetails;
  } else if (error instanceof AppError) {
    if (error.message === "Unauthorized Access") {
      statusCode = error?.statusCode;
      message = error.message;
      errorMessage = "You do not have the necessary permissions to access this resource.";
      errorDetails = null;
    } else {
      statusCode = error?.statusCode;
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  // custom error response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack: message === "Unauthorized Access" ? null : process.env.NODE_ENV === "DEVELOPMENT" ? error?.stack : null,
  });
};

export default ErrorHandler;
