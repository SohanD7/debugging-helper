import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";

export class ContextManager {
 constructor() {
  // In-memory storage for demo (use database in production)
  this.segments = new Map();
  this.sessions = new Map();
 }

 createSegment({ id, type, content, sessionId, timestamp, references = [] }) {
  const segment = {
   id: id || uuidv4(),
   type,
   content,
   sessionId,
   timestamp,
   references,
   metadata: {
    createdAt: new Date().toISOString(),
    version: "1.0",
   },
  };

  this.segments.set(segment.id, segment);

  // Add to session
  if (!this.sessions.has(sessionId)) {
   this.sessions.set(sessionId, {
    id: sessionId,
    segments: [],
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
   });
  }

  const session = this.sessions.get(sessionId);
  session.segments.push(segment.id);
  session.lastActivity = new Date().toISOString();

  logger.info(`Created segment ${segment.id} for session ${sessionId}`);
  return segment;
 }

 getSegment(segmentId) {
  return this.segments.get(segmentId);
 }

 getSessionSegments(sessionId) {
  const session = this.sessions.get(sessionId);
  if (!session) return [];

  return session.segments.map((segmentId) => this.segments.get(segmentId));
 }

 buildContext(sessionId, requestedSegments = []) {
  const allSegments = this.getSessionSegments(sessionId);

  if (requestedSegments.length > 0) {
   return requestedSegments
    .map((segmentId) => this.segments.get(segmentId))
    .filter(Boolean);
  }

  // Return all segments in chronological order
  return allSegments.sort(
   (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
 }

 getAllSessions() {
  return Array.from(this.sessions.values()).map((session) => ({
   ...session,
   segmentCount: session.segments.length,
  }));
 }

 deleteSession(sessionId) {
  const session = this.sessions.get(sessionId);
  if (session) {
   // Delete all segments
   session.segments.forEach((segmentId) => {
    this.segments.delete(segmentId);
   });
   this.sessions.delete(sessionId);
   logger.info(`Deleted session ${sessionId}`);
   return true;
  }
  return false;
 }
}
