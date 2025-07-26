// Get API URL from environment variable with fallback
const getApiUrl = () => {
 const url = process.env.NEXT_PUBLIC_API_URL;
 if (!url) {
  console.error(
   "NEXT_PUBLIC_API_URL is not set. Please set this environment variable in Vercel."
  );
  // Fallback for development
  return typeof window !== "undefined" ? "" : "http://localhost:3001";
 }
 return url;
};

export const API_URL = getApiUrl();
