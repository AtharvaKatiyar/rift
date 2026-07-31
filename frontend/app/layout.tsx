import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Rift — A permanent link for every task",
  description:
    "One permanent link for every task you care about. Update where it points, as many times as you need. Nobody ever gets a broken link again.",
};

/* Anti-flash script: runs synchronously before paint so the correct
   class is on <html> before React hydrates — no theme flicker on load. */
const antiFlash = `
try {
  var p = window.location.pathname;
  var isPublic = p === '/' || p === '/auth' || p === '';
  var t = localStorage.getItem('rift-theme');
  if (!isPublic && t === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
} catch(e) {}
`;

export default function RootLayout({
  children, 
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* must be before children so it runs before first paint */}
        <script dangerouslySetInnerHTML={{ __html: antiFlash }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
