import React, { useEffect, useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { use3DTilt } from '../hooks/use3DTilt';

const STATS_DATA = [
  { value: 320,   suffix: 'M+', display: '320', label: 'Ad creatives generated' },
  { value: 42,    suffix: 'x',  display: '4.2', label: 'Average ROAS / ROI', isDecimal: true },
  { value: 94,    suffix: '%',  display: '94', label: 'Time saved on copywriting' },
  { value: 15,    suffix: 'K+', display: '15',  label: 'Active brands & agencies' },
];

function StatCard({ stat, index }) {
  const [revealRef, isVisible] = useIntersectionObserver();
  const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt(12);
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (isVisible && !animatedRef.current) {
      animatedRef.current = true;
      const targetNum = stat.isDecimal ? stat.value : parseInt(stat.display, 10);
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * targetNum);
        
        setCount(stat.isDecimal ? (current / 10).toFixed(1) : current);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      // Add a slight delay to stat counter matching the transition delay!
      setTimeout(() => {
        requestAnimationFrame(step);
      }, index * 120);
    }
  }, [isVisible, stat, index]);

  const setCombinedRefs = (node) => {
    revealRef.current = node;
    tiltRef.current = node;
  };

  return (
    <article 
      ref={setCombinedRefs} 
      className={`stat-card glass-card reveal ${isVisible ? 'visible' : ''}`}
      style={{
        ...tiltStyle,
        transitionDelay: isVisible ? `${index * 120}ms` : '0ms'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`${stat.label}: ${count}${stat.suffix}`}
    >
      <div className="stat-number">
        <span className="stat-count">{count}</span>
        <span className="stat-suffix">{stat.suffix}</span>
      </div>
      <p className="stat-label">{stat.label}</p>
    </article>
  );
}

export default function Stats() {
  return (
    <section className="stats" id="stats" aria-label="Statistics">
      <div 
        className="parallax-orb" 
        aria-hidden="true" 
        style={{
          width: '400px',
          height: '400px',
          background: 'rgba(74, 154, 142, 0.04)',
          top: '-100px',
          right: '-100px',
          position: 'absolute'
        }}
      ></div>
      <div className="gradient-bloom bloom-indigo" style={{ width: '500px', height: '300px', left: '25%', top: '10%' }}></div>
      <div className="container">
        <div className="stats-grid" id="stats-grid">
          {STATS_DATA.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
