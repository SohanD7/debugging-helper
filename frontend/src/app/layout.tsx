import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "AI Debugging Helper",
 description: "Intelligent debugging assistant with MCP context retention",
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <html lang="en">
   <body className={inter.className}>
    <div className="min-h-screen bg-gray-50">
     <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between items-center h-16">
        <h1 className="text-xl font-bold text-gray-900">
         AI Debugging Assistant
        </h1>
        <div className="flex items-center space-x-4">
         <span className="text-sm text-gray-500">Powered by OpenAI MCP</span>
        </div>
       </div>
      </div>
     </header>
     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
     </main>
    </div>
   </body>
  </html>
 );
}
