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
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.05)",
        borderWidth: 3,
        pointBackgroundColor: "#2563eb",
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
          color: "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          callback: function(value) {
            return "$" + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Revenue Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Monthly revenue trends</p>
        </div>
        <div className="flex gap-2">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
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