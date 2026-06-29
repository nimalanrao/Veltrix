interface StatusBadgeProps {
  status: "active" | "paused" | "draft" | "completed" | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = () => {
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
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-body font-bold uppercase tracking-wider border ${getBadgeStyle()}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
}
