import { useNavigate } from "react-router-dom";
import { Activity, DollarSign, Target, TrendingUp, Sparkles, BarChart3, LinkIcon } from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import AIInsightPanel from "../../components/dashboard/AIInsightPanel";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import { useCampaigns } from "../../hooks/useCampaigns";
import { useMetrics } from "../../hooks/useMetrics";
import { useProfile } from "../../hooks/useProfile";
import { formatCurrency, formatCompactNumber, formatPercent } from "../../lib/utils";
import type { CampaignSummary } from "../../lib/gemini";
import ChannelBadge from "../../components/dashboard/ChannelBadge";

export default function Overview() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { campaigns, loading: campaignsLoading } = useCampaigns();
  const { dailyMetrics, aggregateMetrics, loading: metricsLoading } = useMetrics();

  const loading = profileLoading || campaignsLoading || metricsLoading;

  // Active Campaigns
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  // Formatting values
  const totalSpend = formatCurrency(aggregateMetrics.totalSpend);
  const totalConversions = formatCompactNumber(aggregateMetrics.totalConversions);
  const avgROAS = `${aggregateMetrics.avgROAS.toFixed(1)}x`;

  // Get recent 5 campaigns
  const recentCampaigns = campaigns.slice(0, 5);

  // Map campaigns to Gemini summary for insights
  const campaignSummaries: CampaignSummary[] = campaigns.map((c) => {
    // Basic heuristics to match stats
    const isActive = c.status === "active";
    return {
      name: c.name,
      channel: c.channel,
      spend: isActive ? Number(c.daily_budget || 0) * 15 : 0, // estimate
      revenue: isActive ? Number(c.daily_budget || 0) * 15 * 4.2 : 0, // estimate
      ctr: c.predicted_ctr || 2.5,
      cpa: c.predicted_cpa || 5.0,
      roas: isActive ? 4.2 : 0,
      status: c.status,
    };
  });

  // Extract sparkline points from daily metrics
  const getMetricSparkline = (key: "spend" | "conversions" | "clicks" | "impressions" | "roas") => {
    if (dailyMetrics.length < 2) return [];
    // Take the last 7 entries
    return dailyMetrics.slice(-7).map((m) => {
      if (key === "roas") {
        return Number(m.spend || 0) > 0 ? Number(m.revenue || 0) / Number(m.spend || 0) : 0;
      }
      return Number(m[key] || 0);
    });
  };

  // Calculate trends comparing last 7 days vs previous 7 days
  const calculateTrend = (key: "spend" | "conversions" | "roas") => {
    if (dailyMetrics.length < 14) return undefined;
    
    const latest7 = dailyMetrics.slice(-7);
    const prev7 = dailyMetrics.slice(-14, -7);
    
    if (key === "spend") {
      const latestSum = latest7.reduce((sum, m) => sum + Number(m.spend || 0), 0);
      const prevSum = prev7.reduce((sum, m) => sum + Number(m.spend || 0), 0);
      if (prevSum === 0) return undefined;
      const diff = ((latestSum - prevSum) / prevSum) * 100;
      return {
        text: `${diff >= 0 ? "+" : ""}${diff.toFixed(0)}% vs last week`,
        direction: diff >= 0 ? ("up" as const) : ("down" as const)
      };
    }
    
    if (key === "conversions") {
      const latestSum = latest7.reduce((sum, m) => sum + (m.conversions || 0), 0);
      const prevSum = prev7.reduce((sum, m) => sum + (m.conversions || 0), 0);
      if (prevSum === 0) return undefined;
      const diff = ((latestSum - prevSum) / prevSum) * 100;
      return {
        text: `${diff >= 0 ? "+" : ""}${diff.toFixed(0)}% vs last week`,
        direction: diff >= 0 ? ("up" as const) : ("down" as const)
      };
    }
    
    if (key === "roas") {
      const latestSpend = latest7.reduce((sum, m) => sum + Number(m.spend || 0), 0);
      const latestRevenue = latest7.reduce((sum, m) => sum + Number(m.revenue || 0), 0);
      const prevSpend = prev7.reduce((sum, m) => sum + Number(m.spend || 0), 0);
      const prevRevenue = prev7.reduce((sum, m) => sum + Number(m.revenue || 0), 0);
      
      const latestROAS = latestSpend > 0 ? latestRevenue / latestSpend : 0;
      const prevROAS = prevSpend > 0 ? prevRevenue / prevSpend : 0;
      
      if (prevROAS === 0) return undefined;
      const diff = ((latestROAS - prevROAS) / prevROAS) * 100;
      return {
        text: `${diff >= 0 ? "+" : ""}${diff.toFixed(0)}% vs last week`,
        direction: diff >= 0 ? ("up" as const) : ("down" as const)
      };
    }
    
    return undefined;
  };

  const spendTrend = calculateTrend("spend");
  const convTrend = calculateTrend("conversions");
  const roasTrend = calculateTrend("roas");

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "paused":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "draft":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">
            {loading ? <LoadingSkeleton width="280px" height="32px" /> : `Welcome back, ${profile?.name || "User"}`}
          </h1>
          <p className="text-sm font-body text-slate-500 font-light mt-1">
            Here is what's happening with your autonomous AI marketing today.
          </p>
        </div>
        <span className="text-xs font-body font-semibold text-slate-400 bg-white border border-slate-200/80 rounded-full px-3 py-1.5 self-start md:self-auto shadow-sm">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
        </span>
      </header>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <LoadingSkeleton height="110px" />
            <LoadingSkeleton height="110px" />
            <LoadingSkeleton height="110px" />
            <LoadingSkeleton height="110px" />
          </>
        ) : (
          <>
            <StatCard
              label="Active Campaigns"
              value={activeCount}
              icon={Activity}
            />
            <StatCard
              label="Total Ad Spend"
              value={totalSpend}
              trend={spendTrend?.text}
              trendDirection={spendTrend?.direction}
              icon={DollarSign}
              sparkline={getMetricSparkline("spend")}
            />
            <StatCard
              label="Conversions"
              value={totalConversions}
              trend={convTrend?.text}
              trendDirection={convTrend?.direction}
              icon={Target}
              sparkline={getMetricSparkline("conversions")}
            />
            <StatCard
              label="Average ROAS"
              value={avgROAS}
              trend={roasTrend?.text}
              trendDirection={roasTrend?.direction}
              icon={TrendingUp}
              sparkline={getMetricSparkline("roas")}
            />
          </>
        )}
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recharts Performance Line/Area Chart */}
        <div className="lg:col-span-2">
          {loading ? <LoadingSkeleton height="350px" /> : <PerformanceChart data={dailyMetrics} />}
        </div>

        {/* AI Insight Engine Recommendations */}
        <div className="lg:col-span-1">
          <AIInsightPanel campaigns={campaignSummaries} />
        </div>
      </div>

      {/* Recent Campaigns Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-body font-semibold text-slate-800">
                Recent Campaigns
              </span>
              <button
                onClick={() => navigate("/dashboard/campaigns")}
                className="text-xs font-body font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                View All Campaigns →
              </button>
            </div>
            
            {loading ? (
              <div className="p-6 flex flex-col gap-4">
                <LoadingSkeleton height="40px" />
                <LoadingSkeleton height="40px" />
                <LoadingSkeleton height="40px" />
              </div>
            ) : recentCampaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-body font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-3.5">Name</th>
                      <th className="px-6 py-3.5">Channel</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">CTR</th>
                      <th className="px-6 py-3.5">Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCampaigns.map((camp) => (
                      <tr
                        key={camp.id}
                        onClick={() => navigate(`/dashboard/campaigns/${camp.id}`)}
                        className="hover:bg-slate-50/60 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-body font-semibold text-slate-900">
                          {camp.name}
                        </td>
                        <td className="px-6 py-4">
                          <ChannelBadge channel={camp.channel} />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-body font-bold uppercase tracking-wider border ${getStatusBadgeColor(camp.status)}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-body font-medium text-slate-600">
                          {camp.predicted_ctr ? formatPercent(Number(camp.predicted_ctr)) : "—"}
                        </td>
                        <td className="px-6 py-4 text-xs font-body font-semibold text-slate-900">
                          {formatCurrency(Number(camp.budget_spent || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-body font-semibold text-slate-800">No campaigns launched</h4>
                <p className="text-xs font-body text-slate-400 font-light max-w-xs leading-relaxed">
                  Start generating your ad copywriting and creative formats to launch your campaigns.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
              Quick Tasks
            </span>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/dashboard/campaigns/new")}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-body font-bold text-slate-800 leading-snug">Create Campaign</span>
                    <span className="text-[9px] font-body text-slate-400 leading-none">Generate copies with Gemini</span>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-800 transition-colors">→</span>
              </button>

              <button
                onClick={() => navigate("/dashboard/analytics")}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-body font-bold text-slate-800 leading-snug">Performance Reports</span>
                    <span className="text-[9px] font-body text-slate-400 leading-none">Review deep audience insights</span>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-800 transition-colors">→</span>
              </button>

              <button
                onClick={() => navigate("/dashboard/integrations")}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-body font-bold text-slate-800 leading-snug">Linked Channels</span>
                    <span className="text-[9px] font-body text-slate-400 leading-none">Synchronize ad networks</span>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-800 transition-colors">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
