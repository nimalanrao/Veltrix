import React, { useState, useEffect } from 'react';
import logoSvg from '../assets/Veltrix text logo.svg';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  // Close menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className={`pill-navbar-container ${isScrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
      <nav className="pill-navbar" role="navigation" aria-label="Main navigation">
        <a href="#hero" className="navbar-logo" aria-label="Veltrix home" onClick={handleLinkClick}>
          <img src={logoSvg} alt="Veltrix Logo" className="navbar-logo-img" />
        </a>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links-desktop">
          <li><a href="#features" className="navbar-link-desktop" onClick={handleLinkClick}>Features</a></li>
          <li><a href="#playground" className="navbar-link-desktop" onClick={handleLinkClick}>Playground</a></li>
          <li><a href="#pricing" className="navbar-link-desktop" onClick={handleLinkClick}>Pricing</a></li>
          <li><a href="#faq" className="navbar-link-desktop" onClick={handleLinkClick}>FAQ</a></li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className={`navbar-hamburger ${isOpen ? 'open' : ''}`} 
          id="hamburger-btn" 
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen} 
          aria-controls="navbar-menu-mobile"
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div 
        id="navbar-menu-mobile" 
        className={`navbar-menu-mobile ${isOpen ? 'open' : ''}`}
      >
        <ul className="navbar-links-mobile">
          <li><a href="#features" className="navbar-link-mobile" onClick={handleLinkClick}>Features</a></li>
          <li><a href="#playground" className="navbar-link-mobile" onClick={handleLinkClick}>Playground</a></li>
          <li><a href="#pricing" className="navbar-link-mobile" onClick={handleLinkClick}>Pricing</a></li>
          <li><a href="#faq" className="navbar-link-mobile" onClick={handleLinkClick}>FAQ</a></li>
        </ul>
      </div>
    </header>
  );
}
