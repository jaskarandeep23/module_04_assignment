import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/error";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const errorHandler = (
  err: Error | null,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export default errorHandler;