import { ZodError, ZodIssue } from "zod";
import { IErrorResponse } from "../interfaces";

const ZodErrorHandler = (error: ZodError): IErrorResponse => {
  let errorMessages: string = "";

  error.issues.forEach((issue: ZodIssue, index: number) => {
    errorMessages += `${index !== 0 ? " " : ""}${String(issue?.path[issue.path.length - 1])} is required.`;
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessage: errorMessages,
    errorDetails: error,
  };
};

export default ZodErrorHandler;
