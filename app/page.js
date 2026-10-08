"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Link2,
  Sparkles,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Zap,
  AlertTriangle,
} from "lucide-react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch (e) {
        // ignore
      }
    }
    checkAuth();
  }, []);

  async function handleShorten(e) {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setIsGuest(false);

    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/urls/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setShortUrl(data.shortUrl);
        setIsGuest(Boolean(data.isGuest));
      } else {
        setError(data.message || "Failed to shorten URL");
      }
    } catch (err) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  function handleCopy() {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:pt-24 lg:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Value Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs backdrop-blur-xs">
              <Zap className="h-3.5 w-3.5" />
              <span>Fast, Reliable & Free Link Shortening</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Short links. <span className="text-blue-600">Simple sharing.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
              Transform long, bulky links into clean, shareable URLs in seconds.
              Share with confidence anywhere across chats, social media, and emails.
            </p>

            {/* HERO SHORTENER FORM */}
            <div className="mx-auto mt-10 max-w-2xl">
              <form
                onSubmit={handleShorten}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-lg shadow-slate-200/50 backdrop-blur-md sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    placeholder="Paste a long URL here (e.g. https://example.com/very/long/path)..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    required
                    className="w-full rounded-xl border-0 bg-transparent py-3 pr-4 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Shortening...</span>
                    </>
                  ) : (
                    <>
                      <span>Shorten URL</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* ERROR ALERT */}
              {error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50/90 p-3 text-sm text-red-700 backdrop-blur-xs">
                  {error}
                </div>
              )}

              {/* RESULT CARD */}
              {shortUrl && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 text-left shadow-xs backdrop-blur-xs">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-emerald-800">Your shortened URL is ready:</p>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm font-bold text-emerald-950 underline hover:text-blue-600"
                      >
                        <span className="truncate">{shortUrl}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-2xs border border-emerald-200 transition hover:bg-emerald-100 active:scale-95"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied! ✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-600" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                      {user && (
                        <Link
                          href="/dashboard"
                          className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-emerald-700"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* GUEST NOTICE: EXPLICIT REMINDER TO LOGIN/SIGNUP TO SAVE LINK */}
                  {isGuest && (
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-emerald-200/80 pt-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-800 font-medium">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>
                          Notice: You are not logged in. This link works, but it will <strong>not be saved</strong> in your dashboard.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href="/login"
                          className="font-semibold text-blue-700 underline hover:text-blue-800"
                        >
                          Log in
                        </Link>
                        <span className="text-slate-400">or</span>
                        <Link
                          href="/signup"
                          className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                        >
                          Sign Up to save
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                Features
              </h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Everything you need to manage your links
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Fast URL Shortening
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Generates short 6-character links in milliseconds with clean, instant redirection.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Save Your Links
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Create a free account to track, manage, and delete all your shortened links anytime.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
                  <Share2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Easy Sharing
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  One-click copy to clipboard. Share clean, compact links across chats, emails, and social media.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                Workflow
              </h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                How It Works in 3 Simple Steps
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-center shadow-xs backdrop-blur-xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
                  1
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Paste your URL
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Enter any long, cumbersome destination link into the input field.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-center shadow-xs backdrop-blur-xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
                  2
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Generate Short Link
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Our system generates a unique, safe code and creates your short URL.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-center shadow-xs backdrop-blur-xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
                  3
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Share Anywhere
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Copy your new link and share it. Visitors will be seamlessly redirected.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
