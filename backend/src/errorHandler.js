import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
 logger.error({
  message: err.message,
  stack: err.stack,
  url: req.url,
  method: req.method,
  ip: req.ip,
 });

 res.status(err.status || 500).json({
  error:
   process.env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message,
  timestamp: new Date().toISOString(),
 });
};
