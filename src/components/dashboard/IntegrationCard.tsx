import { RefreshCw, Link as LinkIcon, CheckCircle, AlertTriangle, Smartphone, Search, Mail, X } from "lucide-react";

export interface Integration {
  channel: "meta" | "google" | "x" | "email" | string;
  status: "connected" | "disconnected" | "error";
  account_name?: string | null;
  lastSynced?: string;
  errorMessage?: string;
}

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (channel: string) => void;
  onDisconnect: (channel: string) => void;
  onSync: (channel: string) => void;
}

export default function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onSync,
}: IntegrationCardProps) {
  
  const getChannelStyle = () => {
    switch (integration.channel) {
      case "meta":
        return { label: "Meta Ads Manager", color: "text-blue-600" };
      case "google":
        return { label: "Google Ads Account", color: "text-amber-600" };
      case "x":
        return { label: "X / Twitter Ads", color: "text-slate-900" };
      default:
        return { label: "Email Blast Integration", color: "text-purple-600" };
    }
  };

  const renderPlatformIcon = () => {
    const classNames = "h-5 w-5 text-slate-800";
    switch (integration.channel) {
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

  const info = getChannelStyle();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-200 text-left">
      <div className="flex flex-col gap-4">
        {/* Header Platform */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            {renderPlatformIcon()}
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-body font-bold text-slate-900 leading-tight truncate">
              {info.label}
            </h4>
            <span className="text-[10px] font-body text-slate-400 font-light mt-0.5 capitalize">
              Channel: {integration.channel}
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Sync Metadata Details */}
        <div className="flex flex-col gap-2.5 text-xs font-body text-slate-500 font-light">
          {integration.status === "connected" && (
            <>
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Account Name:</span>
                <span className="font-semibold text-slate-800">{integration.account_name || "Veltrix Profile"}</span>
              </div>
              {integration.lastSynced && (
                <div className="flex justify-between">
                  <span>Synced:</span>
                  <span className="font-light text-slate-400">{integration.lastSynced}</span>
                </div>
              )}
            </>
          )}

          {integration.status === "disconnected" && (
            <div className="flex items-center gap-1.5 text-slate-400 font-light">
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Not Connected</span>
            </div>
          )}

          {integration.status === "error" && (
            <>
              <div className="flex items-center gap-1.5 text-rose-500 font-semibold">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Authentication Error</span>
              </div>
              <p className="text-[10px] text-rose-500 bg-rose-50 border border-rose-100 p-2.5 rounded-lg leading-normal">
                {integration.errorMessage || "API credential token has expired."}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
        {integration.status === "connected" ? (
          <>
            <button
              onClick={() => onSync(integration.channel)}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2 text-[10px] font-body font-bold cursor-pointer transition-all active:scale-97 flex items-center justify-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Sync Data
            </button>
            <button
              onClick={() => onDisconnect(integration.channel)}
              className="border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 text-slate-500 rounded-lg py-2 px-3 text-[10px] font-body font-bold cursor-pointer transition-all"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={() => onConnect(integration.channel)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2.5 text-[10px] font-body font-bold cursor-pointer transition-all active:scale-[0.98] text-center"
          >
            {integration.status === "error" ? "Reconnect Platform" : "Connect Platform"}
          </button>
        )}
      </div>
    </div>
  );
}
