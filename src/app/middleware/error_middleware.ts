import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../utils/error';
import { responseErrorWithMessage } from '../../utils/response';

export default function errorHandlerMiddleware(error: Error, req: Request, res: Response, next: NextFunction): Response {
  if (error instanceof ValidationError) {
    return res.status(400).json(responseErrorWithMessage(error.message));
  }
  console.log(error);
  return res.status(400).json(responseErrorWithMessage());
}
