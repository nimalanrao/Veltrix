import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import logoSvg from "../assets/Veltrix logo.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      if (rememberMe) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }
      setLoading(false);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left side — Video (Hidden on mobile) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#060609]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_115329_5e00c9c5-4d69-49b7-94c3-9c31c60bb644.mp4"
            type="video/mp4"
          />
        </video>
        
        <div className="relative z-10 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoSvg} alt="Veltrix" className="h-8 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-1.5 py-1 backdrop-blur-md mb-6">
            <span className="bg-white text-black rounded-full px-2 py-0.5 text-[10px] font-semibold font-body">
              Veltrix Studio
            </span>
            <span className="text-xs text-white/90 pr-2 font-body font-medium">
              Autonomous AI Campaign Engine
            </span>
          </div>
          <h2 className="text-4xl font-heading italic text-white leading-tight mb-4 tracking-tight">
            Stop guessing.<br />Start generating.
          </h2>
          <p className="text-sm font-body text-white/70 font-light leading-relaxed">
            Log in to access your intelligent marketing dashboard. Monitor predictive insights, autonomous bids, and live campaigns across all channels.
          </p>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[11, 32, 44].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#060609] flex items-center justify-center shadow-sm overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i}`} alt={`User ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-xs text-white/60 font-body">
              Join leading marketers scaling with AI.
            </div>
          </div>
        </div>
      </div>

      {/* Right side — Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link to="/" className="flex items-center group">
              <img src={logoSvg} alt="Veltrix" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" />
            </Link>
          </div>

          <div className="text-left mb-8">
            <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm font-body text-slate-500 font-light">
              Enter your details to access your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 group">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-body font-semibold text-slate-600">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-body font-semibold text-slate-600">Password</label>
                <a href="#" className="text-xs font-body font-medium text-slate-400 hover:text-slate-900 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300"
              />
            </div>

            <div className="flex items-center justify-start mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-200 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5 cursor-pointer"
                />
                <span className="text-xs font-body text-slate-500 font-medium">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-3 text-sm font-body font-semibold hover:bg-slate-800 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-slate-900/20"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Log in to dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Separator removed */}

          <p className="mt-8 text-center text-sm font-body text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
