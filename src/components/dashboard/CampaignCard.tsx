import { useNavigate } from "react-router-dom";
import { Play, Pause, MoreVertical, Trash2, Copy, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Campaign } from "../../hooks/useCampaigns";
import ChannelBadge from "./ChannelBadge";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatPercent } from "../../lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
  onToggleStatus: (id: string, current: Campaign["status"]) => void;
  onDelete: (id: string) => void;
  onDuplicate: (campaign: Campaign) => void;
}

export default function CampaignCard({
  campaign,
  onToggleStatus,
  onDelete,
  onDuplicate,
}: CampaignCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProgressColor = () => {
    const budget = Number(campaign.total_budget || 0);
    if (budget === 0) return "bg-slate-200";
    const percent = (campaign.budget_spent / budget) * 100;
    if (percent > 85) return "bg-rose-500";
    if (percent > 60) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getSpentPercent = () => {
    const budget = Number(campaign.total_budget || 0);
    if (budget === 0) return 0;
    return Math.min(100, Math.round((campaign.budget_spent / budget) * 100));
  };

  return (
    <motion.div
      className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group cursor-pointer relative"
      onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
      whileHover={{ y: -2 }}
    >
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <ChannelBadge channel={campaign.channel} />
            <h3 className="text-base font-body font-bold text-slate-900 truncate mt-1 group-hover:text-slate-800">
              {campaign.name}
            </h3>
          </div>
          
          {/* Actions Dropdown */}
          <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-50 border border-slate-100/50 text-slate-400 hover:text-slate-950 cursor-pointer transition-transform"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-1.5 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      navigate(`/dashboard/campaigns/${campaign.id}`);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-body font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 w-full text-left cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      onToggleStatus(campaign.id, campaign.status);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-body font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 w-full text-left cursor-pointer"
                  >
                    {campaign.status === "active" ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        Pause Campaign
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Resume Campaign
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onDuplicate(campaign);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-body font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 w-full text-left cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Duplicate ad
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={() => {
                      onDelete(campaign.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-body font-semibold text-rose-600 hover:bg-rose-50 w-full text-left cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Campaign
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      {/* Progress & Metrics */}
      <div className="mt-8">
        {/* Budget Progress Bar */}
        {campaign.total_budget && (
          <div className="flex flex-col gap-1.5 mb-5">
            <div className="flex items-center justify-between text-[10px] font-body font-bold text-slate-400 uppercase tracking-wide">
              <span>Budget Progress</span>
              <span>{getSpentPercent()}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${getSpentPercent()}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-body mt-0.5 leading-none">
              <span className="font-semibold text-slate-800">
                {formatCurrency(campaign.budget_spent)}
              </span>
              <span className="font-light text-slate-400">
                of {formatCurrency(Number(campaign.total_budget))}
              </span>
            </div>
          </div>
        )}

        {/* Analytics stats */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100/80 pt-4">
          <div className="text-center">
            <span className="text-sm font-heading italic text-slate-800 leading-none">
              {campaign.predicted_ctr ? formatPercent(Number(campaign.predicted_ctr)) : "—"}
            </span>
            <span className="text-[9px] font-body font-bold text-slate-400 uppercase tracking-wider block mt-1 leading-none">
              CTR
            </span>
          </div>
          <div className="text-center border-x border-slate-100">
            <span className="text-sm font-heading italic text-slate-800 leading-none">
              {campaign.predicted_cpa ? formatCurrency(Number(campaign.predicted_cpa)) : "—"}
            </span>
            <span className="text-[9px] font-body font-bold text-slate-400 uppercase tracking-wider block mt-1 leading-none">
              CPA
            </span>
          </div>
          <div className="text-center">
            <span className="text-sm font-heading italic text-slate-800 leading-none">
              {campaign.status === "active" ? "4.2x" : "—"}
            </span>
            <span className="text-[9px] font-body font-bold text-slate-400 uppercase tracking-wider block mt-1 leading-none">
              ROAS
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
