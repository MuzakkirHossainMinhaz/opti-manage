import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const checkValidation = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // parse the request body
      await schema.parseAsync(req.body);

      // if no error, pass the request to the next middleware
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkValidation;
