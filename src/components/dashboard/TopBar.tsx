import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";

interface TopBarProps {
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

export default function TopBar({ setSidebarOpen }: TopBarProps) {
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
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer active:scale-95 transition-transform"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-xl md:text-2xl font-heading italic tracking-tight text-slate-950">
          {getTitle()}
        </h2>
      </div>

      {/* User Status / Profile avatar */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-body font-semibold text-slate-800 leading-none">
            {profile?.name || "User"}
          </span>
          <span className="text-[10px] font-body text-slate-400 font-light mt-0.5 leading-none">
            {user?.email || ""}
          </span>
        </div>
        <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-body text-xs font-bold border border-slate-800">
          {getInitial()}
        </div>
      </div>
    </header>
  );
}
