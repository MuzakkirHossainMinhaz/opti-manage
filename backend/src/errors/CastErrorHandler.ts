import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces";

const CastErrorHandler = (error: mongoose.Error.CastError): IErrorResponse => {
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

export default CastErrorHandler;
