import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Activity, Users, BarChart3, Link as LinkIcon, Settings, LogOut, X } from "lucide-react";
import logoSvg from "../../assets/Veltrix logo.svg";
import { useAuth } from "../../hooks/useAuth";

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
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logoSvg} alt="Veltrix" className="h-8 w-8 object-contain" />
              <span className="font-heading italic font-bold text-xl tracking-tight text-slate-900">Veltrix</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-800"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all duration-150 text-left w-full cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                      : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-body font-bold text-slate-500 uppercase tracking-wider">Veltrix Pro</span>
            </div>
            <span className="text-[11px] font-body text-slate-400 font-light leading-snug">
              Autonomous Campaign optimization enabled.
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 text-rose-500 hover:bg-rose-50 rounded-xl text-sm font-body font-semibold transition-all w-full text-left cursor-pointer active:scale-98"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
