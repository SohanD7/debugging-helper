// Get API URL from environment variable with fallback
export const getApiUrl = () => {
 const url = process.env.NEXT_PUBLIC_API_URL;
 if (!url) {
  console.error(
   "NEXT_PUBLIC_API_URL is not set. Please set this environment variable in Vercel."
  );
  // For local development, return empty string to use relative paths with Next.js rewrites
  return "";
 }
 return url;
};

// For backward compatibility, but prefer using getApiUrl() directly
export const API_URL = getApiUrl();
