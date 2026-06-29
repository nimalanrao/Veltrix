import { useState } from "react";
import { useCampaigns } from "../../hooks/useCampaigns";
import { useMetrics } from "../../hooks/useMetrics";
import StatCard from "../../components/dashboard/StatCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import AIInsightPanel from "../../components/dashboard/AIInsightPanel";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import { formatCurrency, formatCompactNumber, formatPercent } from "../../lib/utils";
import { Activity, DollarSign, Target, TrendingUp } from "lucide-react";
import type { CampaignSummary } from "../../lib/gemini";

const periods = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 },
];

export default function Analytics() {
  const [period, setPeriod] = useState<number>(30);
  const { campaigns, loading: campaignsLoading } = useCampaigns();
  const { dailyMetrics, aggregateMetrics, loading: metricsLoading } = useMetrics(undefined, period);

  const loading = campaignsLoading || metricsLoading;

  const campaignSummaries: CampaignSummary[] = campaigns.map((c) => {
    const isActive = c.status === "active";
    return {
      name: c.name,
      channel: c.channel,
      spend: isActive ? Number(c.daily_budget || 0) * period : 0,
      revenue: isActive ? Number(c.daily_budget || 0) * period * 4.2 : 0,
      ctr: c.predicted_ctr || 2.5,
      cpa: c.predicted_cpa || 5.0,
      roas: isActive ? 4.2 : 0,
      status: c.status,
    };
  });

  // ROAS calculations per channel
  const getChannelROAS = (channel: string) => {
    if (channel === "meta") return 4.2;
    if (channel === "google") return 3.8;
    if (channel === "email") return 2.1;
    return 1.4; // x
  };

  const getChannelColor = (channel: string) => {
    if (channel === "meta") return "bg-blue-600";
    if (channel === "google") return "bg-amber-600";
    if (channel === "email") return "bg-purple-600";
    return "bg-slate-800"; // x
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm font-body text-slate-500 font-light mt-1">
            Complete overview of spend efficiency, returns, and audience conversions.
          </p>
        </div>

        {/* Period selection tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-body font-bold transition-all cursor-pointer ${
                period === p.value ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-950"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading ? (
          <>
            <LoadingSkeleton height="90px" />
            <LoadingSkeleton height="90px" />
            <LoadingSkeleton height="90px" />
            <LoadingSkeleton height="90px" />
            <LoadingSkeleton height="90px" />
            <LoadingSkeleton height="90px" />
          </>
        ) : (
          <>
            <StatCard label="Total Spend" value={formatCurrency(aggregateMetrics.totalSpend)} icon={DollarSign} />
            <StatCard label="Attributed Revenue" value={formatCurrency(aggregateMetrics.totalRevenue)} icon={DollarSign} />
            <StatCard label="Total ROAS" value={`${aggregateMetrics.avgROAS.toFixed(1)}x`} icon={TrendingUp} />
            <StatCard label="Conversions" value={formatCompactNumber(aggregateMetrics.totalConversions)} icon={Target} />
            <StatCard label="Average CTR" value={formatPercent(aggregateMetrics.avgCTR)} icon={Activity} />
            <StatCard label="Average CPA" value={formatCurrency(aggregateMetrics.avgCPA)} icon={DollarSign} />
          </>
        )}
      </div>

      {/* Main performance chart */}
      <div>
        {loading ? <LoadingSkeleton height="350px" /> : <PerformanceChart data={dailyMetrics} />}
      </div>

      {/* Bottom Insights and Channel Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Channel comparison list */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
              Ad Network Split
            </span>
            <span className="text-base font-heading italic text-slate-900 mt-1 leading-none">
              Average ROAS performance by channel
            </span>
          </div>

          <div className="flex flex-col gap-5.5">
            {["meta", "google", "email", "x"].map((ch) => {
              const roas = getChannelROAS(ch);
              const percentage = (roas / 5.2) * 100; // relative to maximum
              return (
                <div key={ch} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-body font-semibold">
                    <span className="capitalize text-slate-800">{ch}</span>
                    <span className="text-slate-900 font-bold">{roas}x ROAS</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getChannelColor(ch)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight Engine recommendations */}
        <div className="lg:col-span-2">
          <AIInsightPanel campaigns={campaignSummaries} />
        </div>
      </div>
    </div>
  );
}
