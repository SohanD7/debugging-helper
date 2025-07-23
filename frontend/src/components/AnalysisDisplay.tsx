"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 Sparkles,
 Copy,
 Check,
 Download,
 Share,
 ThumbsUp,
 ThumbsDown,
 BookOpen,
 Lightbulb,
 AlertTriangle,
 CheckCircle,
 Code,
 FileText,
 ExternalLink,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
 oneLight,
 oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface AnalysisDisplayProps {
 analysis: string;
 sessionId?: string | null | undefined;
}

interface AnalysisSection {
 title: string;
 content: string;
 icon: React.ElementType;
 color: string;
 bgColor: string;
}

function parseAnalysis(text: string): AnalysisSection[] {
 const sections: AnalysisSection[] = [];
 const lines = text.split("\n");

 let currentSection: AnalysisSection | null = null;
 let currentContent: string[] = [];

 const sectionMappings = {
  summary: { icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
  issue: { icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50" },
  analysis: {
   icon: BookOpen,
   color: "text-purple-600",
   bgColor: "bg-purple-50",
  },
  recommendation: {
   icon: Lightbulb,
   color: "text-yellow-600",
   bgColor: "bg-yellow-50",
  },
  fix: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
  code: { icon: Code, color: "text-slate-600", bgColor: "bg-slate-50" },
 };

 lines.forEach((line) => {
  // Check if line starts a new section
  const trimmed = line.trim().toLowerCase();

  if (line.startsWith("# ") || line.startsWith("## ")) {
   // Save previous section
   if (currentSection && currentContent.length > 0) {
    currentSection.content = currentContent.join("\n").trim();
    sections.push(currentSection);
   }

   // Start new section
   const title = line.replace(/^#+\s*/, "");
   const sectionKey =
    Object.keys(sectionMappings).find((key) => trimmed.includes(key)) ||
    "analysis";

   const mapping = sectionMappings[sectionKey as keyof typeof sectionMappings];

   currentSection = {
    title,
    content: "",
    ...mapping,
   };
   currentContent = [];
  } else if (currentSection) {
   currentContent.push(line);
  } else {
   // Default section if no header found
   if (!currentSection) {
    currentSection = {
     title: "Analysis Results",
     content: "",
     icon: Sparkles,
     color: "text-blue-600",
     bgColor: "bg-blue-50",
    };
    currentContent = [];
   }
   currentContent.push(line);
  }
 });

 // Add final section
 if (currentSection && currentContent.length > 0) {
  (currentSection as AnalysisSection).content = currentContent.join("\n").trim();
  sections.push(currentSection);
 }

 return sections.length > 0
  ? sections
  : [
     {
      title: "Analysis Results",
      content: text,
      icon: Sparkles,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
     },
    ];
}

function CodeBlock({
 children,
 language = "javascript",
}: {
 children: string;
 language?: string;
}) {
 const [copied, setCopied] = useState(false);
 const [darkMode, setDarkMode] = useState(false);

 const handleCopy = useCallback(() => {
  navigator.clipboard.writeText(children);
  setCopied(true);
  toast.success("Code copied to clipboard");
  setTimeout(() => setCopied(false), 2000);
 }, [children]);

 return (
  <div className="relative group">
   <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
    <motion.button
     whileHover={{ scale: 1.1 }}
     whileTap={{ scale: 0.9 }}
     onClick={() => setDarkMode(!darkMode)}
     className="p-1.5 text-slate-400 hover:text-slate-600 bg-black/5 hover:bg-black/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
    >
     {darkMode ? "🌙" : "☀️"}
    </motion.button>
    <motion.button
     whileHover={{ scale: 1.1 }}
     whileTap={{ scale: 0.9 }}
     onClick={handleCopy}
     className="p-1.5 text-slate-400 hover:text-slate-600 bg-black/5 hover:bg-black/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
    >
     {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </motion.button>
   </div>

   <SyntaxHighlighter
    language={language}
    style={darkMode ? oneDark : oneLight}
    className="!m-0 !rounded-lg !text-sm"
    showLineNumbers={children.split("\n").length > 5}
   >
    {children}
   </SyntaxHighlighter>
  </div>
 );
}

function AnalysisSectionCard({
 section,
 index,
}: {
 section: AnalysisSection;
 index: number;
}) {
 const [isExpanded, setIsExpanded] = useState(index === 0);
 const Icon = section.icon;

 const renderContent = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
   // Add text before code block
   if (match.index > lastIndex) {
    const textContent = content.slice(lastIndex, match.index);
    if (textContent.trim()) {
     parts.push(
      <div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">
       {textContent.split("\n").map((line, i) => (
        <p key={i} className="mb-2 text-slate-700 leading-relaxed">
         {line}
        </p>
       ))}
      </div>
     );
    }
   }

   // Add code block
   const language = match[1] || "javascript";
   const code = match[2].trim();
   parts.push(
    <div key={`code-${match.index}`} className="my-4">
     <CodeBlock language={language}>{code}</CodeBlock>
    </div>
   );

   lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
   const remaining = content.slice(lastIndex);
   if (remaining.trim()) {
    parts.push(
     <div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">
      {remaining.split("\n").map((line, i) => (
       <p key={i} className="mb-2 text-slate-700 leading-relaxed">
        {line}
       </p>
      ))}
     </div>
    );
   }
  }

  return parts.length > 0 ? (
   parts
  ) : (
   <div className="prose prose-sm max-w-none">
    {content.split("\n").map((line, i) => (
     <p key={i} className="mb-2 text-slate-700 leading-relaxed">
      {line}
     </p>
    ))}
   </div>
  );
 };

 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: index * 0.1 }}
   className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
  >
   <motion.button
    whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
    onClick={() => setIsExpanded(!isExpanded)}
    className="w-full p-6 text-left transition-colors"
   >
    <div className="flex items-center justify-between">
     <div className="flex items-center space-x-4">
      <div
       className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg",
        section.bgColor
       )}
      >
       <Icon className={cn("h-5 w-5", section.color)} />
      </div>
      <div>
       <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
       <p className="text-sm text-slate-500 mt-0.5">
        Click to {isExpanded ? "collapse" : "expand"} details
       </p>
      </div>
     </div>
     <motion.div
      animate={{ rotate: isExpanded ? 180 : 0 }}
      transition={{ duration: 0.2 }}
     >
      <svg
       className="h-5 w-5 text-slate-400"
       fill="none"
       viewBox="0 0 24 24"
       stroke="currentColor"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
       />
      </svg>
     </motion.div>
    </div>
   </motion.button>

   <AnimatePresence>
    {isExpanded && (
     <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-slate-100"
     >
      <div className="p-6 pt-4">{renderContent(section.content)}</div>
     </motion.div>
    )}
   </AnimatePresence>
  </motion.div>
 );
}

function ActionBar({
 analysis,
 sessionId,
}: {
 analysis: string;
 sessionId: string;
}) {
 const [copied, setCopied] = useState(false);
 const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

 const handleCopyAll = useCallback(() => {
  navigator.clipboard.writeText(analysis);
  setCopied(true);
  toast.success("Analysis copied to clipboard");
  setTimeout(() => setCopied(false), 2000);
 }, [analysis]);

 const handleDownload = useCallback(() => {
  const blob = new Blob([analysis], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analysis-${sessionId}-${new Date().getTime()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Analysis downloaded");
 }, [analysis, sessionId]);

 const handleFeedback = useCallback((type: "up" | "down") => {
  setFeedback(type);
  toast.success(`Thanks for your feedback!`);
  // Here you would typically send feedback to your analytics
 }, []);

 return (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 border-t border-slate-200">
   <div className="flex items-center space-x-3">
    <motion.button
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
     onClick={handleCopyAll}
     className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-sm"
    >
     {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
     <span>{copied ? "Copied" : "Copy All"}</span>
    </motion.button>

    <motion.button
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
     onClick={handleDownload}
     className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-sm"
    >
     <Download className="h-4 w-4" />
     <span>Download</span>
    </motion.button>

    <motion.button
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
     className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-sm"
    >
     <Share className="h-4 w-4" />
     <span>Share</span>
    </motion.button>
   </div>

   <div className="flex items-center space-x-2">
    <span className="text-sm text-slate-500">Helpful?</span>
    <motion.button
     whileHover={{ scale: 1.1 }}
     whileTap={{ scale: 0.9 }}
     onClick={() => handleFeedback("up")}
     className={cn(
      "p-2 rounded-lg transition-colors",
      feedback === "up"
       ? "bg-green-100 text-green-600"
       : "text-slate-400 hover:text-green-600 hover:bg-green-50"
     )}
    >
     <ThumbsUp className="h-4 w-4" />
    </motion.button>
    <motion.button
     whileHover={{ scale: 1.1 }}
     whileTap={{ scale: 0.9 }}
     onClick={() => handleFeedback("down")}
     className={cn(
      "p-2 rounded-lg transition-colors",
      feedback === "down"
       ? "bg-red-100 text-red-600"
       : "text-slate-400 hover:text-red-600 hover:bg-red-50"
     )}
    >
     <ThumbsDown className="h-4 w-4" />
    </motion.button>
   </div>
  </div>
 );
}

export default function AnalysisDisplay({
 analysis,
 sessionId,
}: AnalysisDisplayProps) {
 const sections = parseAnalysis(analysis);

 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5 }}
   className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden"
  >
   {/* Header */}
   <div className="bg-gradient-to-r from-slate-50 to-green-50/30 px-8 py-6 border-b border-slate-200/50">
    <div className="flex items-center justify-between">
     <div className="flex items-center space-x-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 text-white shadow-lg">
       <Sparkles className="h-6 w-6" />
      </div>
      <div>
       <h2 className="text-xl font-bold text-slate-900">AI Analysis Results</h2>
       <p className="text-sm text-slate-600">
        Session: <span className="font-mono text-slate-700">{sessionId}</span>
       </p>
      </div>
     </div>

     <div className="flex items-center space-x-2 text-sm text-slate-500">
      <div className="flex items-center space-x-1">
       <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
       <span>Analysis Complete</span>
      </div>
     </div>
    </div>
   </div>

   {/* Content */}
   <div className="p-8 space-y-6">
    {sections.map((section, index) => (
     <AnalysisSectionCard
      key={`${section.title}-${index}`}
      section={section}
      index={index}
     />
    ))}
   </div>

   {/* Action Bar */}
   {sessionId && <ActionBar analysis={analysis} sessionId={sessionId} />}
  </motion.div>
 );
}
