import logoSvg from "../assets/Veltrix text logo.svg";

export default function Footer() {
  return (
    <footer id="footer" className="relative py-12 px-8 md:px-12 border-t border-slate-100 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-2 group shrink-0">
          <img
            src={logoSvg}
            alt="Veltrix"
            className="h-6 w-auto object-contain brightness-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </a>
        
        {/* Copyright */}
        <span className="text-xs text-slate-400 font-body">
          © {new Date().getFullYear()} Veltrix. Made with ❤️ by Nithyanantha.
        </span>
      </div>
    </footer>
  );
}
