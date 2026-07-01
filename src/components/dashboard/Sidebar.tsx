import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Activity, Users, BarChart3, Link as LinkIcon, Settings, LogOut, ChevronsLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import logoSvg from "../../assets/Veltrix logo.svg";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Campaigns", icon: Activity, path: "/dashboard/campaigns" },
  { label: "Audience", icon: Users, path: "/dashboard/audience" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "Integrations", icon: LinkIcon, path: "/dashboard/integrations" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#f8f7f4] border-r border-[#eae8e4] flex flex-col justify-between transition-all duration-300 ease-in-out lg:static ${
          open 
            ? "w-60 opacity-100 translate-x-0 p-5" 
            : "w-0 opacity-0 -translate-x-full lg:translate-x-0 lg:p-0 lg:border-r-0 overflow-hidden"
        }`}
      >
        <div className="min-w-[200px]">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between mb-8 group/header">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center p-1.5 shadow-sm">
                <img src={logoSvg} alt="Veltrix" className="h-full w-full object-contain" />
              </div>
              <span className="font-heading italic font-bold text-base tracking-tight text-slate-900">Veltrix</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md text-[#7c7b77] hover:text-[#1a1a1a] hover:bg-[#eae8e4]/80 transition-colors cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) {
                      setOpen(false);
                    }
                  }}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13.5px] font-body font-medium transition-colors text-left w-full cursor-pointer ${
                    active
                      ? "bg-[#eae8e4] text-[#1a1a1a]"
                      : "text-[#5f5e5b] hover:text-[#1a1a1a] hover:bg-[#eae8e4]/50"
                  }`}
                >
                  <Icon className="h-4 w-4 text-[#7c7b77]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          {/* User profile card */}
          <div className="flex items-center gap-2.5 px-1 py-0.5">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="h-6 w-6 rounded-full object-cover border border-[#eae8e4]" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px]">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex flex-col text-left min-w-0 flex-1">
              <span className="text-[12px] font-body font-semibold text-slate-850 truncate leading-snug">
                {profile?.name || "User Profile"}
              </span>
              <span className="text-[9px] font-body text-slate-450 font-light truncate leading-none mt-0.5">
                {profile?.company_name || "Personal Workspace"}
              </span>
            </div>
          </div>

          <div className="bg-[#f1efe9] border border-[#e1ded7] rounded-xl p-3.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
              <span className="text-[10px] font-body font-bold text-slate-700 uppercase tracking-wider">Veltrix Pro</span>
            </div>
            <span className="text-[11px] font-body text-slate-500 leading-snug">
              Autonomous Campaign optimization enabled.
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50/50 rounded-md text-[13.5px] font-body font-medium transition-colors w-full text-left cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
