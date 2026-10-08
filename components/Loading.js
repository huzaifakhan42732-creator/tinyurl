export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
      {message && (
        <p className="mt-3 text-xs font-medium text-slate-500">{message}</p>
      )}
    </div>
  );
}
