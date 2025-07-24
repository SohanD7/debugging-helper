"use client";

import { motion } from "framer-motion";
import { Code, Bug, MessageSquare, Sparkles } from "lucide-react";
import DebugForm from "@/components/DebugForm";
import ContextViewer from "@/components/ContextViewer";
import AnalysisDisplay from "@/components/AnalysisDisplay";
import { useDebugSession } from "@/hooks/useDebugSession";

// Animation variants for staggered children
const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
  opacity: 1,
  transition: {
   type: "spring" as const,
   delayChildren: 0.1,
   staggerChildren: 0.1,
  },
 },
};

const itemVariants = {
 hidden: { y: 20, opacity: 0 },
 visible: {
  y: 0,
  opacity: 1,
  transition: {
   type: "spring" as const,
   damping: 12,
   stiffness: 200,
  },
 },
};

// Hero Section Component
function HeroSection() {
 return (
  <motion.div
   variants={containerVariants}
   initial="hidden"
   animate="visible"
   className="text-center mb-12"
  >
   <motion.h1
    variants={itemVariants}
    className="text-4xl md:text-5xl text-white-900 mb-4"
   >
    Debugging Helper
   </motion.h1>
  </motion.div>
 );
}

export default function Home() {
 const {
  currentSession,
  analysis,
  loading,
  error,
  submitAnalysis,
  loadSession,
  contextSegments,
  resetSession,
 } = useDebugSession();

 return (
  <div className="min-h-screen">
   <HeroSection />

   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.8 }}
    className="grid grid-cols-1 xl:grid-cols-4 gap-8"
   >
    {/* Main Content Area */}
    <div className="xl:col-span-3 space-y-8">
     <DebugForm
      onSubmit={submitAnalysis}
      loading={loading}
      error={error}
      currentSession={currentSession}
      resetSession={resetSession}
     />

     {analysis && (
      <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
      >
       <AnalysisDisplay analysis={analysis} sessionId={currentSession} />
      </motion.div>
     )}
    </div>

    {/* Sidebar */}
    <div className="xl:col-span-1">
     <div className="sticky top-24">
      <ContextViewer
       sessionId={currentSession}
       segments={contextSegments}
       onLoadSession={loadSession}
      />
     </div>
    </div>
   </motion.div>
  </div>
 );
}
