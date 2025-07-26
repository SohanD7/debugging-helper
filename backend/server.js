import "./src/config/env.js"; // Load environment variables and configurations
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import debugRoutes from "./src/routes/debug.js";
import contextRoutes from "./src/routes/context.js";
import historyRoutes from "./src/routes/history.js";
import { errorHandler } from "./src/errorHandler.js";
import { logger } from "./src/utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Log environment info
logger.info(`Starting server on port ${PORT}`);
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);

const allowedOrigins = [
 "https://debugging-helper.vercel.app",
 "http://localhost:3000", // for local dev
 "https://debugging-helper-backend.onrender.com",
];

// Add FRONTEND_URL to allowed origins if it exists
if (
 process.env.FRONTEND_URL &&
 !allowedOrigins.includes(process.env.FRONTEND_URL)
) {
 allowedOrigins.push(process.env.FRONTEND_URL);
}

logger.info(`Allowed origins: ${allowedOrigins.join(", ")}`);

const corsOptions = {
 origin: function (origin, callback) {
  logger.info(`Incoming request from origin: ${origin}`);

  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) {
   logger.info(`Origin ${origin} allowed (no origin)`);
   return callback(null, true);
  }

  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
   logger.info(`Origin ${origin} allowed`);
   return callback(null, true);
  }

  logger.warn(`Origin ${origin} not allowed by CORS`);
  return callback(new Error(`Origin ${origin} not allowed by CORS`));
 },
 credentials: true,
 methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
 allowedHeaders: ["Content-Type", "Authorization"],
};

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
 logger.info(
  `${req.method} ${req.path} - Origin: ${req.get("Origin") || "No Origin"}`
 );
 next();
});

// Routes
app.use("/api/debug", debugRoutes);
app.use("/api/context", contextRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/api/health", (req, res) => {
 logger.info("Health check requested");
 res.json({
  status: "healthy",
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV,
  allowedOrigins,
 });
});

// Root route for debugging
app.get("/", (req, res) => {
 res.json({
  message: "Backend API is running",
  endpoints: ["/api/debug", "/api/context", "/api/history", "/api/health"],
  timestamp: new Date().toISOString(),
 });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
 logger.info(`Server running on port ${PORT}`);
 logger.info(`Health check available at: http://localhost:${PORT}/api/health`);
});

export default app;
