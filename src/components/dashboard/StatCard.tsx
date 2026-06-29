import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  icon: LucideIcon;
  sparkline?: number[];
}

export default function StatCard({
  label,
  value,
  trend,
  trendDirection = "up",
  icon: Icon,
  sparkline,
}: StatCardProps) {
  // Generate simple SVG path for sparkline
  const generateSparklinePath = (points: number[]) => {
    if (!points || points.length < 2) return "";
    const width = 100;
    const height = 30;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;
    const step = width / (points.length - 1);
    
    return points
      .map((p, idx) => {
        const x = idx * step;
        const y = height - ((p - min) / range) * height;
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group cursor-default"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
            {label}
          </span>
          <span className="text-3xl font-heading italic text-slate-900 mt-1 leading-none">
            {value}
          </span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
          <Icon className="h-4.5 w-4.5 text-slate-800" />
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        {trend && (
          <div className="flex items-center gap-1.5 leading-none">
            {trendDirection === "up" ? (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 rounded-full px-2 py-1 text-[10px] font-body font-bold">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-rose-50 text-rose-600 rounded-full px-2 py-1 text-[10px] font-body font-bold">
                <TrendingDown className="h-3 w-3" />
                {trend}
              </div>
            )}
          </div>
        )}

        {/* Sparkline SVG */}
        {sparkline && sparkline.length > 1 && (
          <svg className="w-20 h-7 overflow-visible opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 100 30">
            <path
              d={generateSparklinePath(sparkline)}
              fill="none"
              stroke={trendDirection === "up" ? "#10b981" : "#f43f5e"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </motion.div>
  );
}
