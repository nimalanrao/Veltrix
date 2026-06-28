import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import logoSvg from "../assets/Veltrix logo.svg";

const links = [
  { label: "Features", href: "#features" },
  { label: "Playground", href: "#playground" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
      style={{ transition: "padding 300ms cubic-bezier(0.23,1,0.32,1)" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between">
        {/* Logo Icon */}
        <a href="#hero" className="flex items-center group w-12 shrink-0" aria-label="Veltrix Home">
          <img
            src={logoSvg}
            alt=""
            className={`h-9 w-9 object-contain transition-all duration-300 group-hover:scale-105 group-active:scale-95 ${
              scrolled ? "brightness-0" : ""
            }`}
          />
        </a>

        {/* Desktop Nav — Fully Liquid Glass */}
        <nav className={`hidden md:flex items-center gap-1 rounded-full px-5 py-1.5 backdrop-blur-md border shadow-sm transition-all duration-300 ${
          scrolled ? "bg-slate-950/[0.03] border-slate-200/50" : "bg-white/10 border-white/20"
        }`}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`px-3 py-1.5 text-sm font-body font-semibold transition-colors duration-150 ${
                scrolled ? "text-slate-600 hover:text-slate-950" : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login"
            className={`ml-1 inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-body font-semibold active:scale-[0.97] cursor-pointer transition-all ${
              scrolled ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white text-black hover:bg-white/95"
            }`}
            style={{ transition: "transform 160ms cubic-bezier(0.23,1,0.32,1), background 200ms ease" }}
          >
            Launch App
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full border transition-all cursor-pointer active:scale-[0.95] ${
            scrolled ? "border-slate-200 bg-white/70" : "border-white/20 bg-white/10"
          }`}
          style={{ transition: "transform 160ms cubic-bezier(0.23,1,0.32,1)" }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close" : "Menu"}
        >
          {open ? (
            <X className={`h-5 w-5 ${scrolled ? "text-slate-800" : "text-white"}`} />
          ) : (
            <Menu className={`h-5 w-5 ${scrolled ? "text-slate-800" : "text-white"}`} />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl flex items-center justify-center md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ transition: "opacity 300ms cubic-bezier(0.23,1,0.32,1), visibility 300ms" }}
      >
        <button
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/80 text-slate-800 active:scale-95 transition-transform"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        <nav className="flex flex-col items-center gap-6">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-3xl font-body font-light text-slate-800 ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transition: `transform 400ms cubic-bezier(0.23,1,0.32,1) ${100 + i * 60}ms, opacity 400ms ease ${100 + i * 60}ms` }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login"
            className={`mt-2 inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-full px-6 py-3 text-lg font-body font-medium ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transition: "transform 400ms cubic-bezier(0.23,1,0.32,1) 340ms, opacity 400ms ease 340ms" }}
            onClick={() => setOpen(false)}
          >
            Launch App
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
