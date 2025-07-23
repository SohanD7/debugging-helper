import './src/config/env.js'; // Load environment variables and configurations
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
const PORT = process.env.PORT || 3001;3

// Security middleware
app.use(helmet());
app.use(
 cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
 })
);

// Rate limiting
const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/debug", debugRoutes);
app.use("/api/context", contextRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/api/health", (req, res) => {
 res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
 logger.info(`Server running on port ${PORT}`);
});

export default app;
