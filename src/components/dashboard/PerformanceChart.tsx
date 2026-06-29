import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDateShort } from "../../lib/utils";

interface ChartDataPoint {
  date: string;
  spend: number;
  conversions: number;
  ctr: number;
  cpa: number;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
}

type MetricKey = "spend" | "conversions" | "ctr" | "cpa";

interface MetricOption {
  key: MetricKey;
  label: string;
  formatValue: (v: number) => string;
  color: string;
}

const metricOptions: MetricOption[] = [
  { key: "spend", label: "Spend", formatValue: (v) => formatCurrency(v), color: "#0f172a" },
  { key: "conversions", label: "Conversions", formatValue: (v) => v.toLocaleString(), color: "#10b981" },
  { key: "ctr", label: "CTR", formatValue: (v) => `${v.toFixed(2)}%`, color: "#3b82f6" },
  { key: "cpa", label: "CPA", formatValue: (v) => formatCurrency(v), color: "#f59e0b" },
];

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("spend");

  const option = metricOptions.find((o) => o.key === activeMetric)!;

  // Format date labels for x-axis
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: formatDateShort(d.date),
  }));

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
            Performance
          </span>
          <span className="text-xl font-heading italic text-slate-900 mt-1 leading-none">
            Campaign overview over time
          </span>
        </div>

        {/* Metric Selectors */}
        <div className="flex flex-wrap gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0">
          {metricOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveMetric(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all cursor-pointer ${
                activeMetric === opt.key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-950"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={option.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={option.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-10}
                tickFormatter={(v) => (activeMetric === "spend" || activeMetric === "cpa" ? `$${v}` : v)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as ChartDataPoint;
                    return (
                      <div className="bg-slate-950 text-white rounded-xl p-4 shadow-xl border border-slate-800 flex flex-col gap-1.5">
                        <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-wider">
                          {dataPoint.date}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: option.color }} />
                          <span className="text-sm font-body font-semibold">
                            {option.label}: {option.formatValue(dataPoint[activeMetric] || 0)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={option.color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 font-body text-sm font-light">
            No performance data available.
          </div>
        )}
      </div>
    </div>
  );
}
