import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { getApiUrl } from "@/config";

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
    // Use existing sessionId if provided, otherwise use current session or generate new one
    const sessionId = data.sessionId || currentSession || uuidv4();
    const apiUrl = getApiUrl();
    const url = apiUrl ? `${apiUrl}/api/debug/analyze` : "/api/debug/analyze";

    console.log("Making request to:", url);
    console.log("API_URL:", apiUrl);
    console.log("Using sessionId:", sessionId);

    const response = await fetch(url, {
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

    if (!response.ok) {
     const errorText = await response.text();
     console.error("Response not ok:", response.status, errorText);
     throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
     setCurrentSession(result.sessionId);
     setAnalysis(result.analysis);
     setContextSegments((prev) => [...prev, ...result.segments]);
    } else {
     setError(result.error || "Analysis failed");
    }
   } catch (err) {
    console.error("Network error:", err);
    setError(err instanceof Error ? err.message : "Network error occurred");
   } finally {
    setLoading(false);
   }
  },
  [contextSegments, currentSession]
 );

 const loadSession = useCallback(async (sessionId: string) => {
  setLoading(true);
  setError(null);

  try {
   const apiUrl = getApiUrl();
   const url = apiUrl
    ? `${apiUrl}/api/debug/session/${sessionId}`
    : `/api/debug/session/${sessionId}`;
   const response = await fetch(url);
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
