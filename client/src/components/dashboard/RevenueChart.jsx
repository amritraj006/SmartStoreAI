import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function RevenueChart({ labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], chartData = [3000, 5000, 4000, 7000, 9000, 12000] }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Revenue",
        data: chartData,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#9ca3af",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          callback: function(value) {
            return "$" + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
        },
      },
    },
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-800/80">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Revenue Analytics</h2>
          <p className="text-sm text-slate-400 mt-1">Monthly revenue trends</p>
        </div>
        <div className="flex gap-2">
          <select className="text-sm border border-slate-800 bg-slate-950 text-slate-350 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500">
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>
      <div className="h-[350px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default RevenueChart;