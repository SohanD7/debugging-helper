import express from "express";
import MCPService from "../mcpService.js";
import { logger } from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const mcpService = new MCPService();

// Analyze code input (diff, stack trace, or commit message)
router.post("/analyze", async (req, res) => {
 try {
  const {
   type,
   content,
   sessionId = uuidv4(),
   contextSegments = [],
  } = req.body;

  if (!type || !content) {
   return res.status(400).json({ error: "Type and content are required" });
  }

  let result;

  switch (type) {
   case "diff":
    result = await mcpService.analyzeDiff(content, sessionId, contextSegments);
    break;
   case "stacktrace":
    result = await mcpService.analyzeStackTrace(
     content,
     sessionId,
     contextSegments
    );
    break;
   case "commit":
    // Treat commit messages as diffs for now
    result = await mcpService.analyzeDiff(content, sessionId, contextSegments);
    break;
   default:
    return res
     .status(400)
     .json({ error: "Invalid type. Use: diff, stacktrace, or commit" });
  }

  res.json({
   success: true,
   sessionId: result.sessionId,
   analysis: result.analysis,
   segments: result.segments,
   timestamp: new Date().toISOString(),
  });
 } catch (error) {
  logger.error("Error in /analyze:", error);
  res.status(500).json({ error: "Internal server error" });
 }
});

// Get session details
router.get("/session/:sessionId", async (req, res) => {
 try {
  const { sessionId } = req.params;
  const history = await mcpService.getSessionHistory(sessionId);

  res.json({
   success: true,
   sessionId,
   history,
   segmentCount: history.length,
  });
 } catch (error) {
  logger.error("Error getting session:", error);
  res.status(500).json({ error: "Internal server error" });
 }
});

export default router;
