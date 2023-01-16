import React from "react";

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
import { Line } from "react-chartjs-2";
import { sampleGraphData } from "../../../Core/Consts/consts";
import OneDayPortfolioVal from "../../../Core/Types/OneDayPortfolioVal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

//const labels = ["January", "February", "March", "April", "May", "June", "July"];

/* export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map((_, i) => sampleGraphData[i]),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
        {
      label: "Dataset 2",
      data: labels.map((_, i) => sampleGraphData[i + 30]),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
}; */

type Props = {
  portfolioVals: OneDayPortfolioVal[];
  labels: string[];
};

export default function PortfolioChart({ labels, portfolioVals }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(
          (_, i) => portfolioVals[i]?.totalValue
          //apiData ? [i, apiData[i]] : sampleGraphData[i]
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} />;
}
