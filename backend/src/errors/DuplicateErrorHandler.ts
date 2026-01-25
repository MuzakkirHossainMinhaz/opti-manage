import { IErrorResponse } from "../interfaces";

const DuplicateErrorHandler = (error: any): IErrorResponse => {
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

export default DuplicateErrorHandler;
