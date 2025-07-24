"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
 Code,
 Bug,
 GitBranch,
 Send,
 Sparkles,
 AlertCircle,
 RefreshCw,
 Copy,
 Check,
 Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface DebugFormProps {
 onSubmit: (data: {
  type: string;
  content: string;
  sessionId?: string;
 }) => void;
 loading: boolean;
 error?: string | null;
}

interface FormData {
 type: "diff" | "stacktrace" | "commit";
 content: string;
}

// Input type options with enhanced styling
const inputTypes = [
 {
  value: "diff",
  label: "Git Diff",
  icon: GitBranch,
  description: "Analyze code changes and potential issues",
  color: "from-blue-500 to-blue-600",
  bgColor: "bg-blue-50",
  textColor: "text-blue-700",
  borderColor: "border-blue-200",
 },
 {
  value: "stacktrace",
  label: "Stack Trace",
  icon: Bug,
  description: "Debug errors and exception traces",
  color: "from-red-500 to-red-600",
  bgColor: "bg-red-50",
  textColor: "text-red-700",
  borderColor: "border-red-200",
 },
 {
  value: "commit",
  label: "Commit Message",
  icon: Code,
  description: "Analyze commit context and changes",
  color: "from-green-500 to-green-600",
  bgColor: "bg-green-50",
  textColor: "text-green-700",
  borderColor: "border-green-200",
 },
];

// Sample content for each type
const sampleContent = {
 diff: `diff --git a/src/auth.js b/src/auth.js
index 1234567..abcdefg 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -10,7 +10,7 @@ function authenticate(user) {
   if (!user) {
     return false;
   }
-  return user.id && user.password;
+  return user.id && user.password && user.active;
 }`,
 stacktrace: `TypeError: Cannot read property 'id' of undefined
    at authenticate (auth.js:13:15)
    at login (login.js:22:8)
    at processLogin (app.js:45:12)
    at /Users/project/app.js:67:5`,
 commit: `feat: add user authentication with session management

- Implement JWT-based authentication
- Add user session handling
- Include password validation
- Update API endpoints for auth`,
};

function LoadingSpinner() {
 return (
  <motion.div
   animate={{ rotate: 360 }}
   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
   className="h-4 w-4"
  >
   <RefreshCw className="h-4 w-4" />
  </motion.div>
 );
}

function TypeSelector({
 value,
 onChange,
 error,
}: {
 value: string;
 onChange: (value: string) => void;
 error?: string;
}) {
 return (
  <div className="space-y-3">
   <label className="block text-sm font-semibold text-slate-700">
    Select Input Type
   </label>
   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {inputTypes.map((type) => {
     const Icon = type.icon;
     const isSelected = value === type.value;

     return (
      <motion.button
       key={type.value}
       type="button"
       whileHover={{ scale: 1.02 }}
       whileTap={{ scale: 0.98 }}
       onClick={() => onChange(type.value)}
       className={cn(
        "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
        isSelected
         ? `${type.borderColor} ${type.bgColor} shadow-lg shadow-${type.color}/25`
         : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
       )}
      >
       <div className="flex items-center space-x-3">
        <div
         className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          isSelected
           ? `bg-gradient-to-r ${type.color} text-white`
           : "bg-slate-100 text-slate-600"
         )}
        >
         <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
         <p
          className={cn(
           "font-medium",
           isSelected ? type.textColor : "text-slate-900"
          )}
         >
          {type.label}
         </p>
         <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
        </div>
       </div>

       {isSelected && (
        <motion.div
         layoutId="selectedIndicator"
         className="absolute top-2 right-2"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         transition={{ type: "spring", stiffness: 180, damping: 40 }}
        >
         <div
          className={cn(
           "flex h-6 w-6 items-center justify-center rounded-full",
           `bg-gradient-to-r ${type.color} text-white`
          )}
         >
          <Check className="h-3 w-3" />
         </div>
        </motion.div>
       )}
      </motion.button>
     );
    })}
   </div>
   {error && (
    <motion.p
     initial={{ opacity: 0, y: -10 }}
     animate={{ opacity: 1, y: 0 }}
     className="text-sm text-red-600 flex items-center space-x-1"
    >
     <AlertCircle className="h-4 w-4" />
     <span>{error}</span>
    </motion.p>
   )}
  </div>
 );
}

function ContentTextarea({
 value,
 onChange,
 placeholder,
 error,
 selectedType,
}: {
 value: string;
 onChange: (value: string) => void;
 placeholder: string;
 error?: string;
 selectedType: string;
}) {
 const [copied, setCopied] = useState(false);

 const handlePasteSample = useCallback(() => {
  const sample = sampleContent[selectedType as keyof typeof sampleContent];
  if (sample) {
   onChange(sample);
   toast.success("Sample content pasted");
  }
 }, [selectedType, onChange]);

 const handleCopyContent = useCallback(() => {
  if (value) {
   navigator.clipboard.writeText(value);
   setCopied(true);
   toast.success("Content copied to clipboard");
   setTimeout(() => setCopied(false), 2000);
  }
 }, [value]);

 return (
  <div className="space-y-3">
   <div className="flex items-center justify-between">
    <label className="block text-sm font-semibold text-slate-700">
     Code Content
    </label>
    <div className="flex items-center space-x-2">
     {value && (
      <motion.button
       type="button"
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
       onClick={handleCopyContent}
       className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
      >
       {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
       <span>{copied ? "Copied" : "Copy"}</span>
      </motion.button>
     )}
     <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePasteSample}
      className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
     >
      <Code className="h-3 w-3" />
      <span>Paste Sample</span>
     </motion.button>
    </div>
   </div>

   <div className="relative">
    <textarea
     value={value}
     onChange={(e) => onChange(e.target.value)}
     rows={14}
     placeholder={placeholder}
     className={cn(
      "w-full px-4 py-3 border-2 rounded-xl bg-slate-50/50 font-mono text-sm resize-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-black",
      error
       ? "border-red-300 focus:border-red-500"
       : "border-slate-200 focus:border-blue-500 hover:border-slate-300"
     )}
    />
    <div className="absolute top-3 right-3 text-xs text-slate-400">
     {value.length} chars
    </div>
   </div>

   {error && (
    <motion.p
     initial={{ opacity: 0, y: -10 }}
     animate={{ opacity: 1, y: 0 }}
     className="text-sm text-red-600 flex items-center space-x-1"
    >
     <AlertCircle className="h-4 w-4" />
     <span>{error}</span>
    </motion.p>
   )}
  </div>
 );
}

export default function DebugForm({
 onSubmit,
 loading,
 error,
}: DebugFormProps) {
 const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
 const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  watch,
  setValue,
 } = useForm<FormData>();

 const watchedType = watch("type") || "";
 const watchedContent = watch("content") || "";

 const handleFormSubmit = (data: FormData) => {
  onSubmit({
   ...data,
   sessionId: currentSessionId || undefined,
  });
 };

 const handleNewSession = () => {
  setCurrentSessionId(null);
  reset();
  toast.success("New session started");
 };

 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5 }}
   className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden"
  >
   {/* Header */}
   <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 px-8 py-6 border-b border-slate-200/50">
    <div className="flex items-center justify-between">
     <div className="flex items-center space-x-3">
      <div>
       <h2 className="text-2xl font-bold text-slate-900">
        Enter code here
       </h2>
      </div>
     </div>

     {currentSessionId && (
      <motion.button
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
       onClick={handleNewSession}
       className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-sm"
      >
       New Session
      </motion.button>
     )}
    </div>
   </div>

   <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-8">
    {/* Type Selection */}
    <TypeSelector
     value={watchedType}
     onChange={(value) =>
      setValue("type", value as "diff" | "stacktrace" | "commit")
     }
     error={errors.type?.message}
    />
    <input
     type="hidden"
     {...register("type", { required: "Please select an input type" })}
    />

    {/* Content Input */}
    <ContentTextarea
     value={watchedContent}
     onChange={(value) => setValue("content", value)}
     placeholder="Paste your git diff, stack trace, or commit message here..."
     error={errors.content?.message}
     selectedType={watchedType}
    />
    <input
     type="hidden"
     {...register("content", { required: "Please provide code content" })}
    />

    {/* Session Info */}
    <AnimatePresence>
     {currentSessionId && (
      <motion.div
       initial={{ opacity: 0, height: 0 }}
       animate={{ opacity: 1, height: "auto" }}
       exit={{ opacity: 0, height: 0 }}
       className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4"
      >
       <div className="flex items-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        <p className="text-sm font-medium text-blue-900">
         Current Session:{" "}
         <span className="font-mono text-blue-700">{currentSessionId}</span>
        </p>
       </div>
      </motion.div>
     )}
    </AnimatePresence>

    {/* Error Display */}
    <AnimatePresence>
     {error && (
      <motion.div
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       className="bg-red-50 border border-red-200 rounded-xl p-4"
      >
       <div className="flex items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="text-sm font-medium text-red-900">{error}</p>
       </div>
      </motion.div>
     )}
    </AnimatePresence>

    {/* Submit Button */}
    <div className="flex justify-center pt-4">
     <motion.button
      type="submit"
      disabled={loading || !watchedType || !watchedContent}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={cn(
       "relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200",
       loading || !watchedType || !watchedContent
        ? "bg-slate-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:shadow-blue-500/25"
      )}
     >
      <div className="flex items-center space-x-3">
       {loading ? <LoadingSpinner /> : <Send className="h-5 w-5" />}
       <span>{loading ? "Analyzing..." : "Analyze Code"}</span>
      </div>

      {!loading && watchedType && watchedContent && (
       <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
        style={{ zIndex: -1 }}
       />
      )}
     </motion.button>
    </div>
   </form>
  </motion.div>
 );
}
