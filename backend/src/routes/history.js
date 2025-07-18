import express from "express";
import MCPService from "../services/mcpService.js";

const router = express.Router();
const mcpService = new MCPService();

// Get all sessions
router.get("/sessions", async (req, res) => {
 try {
  const sessions = mcpService.contextManager.getAllSessions();

  res.json({
   success: true,
   sessions,
   count: sessions.length,
  });
 } catch (error) {
  res.status(500).json({ error: "Internal server error" });
 }
});

// Delete a session
router.delete("/session/:sessionId", async (req, res) => {
 try {
  const { sessionId } = req.params;
  const deleted = mcpService.contextManager.deleteSession(sessionId);

  if (deleted) {
   res.json({ success: true, message: "Session deleted" });
  } else {
   res.status(404).json({ error: "Session not found" });
  }
 } catch (error) {
  res.status(500).json({ error: "Internal server error" });
 }
});

export default router;
