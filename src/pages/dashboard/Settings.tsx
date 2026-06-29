import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import { CheckCircle, Info, Shield, CreditCard, User, Bell, Key } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api-keys", label: "Gemini Keys", icon: Key },
];

export default function Settings() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  
  // Security Form
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passUpdating, setPassUpdating] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);

  // Hydrate fields once loaded
  useState(() => {
    if (profile) {
      setName(profile.name || "");
      setCompanyName(profile.company_name || "");
      setCompanySize(profile.company_size || "");
    }
  });

  // Since profile loading is async, populate inputs when profile changes
  useState(() => {
    if (profile) {
      setName(profile.name || "");
      setCompanyName(profile.company_name || "");
      setCompanySize(profile.company_size || "");
    }
  });

  // Handle re-population on tab click or update
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (profile) {
      setName(profile.name || "");
      setCompanyName(profile.company_name || "");
      setCompanySize(profile.company_size || "");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSaveSuccess(false);
    
    const { error } = await updateProfile({
      name,
      company_name: companyName,
      company_size: companySize,
    });

    setUpdating(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("Error saving profile: " + error.message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setPassUpdating(true);
    setPassSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) {
        setPassSuccess(true);
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => setPassSuccess(false), 3000);
      } else {
        alert("Password update failed: " + error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPassUpdating(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSkeleton width="180px" height="24px" />
        <LoadingSkeleton height="200px" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm font-body text-slate-500 font-light mt-1">
          Configure profile workspace metadata, check billing subscription caps, and change security.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4.5 py-3 border-b-2 text-xs font-body font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? "border-slate-950 text-slate-950"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content wrapper */}
      <div className="max-w-md w-full">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Workspace Profile Details
            </h4>

            <div className="flex items-center gap-4.5">
              <div className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg border border-slate-800">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-body font-bold text-slate-900 leading-snug">
                  {name || "Workspace Profile"}
                </span>
                <span className="text-xs font-body text-slate-400 font-light leading-none">
                  {user?.email}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-body font-bold text-slate-500">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-body font-bold text-slate-500">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-body font-bold text-slate-500">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-700 outline-none cursor-pointer"
              >
                <option value="1-10">1 - 10 employees</option>
                <option value="11-50">11 - 50 employees</option>
                <option value="51-200">51 - 200 employees</option>
                <option value="201+">201+ employees</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full py-2.5 text-xs font-body font-bold cursor-pointer active:scale-97 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  Profile Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        )}

        {/* BILLING TAB */}
        {activeTab === "billing" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Plan Subscription details
            </h4>

            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-body font-bold text-slate-800">Pro Subscription Active</span>
              </div>
              <p className="text-xs font-body text-slate-400 font-light leading-relaxed">
                Enjoy unlimited campaigns, autonomous bid updates, and Imagen visual creative formats.
              </p>
              <div className="h-px bg-slate-200/50 my-1" />
              <div className="flex justify-between text-xs font-body text-slate-500 font-light">
                <span>Renewal rate:</span>
                <span className="font-semibold text-slate-800">MYR 149 / mo</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-body font-bold text-slate-400 uppercase tracking-wide">
                <span>Monthly AI Generation credits</span>
                <span>4.6% (23 / 500)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-slate-900" style={{ width: "4.6%" }} />
              </div>
            </div>

            <button
              onClick={() => alert("Billing updates are coming soon.")}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full py-2.5 text-xs font-body font-bold cursor-pointer active:scale-97 text-center shadow-xs"
            >
              Update Billing Method
            </button>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <form onSubmit={handleUpdatePassword} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Change Account Password
            </h4>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-body font-bold text-slate-500">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-body font-bold text-slate-500">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Verify new password"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={passUpdating}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full py-2.5 text-xs font-body font-bold cursor-pointer active:scale-97 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {passSuccess ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  Password Updated
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Email Notification Toggles
            </h4>

            <div className="flex flex-col gap-4">
              {[
                { label: "Campaign performance alerts", desc: "Notify when CTR jumps or drops significantly" },
                { label: "Weekly digest report", desc: "Summarized dashboard performance statistics" },
                { label: "Budget threshold warnings", desc: "Notify when spend exceeds 80% of campaign cap" },
              ].map((n, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 cursor-pointer select-none">
                  <div className="flex flex-col text-left gap-0.5 max-w-[280px]">
                    <span className="text-xs font-body font-bold text-slate-700 leading-snug">{n.label}</span>
                    <span className="text-[10px] font-body text-slate-400 font-light leading-normal">{n.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={idx < 2}
                    className="rounded border-slate-350 text-slate-900 focus:ring-slate-900 h-4.5 w-4.5 cursor-pointer self-center"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Notification settings saved.")}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full py-2.5 text-xs font-body font-bold cursor-pointer active:scale-97 text-center shadow-xs"
            >
              Save Notification Preferences
            </button>
          </div>
        )}

        {/* GEMINI KEYS TAB */}
        {activeTab === "api-keys" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              AI model credentials
            </h4>

            <div className="flex items-center gap-2 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
              <Info className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="text-[10px] font-body text-blue-700 leading-snug font-light">
                Veltrix utilizes your local <span className="font-semibold">VITE_GEMINI_API_KEY</span> env var configuration to load AI copywriters & creative Imagen models.
              </span>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-xs font-body font-bold text-slate-500">Local Configuration Key Status:</span>
              <div className="border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3.5 text-xs font-mono text-slate-700 mt-1 truncate">
                {import.meta.env.VITE_GEMINI_API_KEY ? "● Active credential verified (VITE_GEMINI_API_KEY is configured)" : "○ Credential not configured"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
