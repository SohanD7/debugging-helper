"use client";

interface AnalysisDisplayProps {
 analysis: string;
 sessionId?: string | null;
}

export default function AnalysisDisplay({
 analysis,
 sessionId,
}: AnalysisDisplayProps) {
 const formatAnalysis = (text: string) => {
  // Simple markdown-like formatting
  return text.split("\n").map((line, index) => {
   if (line.startsWith("# ")) {
    return (
     <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
      {line.substring(2)}
     </h3>
    );
   }
   if (line.startsWith("## ")) {
    return (
     <h4 key={index} className="text-md font-medium text-gray-800 mt-3 mb-1">
      {line.substring(3)}
     </h4>
    );
   }
   if (line.startsWith("- ")) {
    return (
     <li key={index} className="text-sm text-gray-700 ml-4">
      {line.substring(2)}
     </li>
    );
   }
   if (line.trim() === "") {
    return <br key={index} />;
   }
   return (
    <p key={index} className="text-sm text-gray-700 mb-2">
     {line}
    </p>
   );
  });
 };

 return (
  <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
   <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-900">AI Analysis</h2>
    <span className="text-xs text-gray-500 font-mono">
     Session: {sessionId}
    </span>
   </div>

   <div className="prose prose-sm max-w-none">{formatAnalysis(analysis)}</div>
  </div>
 );
}
