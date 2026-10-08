import "./globals.css";
import Background from "@/components/Background";

export const metadata = {
  title: "TinyURL - Simple, Fast URL Shortener",
  description: "Shorten links, share easily, and track your URLs with a clean, minimal interface.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Background />
        {children}
      </body>
    </html>
  );
}
