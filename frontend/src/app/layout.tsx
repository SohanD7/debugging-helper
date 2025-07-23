"use client";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Terminal, Brain, Github, Settings } from "lucide-react";
import "./globals.css";

const inter = Inter({
 subsets: ["latin"],
 display: "swap",
 variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
 subsets: ["latin"],
 display: "swap",
 variable: "--font-jetbrains-mono",
});

function NavigationHeader() {
 return (
  <motion.header
   initial={{ y: -20, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   transition={{ duration: 0.5 }}
   className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95"
  >
   <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
     {/* Logo and Brand */}
     <div className="flex items-center space-x-4">
      <motion.div
       whileHover={{ rotate: 360 }}
       transition={{ duration: 0.8, ease: "easeInOut" }}
       className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg"
      >
       <Brain className="h-6 w-6 text-white" />
      </motion.div>
      <div className="hidden sm:block">
       <h1 className="text-xl font-bold text-slate-900">
        AI Debugging Assistant
       </h1>
       <p className="text-sm text-slate-500">Powered by OpenAI MCP</p>
      </div>
     </div>

     {/* Navigation Actions */}
     <div className="flex items-center space-x-4">
      <motion.button
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
       className="hidden sm:flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 hover:bg-slate-100 rounded-md"
      >
       <Terminal className="h-4 w-4" />
       <span>Terminal</span>
      </motion.button>

      <motion.button
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
       className="hidden sm:flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 hover:bg-slate-100 rounded-md"
      >
       <Github className="h-4 w-4" />
       <span>GitHub</span>
      </motion.button>

      <motion.button
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
       className="flex items-center justify-center h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
      >
       <Settings className="h-4 w-4" />
      </motion.button>
     </div>
    </div>
   </div>
  </motion.header>
 );
}

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
     </div>
     <div className="text-slate-400">
      <span>Ready for Analysis</span>
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
  <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
   <head />
   <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 font-sans antialiased">
    <div className="relative flex min-h-screen flex-col">
     <NavigationHeader />

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
