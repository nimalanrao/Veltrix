import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Brain, Zap, BarChart3, Layers, Rocket, TrendingUp } from "lucide-react";

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
  {
    icon: TrendingUp,
    title: "Attribution & Scaling",
    description:
      "Veltrix automatically tracks conversions back to specific creative parameter pairs. It scales the highest-ROI segments while systematically cutting waste.",
    tags: ["ROAS Scaling", "Attribution", "Efficiency"],
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    // Max rotation 12deg for a premium subtle feel
    const rX = -(mouseY / height) * 12;
    const rY = (mouseX / width) * 12;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full shrink-0 p-[1px] rounded-3xl transition-shadow duration-300 z-10"
      style={{
        perspective: "1000px",
        boxShadow: isHovered 
          ? "0 30px 60px -15px rgba(15, 23, 42, 0.08)" 
          : "0 15px 30px -10px rgba(0, 0, 0, 0.04)",
      }}
    >
      <motion.div
        className="w-full h-full bg-white border border-[#eae8e4] rounded-3xl p-6 md:p-8 flex flex-col gap-5 cursor-default relative overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 150ms ease-out",
        }}
      >
        {/* Icon & Title with Parallax */}
        <div className="flex items-center gap-4" style={{ transform: "translateZ(30px)" }}>
          <div className="w-12 h-12 rounded-2xl bg-slate-900/5 border border-slate-900/5 flex items-center justify-center shrink-0">
            <Icon className="h-6 w-6 text-slate-800" />
          </div>
          <h3 className="text-xl font-heading italic text-slate-950 leading-tight">
            {feature.title}
          </h3>
        </div>

        {/* Description with Parallax */}
        <p 
          className="text-sm text-slate-600 font-body font-light leading-relaxed flex-1"
          style={{ transform: "translateZ(20px)" }}
        >
          {feature.description}
        </p>

        {/* Tags with Parallax */}
        <div 
          className="flex flex-wrap gap-2 pt-5 border-t border-slate-100"
          style={{ transform: "translateZ(15px)" }}
        >
          {feature.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-body font-semibold text-slate-700 bg-slate-900/5 border border-slate-900/5 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 bg-[#fcfcfb] overflow-hidden border-t border-[#eae8e4]">
      {/* Floating Ambient Depth Blobs */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          x: [0, -50, 60, 0],
          y: [0, 80, -30, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none z-0"
      />

      <div className="max-w-5xl mx-auto px-8 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 text-xs font-body font-semibold text-slate-600 mb-4 backdrop-blur-md">
            Workflow
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading italic text-slate-950 leading-tight tracking-tight">
            Autonomous Campaign Lifecycle
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-600 font-body font-light max-w-xl mx-auto">
            From initial audience insights to 24/7 bidding optimization, Veltrix manages your entire campaign lifecycle autonomously.
          </p>
        </div>

        {/* Feature Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
          {features.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
