import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData, title }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "",
            },
          },
        }}
      />
    </div>
  );
}
export default PieChart;
