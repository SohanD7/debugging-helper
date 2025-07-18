import express from "express";
import MCPService from "../services/mcpService.js";

const router = express.Router();
const mcpService = new MCPService();

// Get context segments for a session
router.get("/segments", async (req, res) => {
 try {
  const { sessionId } = req.query;

  if (!sessionId) {
   return res.status(400).json({ error: "Session ID is required" });
  }

  const segments = await mcpService.getSessionHistory(sessionId);

  res.json({
   success: true,
   segments,
   count: segments.length,
  });
 } catch (error) {
  res.status(500).json({ error: "Internal server error" });
 }
});

export default router;
