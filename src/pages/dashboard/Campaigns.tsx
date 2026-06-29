import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ChevronDown, Sparkles } from "lucide-react";
import { useCampaigns } from "../../hooks/useCampaigns";
import type { Campaign } from "../../hooks/useCampaigns";
import CampaignCard from "../../components/dashboard/CampaignCard";
import EmptyState from "../../components/dashboard/EmptyState";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";

const channels = [
  { id: "all", label: "All Channels" },
  { id: "meta", label: "Meta Ads" },
  { id: "google", label: "Google Ads" },
  { id: "x", label: "X / Twitter" },
  { id: "email", label: "Email Blast" },
];

const sortOptions = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "budget_high", label: "Highest Budget" },
  { id: "spent_high", label: "Highest Spend" },
];

export default function Campaigns() {
  const navigate = useNavigate();
  const { campaigns, loading, toggleStatus, deleteCampaign, duplicateCampaign } = useCampaigns();
  
  const [activeTab, setActiveTab] = useState<Campaign["status"] | "all">("all");
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Filtering Logic
  const filteredCampaigns = campaigns
    .filter((c) => {
      const matchesTab = activeTab === "all" ? true : c.status === activeTab;
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                            (c.product_name && c.product_name.toLowerCase().includes(search.toLowerCase()));
      const matchesChannel = channelFilter === "all" ? true : c.channel === channelFilter;
      
      return matchesTab && matchesSearch && matchesChannel;
    })
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortOption === "budget_high") return Number(b.total_budget || 0) - Number(a.total_budget || 0);
      if (sortOption === "spent_high") return b.budget_spent - a.budget_spent;
      return 0;
    });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this campaign? This action cannot be undone.")) {
      await deleteCampaign(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">
            Campaigns
          </h1>
          <p className="text-sm font-body text-slate-500 font-light mt-1">
            Create, deploy, and monitor your multi-channel marketing campaigns.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/dashboard/campaigns/new")}
          className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-5 py-2.5 text-xs font-body font-semibold hover:bg-slate-800 transition-all active:scale-97 cursor-pointer shadow-sm shadow-slate-900/10 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Filter / Sort Control Bar */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-3">
          {(["all", "active", "paused", "draft", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white transition-all"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Channel filter */}
            <div className="relative flex-1 md:flex-initial min-w-[130px]">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-xs font-body font-semibold text-slate-700 outline-none cursor-pointer focus:border-slate-300 focus:bg-white appearance-none"
              >
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort options */}
            <div className="relative flex-1 md:flex-initial min-w-[130px]">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-xs font-body font-semibold text-slate-700 outline-none cursor-pointer focus:border-slate-300 focus:bg-white appearance-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid List rendering */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton height="260px" />
          <LoadingSkeleton height="260px" />
          <LoadingSkeleton height="260px" />
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              onToggleStatus={toggleStatus}
              onDelete={handleDelete}
              onDuplicate={duplicateCampaign}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No campaigns found"
          description={
            search || channelFilter !== "all" || activeTab !== "all"
              ? "Try adjusting your search criteria or dashboard filter tabs to find what you are looking for."
              : "Generate copies, customize platforms, and configure schedules to launch your first marketing campaign."
          }
          actionLabel="Create Campaign"
          onAction={() => navigate("/dashboard/campaigns/new")}
        />
      )}
    </div>
  );
}
