import React, { useEffect, useRef } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import Playground from './components/Playground';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';

function App() {
  const scrollProgressRef = useRef(null);
  const scrollPercentRef = useRef(null);

  useEffect(() => {
    // Parallax decorative orbs scroll effect
    const handleOrbsParallax = (scrollY) => {
      const orbs = document.querySelectorAll('.parallax-orb');
      if (!orbs.length) return;

      orbs.forEach((orb, i) => {
        const speedY = 0.08 + (i * 0.03);
        const y = scrollY * speedY;
        const x = Math.sin(scrollY * 0.002 + i) * 20; // gentle horizontal sway
        const rotate = scrollY * (0.03 + i * 0.01);
        orb.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
      });
    };

    const getPinOffset = () => {
      return window.innerWidth > 1024 ? 550 : 0;
    };

    const getMaxScrollRange = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      return Math.max(0, totalHeight + getPinOffset());
    };

    // Update custom mini scroll progress bar
    const updateScrollProgress = (scrollY) => {
      const maxScrollRange = getMaxScrollRange();
      if (maxScrollRange <= 0) return;
      const pct = Math.max(0, Math.min(100, Math.round((scrollY / maxScrollRange) * 100)));
      
      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.transform = `scaleY(${pct / 100})`;
      }
      if (scrollPercentRef.current) {
        scrollPercentRef.current.textContent = `${pct}%`;
      }
    };

    // Physics (momentum) scroll implementation
    const pinOffsetInit = getPinOffset();
    let currentScroll = window.scrollY > 0 ? window.scrollY + pinOffsetInit : 0;
    let targetScroll = currentScroll;
    let isScrolling = false;
    let animationFrameId = null;

    const handleNativeScroll = () => {
      if (!isScrolling) {
        const pinOffset = getPinOffset();
        currentScroll = window.scrollY > 0 ? window.scrollY + pinOffset : 0;
        targetScroll = currentScroll;
        handleOrbsParallax(currentScroll);
        updateScrollProgress(currentScroll);
        window.dispatchEvent(new CustomEvent('physics-scroll', { detail: { scrollY: currentScroll } }));
      }
    };

    const animateScroll = () => {
      const diff = targetScroll - currentScroll;
      // Physics interpolation (Lerp) - 0.085 provides a silky smooth ease
      currentScroll += diff * 0.085;
      
      const pinOffset = getPinOffset();
      const actualScrollY = currentScroll < pinOffset ? 0 : currentScroll - pinOffset;
      
      window.scrollTo(0, actualScrollY);
      handleOrbsParallax(currentScroll);
      updateScrollProgress(currentScroll);
      window.dispatchEvent(new CustomEvent('physics-scroll', { detail: { scrollY: currentScroll } }));
      
      if (Math.abs(diff) > 0.5) {
        animationFrameId = requestAnimationFrame(animateScroll);
      } else {
        isScrolling = false;
      }
    };

    const handleWheel = (e) => {
      // Don't hijack scroll if menu overlay is open (body overflow hidden)
      if (document.body.style.overflow === 'hidden') return;

      e.preventDefault();
      // Multiplier (0.55) balances trackpads and clicky mouse wheels
      targetScroll += e.deltaY * 0.55;
      
      const maxScrollRange = getMaxScrollRange();
      targetScroll = Math.max(0, Math.min(targetScroll, maxScrollRange));
      
      if (!isScrolling) {
        isScrolling = true;
        animationFrameId = requestAnimationFrame(animateScroll);
      }
    };

    const handleKeyDown = (e) => {
      // Don't hijack scroll if menu overlay is open (body overflow hidden)
      if (document.body.style.overflow === 'hidden') return;

      let delta = 0;
      if (e.key === 'ArrowDown') delta = 40;
      else if (e.key === 'ArrowUp') delta = -40;
      else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) delta = window.innerHeight * 0.8;
      else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) delta = -window.innerHeight * 0.8;
      else return; // let other keys pass

      e.preventDefault();
      targetScroll += delta;
      
      const maxScrollRange = getMaxScrollRange();
      targetScroll = Math.max(0, Math.min(targetScroll, maxScrollRange));
      
      if (!isScrolling) {
        isScrolling = true;
        animationFrameId = requestAnimationFrame(animateScroll);
      }
    };

    // Physics scroll navigation for anchor links
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Offset 90px accounts for the floating header pill
        const elementRect = targetElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.scrollY;
        
        if (targetId === '#hero') {
          targetScroll = 0;
        } else {
          targetScroll = (absoluteElementTop - 90) + getPinOffset();
        }
        
        if (!isScrolling) {
          isScrolling = true;
          animationFrameId = requestAnimationFrame(animateScroll);
        }
      }
    };

    const handleResize = () => {
      const pinOffset = getPinOffset();
      const currentVirt = window.scrollY > 0 ? window.scrollY + pinOffset : 0;
      updateScrollProgress(currentVirt);
    };

    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('click', handleAnchorClick);

    // Initial triggers
    handleOrbsParallax(currentScroll);
    updateScrollProgress(currentScroll);

    return () => {
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleAnchorClick);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <Preloader />
      <Header />
      <main style={{ position: 'relative', overflow: 'hidden' }}>
        <Hero />
        <Stats />
        <Features />
        <Playground />
        <Pricing />
        <FAQ />
      </main>
      <BackToTop />

      {/* Super mini compact vertical scroll progress indicator */}
      <div className="scroll-progress-tracker" aria-hidden="true">
        <span ref={scrollPercentRef} className="scroll-progress-text">0%</span>
        <div className="scroll-progress-track">
          <div ref={scrollProgressRef} className="scroll-progress-fill"></div>
        </div>
      </div>

      {/* Sticky GitHub Badge */}
      <a href="https://github.com/nimalanrao" target="_blank" rel="noopener noreferrer" className="github-sticky-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.54 6.5-6.47a4.64 4.64 0 0 0-1.2-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.3 1.2a11.5 11.5 0 0 0-6 0C7.2 1.6 6.2 1.9 6.2 1.9a4.2 4.2 0 0 0-.1 3.2A4.64 4.64 0 0 0 4 8.2c0 4.93 3.35 6.09 6.5 6.47a4.8 4.8 0 0 0-1 2.93V22"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </svg>
        <span>@nimalanrao</span>
      </a>
      
      <Footer />
    </>
  );
}

export default App;
