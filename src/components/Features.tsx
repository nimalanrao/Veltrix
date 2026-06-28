import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Brain, Zap, BarChart3, Layers, Rocket } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Audience Insight Engine",
    description:
      "Veltrix aggregates search intent, social listening trends, and competitor positioning. It automatically constructs hyper-targeted buyer persona profiles to guide your copy generation.",
    tags: ["Market Research", "Persona Mapping", "Automated"],
  },
  {
    icon: Zap,
    title: "Multi-Channel Copywriting",
    description:
      "Generate high-converting marketing copy customized for Meta (Facebook/Instagram), Google Search Ads, Twitter/X posts, and Email newsletters. Choose from a selection of psychological tones.",
    tags: ["Ad Copywriting", "Newsletters", "Multi-tone Support"],
  },
  {
    icon: Layers,
    title: "Smart Layout Curation",
    description:
      "Veltrix pairs ad copies with brand-consistent, highly relevant gradient layouts and design patterns. Ensure beautiful presentations across all feeds and formats instantly.",
    tags: ["Visual Presets", "Social Mockups", "Brand Consistent"],
  },
  {
    icon: Rocket,
    title: "Direct API Deployment",
    description:
      "Synchronize and publish your campaigns instantly to Meta Ads Manager, Google Ads accounts, and CRM platforms with a single click. No copy-pasting or file exporting required.",
    tags: ["Meta Ads API", "Google Ads API", "One-Click Publish"],
  },
  {
    icon: BarChart3,
    title: "Autonomous Bid Optimization",
    description:
      "Our predictive bid models monitor campaigns 24/7. Run autonomous A/B copy tests and dynamically adjust budgets to target the lowest cost-per-acquisition (CPA) and highest ROAS.",
    tags: ["A/B Testing", "ROAS Optimization", "Real-time Analytics"],
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon;

  return (
    <motion.div
      className="w-[85vw] sm:w-[380px] md:w-[420px] shrink-0 liquid-glass bg-white/70 border border-slate-100 rounded-2xl p-6 md:p-8 flex flex-col gap-4 group cursor-default"
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)" }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 rounded-xl bg-slate-900/5 flex items-center justify-center origin-center shrink-0"
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="h-5 w-5 text-slate-800" />
        </motion.div>
        <h3 className="text-lg font-body font-semibold text-slate-900 leading-tight">
          {feature.title}
        </h3>
      </div>

      <p className="text-sm text-slate-500 font-body font-light leading-relaxed flex-1">
        {feature.description}
      </p>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
        {feature.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-body font-semibold text-slate-600 bg-slate-900/5 rounded-full px-2.5 py-1 transition-colors group-hover:bg-slate-900/10"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Features() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Create a scroll-based horizontal translation
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Maps scroll progress 0 -> 1 to x transform.
  // We move the container to the left by a percentage of its own width.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

  return (
    <section id="features" ref={targetRef} className="relative h-[600vh] bg-white">
      {/* Sticky container stays in viewport for 600vh of scrolling */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden pt-12 md:pt-0">
        
        {/* Section Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto px-6 shrink-0">
          <span className="inline-block bg-slate-100 border border-slate-200/60 rounded-full px-4 py-1.5 text-xs font-body font-semibold text-slate-600 mb-4">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading italic text-slate-950 leading-tight tracking-tight">
            Autonomous Campaign Lifecycle
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-500 font-body font-light">
            From initial audience insights to 24/7 bidding optimization, Veltrix manages your entire campaign lifecycle autonomously.
          </p>
        </div>

        {/* Horizontal Scrolling Track */}
        <div className="w-full overflow-hidden flex items-center shrink-0 py-10">
          <motion.div style={{ x }} className="flex gap-6 md:gap-8 px-4 md:px-8 w-max">
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
