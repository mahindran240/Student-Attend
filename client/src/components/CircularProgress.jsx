import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CircularProgress({ value = 0 }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="relative mx-auto h-48 w-48">
      <Doughnut
        data={{
          labels: ["Present", "Remaining"],
          datasets: [{ data: [safeValue, 100 - safeValue], backgroundColor: ["#0f766e", "#e2e8f0"], borderWidth: 0 }]
        }}
        options={{ cutout: "72%", plugins: { legend: { display: false } } }}
      />
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{safeValue}%</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">attendance</p>
        </div>
      </div>
    </div>
  );
}
