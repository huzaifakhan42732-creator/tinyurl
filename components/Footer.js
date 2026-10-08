import Link from "next/link";
import { Link2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-10 backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white shadow-xs">
              <Link2 className="h-4 w-4" />
            </div>
            <span>Tiny<span className="text-blue-600">URL</span></span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Smart, fast, and secure link shortening.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
          <Link href="/" className="transition hover:text-slate-900">
            Home
          </Link>
          <Link href="/dashboard" className="transition hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/login" className="transition hover:text-slate-900">
            Login
          </Link>
          <Link href="/signup" className="transition hover:text-slate-900">
            Sign Up
          </Link>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1 text-xs text-slate-500">
          <div className="inline-flex items-center gap-1 font-medium text-slate-700">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by <strong className="font-semibold text-slate-900">Adan Khan</strong></span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-600 font-medium">Built with Passion</span>
          </div>
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} TinyURL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
