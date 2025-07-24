"use client";

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Terminal, Brain, Github, Settings } from "lucide-react";
import "./globals.css";

function StatusBar() {
 return (
  <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/95">
   <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-8 items-center justify-between text-xs">
     <div className="flex items-center space-x-4 text-slate-500">
      <div className="flex items-center space-x-1">
       <div className="h-2 w-2 rounded-full bg-green-400"></div>
       <span>Backend Connected</span>
      </div>
      <div className="flex items-center space-x-1">
       <div className="h-2 w-2 rounded-full bg-blue-400"></div>
       <span>OpenAI MCP Active</span>
      </div>
      <div className="flex items-center space-x-1">
       <div className="h-2 w-2 rounded-full bg-purple-400"></div>
       <span>Ready for Analysis</span>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <html lang="en">
   <head />
   <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 antialiased">
    <div className="relative flex min-h-screen flex-col">
     <main className="flex-1 pb-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
       >
        {children}
       </motion.div>
      </div>
     </main>

     <StatusBar />
    </div>

    <Toaster
     position="top-right"
     toastOptions={{
      duration: 4000,
      style: {
       background: "#363636",
       color: "#fff",
       borderRadius: "8px",
       fontSize: "14px",
       padding: "16px",
      },
     }}
    />
   </body>
  </html>
 );
}
