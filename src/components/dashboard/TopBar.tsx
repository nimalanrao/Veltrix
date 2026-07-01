import { Menu, ChevronsRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/campaigns": "Campaigns",
  "/dashboard/campaigns/new": "New Campaign",
  "/dashboard/audience": "Audience",
  "/dashboard/analytics": "Analytics",
  "/dashboard/integrations": "Integrations",
  "/dashboard/settings": "Settings",
};

export default function TopBar({ sidebarOpen, setSidebarOpen }: TopBarProps) {
  const location = useLocation();
  const { profile } = useProfile();
  const { user } = useAuth();

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/campaigns/")) {
      if (path === "/dashboard/campaigns/new") return "New Campaign";
      return "Campaign Detail";
    }
    return pageTitles[path] || "Dashboard";
  };

  const getInitial = () => {
    if (profile?.name) return profile.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <header className="h-14 border-b border-[#eae8e4] bg-[#fcfcfb] sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
      {/* Mobile Drawer / Collapsed Trigger & Title */}
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-md text-[#7c7b77] hover:text-[#1a1a1a] hover:bg-[#eae8e4]/60 transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 rounded-md text-[#7c7b77] hover:text-[#1a1a1a] hover:bg-[#eae8e4]/60 transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <h2 className="text-base font-body font-bold text-slate-900 tracking-tight ml-1">
          {getTitle()}
        </h2>
      </div>

      {/* User Status / Profile avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[12px] font-body font-semibold text-slate-700 leading-none">
            {profile?.name || "User"}
          </span>
          <span className="text-[10px] font-body text-[#8c8b88] mt-0.5 leading-none">
            {user?.email || ""}
          </span>
        </div>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="Profile" className="h-7 w-7 rounded-full object-cover border border-[#eae8e4]" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-body text-[11px] font-bold">
            {getInitial()}
          </div>
        )}
      </div>
    </header>
  );
}
