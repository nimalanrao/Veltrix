import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Building2, User, Mail, Lock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoSvg from "../assets/Veltrix logo.svg";

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    companySize: "",
    address: "",
    city: "",
    country: "",
    password: "",
  });

  const totalSteps = 5;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000);
    }
  };

  const updateForm = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Right side — Video (Mirrored layout from login) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#060609] lg:order-2">
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
        
        <div className="relative z-10 flex items-center gap-2 justify-end">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoSvg} alt="Veltrix" className="h-8 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md ml-auto text-right">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-1.5 py-1 backdrop-blur-md mb-6 ml-auto">
            <span className="bg-emerald-500 text-white rounded-full px-2 py-0.5 text-[10px] font-semibold font-body">
              Onboarding
            </span>
            <span className="text-xs text-white/90 pr-2 font-body font-medium">
              Join Veltrix Studio
            </span>
          </div>
          <h2 className="text-4xl font-heading italic text-white leading-tight mb-4 tracking-tight">
            Build campaigns that<br />optimize themselves.
          </h2>
          <p className="text-sm font-body text-white/70 font-light leading-relaxed">
            Create an account in less than a minute. Our AI will automatically tailor your initial workspace based on your profile.
          </p>
          
          <div className="mt-8 flex items-center justify-end gap-4">
            <div className="text-xs text-white/60 font-body text-right">
              Join leading marketers scaling with AI.
            </div>
            <div className="flex -space-x-3">
              {[44, 32, 11].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#060609] flex items-center justify-center shadow-sm overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i}`} alt={`User ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Left side — Register Quiz Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative overflow-hidden lg:order-1">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link to="/" className="flex items-center group">
              <img src={logoSvg} alt="Veltrix" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" />
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {[...Array(totalSteps)].map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${i < step ? "bg-emerald-500" : "bg-slate-100"}`} />
              ))}
            </div>
            <span className="text-[10px] font-body font-bold uppercase tracking-widest text-slate-400 mb-2 block">
              Step {step} of {totalSteps}
            </span>
            <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight mb-2">
              {step === 1 && "What's your name?"}
              {step === 2 && "Where can we reach you?"}
              {step === 3 && "Tell us about your team"}
              {step === 4 && "Where are you located?"}
              {step === 5 && "Secure your account"}
            </h1>
            <p className="text-sm font-body text-slate-500 font-light">
              {step === 1 && "Let's personalize your workspace."}
              {step === 2 && "We'll use this for your primary account login."}
              {step === 3 && "This helps us tailor your AI models. (Optional)"}
              {step === 4 && "For billing and local compliance."}
              {step === 5 && "Create a strong password to get started."}
            </p>
          </div>

          <form onSubmit={handleNext} className="group relative min-h-[160px]">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col gap-4"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. Nimalan Rao"
                      value={formData.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col gap-4"
                >
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="nimalan@example.com"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col gap-4"
                >
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Company Name (Optional)"
                      value={formData.companyName}
                      onChange={(e) => updateForm("companyName", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm"
                    />
                  </div>
                  <select
                    value={formData.companySize}
                    onChange={(e) => updateForm("companySize", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-body text-slate-600 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm"
                  >
                    <option value="" disabled>Select team size (Optional)</option>
                    <option value="1-10">1 - 10 employees</option>
                    <option value="11-50">11 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </motion.div>
              )}

              {/* STEP 4 - ADDRESS */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col gap-4"
                >
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <textarea
                      required
                      autoFocus
                      rows={2}
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => updateForm("country", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 5 - PASSWORD */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col gap-4"
                >
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      autoFocus
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all hover:border-slate-300 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-xs font-body font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer px-2 py-1"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-body font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md ${
                  step === totalSteps
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10"
                }`}
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : step === totalSteps ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-sm font-body text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
