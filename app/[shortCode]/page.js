import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import Url from "@/models/Url";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link2Off, ArrowLeft } from "lucide-react";

// This page runs on the server for every visit (no caching)
export const dynamic = "force-dynamic";

export default async function ShortCodePage({ params }) {
  const { shortCode } = await params;

  await connectDB();

  // Find the original URL for this short code
  const url = await Url.findOne({ shortCode });

  if (url) {
    // Send the visitor to the original long URL
    redirect(url.originalUrl);
  }

  // Short code doesn't exist
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Link2Off className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Link Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              The short link <span className="font-mono font-semibold text-slate-900">/{shortCode}</span> does not exist or may have been deleted.
            </p>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
