"use client";

import { useState } from "react";
import { Link2, Plus, ArrowRight } from "lucide-react";

/**
 * Reusable URL shortening form component.
 * Can be used in pages or modals.
 */
export default function UrlForm({ onShortened, buttonText = "Shorten URL" }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    setError("");
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
        setUrl("");
        if (onShortened) onShortened(data);
      } else {
        setError(data.message || "Failed to shorten URL");
      }
    } catch (err) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Link2 className="h-5 w-5" />
        </div>
        <input
          type="url"
          required
          placeholder="https://example.com/very/long/destination/url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
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
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-1 text-xs text-red-600 sm:col-span-2">{error}</p>
      )}
    </form>
  );
}
