export default function DataTable({ columns, rows, empty = "No records found." }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-slate-800/80">
          <thead className="bg-gradient-to-r from-slate-50 to-teal-50/60 dark:from-slate-900 dark:to-teal-950/30">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/80 dark:divide-slate-800 dark:bg-slate-900/55">
            {rows.length === 0 ? (
              <tr><td className="px-4 py-8 text-center text-slate-500 dark:text-slate-400" colSpan={columns.length}>{empty}</td></tr>
            ) : rows.map((row, index) => (
              <tr key={row._id || index} className="transition duration-300 hover:bg-teal-50/55 dark:hover:bg-slate-800/70">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-200">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
