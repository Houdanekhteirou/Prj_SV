"use client";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import PieChart from "./pieChart";

Chart.register(CategoryScale);

export default function ChartComponent({ title, chartData }) {
  return (
    <div className="App w-3/4">
      <PieChart chartData={chartData} title={title} />
    </div>
  );
}
