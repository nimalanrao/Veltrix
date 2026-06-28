import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

const stats = [
  { value: "320M+", label: "Ad creatives generated" },
  { value: "4.2x", label: "Average ROAS / ROI" },
  { value: "94%", label: "Time saved on copywriting" },
  { value: "15K+", label: "Active brands & agencies" },
];

function AnimatedStat({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  return (
    <motion.div
      ref={ref}
      className="liquid-glass bg-white/70 border border-slate-100 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center gap-2 hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" as const }}
    >
      <span className="text-4xl md:text-5xl font-heading italic text-slate-900 tracking-tight">
        {stat.value}
      </span>
      <span className="text-xs md:text-sm font-body font-medium text-slate-500">
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative py-20 md:py-24 px-6 lg:px-10 bg-slate-50/30">
      <div className="max-w-5xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <AnimatedStat key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
