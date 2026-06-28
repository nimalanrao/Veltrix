import logoSvg from "../assets/Veltrix text logo.svg";

export default function Footer() {
  return (
    <footer id="footer" className="relative py-10 md:py-14 px-6 lg:px-10 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <a href="#hero" className="flex items-center gap-2 group w-32 shrink-0 justify-center sm:justify-start">
            <img
              src={logoSvg}
              alt="Veltrix"
              className="h-6 w-auto object-contain brightness-0 opacity-80 group-hover:scale-102 transition-transform duration-150"
            />
          </a>
          <span className="text-xs text-slate-400 font-body">
            © 2026 Veltrix. Made with ❤️ by Nithyanantha.
          </span>
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {["Features", "Playground", "Pricing", "FAQ"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-xs font-body font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-150"
            >
              {label}
            </a>
          ))}
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full hidden sm:inline" />
          <a
            href="https://github.com/nimalanrao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-body font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-150"
          >
            GitHub
          </a>
        </div>

      </div>
    </footer>
  );
}
