class BaseError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  public constructor(
    message: string,
    statusCode: number,
    isOperational: boolean,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export class ApiError extends BaseError {
  public constructor(
    message: string,
    statusCode: number,
    isOperational = true,
  ) {
    super(message, statusCode, isOperational);
  }
}
