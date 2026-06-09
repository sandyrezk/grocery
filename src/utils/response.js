/**
 * Send a success response
 */
export const sendSuccess = (
  res,
  statusCode = 200,
  message = "Success",
  data = null
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
  res,
  statusCode = 500,
  message = "Something went wrong"
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Custom App Error
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";

    Error.captureStackTrace?.(this, this.constructor);
  }
}