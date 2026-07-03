export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600/30 border-t-teal-600 shadow-sm dark:border-teal-300/20 dark:border-t-teal-300" />
      <span className="animate-fade-in">{label}</span>
    </div>
  );
}
