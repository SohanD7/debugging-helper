"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

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
 } = useForm<FormData>();

 const handleFormSubmit = (data: FormData) => {
  onSubmit({
   ...data,
   sessionId: currentSessionId || undefined,
  });
 };

 return (
  <div className="bg-white rounded-lg shadow-sm border p-6">
   <h2 className="text-lg font-semibold text-gray-900 mb-6">
    Submit Code for Analysis
   </h2>

   <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
    {/* Type Selection */}
    <div>
     <label className="block text-sm font-medium text-gray-700 mb-2">
      Input Type
     </label>
     <select
      {...register("type", { required: "Please select an input type" })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     >
      <option value="">Select type...</option>
      <option value="diff">Git Diff</option>
      <option value="stacktrace">Stack Trace</option>
      <option value="commit">Commit Message</option>
     </select>
     {errors.type && (
      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
     )}
    </div>

    {/* Content Input */}
    <div>
     <label className="block text-sm font-medium text-gray-700 mb-2">
      Code Content
     </label>
     <textarea
      {...register("content", { required: "Please provide code content" })}
      rows={12}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
      placeholder="Paste your git diff, stack trace, or commit message here..."
     />
     {errors.content && (
      <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
     )}
    </div>

    {/* Session ID Display */}
    {currentSessionId && (
     <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
      <p className="text-sm text-blue-800">
       <span className="font-medium">Current Session:</span> {currentSessionId}
      </p>
     </div>
    )}

    {/* Error Display */}
    {error && (
     <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <p className="text-sm text-red-800">{error}</p>
     </div>
    )}

    {/* Submit Button */}
    <div className="flex justify-between">
     <button
      type="button"
      onClick={() => {
       setCurrentSessionId(null);
       reset();
      }}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     >
      New Session
     </button>

     <button
      type="submit"
      disabled={loading}
      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
     >
      {loading ? "Analyzing..." : "Analyze Code"}
     </button>
    </div>
   </form>
  </div>
 );
}
