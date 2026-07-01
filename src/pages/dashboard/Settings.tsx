import { useState, useEffect, useRef } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import { CheckCircle, Info, Shield, CreditCard, User, Bell, Key, RefreshCw, Upload } from "lucide-react";

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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [creditCount, setCreditCount] = useState(0);
  
  // Security Form
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passUpdating, setPassUpdating] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);

  // Hydrate fields once loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCompanyName(profile.company_name || "");
      setCompanySize(profile.company_size || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  // Load actual AI logs usage count
  useEffect(() => {
    async function loadGeminiLogs() {
      if (!user) return;
      try {
        const { count, error } = await supabase
          .from("gemini_log")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (!error && count !== null) {
          setCreditCount(count);
        }
      } catch (err) {
        console.error("Error loading logs count:", err);
      }
    }
    loadGeminiLogs();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSaveSuccess(false);
    
    const { error } = await updateProfile({
      name,
      company_name: companyName,
      company_size: companySize,
      avatar_url: avatarUrl || null,
    });

    setUpdating(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("Error saving profile: " + error.message);
    }
  };

  const handleFileChange = async (file: File) => {
    if (!file || !user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from("campaign-images")
        .upload(fileName, file, { contentType: file.type, upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("campaign-images")
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      setAvatarUrl(publicUrl);
      
      // Update DB profile directly
      await updateProfile({ avatar_url: publicUrl });
    } catch (err: any) {
      alert("Error uploading avatar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
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
    <div className="flex flex-col gap-6 md:gap-8 text-left max-w-5xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm font-body text-slate-500 font-light mt-1">
          Configure profile workspace metadata, check billing subscription caps, and change security.
        </p>
      </div>

      {/* Main Spaced Layout Container */}
      <div className="flex flex-col md:flex-row gap-8 items-start w-full">
        {/* Left Pane (Vertical Tabs on Desktop, Row scroll on Mobile) */}
        <div className="w-full md:w-56 shrink-0 flex md:flex-col gap-1 border-b md:border-b-0 md:border-r border-[#eae8e4] pb-4 md:pb-0 md:pr-4 overflow-x-auto md:overflow-x-visible scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-md text-[13.5px] font-body font-medium transition-colors text-left shrink-0 md:shrink-1 cursor-pointer ${
                  active
                    ? "bg-[#eae8e4] text-[#1a1a1a]"
                    : "text-[#5f5e5b] hover:text-[#1a1a1a] hover:bg-[#eae8e4]/40"
                }`}
              >
                <Icon className="h-4 w-4 text-[#7c7b77]" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Pane (Main form content) */}
        <div className="flex-1 w-full max-w-xl">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="bg-white p-6 md:p-8 rounded-2xl border border-[#eae8e4] shadow-xs flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-wider leading-none">
                  Workspace Profile Details
                </h4>
                <p className="text-[11px] font-body text-slate-400 mt-1 leading-none">
                  Customize public profile avatars and enterprise tags.
                </p>
              </div>

              {/* Drag and Drop Profile Image Area */}
              <div className="flex items-center gap-5">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative group h-16 w-16 rounded-full overflow-hidden border border-slate-200 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center bg-[#fcfcfb] select-none"
                >
                  {uploading ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-slate-400" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl uppercase">
                      {name ? name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}

                  {/* Drag-over hover action text overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-[9px] text-white font-medium">
                    <Upload className="h-3.5 w-3.5 mb-0.5" />
                    <span>Upload</span>
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-xs font-body font-bold text-slate-700">Profile Picture</span>
                  <span className="text-[10px] font-body text-slate-400 font-light mt-0.5 leading-relaxed max-w-[200px]">
                    Drag & drop an image or click to browse. Max size 2MB.
                  </span>
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-bold text-slate-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fcfcfb] border border-[#eae8e4] rounded-xl px-4 py-2.5 text-xs font-body text-slate-900 outline-none focus:bg-white focus:border-slate-350 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-bold text-slate-500">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#fcfcfb] border border-[#eae8e4] rounded-xl px-4 py-2.5 text-xs font-body text-slate-900 outline-none focus:bg-white focus:border-slate-350 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-bold text-slate-500">Company Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-[#fcfcfb] border border-[#eae8e4] rounded-xl px-4 py-2.5 text-xs font-body text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-slate-350 transition-all"
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
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#eae8e4] shadow-xs flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-wider leading-none">
                  Plan Subscription details
                </h4>
                <p className="text-[11px] font-body text-slate-400 mt-1 leading-none">
                  Manage workspace limits and invoices.
                </p>
              </div>

              <div className="border border-[#e1ded7] bg-[#f1efe9]/50 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-body font-bold text-slate-800">Pro Subscription Active</span>
                </div>
                <p className="text-xs font-body text-slate-500 font-light leading-relaxed">
                  Enjoy unlimited campaigns, autonomous bid updates, and Imagen visual creative formats.
                </p>
                <div className="h-px bg-slate-200/50 my-1" />
                <div className="flex justify-between text-xs font-body text-slate-500 font-light">
                  <span>Renewal rate:</span>
                  <span className="font-semibold text-slate-800">MYR 149 / mo</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] font-body font-bold text-slate-450 uppercase tracking-wide">
                  <span>Monthly AI Generation credits</span>
                  <span>{((creditCount / 500) * 100).toFixed(1)}% ({creditCount} / 500)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.min(100, (creditCount / 500) * 100)}%` }} />
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
            <form onSubmit={handleUpdatePassword} className="bg-white p-6 md:p-8 rounded-2xl border border-[#eae8e4] shadow-xs flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-wider leading-none">
                  Change Account Password
                </h4>
                <p className="text-[11px] font-body text-slate-400 mt-1 leading-none">
                  Ensure account security with a strong credential.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-bold text-slate-500">New Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-[#fcfcfb] border border-[#eae8e4] rounded-xl px-4 py-2.5 text-xs font-body text-slate-900 outline-none focus:bg-white focus:border-slate-350 transition-all"
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
                  className="w-full bg-[#fcfcfb] border border-[#eae8e4] rounded-xl px-4 py-2.5 text-xs font-body text-slate-900 outline-none focus:bg-white focus:border-slate-350 transition-all"
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
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#eae8e4] shadow-xs flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-wider leading-none">
                  Email Notification Toggles
                </h4>
                <p className="text-[11px] font-body text-slate-400 mt-1 leading-none">
                  Choose what workspace digests you receive.
                </p>
              </div>

              <div className="flex flex-col gap-4.5">
                {[
                  { label: "Campaign performance alerts", desc: "Notify when CTR jumps or drops significantly" },
                  { label: "Weekly digest report", desc: "Summarized dashboard performance statistics" },
                  { label: "Budget threshold warnings", desc: "Notify when spend exceeds 80% of campaign cap" },
                ].map((n, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-4 cursor-pointer select-none">
                    <div className="flex flex-col text-left gap-0.5 max-w-[280px]">
                      <span className="text-xs font-body font-bold text-slate-700 leading-snug">{n.label}</span>
                      <span className="text-[10px] font-body text-slate-450 font-light leading-normal">{n.desc}</span>
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
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#eae8e4] shadow-xs flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-body font-bold text-slate-800 uppercase tracking-wider leading-none">
                  AI model credentials
                </h4>
                <p className="text-[11px] font-body text-slate-400 mt-1 leading-none">
                  Check Gemini integration endpoint configuration.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                <Info className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-[10px] font-body text-blue-700 leading-snug font-light">
                  Veltrix utilizes your local <span className="font-semibold">VITE_GEMINI_API_KEY</span> env var configuration to load AI copywriters & creative Imagen models.
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-xs font-body font-bold text-slate-500">Local Gemini API Key:</span>
                <div className="relative group/key border border-[#eae8e4] bg-[#fcfcfb] rounded-xl px-4 py-3.5 text-xs font-mono text-slate-700 mt-1 cursor-pointer overflow-hidden transition-all duration-200">
                  <span className="filter blur-[3.5px] group-hover/key:blur-none transition-all duration-300 select-all block pr-24">
                    {import.meta.env.VITE_GEMINI_API_KEY || "VITE_GEMINI_API_KEY is not set"}
                  </span>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#8c8b88] group-hover/key:opacity-0 transition-opacity duration-200 pointer-events-none select-none">
                    Hover to reveal key
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
