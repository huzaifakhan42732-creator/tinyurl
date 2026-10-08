export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50">
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-60" />

      {/* Very Soft Gradient Orbs */}
      <div
        className="animate-float-slow absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl filter"
        aria-hidden="true"
      />
      <div
        className="animate-float-reverse absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-indigo-200/35 blur-3xl filter"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl filter"
        aria-hidden="true"
      />
    </div>
  );
}
