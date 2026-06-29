import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[350px] gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100/80 text-slate-400">
        {typeof Icon === "string" ? (
          <span className="text-xl">{Icon}</span>
        ) : (
          <Icon className="h-5 w-5 text-slate-500" />
        )}
      </div>
      
      <div className="flex flex-col gap-1 max-w-sm">
        <h4 className="text-sm font-body font-semibold text-slate-800">
          {title}
        </h4>
        <p className="text-xs font-body text-slate-400 font-light leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-xs font-body font-semibold cursor-pointer active:scale-97 transition-all shadow-sm shadow-slate-900/5 mt-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
