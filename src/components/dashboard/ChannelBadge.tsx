import { Smartphone, Search, Mail, X } from "lucide-react";

interface ChannelBadgeProps {
  channel: "meta" | "google" | "x" | "email" | string;
}

export default function ChannelBadge({ channel }: ChannelBadgeProps) {
  const getBadgeStyle = () => {
    switch (channel) {
      case "meta":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "google":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "x":
        return "bg-slate-50 text-slate-800 border-slate-100";
      default:
        return "bg-purple-50 text-purple-700 border-purple-100";
    }
  };

  const renderIcon = () => {
    const classNames = "h-3 w-3";
    switch (channel) {
      case "meta":
        return <Smartphone className={classNames} />;
      case "google":
        return <Search className={classNames} />;
      case "x":
        return <X className={classNames} />;
      default:
        return <Mail className={classNames} />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-body font-bold uppercase tracking-wider border ${getBadgeStyle()}`}>
      {renderIcon()}
      {channel}
    </span>
  );
}
