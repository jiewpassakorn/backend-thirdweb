import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    statusCode: statusCode,
    message: err.message
  });
}
