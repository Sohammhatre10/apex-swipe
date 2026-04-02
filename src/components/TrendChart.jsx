import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

export default function TrendChart({ fund }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const isUp = fund.changePct >= 0;
  const lineColor = isUp ? '#10b981' : '#ef4444';
  const fillColor = isUp ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)';

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: fund.trendLabels,
        datasets: [{
          data: fund.trend,
          borderColor: lineColor,
          backgroundColor: fillColor,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: lineColor,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1a1a2e',
            titleColor: '#a0aec0',
            bodyColor: '#ffffff',
            padding: 8,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `₹${ctx.parsed.y.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { size: 10, family: "'DM Sans', sans-serif" },
              color: '#94a3b8',
              maxRotation: 0,
            },
          },
          y: { display: false },
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [fund.id]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '130px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
