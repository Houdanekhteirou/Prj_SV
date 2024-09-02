'use client'
import React from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

const PopulationChart = ({ data, labels, scaleLabel }: { data: number[]; labels: string[]; scaleLabel?: string }) => {
  // Data for the chart
  const dataChart = {
    labels: labels,
    datasets: [
      {
        label: scaleLabel,
        data: data,
        fill: false,
        borderColor: '#7ABAF5',
        tension: 0,
        pointStyle: 'line'
      }
    ]
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <>
      <Line data={dataChart} options={options} />
    </>
  )
}

export default PopulationChart
