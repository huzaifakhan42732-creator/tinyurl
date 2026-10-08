"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Link2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Calendar,
  AlertCircle,
  Inbox,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch logged-in user profile & their URLs
  async function loadData() {
    try {
      // 1. Check Auth & get Name
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.authenticated && meData.user) {
          setUserName(meData.user.name);
        } else {
          router.push("/login");
          return;
        }
      } else {
        router.push("/login");
        return;
      }

      // 2. Fetch User URLs
      const urlsRes = await fetch("/api/urls");
      if (urlsRes.status === 401) {
        router.push("/login");
        return;
      }
      const urlsData = await urlsRes.json();
      if (urlsData.success) {
        setUrls(urlsData.urls || []);
      }
    } catch (err) {
      console.error("Dashboard load error", err);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleShorten(e) {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!originalUrl.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/urls/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: originalUrl.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setShortUrl(data.shortUrl);
        setOriginalUrl("");
        // Reload list to show newly created URL
        const listRes = await fetch("/api/urls");
        const listData = await listRes.json();
        if (listData.success) setUrls(listData.urls || []);
      } else {
        setError(data.message || "Failed to shorten URL");
      }
    } catch (err) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/urls?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      setDeletingId(null);
      setDeleteConfirmId(null);

      if (data.success) {
        setUrls((prev) => prev.filter((item) => item._id !== id));
      } else {
        setError(data.message || "Failed to delete URL");
      }
    } catch (err) {
      setDeletingId(null);
      setError("Network error deleting URL");
    }
  }

  function copyToClipboard(text, id = "main") {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  function formatDate(iso) {
    if (!iso) return "Just now";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-5xl">
          {/* DASHBOARD HEADER */}
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Dashboard Overview</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back{userName ? `, ${userName}` : ""}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Create new short links and manage your existing URLs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs">
                <span>Total Links:</span>
                <span className="font-bold text-blue-600">{urls.length}</span>
              </div>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* URL SHORTENER CARD */}
          <section className="mt-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-md shadow-slate-200/40 backdrop-blur-md sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">
                Paste your long URL
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Enter any destination URL starting with http:// or https://
              </p>

              <form onSubmit={handleShorten} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/very/long/destination/url"
                    value={originalUrl}
                    onChange={(e) => {
                      setOriginalUrl(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pr-4 pl-11 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xs shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Shortening...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Shorten URL</span>
                    </>
                  )}
                </button>
              </form>

              {/* GENERATED RESULT BOX */}
              {shortUrl && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 transition-all animate-in fade-in">
                  <p className="text-xs font-semibold text-emerald-800">
                    Your shortened URL
                  </p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-emerald-950 underline hover:text-blue-600"
                    >
                      <span className="break-all">{shortUrl}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>

                    <button
                      onClick={() => copyToClipboard(shortUrl, "new-short")}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-2xs transition hover:bg-emerald-100 active:scale-95"
                    >
                      {copiedId === "new-short" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied! ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-600" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* URL HISTORY SECTION */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your URLs</h2>
                <p className="text-xs text-slate-500">
                  Manage, copy, or delete previously created shortened links
                </p>
              </div>
            </div>

            {initialLoading ? (
              <div className="mt-6 flex flex-col gap-3">
                <div className="h-16 w-full animate-pulse rounded-xl bg-slate-200/60" />
                <div className="h-16 w-full animate-pulse rounded-xl bg-slate-200/60" />
                <div className="h-16 w-full animate-pulse rounded-xl bg-slate-200/60" />
              </div>
            ) : urls.length === 0 ? (
              /* EMPTY STATE */
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center backdrop-blur-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                  You haven&apos;t shortened any URLs yet.
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Paste a link into the box above to generate your first short URL.
                </p>
              </div>
            ) : (
              /* URLS LIST / TABLE */
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 sm:px-6">Short Link</th>
                        <th className="px-4 py-3 sm:px-6">Original Destination</th>
                        <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Created</th>
                        <th className="px-4 py-3 text-right sm:px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {urls.map((item) => {
                        const fullLink = `${origin}/${item.shortCode}`;
                        const isCopied = copiedId === item._id;
                        const isDeleting = deletingId === item._id;
                        const isConfirming = deleteConfirmId === item._id;

                        return (
                          <tr
                            key={item._id}
                            className="transition hover:bg-blue-50/30"
                          >
                            {/* Short link */}
                            <td className="px-4 py-3.5 sm:px-6">
                              <a
                                href={`/${item.shortCode}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono font-semibold text-blue-600 underline hover:text-blue-700"
                              >
                                <span>/{item.shortCode}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                              </a>
                            </td>

                            {/* Original URL (Truncated) */}
                            <td className="max-w-[200px] truncate px-4 py-3.5 text-slate-600 sm:max-w-xs md:max-w-md sm:px-6">
                              <span title={item.originalUrl}>
                                {item.originalUrl}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="hidden px-4 py-3.5 whitespace-nowrap text-slate-400 sm:table-cell sm:px-6">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(item.createdAt)}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-6">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Copy Button */}
                                <button
                                  onClick={() => copyToClipboard(fullLink, item._id)}
                                  title="Copy short link"
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="h-3 w-3 text-emerald-600" />
                                      <span className="text-emerald-700">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3 text-slate-500" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>

                                {/* Delete Button / Confirmation */}
                                {isConfirming ? (
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      onClick={() => handleDelete(item._id)}
                                      disabled={isDeleting}
                                      className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-red-700 disabled:opacity-50"
                                    >
                                      {isDeleting ? "Deleting..." : "Confirm"}
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(item._id)}
                                    title="Delete URL"
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
