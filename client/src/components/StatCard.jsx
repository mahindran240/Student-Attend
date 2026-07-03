export default function StatCard({ icon: Icon, label, value, accent = "bg-teal-50 text-ocean dark:bg-teal-950" }) {
  return (
    <div className="panel group overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <span className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm transition duration-300 group-hover:scale-110 ${accent}`}>
            <Icon size={22} />
          </span>
        )}
      </div>
    </div>
  );
}
