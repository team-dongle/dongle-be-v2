import { StatusCodes } from "http-status-codes";

export const errorMiddleware = (error, _req, res, next) => {
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    code: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message,
  });
};
