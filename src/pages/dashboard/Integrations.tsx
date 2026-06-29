import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import IntegrationCard from "../../components/dashboard/IntegrationCard";
import type { Integration } from "../../components/dashboard/IntegrationCard";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import { X, CheckCircle, Info, RefreshCw } from "lucide-react";

export default function Integrations() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Connect Dialog State
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [accountName, setAccountName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Webhook settings (simulated save)
  const [webhookUrl, setWebhookUrl] = useState("https://veltrix-webhook-receiver.free.beeceptor.com");
  const [webhookSaved, setWebhookSaved] = useState(false);

  const fetchIntegrations = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id);
      if (!error && data) {
        // Map raw DB data to UI Integration model
        const items: Integration[] = ["meta", "google", "x", "email"].map((ch) => {
          const found = data.find((i) => i.channel === ch);
          if (found) {
            return {
              channel: found.channel,
              status: found.status as any,
              account_name: found.account_name,
              lastSynced: found.last_synced_at ? new Date(found.last_synced_at).toLocaleTimeString() : undefined,
              errorMessage: found.error_message || undefined,
            };
          }
          return { channel: ch, status: "disconnected" };
        });
        setIntegrations(items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchIntegrations();
  }, [user]);

  const handleConnectClick = (channel: string) => {
    setActiveChannel(channel);
    setAccountName("");
    setApiKey("");
    setSuccess(false);
  };

  const handleDisconnect = async (channel: string) => {
    if (confirm(`Are you sure you want to disconnect your ${channel} account?`)) {
      try {
        await supabase
          .from("integrations")
          .delete()
          .eq("user_id", user?.id)
          .eq("channel", channel);
        fetchIntegrations();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSync = async (channel: string) => {
    try {
      await supabase
        .from("integrations")
        .update({ last_synced_at: new Date().toISOString() })
        .eq("user_id", user?.id)
        .eq("channel", channel);
      fetchIntegrations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel || !user) return;
    setConnecting(true);
    
    // Simulate API connectivity check
    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("integrations")
          .upsert({
            user_id: user.id,
            channel: activeChannel,
            status: "connected",
            account_name: accountName || "Veltrix Connect Profile",
            api_key_hash: apiKey,
            last_synced_at: new Date().toISOString(),
          }, { onConflict: "user_id,channel" });

        if (!error) {
          setSuccess(true);
          setTimeout(() => {
            setActiveChannel(null);
            fetchIntegrations();
          }, 1000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setConnecting(false);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">Integrations</h1>
        <p className="text-sm font-body text-slate-500 font-light mt-1">
          Synchronize campaigns, tracking scripts, and conversions with external ad networks.
        </p>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingSkeleton height="210px" />
          <LoadingSkeleton height="210px" />
          <LoadingSkeleton height="210px" />
          <LoadingSkeleton height="210px" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((item) => (
            <IntegrationCard
              key={item.channel}
              integration={item}
              onConnect={handleConnectClick}
              onDisconnect={handleDisconnect}
              onSync={handleSync}
            />
          ))}
        </div>
      )}

      {/* Webhook Configuration panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 text-left">
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-body font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
            Webhook Settings
          </h3>
          <p className="text-[10px] font-body text-slate-400 font-light">
            Trigger custom HTTP callbacks for dashboard lifecycle events.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-body font-bold text-slate-500">Receiver Endpoint URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => {
                setWebhookUrl(e.target.value);
                setWebhookSaved(false);
              }}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900 focus:bg-white focus:border-slate-350 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
            <Info className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="text-[10px] font-body text-blue-700 leading-snug font-light">
              Callbacks will fire for payload events: <span className="font-semibold">campaign.created</span>, <span className="font-semibold">campaign.launched</span>, <span className="font-semibold">ab_test.concluded</span>.
            </span>
          </div>

          <button
            onClick={() => {
              setWebhookSaved(true);
              setTimeout(() => setWebhookSaved(false), 3000);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-full py-2.5 px-6 text-xs font-body font-bold self-start cursor-pointer active:scale-97 transition-all flex items-center gap-1.5"
          >
            {webhookSaved ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Settings Saved
              </>
            ) : (
              "Save Webhook Settings"
            )}
          </button>
        </div>
      </div>

      {/* Connect Modal Overlay */}
      {activeChannel && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 md:p-8 flex flex-col gap-5 text-left relative">
            <button
              onClick={() => setActiveChannel(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-body font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Connect {activeChannel}
            </h3>

            {success ? (
              <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                <CheckCircle className="h-10 w-10 text-emerald-500 animate-bounce" />
                <span className="text-sm font-body font-bold text-slate-800">Connection Successful!</span>
                <span className="text-xs font-body text-slate-400 font-light">Loading synced dashboard resources...</span>
              </div>
            ) : (
              <form onSubmit={handleSaveConnection} className="flex flex-col gap-4">
                <p className="text-[10px] font-body text-slate-400 font-light leading-relaxed">
                  Provide credentials or developer API access keys to hook platform metrics.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-bold text-slate-500">Account Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Campaign Workspace"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-bold text-slate-500">API Access Token / Developer Key</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••••••"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={connecting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full py-3 text-xs font-body font-bold cursor-pointer active:scale-[0.98] mt-2 shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {connecting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  {connecting ? "Testing Connection..." : "Verify & Save Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
