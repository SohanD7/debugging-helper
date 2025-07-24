import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface DebugSessionData {
 type: string;
 content: string;
 sessionId?: string;
}

interface ContextSegment {
 id: string;
 type: string;
 content: any;
 timestamp: string;
 references?: string[];
}

export const useDebugSession = () => {
 const [currentSession, setCurrentSession] = useState<string | null>(null);
 const [analysis, setAnalysis] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [contextSegments, setContextSegments] = useState<ContextSegment[]>([]);

 const resetSession = useCallback(() => {
  setCurrentSession(null);
  setAnalysis(null);
  setError(null);
  setContextSegments([]);
 }, []);

 const submitAnalysis = useCallback(
  async (data: DebugSessionData) => {
   setLoading(true);
   setError(null);

   try {
    const sessionId = data.sessionId || uuidv4();

    const response = await fetch("/api/debug/analyze", {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify({
      type: data.type,
      content: data.content,
      sessionId,
      contextSegments: contextSegments.map((s) => s.id),
     }),
    });

    const result = await response.json();

    if (result.success) {
     setCurrentSession(result.sessionId);
     setAnalysis(result.analysis);
     setContextSegments((prev) => [...prev, ...result.segments]);
    } else {
     setError(result.error || "Analysis failed");
    }
   } catch (err) {
    setError("Network error occurred");
   } finally {
    setLoading(false);
   }
  },
  [contextSegments]
 );

 const loadSession = useCallback(async (sessionId: string) => {
  setLoading(true);
  setError(null);

  try {
   const response = await fetch(`/api/debug/session/${sessionId}`);
   const result = await response.json();

   if (result.success) {
    setCurrentSession(sessionId);
    setContextSegments(result.history);
    setAnalysis(null); // Clear current analysis
   } else {
    setError(result.error || "Failed to load session");
   }
  } catch (err) {
   setError("Network error occurred");
  } finally {
   setLoading(false);
  }
 }, []);

 return {
  currentSession,
  analysis,
  loading,
  error,
  contextSegments,
  submitAnalysis,
  loadSession,
  resetSession,
 };
};
