export default function StatCard({ icon: Icon, label, value, accent = "bg-teal-50 text-ocean dark:bg-teal-950" }) {
  return (
    <div className="panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <span className={`grid h-11 w-11 place-items-center rounded-md ${accent}`}>
            <Icon size={22} />
          </span>
        )}
      </div>
    </div>
  );
}
