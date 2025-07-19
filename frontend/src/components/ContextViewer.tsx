"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface ContextSegment {
 id: string;
 type: string;
 content: any;
 timestamp: string;
 references?: string[];
}

interface ContextViewerProps {
 sessionId?: string | null;
 segments: ContextSegment[];
 onLoadSession?: (sessionId: string) => void;
}

export default function ContextViewer({
 sessionId,
 segments,
 onLoadSession,
}: ContextViewerProps) {
 const [sessions, setSessions] = useState<any[]>([]);
 const [loadingSessions, setLoadingSessions] = useState(false);

 useEffect(() => {
  loadSessions();
 }, []);

 const loadSessions = async () => {
  setLoadingSessions(true);
  try {
   const response = await fetch("/api/history/sessions");
   const data = await response.json();
   if (data.success) {
    setSessions(data.sessions);
   }
  } catch (error) {
   console.error("Error loading sessions:", error);
  } finally {
   setLoadingSessions(false);
  }
 };

 const getSegmentIcon = (type: string) => {
  switch (type) {
   case "git_diff":
    return "📝";
   case "stack_trace":
    return "🐛";
   case "ai_analysis":
    return "🤖";
   default:
    return "📄";
  }
 };

 const getSegmentColor = (type: string) => {
  switch (type) {
   case "git_diff":
    return "bg-blue-100 text-blue-800";
   case "stack_trace":
    return "bg-red-100 text-red-800";
   case "ai_analysis":
    return "bg-green-100 text-green-800";
   default:
    return "bg-gray-100 text-gray-800";
  }
 };

 return (
  <div className="bg-white rounded-lg shadow-sm border p-6">
   <h2 className="text-lg font-semibold text-gray-900 mb-6">
    Context & History
   </h2>

   {/* Current Session */}
   {sessionId && (
    <div className="mb-6">
     <h3 className="text-sm font-medium text-gray-700 mb-3">Current Session</h3>
     <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
      <p className="text-sm text-blue-800 font-mono">{sessionId}</p>
      <p className="text-xs text-blue-600 mt-1">{segments.length} segment(s)</p>
     </div>
    </div>
   )}

   {/* Context Timeline */}
   {segments.length > 0 && (
    <div className="mb-6">
     <h3 className="text-sm font-medium text-gray-700 mb-3">
      Context Timeline
     </h3>
     <div className="space-y-3">
      {segments.map((segment, index) => (
       <div
        key={segment.id}
        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md"
       >
        <span className="text-lg">{getSegmentIcon(segment.type)}</span>
        <div className="flex-1 min-w-0">
         <div className="flex items-center space-x-2 mb-1">
          <span
           className={`px-2 py-1 text-xs font-medium rounded ${getSegmentColor(
            segment.type
           )}`}
          >
           {segment.type.replace("_", " ")}
          </span>
          <span className="text-xs text-gray-500">
           {formatDistanceToNow(new Date(segment.timestamp), {
            addSuffix: true,
           })}
          </span>
         </div>
         <p className="text-sm text-gray-600 truncate">
          {segment.type === "ai_analysis"
           ? "AI analysis completed"
           : JSON.stringify(segment.content).substring(0, 50) + "..."}
         </p>
        </div>
       </div>
      ))}
     </div>
    </div>
   )}

   {/* Recent Sessions */}
   <div>
    <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Sessions</h3>
    {loadingSessions ? (
     <div className="text-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
     </div>
    ) : sessions.length > 0 ? (
     <div className="space-y-2">
      {sessions.slice(0, 5).map((session) => (
       <div
        key={session.id}
        className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={() => onLoadSession?.(session.id)}
       >
        <div className="flex justify-between items-start">
         <p className="text-sm font-mono text-gray-800 truncate">
          {session.id}
         </p>
         <span className="text-xs text-gray-500">
          {session.segmentCount} segments
         </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
         {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
        </p>
       </div>
      ))}
     </div>
    ) : (
     <p className="text-sm text-gray-500 text-center py-4">
      No previous sessions
     </p>
    )}
   </div>
  </div>
 );
}
