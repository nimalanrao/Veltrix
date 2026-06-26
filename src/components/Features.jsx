import React, { useEffect, useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { use3DTilt } from '../hooks/use3DTilt';

const FEATURES_DATA = [
  {
    step: 'Phase 01',
    title: 'Audience Insight Engine',
    desc: 'Veltrix aggregates search intent, social listening trends, and competitor positioning. It automatically constructs hyper-targeted buyer persona profiles to guide your copy generation.',
    tags: ['Market Research', 'Persona Mapping', 'Automated'],
    iconKey: 'audienceLarge'
  },
  {
    step: 'Phase 02',
    title: 'Multi-Channel Copywriting',
    desc: 'Generate high-converting marketing copy customized for Meta (Facebook/Instagram), Google Search Ads, Twitter/X posts, and Email newsletters. Choose from a selection of psychological tones.',
    tags: ['Ad Copywriting', 'Newsletters', 'Multi-tone Support'],
    iconKey: 'copyLarge'
  },
  {
    step: 'Phase 03',
    title: 'Smart Layout Curation',
    desc: 'Veltrix pairs ad copies with brand-consistent, highly relevant gradient layouts and design patterns. Ensure beautiful presentations across all feeds and formats instantly.',
    tags: ['Visual Presets', 'Social Mockups', 'Brand Consistent'],
    iconKey: 'layoutLarge'
  },
  {
    step: 'Phase 04',
    title: 'Direct API Deployment',
    desc: 'Synchronize and publish your campaigns instantly to Meta Ads Manager, Google Ads accounts, and CRM platforms with a single click. No copy-pasting or file exporting required.',
    tags: ['Meta Ads API', 'Google Ads API', 'One-Click Publish'],
    iconKey: 'apiLarge'
  },
  {
    step: 'Phase 05',
    title: 'Autonomous Bid Optimization',
    desc: 'Our predictive bid models monitor campaigns 24/7. Run autonomous A/B copy tests and dynamically adjust budgets to target the lowest cost-per-acquisition (CPA) and highest ROAS.',
    tags: ['A/B Testing', 'ROAS Optimization', 'Real-time Analytics'],
    iconKey: 'optimizationLarge'
  },
];

const ICONS = {
  search: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  zap: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  globe: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  audienceLarge: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', display: 'block' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <circle cx="12" cy="12" r="3" fill="var(--accent)" />
    </svg>
  ),
  copyLarge: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', display: 'block' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  layoutLarge: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', display: 'block' }}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  apiLarge: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', display: 'block' }}>
      <path d="M16 16l4-4-4-4" />
      <path d="M8 8l-4 4 4 4" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  ),
  optimizationLarge: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', display: 'block' }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M2 10l5-3 5 4 10-7" />
    </svg>
  )
};

const TAG_ICONS = [ICONS.search, ICONS.zap, ICONS.globe];

function TimelineItem({ feature }) {
  const [revealRef, isVisible] = useIntersectionObserver();
  const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt(8);

  return (
    <div 
      ref={revealRef} 
      className={`timeline-item ${isVisible ? 'visible' : ''}`}
      role="listitem"
    >
      <div className="timeline-dot" aria-hidden="true"></div>
      <article 
        ref={tiltRef} 
        className="timeline-card glass-card"
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {ICONS[feature.iconKey]}
        <span className="timeline-step">{feature.step}</span>
        <h3 className="timeline-title">{feature.title}</h3>
        <p className="timeline-desc">{feature.desc}</p>
        <div className="timeline-meta">
          {feature.tags.map((tag, ti) => (
            <span key={ti} className="timeline-tag">
              {TAG_ICONS[ti]} {tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function Features() {
  const timelineRef = useRef(null);
  const fillLineRef = useRef(null);

  useEffect(() => {
    let active = true;
    const handleScroll = () => {
      if (!timelineRef.current || !fillLineRef.current || !active) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Start filling when timeline top enters 80% of viewport height
      const startPoint = viewportHeight * 0.8;
      const totalDistance = rect.height;
      const currentProgress = startPoint - rect.top;
      
      let progress = currentProgress / totalDistance;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      
      fillLineRef.current.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('physics-scroll', handleScroll, { passive: true });
    // Trigger on mount
    handleScroll();

    return () => {
      active = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('physics-scroll', handleScroll);
    };
  }, []);

  return (
    <section id="features" className="courses" aria-label="Features" style={{ position: 'relative' }}>
      <div 
        className="parallax-orb" 
        aria-hidden="true" 
        style={{
          width: '450px',
          height: '450px',
          background: 'rgba(91, 191, 176, 0.03)',
          top: '15%',
          left: '-200px',
          position: 'absolute'
        }}
      ></div>
      <div className="gradient-bloom bloom-coral" style={{ width: '450px', height: '450px', right: '-150px', bottom: '10%', animationDelay: '-8s' }}></div>
      <div className="container">
        <div className="courses-header">
          <span className="section-label">Workflow</span>
          <h2 className="section-title">Autonomous Campaign Lifecycle</h2>
          <p className="section-desc">From initial audience insights to 24/7 bidding optimization, Veltrix manages your entire campaign lifecycle autonomously.</p>
        </div>
        <div ref={timelineRef} className="timeline" id="timeline" role="list">
          <div className="timeline-track-line" aria-hidden="true"></div>
          <div ref={fillLineRef} className="timeline-fill-line" aria-hidden="true"></div>
          {FEATURES_DATA.map((feature, i) => (
            <TimelineItem key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
