import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with absolute path
dotenv.config({
 path: path.resolve(__dirname, "../../.env"),
 debug: process.env.NODE_ENV !== "production",
});

// Verify critical variables are loaded
if (!process.env.OPENAI_API_KEY) {
 throw new Error("OPENAI_API_KEY environment variable is required");
}

console.log("Environment variables loaded successfully");
