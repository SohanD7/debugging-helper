import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OpenAI } from "openai";
import { logger } from "./utils/logger.js";
import { ContextManager } from "./contextManager.js";

class MCPService {
 constructor() {
  this.openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
  });
  this.contextManager = new ContextManager();
  this.server = new McpServer({
   name: "debugging-helper",
   version: "1.0.0",
  });
  this.setupTools();
 }

 setupTools() {
  // Tool for analyzing git diffs
  this.server.tool(
   "analyze_git_diff",
   {
    description: "Analyze git diff for potential issues and suggestions",
    inputSchema: {
     type: "object",
     properties: {
      diff: { type: "string" },
      sessionId: { type: "string" },
      contextSegments: { type: "array" },
     },
     required: ["diff", "sessionId"],
    },
   },
   async ({ diff, sessionId, contextSegments = [] }) => {
    return this.analyzeDiff(diff, sessionId, contextSegments);
   }
  );

  // Tool for analyzing stack traces
  this.server.tool(
   "analyze_stack_trace",
   {
    description: "Analyze stack trace for error diagnosis",
    inputSchema: {
     type: "object",
     properties: {
      stackTrace: { type: "string" },
      sessionId: { type: "string" },
      contextSegments: { type: "array" },
     },
     required: ["stackTrace", "sessionId"],
    },
   },
   async ({ stackTrace, sessionId, contextSegments = [] }) => {
    return this.analyzeStackTrace(stackTrace, sessionId, contextSegments);
   }
  );
 }

 async analyzeDiff(diff, sessionId, contextSegments = []) {
  try {
   // Create context segment for this diff
   const diffSegment = this.contextManager.createSegment({
    id: `diff_${Date.now()}`,
    type: "git_diff",
    content: { diff },
    sessionId,
    timestamp: new Date().toISOString(),
   });

   // Build context from previous segments
   const context = this.contextManager.buildContext(sessionId, contextSegments);

   // Create OpenAI prompt with MCP context
   const prompt = this.buildAnalysisPrompt(diff, context, "diff");

   // Call OpenAI Responses API
   const response = await this.openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
     {
      role: "system",
      content:
       "You are an expert code reviewer and debugging assistant. Analyze the provided git diff and provide detailed insights about potential issues, improvements, and debugging suggestions.",
     },
     {
      role: "user",
      content: prompt,
     },
    ],
    max_tokens: 2000,
    temperature: 0.1,
   });

   const analysis = response.choices[0].message.content;

   // Create response segment
   const responseSegment = this.contextManager.createSegment({
    id: `response_${Date.now()}`,
    type: "ai_analysis",
    content: { analysis, model: "gpt-4-turbo-preview" },
    sessionId,
    timestamp: new Date().toISOString(),
    references: [diffSegment.id, ...contextSegments],
   });

   return {
    analysis,
    segments: [diffSegment, responseSegment],
    sessionId,
   };
  } catch (error) {
   logger.error("Error analyzing diff:", error);
   throw error;
  }
 }

 async analyzeStackTrace(stackTrace, sessionId, contextSegments = []) {
  try {
   // Create context segment for this stack trace
   const errorSegment = this.contextManager.createSegment({
    id: `error_${Date.now()}`,
    type: "stack_trace",
    content: { stackTrace },
    sessionId,
    timestamp: new Date().toISOString(),
   });

   // Build context from previous segments
   const context = this.contextManager.buildContext(sessionId, contextSegments);

   // Create OpenAI prompt with MCP context
   const prompt = this.buildAnalysisPrompt(stackTrace, context, "error");

   // Call OpenAI API
   const response = await this.openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
     {
      role: "system",
      content:
       "You are an expert debugging assistant. Analyze the provided stack trace and provide detailed diagnosis, root cause analysis, and specific fix recommendations.",
     },
     {
      role: "user",
      content: prompt,
     },
    ],
    max_tokens: 2000,
    temperature: 0.1,
   });

   const analysis = response.choices[0].message.content;

   // Create response segment
   const responseSegment = this.contextManager.createSegment({
    id: `response_${Date.now()}`,
    type: "ai_analysis",
    content: { analysis, model: "gpt-4-turbo-preview" },
    sessionId,
    timestamp: new Date().toISOString(),
    references: [errorSegment.id, ...contextSegments],
   });

   return {
    analysis,
    segments: [errorSegment, responseSegment],
    sessionId,
   };
  } catch (error) {
   logger.error("Error analyzing stack trace:", error);
   throw error;
  }
 }

 buildAnalysisPrompt(content, context, type) {
  let prompt = `Please analyze the following ${type}:\n\n${content}\n\n`;

  if (context && context.length > 0) {
   prompt += `\nPrevious context from this debugging session:\n`;
   context.forEach((segment, index) => {
    prompt += `\n${index + 1}. ${segment.type}: ${JSON.stringify(
     segment.content
    )}\n`;
   });
   prompt += `\nPlease provide analysis considering this previous context.\n`;
  }

  prompt += `\nProvide:
1. Summary of the issue
2. Root cause analysis
3. Specific fix recommendations
4. Prevention strategies
5. Code examples if applicable`;

  return prompt;
 }

 async getSessionHistory(sessionId) {
  return this.contextManager.getSessionSegments(sessionId);
 }
}

export default MCPService;
