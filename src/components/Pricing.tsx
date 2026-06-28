import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Shield, Zap, Building, CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Shield,
    description: "Essential tools for solo builders & startups.",
    price: "49",
    period: "/mo",
    billing: "Billed monthly. Cancel anytime.",
    features: [
      "10 autonomous campaigns / mo",
      "Meta & Google Ads integrations",
      "Basic CTR performance prediction",
      "Standard copy presets",
      "Community support access",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    icon: Zap,
    description: "Scale your campaigns with full AI intelligence.",
    price: "149",
    period: "/mo",
    billing: "Billed annually. Save 20%.",
    features: [
      "Unlimited campaigns & copies",
      "Autonomous A/B copy testing",
      "Continuous 24/7 bid optimization",
      "Advanced tone & audience tuning",
      "Custom webhook integrations",
      "Private Slack support channel",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    icon: Building,
    description: "Tailored brand models & dedicated API power.",
    price: "Custom",
    period: "",
    billing: "Custom SLAs & dedicated nodes.",
    features: [
      "Everything in Professional",
      "Fine-tuned custom brand models",
      "SSO & multi-tenant admin panel",
      "Priority SLA & API access keys",
      "Dedicated account success manager",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

function PricingCard({ plan }: { plan: (typeof plans)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  const Icon = plan.icon;

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-3xl p-6 md:p-8 flex flex-col gap-6 border transition-all duration-300 group cursor-pointer ${
        plan.featured
          ? "bg-slate-900 text-white border-slate-800 md:scale-[1.03]"
          : "bg-white text-slate-900 border-slate-200/60"
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ 
        y: -5, 
        borderColor: plan.featured ? "#475569" : "#94a3b8",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)"
      }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {plan.featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-850 text-[10px] font-body font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white">
          Highly Recommended
        </span>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-body font-semibold tracking-tight">{plan.name}</h3>
          <p className={`text-xs font-body ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
            {plan.description}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.featured ? "bg-white/10 text-white" : "bg-slate-50 text-slate-700 border border-slate-100"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1 border-t border-b py-5 my-1 border-slate-100/10">
        <div className="flex items-baseline gap-1.5">
          {plan.price !== "Custom" && (
            <span className={`text-xs font-body font-semibold ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>MYR</span>
          )}
          <span className="text-4xl sm:text-5xl font-heading italic tracking-tight leading-none">{plan.price}</span>
          <span className={`text-xs font-body ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>{plan.period}</span>
        </div>
        <span className={`text-[10px] font-body mt-1 ${plan.featured ? "text-slate-500" : "text-slate-400"}`}>
          {plan.billing}
        </span>
      </div>

      {/* Features List */}
      <ul className="flex flex-col gap-3 flex-1 pt-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${plan.featured ? "text-slate-400" : "text-slate-400"}`} />
            <span className={`text-sm font-body ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-body font-semibold transition-all duration-150 cursor-pointer ${
          plan.featured
            ? "bg-white text-black hover:bg-slate-100"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {plan.cta}
        <ArrowUpRight className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="inline-block bg-slate-100 border border-slate-200/60 rounded-full px-4 py-1.5 text-xs font-body font-semibold text-slate-600 mb-4">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading italic text-slate-950 leading-tight tracking-tight">
            Transparent pricing to match your pace
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-500 font-body font-light">
            Start free, scale smoothly, and cancel anytime. Join thousands of high-growth brands maximizing their ad performance.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-stretch pt-2">
          {plans.map((p) => (
            <PricingCard key={p.name} plan={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
