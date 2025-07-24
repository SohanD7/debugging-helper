"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 History,
 Clock,
 FileText,
 Bug,
 GitBranch,
 Bot,
 ChevronRight,
 Trash2,
 Eye,
 EyeOff,
 Circle,
 CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

// Segment type configurations
const segmentConfig = {
 git_diff: {
  icon: GitBranch,
  label: "Git Diff",
  color: "text-blue-600",
  bgColor: "bg-blue-50",
  borderColor: "border-blue-200",
  dotColor: "bg-blue-500",
 },
 stack_trace: {
  icon: Bug,
  label: "Stack Trace",
  color: "text-red-600",
  bgColor: "bg-red-50",
  borderColor: "border-red-200",
  dotColor: "bg-red-500",
 },
 ai_analysis: {
  icon: Bot,
  label: "AI Analysis",
  color: "text-green-600",
  bgColor: "bg-green-50",
  borderColor: "border-green-200",
  dotColor: "bg-green-500",
 },
};

function SkeletonLoader() {
 return (
  <div className="space-y-3">
   {[...Array(3)].map((_, i) => (
    <div
     key={i}
     className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
    >
     <Skeleton circle height={24} width={24} />
     <div className="flex-1">
      <Skeleton height={16} width="60%" />
      <Skeleton height={12} width="40%" style={{ marginTop: 4 }} />
     </div>
    </div>
   ))}
  </div>
 );
}

function SessionCard({
 session,
 onLoad,
 isActive,
}: {
 session: any;
 onLoad: (id: string) => void;
 isActive: boolean;
}) {
 return (
  <motion.div
   whileHover={{ scale: 1.02 }}
   whileTap={{ scale: 0.98 }}
   onClick={() => onLoad(session.id)}
   className={cn(
    "p-4 rounded-lg border cursor-pointer transition-all duration-200",
    isActive
     ? "bg-blue-50 border-blue-200 shadow-md"
     : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
   )}
  >
   <div className="flex items-center justify-between">
    <div className="flex-1 min-w-0">
     <div className="flex items-center space-x-2 mb-1">
      {isActive && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
      <p className="text-sm font-mono text-slate-800 truncate">{session.id}</p>
     </div>
     <div className="flex items-center space-x-3 text-xs text-slate-500">
      <span>{session.segmentCount} segments</span>
      <span>
       {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
      </span>
     </div>
    </div>
    <ChevronRight className="h-4 w-4 text-slate-400" />
   </div>
  </motion.div>
 );
}

function SegmentTimeline({ segments }: { segments: ContextSegment[] }) {
 const [expandedSegments, setExpandedSegments] = useState<Set<string>>(
  new Set()
 );

 const toggleSegment = (segmentId: string) => {
  const newExpanded = new Set(expandedSegments);
  if (newExpanded.has(segmentId)) {
   newExpanded.delete(segmentId);
  } else {
   newExpanded.add(segmentId);
  }
  setExpandedSegments(newExpanded);
 };

 return (
  <div className="space-y-3">
   {segments.map((segment, index) => {
    const config = segmentConfig[
     segment.type as keyof typeof segmentConfig
    ] || {
     icon: FileText,
     label: "Unknown",
     color: "text-slate-600",
     bgColor: "bg-slate-50",
     borderColor: "border-slate-200",
     dotColor: "bg-slate-400",
    };

    const Icon = config.icon;
    const isExpanded = expandedSegments.has(segment.id);
    const isLast = index === segments.length - 1;

    return (
     <motion.div
      key={segment.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
     >
      {/* Timeline Line */}
      {!isLast && (
       <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-200" />
      )}

      <div className="flex items-start space-x-4">
       {/* Timeline Dot */}
       <div
        className={cn(
         "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white shadow-sm",
         config.borderColor
        )}
       >
        <Icon className={cn("h-5 w-5", config.color)} />
       </div>

       {/* Segment Content */}
       <div className="flex-1 min-w-0">
        <motion.button
         whileHover={{ scale: 1.01 }}
         whileTap={{ scale: 0.99 }}
         onClick={() => toggleSegment(segment.id)}
         className={cn(
          "w-full p-4 rounded-lg border text-left transition-all duration-200",
          config.borderColor,
          config.bgColor,
          "hover:shadow-sm"
         )}
        >
         <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
           <span className={cn("text-sm font-semibold", config.color)}>
            {config.label}
           </span>
           <div className={cn("h-2 w-2 rounded-full", config.dotColor)} />
          </div>
          <div className="flex items-center space-x-2">
           <Clock className="h-3 w-3 text-slate-400" />
           <span className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(segment.timestamp), {
             addSuffix: true,
            })}
           </span>
           {isExpanded ? (
            <EyeOff className="h-4 w-4 text-slate-400" />
           ) : (
            <Eye className="h-4 w-4 text-slate-400" />
           )}
          </div>
         </div>

         <div className="text-sm text-slate-600">
          {segment.type === "ai_analysis" ? (
           "AI analysis completed"
          ) : (
           <span className="font-mono text-xs bg-white/50 px-2 py-1 rounded">
            {JSON.stringify(segment.content).substring(0, 60)}...
           </span>
          )}
         </div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
         {isExpanded && (
          <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: "auto" }}
           exit={{ opacity: 0, height: 0 }}
           className="mt-2 p-4 bg-white/80 rounded-lg border border-slate-200"
          >
           <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono overflow-x-auto">
            {segment.type === "ai_analysis"
             ? segment.content.analysis || "No analysis content"
             : JSON.stringify(segment.content, null, 2)}
           </pre>
          </motion.div>
         )}
        </AnimatePresence>
       </div>
      </div>
     </motion.div>
    );
   })}
  </div>
 );
}

export default function ContextViewer({
 sessionId,
 segments,
 onLoadSession,
}: ContextViewerProps) {
 const [sessions, setSessions] = useState<any[]>([]);
 const [loadingSessions, setLoadingSessions] = useState(false);
 const [activeTab, setActiveTab] = useState<"current" | "history">("current");

 useEffect(() => {
  loadSessions();
 }, []);

 // Reload sessions when switching to 'history' tab
 useEffect(() => {
  if (activeTab === "history") {
   loadSessions();
  }
 }, [activeTab]);

 // Reload sessions when a new session is created
 useEffect(() => {
  loadSessions();
 }, [sessionId]);

 const loadSessions = async () => {
  setLoadingSessions(true);
  try {
   // Simulated API call - replace with actual API call
   const response = await fetch("/api/history/sessions");
   if (response.ok) {
    const data = await response.json();
    setSessions(data.sessions || []);
   }
  } catch (error) {
   console.error("Error loading sessions:", error);
  } finally {
   setLoadingSessions(false);
  }
 };

 return (
  <motion.div
   initial={{ opacity: 0, x: 20 }}
   animate={{ opacity: 1, x: 0 }}
   transition={{ duration: 0.5, delay: 0.2 }}
   className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden"
  >
   {/* Header */}
   <div className="bg-gradient-to-r from-slate-50 to-purple-50/30 px-6 py-5 border-b border-slate-200/50">
    <div className="flex items-center space-x-3 mb-4">
     <div>
      <h2 className="text-lg font-bold text-slate-900">Context & History</h2>
      <p className="text-sm text-slate-600">Session memory and timeline</p>
     </div>
    </div>

    {/* Tab Navigation */}
    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
     {[
      { key: "current", label: "Current Session", count: segments.length },
      { key: "history", label: "All Sessions", count: sessions.length },
     ].map((tab) => (
      <motion.button
       key={tab.key}
       whileHover={{ scale: 1.02 }}
       whileTap={{ scale: 0.98 }}
       onClick={() => setActiveTab(tab.key as "current" | "history")}
       className={cn(
        "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
        activeTab === tab.key
         ? "bg-white text-slate-900 shadow-sm"
         : "text-slate-600 hover:text-slate-900"
       )}
      >
       {tab.label}
       {tab.count > 0 && (
        <span
         className={cn(
          "ml-2 px-2 py-0.5 text-xs rounded-full",
          activeTab === tab.key
           ? "bg-slate-100 text-slate-600"
           : "bg-slate-200 text-slate-500"
         )}
        >
         {tab.count}
        </span>
       )}
      </motion.button>
     ))}
    </div>
   </div>

   {/* Content */}
   <div className="p-6">
    <AnimatePresence mode="wait">
     {activeTab === "current" ? (
      <motion.div
       key="current"
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.3 }}
      >
       {sessionId && (
        <div className="mb-6 p-4 bg-blue-50/50 border border-blue-200/50 rounded-xl">
         <div className="flex items-center space-x-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-sm font-semibold text-blue-900">
           Active Session
          </span>
         </div>
         <p className="text-sm font-mono text-blue-700">{sessionId}</p>
         <p className="text-xs text-blue-600 mt-1">
          {segments.length} context segments
         </p>
        </div>
       )}

       {segments.length > 0 ? (
        <div>
         <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>Context Timeline</span>
         </h3>
         <SegmentTimeline segments={segments} />
        </div>
       ) : (
        <div className="text-center py-8">
         <Circle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
         <p className="text-sm text-slate-500">No context segments yet</p>
         <p className="text-xs text-slate-400 mt-1">
          Start analyzing code to build context
         </p>
        </div>
       )}
      </motion.div>
     ) : (
      <motion.div
       key="history"
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.3 }}
      >
       <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center space-x-2">
        <History className="h-4 w-4" />
        <span>Session History</span>
       </h3>

       {loadingSessions ? (
        <SkeletonLoader />
       ) : sessions.length > 0 ? (
        <div className="space-y-3">
         {sessions.slice(0, 10).map((session) => (
          <SessionCard
           key={session.id}
           session={session}
           onLoad={onLoadSession || (() => {})}
           isActive={session.id === sessionId}
          />
         ))}
        </div>
       ) : (
        <div className="text-center py-8">
         <History className="h-12 w-12 text-slate-300 mx-auto mb-3" />
         <p className="text-sm text-slate-500">No previous sessions</p>
         <p className="text-xs text-slate-400 mt-1">
          Start your first analysis to create history
         </p>
        </div>
       )}
      </motion.div>
     )}
    </AnimatePresence>
   </div>
  </motion.div>
 );
}
