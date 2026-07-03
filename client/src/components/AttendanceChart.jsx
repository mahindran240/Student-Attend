import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AttendanceChart({ items = [] }) {
  const labels = items.map((item) => item.subject || item.name || "Subject");
  return (
    <Bar
      data={{
        labels,
        datasets: [
          { label: "Present", data: items.map((item) => item.present || 0), backgroundColor: "#0f766e", borderRadius: 8 },
          { label: "Absent", data: items.map((item) => item.absent || 0), backgroundColor: "#f97316", borderRadius: 8 }
        ]
      }}
      options={{ responsive: true, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "rgba(148, 163, 184, 0.18)" } }, x: { grid: { display: false } } } }}
    />
  );
}
