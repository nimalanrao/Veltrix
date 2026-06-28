import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const channels = [
  { id: "meta", label: "Meta Sponsored Ad" },
  { id: "google", label: "Google Search Ad" },
  { id: "x", label: "X / Twitter Post" },
  { id: "email", label: "Email Newsletter" },
];

const tones = [
  { id: "bold", label: "Urgent & Bold" },
  { id: "witty", label: "Witty & Humorous" },
  { id: "professional", label: "Professional" },
  { id: "inspiring", label: "Inspiring" },
];

const audiences = [
  { id: "tech", label: "Tech Founders & Startups" },
  { id: "ecommerce", label: "E-commerce Shoppers" },
  { id: "fitness", label: "Fitness & Health Enthusiasts" },
  { id: "b2b", label: "B2B Decision Makers" },
];

function InViewWrapper({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" as const }}>
      {children}
    </motion.div>
  );
}

export default function Playground() {
  const [productName, setProductName] = useState("FitTrack Pro");
  const [description, setDescription] = useState(
    "An AI-powered smart fitness ring that automatically tracks workout reps, sleep stages, and daily calorie burn with a sleek titanium body."
  );
  const [channel, setChannel] = useState("meta");
  const [tone, setTone] = useState("bold");
  const [audience, setAudience] = useState("tech");
  const [generated] = useState(false);
  const [loading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleGenerate = () => {
    setErrorText("Login to use this feature");
    // Clear after 3 seconds
    setTimeout(() => {
      setErrorText("");
    }, 3000);
  };

  const selectedChannel = channels.find((c) => c.id === channel);

  return (
    <section id="playground" className="relative py-24 md:py-32 px-6 lg:px-10 bg-slate-50/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block bg-slate-100 border border-slate-200/60 rounded-full px-4 py-1.5 text-xs font-body font-semibold text-slate-600 mb-4">
            Playground
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading italic text-slate-950 leading-tight tracking-tight">
            Veltrix AI Marketing Studio
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-500 font-body font-light">
            Experience autonomous campaign building. Enter your product details, pick a channel, and generate your marketing creatives instantly.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Form */}
          <InViewWrapper delay={0}>
            <div className="liquid-glass bg-white border border-slate-100 rounded-2xl p-6 md:p-8 flex flex-col gap-5 shadow-sm">
              <h3 className="text-sm font-body font-semibold text-slate-800 uppercase tracking-wider">
                Campaign Parameters
              </h3>

              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-semibold text-slate-500">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-semibold text-slate-500">Product Hooks & Desc</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Channel */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-semibold text-slate-500">Marketing Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  {channels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setChannel(c.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-body font-medium transition-all duration-150 cursor-pointer active:scale-[0.97] ${
                        channel === c.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone & Audience */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2.5 text-xs font-body text-slate-900 outline-none cursor-pointer focus:border-slate-300 focus:bg-white"
                  >
                    {tones.map((t) => (
                      <option key={t.id} value={t.id} className="text-slate-900">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2.5 text-xs font-body text-slate-900 outline-none cursor-pointer focus:border-slate-300 focus:bg-white"
                  >
                    {audiences.map((a) => (
                      <option key={a.id} value={a.id} className="text-slate-900">
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-white rounded-full py-3 text-sm font-body font-semibold hover:bg-slate-800 transition-all duration-160 active:scale-[0.97] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Campaign
                  </>
                )}
              </button>

              {errorText && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs font-semibold text-red-500 mt-2 font-body"
                >
                  {errorText}
                </motion.div>
              )}
            </div>
          </InViewWrapper>

          {/* Right — Preview */}
          <InViewWrapper delay={0.15}>
            <div className="liquid-glass bg-white border border-slate-100 rounded-2xl p-6 md:p-8 flex flex-col min-h-[400px] shadow-sm">
              {generated ? (
                <motion.div
                  className="flex flex-col gap-4 flex-1"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" as const }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body font-semibold text-slate-400 uppercase tracking-wider">
                      {selectedChannel?.label}
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-body font-semibold px-2.5 py-0.5 rounded-full">
                      Ready to Deploy
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex-1 flex flex-col gap-3">
                    <h4 className="text-base font-body font-semibold text-slate-900">
                      🔥 Stop scrolling. {productName} just changed the game.
                    </h4>
                    <p className="text-sm font-body text-slate-500 leading-relaxed font-light">
                      {description.slice(0, 120)}... Track everything. Optimize everything. No effort required.
                    </p>
                    <div className="mt-auto pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-body text-slate-400">
                        Predicted CTR: 4.8% · CPA: $2.10
                      </span>
                      <span className="text-[10px] font-body font-semibold text-emerald-600">
                        ▲ Above benchmark
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Est. CTR", value: "4.8%" },
                      { label: "Est. CPA", value: "$2.10" },
                      { label: "Score", value: "92/100" },
                    ].map((m) => (
                      <div key={m.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                        <div className="text-lg font-heading italic text-slate-900">{m.value}</div>
                        <div className="text-[9px] font-body font-semibold text-slate-400 uppercase tracking-wider">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Sparkles className="h-5 w-5 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-body font-semibold text-slate-800">
                    Ready to Launch
                  </h4>
                  <p className="text-xs font-body text-slate-400 max-w-[240px] font-light leading-relaxed">
                    Fill out the campaign parameters on the left and click Generate to see the autonomous copywriting & performance mockup.
                  </p>
                </div>
              )}
            </div>
          </InViewWrapper>
        </div>
      </div>
    </section>
  );
}
