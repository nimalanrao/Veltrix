import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Settings, Users, Activity } from "lucide-react";
import logoSvg from "../assets/Veltrix logo.svg";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic simulation of logout
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logoSvg} alt="Veltrix" className="h-8 w-auto object-contain" />
            <span className="font-heading italic font-bold text-xl tracking-tight text-slate-900">Veltrix</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-body font-medium shadow-md shadow-slate-900/10">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-body font-medium transition-colors">
              <Activity className="h-4 w-4" />
              Campaigns
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-body font-medium transition-colors">
              <Users className="h-4 w-4" />
              Audience
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-body font-medium transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </a>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-rose-500 hover:bg-rose-50 rounded-xl text-sm font-body font-medium transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">
              Welcome back, Nithyanantha
            </h1>
            <p className="text-sm font-body text-slate-500 font-light mt-1">
              Here is what's happening with your campaigns today.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Active Campaigns", value: "12", trend: "+14%" },
              { label: "Total Spend", value: "$4,290", trend: "-2%" },
              { label: "Conversions", value: "849", trend: "+23%" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-body font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl font-heading italic text-slate-900">{stat.value}</span>
                  <span className={`text-xs font-body font-medium ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-96 flex items-center justify-center">
            <p className="text-sm font-body text-slate-400">Activity chart will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
