import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatRelativeDate } from "../../lib/utils";
import LoadingSkeleton from "./LoadingSkeleton";

export interface Activity {
  id: string;
  campaign_id: string;
  event_type: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface ActivityLogProps {
  campaignId: string;
}

export default function ActivityLog({ campaignId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const { data, error } = await supabase
          .from("campaign_activity")
          .select("*")
          .eq("campaign_id", campaignId)
          .order("created_at", { ascending: false });
        if (!error && data) {
          setActivities(data);
        }
      } catch (err) {
        console.error("Activity load error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (campaignId) {
      fetchActivity();
    }
  }, [campaignId]);

  const getDotColor = (type: string) => {
    switch (type) {
      case "launched":
        return "bg-emerald-500 ring-emerald-100";
      case "paused":
        return "bg-amber-500 ring-amber-100";
      case "created":
        return "bg-slate-400 ring-slate-100";
      case "copy_generated":
      case "image_generated":
        return "bg-blue-500 ring-blue-100";
      default:
        return "bg-purple-500 ring-purple-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <LoadingSkeleton height="30px" />
        <LoadingSkeleton height="30px" />
        <LoadingSkeleton height="30px" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
      <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
        Activity log
      </span>

      {activities.length > 0 ? (
        <div className="relative border-l border-slate-100 pl-4.5 ml-2.5 flex flex-col gap-6.5 py-1">
          {activities.map((act) => (
            <div key={act.id} className="relative flex flex-col gap-1 text-left">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full ring-4 ${getDotColor(
                  act.event_type
                )}`}
              />
              <span className="text-xs font-body font-semibold text-slate-800 leading-none">
                {act.description}
              </span>
              <span className="text-[9px] font-body text-slate-400 font-light mt-0.5 leading-none">
                {formatRelativeDate(act.created_at)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-400 font-body text-xs font-light py-4">
          No activity logs recorded.
        </div>
      )}
    </div>
  );
}
