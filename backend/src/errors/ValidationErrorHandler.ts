import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces";

const ValidationErrorHandler = (error: mongoose.Error.ValidationError): IErrorResponse => {
  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessage: error.message,
    errorDetails: error.errors,
  };
};

export default ValidationErrorHandler;
