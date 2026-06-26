import React, { useEffect, useState } from 'react';
import { use3DTilt } from '../hooks/use3DTilt';

const TOKENS = [
  { text: 'import ', className: 'code-keyword' },
  { text: 'veltrix ', className: '' },
  { text: 'as ', className: 'code-keyword' },
  { text: 'vt\n\n', className: '' },
  { text: 'agent ', className: '' },
  { text: '= ', className: 'code-keyword' },
  { text: 'vt.MarketingAgent(\n  ', className: '' },
  { text: 'brand', className: '' },
  { text: '=', className: 'code-keyword' },
  { text: '"Veltrix AI"', className: 'code-string' },
  { text: ',\n  ', className: '' },
  { text: 'objective', className: '' },
  { text: '=', className: 'code-keyword' },
  { text: '"Maximize_ROAS"', className: 'code-string' },
  { text: ',\n  ', className: '' },
  { text: 'budget', className: '' },
  { text: '=', className: 'code-keyword' },
  { text: '5000', className: 'code-number' },
  { text: '\n)\n\n', className: '' },
  { text: '# Launching autonomous campaigns...\n', className: 'code-comment' },
  { text: 'agent.generate_assets(channels=', className: '' },
  { text: '["Meta", "Google"]', className: 'code-string' },
  { text: ')\n', className: '' },
  { text: 'agent.deploy(optimize=', className: '' },
  { text: 'True', className: 'code-keyword' },
  { text: ')\n', className: '' },
  { text: 'Optimizing ROAS...', className: 'code-comment' }
];

export default function Hero() {
  const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt(10);
  const [visibleChars, setVisibleChars] = useState(0);
  const [terminalPhase, setTerminalPhase] = useState(0);

  const totalChars = TOKENS.reduce((acc, t) => acc + t.text.length, 0);

  useEffect(() => {
    const handleScrollEvent = (e) => {
      const y = e.detail?.scrollY ?? window.scrollY;
      
      let nextChars = 0;
      let nextPhase = 0;
      
      // Map scroll height:
      // - 0px to 300px: type the code text characters
      // - 300px to 400px: reveal terminal phase 1 (Epoch 42 progress)
      // - 400px to 500px: reveal terminal phase 2 (metrics log)
      // - > 500px: reveal terminal phase 3 (Epoch 43 progress)
      if (y <= 0) {
        nextChars = 0;
        nextPhase = 0;
      } else if (y <= 300) {
        nextChars = Math.min(totalChars, Math.floor((y / 300) * totalChars));
        nextPhase = 0;
      } else if (y <= 400) {
        nextChars = totalChars;
        nextPhase = 1;
      } else if (y <= 500) {
        nextChars = totalChars;
        nextPhase = 2;
      } else {
        nextChars = totalChars;
        nextPhase = 3;
      }
      
      setVisibleChars((prev) => (prev !== nextChars ? nextChars : prev));
      setTerminalPhase((prev) => (prev !== nextPhase ? nextPhase : prev));
    };

    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    window.addEventListener('physics-scroll', handleScrollEvent, { passive: true });
    
    // Initial call in case page starts scrolled down
    handleScrollEvent({ detail: { scrollY: window.scrollY } });

    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
      window.removeEventListener('physics-scroll', handleScrollEvent);
    };
  }, [totalChars]);

  return (
    <section id="hero" className="hero" aria-label="Hero section">
      {/* Animated background layer */}
      <div className="hero-bg" aria-hidden="true">
        <div className="grid-overlay"></div>
        <div className="gradient-bloom bloom-purple" style={{ width: '450px', height: '450px', left: '-10%', top: '20%' }}></div>
        <div className="gradient-bloom bloom-cyan" style={{ width: '500px', height: '500px', right: '5%', top: '30%', animationDelay: '-4s' }}></div>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Status badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true"></span>
            Autonomous Marketing Agent Live
          </div>

          <h1 className="hero-title">
            Autonomous AI<br />
            <span className="accent">Marketing</span>
          </h1>

          <p className="hero-subtitle">
            Veltrix creates, deploys, and optimizes high-performing campaigns across Meta, Google Search, X, and Email. Boost your ROAS, eliminate agency overhead, and scale conversions automatically.
          </p>

          <div className="hero-actions">
            <a href="#playground" className="btn btn-primary" id="hero-cta-explore">
              Launch Playground
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#features" className="btn btn-secondary" id="hero-cta-pricing">See Features</a>
          </div>
        </div>

        {/* Floating orbs and Interactive Dashboard */}
        <div 
          ref={tiltRef}
          style={{ ...tiltStyle, pointerEvents: 'auto' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="hero-visual" 
          aria-label="Interactive AI Dashboard Mockup"
        >
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          
          {/* Glassmorphic Dashboard Card */}
          <div className="hero-dashboard-card glass-card">
            <div className="dashboard-header">
              <div className="dashboard-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="dashboard-title">veltrix_campaign.py</span>
            </div>
            
            <div className="dashboard-body">
              <pre className="dashboard-code">
                <code>
                  {(() => {
                    let charCounter = 0;
                    return TOKENS.map((token, idx) => {
                      const start = charCounter;
                      charCounter += token.text.length;
                      
                      if (visibleChars <= start) return null;
                      const visibleLength = visibleChars - start;
                      const visibleText = token.text.substring(0, visibleLength);
                      
                      return (
                        <span key={idx} className={token.className}>
                          {visibleText}
                        </span>
                      );
                    });
                  })()}
                  {visibleChars < totalChars && <span className="caret">_</span>}
                </code>
              </pre>
              
              {terminalPhase >= 1 && (
                <div className="dashboard-terminal-output">
                  {terminalPhase >= 1 && (
                    <div className="terminal-line">Generating creatives... <span className="terminal-progress">[====================&gt;]</span></div>
                  )}
                  {terminalPhase >= 2 && (
                    <div className="terminal-line text-accent">Active: CTR: 5.24% - ROAS: 4.82x - CPA: -34%</div>
                  )}
                  {terminalPhase >= 3 && (
                    <div className="terminal-line">Ad spend optimized <span className="terminal-progress">[======================&gt;]</span> <span className="caret">_</span></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
