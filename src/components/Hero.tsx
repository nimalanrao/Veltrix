import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import BlurText from "./BlurText";
import logoSvg from "../assets/Veltrix text logo.svg";

export default function Hero() {
  const blurIn = {
    initial: { filter: "blur(10px)", opacity: 0, y: 20 },
    animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between px-6 lg:px-10 overflow-hidden bg-transparent">
      {/* Background Video with 100% opacity */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-100">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero_bg.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_115329_5e00c9c5-4d69-49b7-94c3-9c31c60bb644.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {/* Center Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-24 pb-20 max-w-3xl mx-auto px-8 md:px-12">
        {/* Badge */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-1.5 py-1 backdrop-blur-md">
            <span className="bg-white text-black rounded-full px-2.5 py-0.5 text-[10px] font-semibold font-body">
              New
            </span>
            <span className="text-xs text-white/90 pr-2 font-body font-medium">
              Autonomous AI Campaign Engine — Now Live
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <h1>
          <BlurText
            text="AI That Runs Your Entire Marketing"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] max-w-3xl justify-center tracking-[-3px]"
            delay={100}
            animateBy="words"
            direction="bottom"
          />
        </h1>

        {/* Subheading */}
        <motion.p
          className="mt-6 text-sm sm:text-base md:text-lg text-white/80 max-w-xl font-body font-light leading-relaxed"
          {...blurIn}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Create, test, and optimize high-converting campaigns across Meta, Google, X, and Email — all powered by autonomous AI agents.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
          {...blurIn}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-black rounded-full px-6 py-3 text-sm font-semibold font-body hover:bg-white/90 active:scale-[0.97] transition-all duration-150"
          >
            Login Now
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#playground"
            className="inline-flex items-center gap-2 text-white/85 hover:text-white transition-colors font-body font-semibold text-sm cursor-pointer active:scale-95"
          >
            Try Demo
            <Play className="h-3.5 w-3.5 fill-current" />
          </a>
        </motion.div>
      </div>

      {/* Bottom Bar — Centered Elements */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 pb-8 max-w-5xl mx-auto w-full border-t border-white/10 pt-6 px-8 md:px-12"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full text-center">
          {/* Logo Center */}
          <div className="flex items-center justify-center gap-2.5">
            <img src={logoSvg} alt="Veltrix" className="h-6 w-auto object-contain opacity-80" />
            <span className="text-[10px] text-white/50 font-body">
              © 2026 Veltrix
            </span>
          </div>

          {/* Channel Partners Center */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {["Meta", "Google", "X", "Email", "TikTok"].map((name) => (
              <span
                key={name}
                className="text-base md:text-lg font-heading italic text-white/40 hover:text-white/70 transition-colors cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
