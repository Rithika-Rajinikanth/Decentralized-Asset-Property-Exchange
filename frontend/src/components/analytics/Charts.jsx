// src/components/analytics/Charts.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Charts = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Investments (ETH)",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Properties Sold",
        data: [7, 11, 5, 8, 3, 7],
        borderColor: "rgba(153,102,255,1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Platform Activity Over Time" },
    },
  };

  return <Line data={data} options={options} />;
};

export default Charts;
