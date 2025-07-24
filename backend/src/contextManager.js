import { v4 as uuidv4 } from "uuid";
import { logger } from "./utils/logger.js";
import prisma from "./utils/prisma.js";

export class ContextManager {
 async createSegment({
  id,
  type,
  content,
  sessionId,
  timestamp,
  references = [],
 }) {
  // Ensure session exists or create it
  let session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) {
   session = await prisma.session.create({
    data: {
     id: sessionId,
     createdAt: timestamp ? new Date(timestamp) : new Date(),
     lastActivity: new Date(),
    },
   });
  } else {
   await prisma.session.update({
    where: { id: sessionId },
    data: { lastActivity: new Date() },
   });
  }

  const segment = await prisma.segment.create({
   data: {
    id: id || uuidv4(),
    type,
    content,
    sessionId,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    references: references.length > 0 ? JSON.stringify(references) : null,
   },
  });
  logger.info(`Created segment ${segment.id} for session ${sessionId}`);
  return segment;
 }

 async getSegment(segmentId) {
  return await prisma.segment.findUnique({ where: { id: segmentId } });
 }

 async getSessionSegments(sessionId) {
  const segments = await prisma.segment.findMany({
   where: { sessionId },
   orderBy: { timestamp: "asc" },
  });
  return segments.map((segment) => ({
   ...segment,
   timestamp: segment.timestamp ? segment.timestamp.toISOString() : null,
  }));
 }

 async buildContext(sessionId, requestedSegments = []) {
  if (requestedSegments.length > 0) {
   return await prisma.segment.findMany({
    where: {
     id: { in: requestedSegments },
     sessionId,
    },
    orderBy: { timestamp: "asc" },
   });
  }
  return await this.getSessionSegments(sessionId);
 }

 async getAllSessions() {
  const sessions = await prisma.session.findMany({
   include: { segments: true },
   orderBy: { createdAt: "desc" },
  });
  return sessions.map((session) => ({
   ...session,
   createdAt: session.createdAt ? session.createdAt.toISOString() : null,
   lastActivity: session.lastActivity
    ? session.lastActivity.toISOString()
    : null,
   segmentCount: session.segments.length,
  }));
 }

 async deleteSession(sessionId) {
  try {
   await prisma.segment.deleteMany({ where: { sessionId } });
   await prisma.session.delete({ where: { id: sessionId } });
   logger.info(`Deleted session ${sessionId}`);
   return true;
  } catch (e) {
   return false;
  }
 }
}
