"use client";

import { useState } from "react";
import DebugForm from "@/components/features/DebugForm";
import ContextViewer from "@/components/features/ContextViewer";
import AnalysisDisplay from "@/components/features/AnalysisDisplay";
import { useDebugSession } from "@/hooks/useDebugSession";

export default function Home() {
 const {
  currentSession,
  analysis,
  loading,
  error,
  submitAnalysis,
  loadSession,
  contextSegments,
 } = useDebugSession();

 return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
   {/* Input Section */}
   <div className="lg:col-span-2">
    <DebugForm onSubmit={submitAnalysis} loading={loading} error={error} />

    {analysis && (
     <AnalysisDisplay analysis={analysis} sessionId={currentSession} />
    )}
   </div>

   {/* Context Viewer */}
   <div className="lg:col-span-1">
    <ContextViewer
     sessionId={currentSession}
     segments={contextSegments}
     onLoadSession={loadSession}
    />
   </div>
  </div>
 );
}
