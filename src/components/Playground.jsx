import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { use3DTilt } from '../hooks/use3DTilt';

// Custom SVG Icons to replace emojis
const ICONS = {
  megaphone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  ),
  mail: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  bolt: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  targetLarge: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  image: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  brush: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M7.5 10.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z" />
      <path d="M11.5 7.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z" />
      <path d="M16.5 9.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z" />
      <path d="M6 14c0-2 2-3 4-3 2.5 0 4.5 1.5 4.5 3.5S12.5 18 10 18s-4-2-4-4z" />
    </svg>
  ),
  file: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  rocket: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
      <path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 3.5s2-1 3.5-2.5" />
      <path d="M12 2C9 2 5 6 5 10c0 1.8.8 3.5 2 4.5 1 1.2 2.7 2 4.5 2 4 0 8-4 8-7 0-3-3-5.5-7.5-7.5z" />
      <path d="M9 15l3-3" />
      <path d="M17 7c-.5.5-1 1.5-1 2.5s.5 2 1 2.5" />
    </svg>
  ),
  chat: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  repeat: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  heart: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  chart: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
};

// Channels configuration
const CHANNELS = [
  { id: 'meta', label: 'Meta Sponsored Ad', icon: ICONS.megaphone },
  { id: 'google', label: 'Google Search Ad', icon: ICONS.search },
  { id: 'x', label: 'X / Twitter Post', icon: ICONS.x },
  { id: 'email', label: 'Email Newsletter', icon: ICONS.mail }
];

// Tones configuration
const TONES = [
  { id: 'bold', label: 'Urgent & Bold' },
  { id: 'witty', label: 'Witty & Humorous' },
  { id: 'professional', label: 'Professional' },
  { id: 'inspiring', label: 'Inspiring' }
];

// Target Audiences
const AUDIENCES = [
  { id: 'tech', label: 'Tech Founders & Startups' },
  { id: 'ecommerce', label: 'E-commerce Shoppers' },
  { id: 'fitness', label: 'Fitness & Health Enthusiasts' },
  { id: 'b2b', label: 'B2B Business Decision Makers' }
];

// Phase loading states
const LOADING_STEPS = [
  'Extracting brand values & product hooks...',
  'Analyzing competitor strategies & audience intent...',
  'Drafting high-converting ad copy variations...',
  'Predicting Click-Through-Rate (CTR) & quality scores...',
  'Structuring live mockup templates...'
];

export default function Playground() {
  const [revealRef, isVisible] = useIntersectionObserver();
  const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt(4);

  // Form State
  const [productName, setProductName] = useState('FitTrack Pro');
  const [productDesc, setProductDesc] = useState('An AI-powered smart fitness ring that automatically tracks workout reps, sleep stages, and daily calorie burn with a sleek titanium body.');
  const [channel, setChannel] = useState('meta');
  const [tone, setTone] = useState('bold');
  const [audience, setAudience] = useState('tech');

  // Interactive Flow States
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [campaignGenerated, setCampaignGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('mockup'); // 'mockup' or 'copy'
  const [showDeployModal, setShowDeployModal] = useState(false);

  // Generated Content State
  const [generatedData, setGeneratedData] = useState(null);

  // Handle generation action
  const handleGenerate = (e) => {
    e.preventDefault();
    if (!productName.trim() || !productDesc.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setCampaignGenerated(false);

    // Dynamic generation of results based on inputs
    const audienceLabel = AUDIENCES.find(a => a.id === audience)?.label || 'your target audience';
    const data = generateCampaignContent(productName, productDesc, tone, channel, audienceLabel);
    setGeneratedData(data);
  };

  // Simulated progress timer
  useEffect(() => {
    let interval = null;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 5;
          
          // Update text description based on percentage
          const stepIndex = Math.min(
            LOADING_STEPS.length - 1,
            Math.floor((next / 100) * LOADING_STEPS.length)
          );
          setLoadingText(LOADING_STEPS[stepIndex]);

          if (next >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            setCampaignGenerated(true);
            return 100;
          }
          return next;
        });
      }, 120);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // Helper generator logic (all in MYR currency)
  const generateCampaignContent = (name, desc, tone, channel, audienceText) => {
    const cleanDesc = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
    
    // Core Copy Templates
    let copy = {
      headline: '',
      body: '',
      cta: 'Learn More',
      hashtags: '',
      ctr: '5.18%',
      cpc: 'MYR 1.80',
      score: '96/100',
      rating: 'Exceptional Performance'
    };

    // CTR adjustments based on parameters to feel real
    let baseCtr = 3.2;
    if (tone === 'bold') baseCtr += 0.8;
    if (tone === 'witty') baseCtr += 1.2;
    if (channel === 'email') baseCtr += 15.0; // Open rate representation
    
    if (channel === 'meta') {
      copy.cta = 'Shop Now';
      copy.hashtags = `#${name.replace(/\s+/g, '')} #Innovation #Marketing`;
      
      if (tone === 'bold') {
        copy.headline = `Stop Settling. Upgrade to ${name} Today.`;
        copy.body = `Tired of standard solutions? ${name} changes everything. Specially engineered for ${audienceText}, it delivers maximum impact. ${desc} Get yours now before stock runs out!`;
      } else if (tone === 'witty') {
        copy.headline = `Your current setup called. It's jealous of ${name}.`;
        copy.body = `No offence, but your old routine is lagging behind. Meet ${name}: ${desc} Designed for ${audienceText} who prefer smart over hard work. 😉`;
      } else if (tone === 'inspiring') {
        copy.headline = `Unlock Your Real Potential with ${name}.`;
        copy.body = `Every revolution begins with a single step. ${name} is crafted to empower ${audienceText} to achieve greatness. Discover how our titanium ring tracks your journey: ${cleanDesc}`;
      } else {
        copy.headline = `Introducing ${name} — Professional Grade`;
        copy.body = `Discover the engineering behind ${name}. A professional system designed for ${audienceText} to optimize workflow. Key features: ${cleanDesc}`;
        copy.cta = 'Learn More';
      }
      
      copy.ctr = `${baseCtr.toFixed(2)}%`;
      copy.cpc = `MYR ${(4.0 - baseCtr * 0.4).toFixed(2)}`;
      copy.score = `${Math.floor(80 + baseCtr * 3)}/100`;

    } else if (channel === 'google') {
      copy.cta = 'Visit Site';
      copy.hashtags = '';
      
      if (tone === 'bold') {
        copy.headline = `Official ${name} | Solve Your Headaches Now`;
        copy.body = `Don't wait. ${name} offers the fastest solution for ${audienceText}. Tracks reps, sleep, and calories: ${cleanDesc} Click to order today!`;
      } else if (tone === 'witty') {
        copy.headline = `Looking for ${name}? | Yes, We Are That Good`;
        copy.body = `Stop scrolling, you found it. ${name} is the smart choice for ${audienceText}. ${cleanDesc} Read reviews and get 20% off.`;
      } else if (tone === 'inspiring') {
        copy.headline = `Begin Your Journey | ${name} Official Site`;
        copy.body = `Live healthier, train smarter. ${name} helps ${audienceText} monitor metrics with extreme precision. Explore the titanium fitness ring.`;
      } else {
        copy.headline = `Official ${name} — Smart Titanium Fitness Ring`;
        copy.body = `The certified choice for ${audienceText}. Fully autonomous tracking of sleep, workouts, and calories. Order directly with free shipping.`;
      }

      copy.ctr = `${(baseCtr - 1.2).toFixed(2)}%`;
      copy.cpc = `MYR ${(6.8 - baseCtr * 0.7).toFixed(2)}`;
      copy.score = `${Math.floor(75 + baseCtr * 3.5)}/100`;

    } else if (channel === 'x') {
      copy.cta = 'Read Thread';
      copy.hashtags = `#${name.replace(/\s+/g, '')} #TechTrends`;
      
      if (tone === 'bold') {
        copy.body = `WARNING: If you are not using ${name}, you're falling behind. 🧵\n\nBuilt specifically for ${audienceText}, it automates metrics using state-of-the-art tech. Read on to see how: ${cleanDesc}`;
      } else if (tone === 'witty') {
        copy.body = `We built a smart ring so you don't have to keep pretending you remember your workout reps. 🧠\n\n${name} does it for you in titanium style. Built for ${audienceText}: ${cleanDesc}`;
      } else if (tone === 'inspiring') {
        copy.body = `Success isn't about luck. It's about data and consistency. 💎\n\n${name} provides ${audienceText} with real-time biometric tracking. Here's our story of building a fitness revolution:`;
      } else {
        copy.body = `Product Launch: Announcing ${name}, the advanced smart ring designed for ${audienceText}. Automatically logging sleep stages, active burn, and workout volumes. details:`;
      }

      copy.ctr = `${(baseCtr + 0.5).toFixed(2)}%`;
      copy.cpc = `MYR ${(2.8 - baseCtr * 0.3).toFixed(2)}`;
      copy.score = `${Math.floor(82 + baseCtr * 3.2)}/100`;

    } else if (channel === 'email') {
      copy.cta = 'Get 20% Off';
      copy.hashtags = '';
      
      if (tone === 'bold') {
        copy.headline = `Urgent: Unlock the next level with ${name}`;
        copy.body = `Hey there,\n\nOpportunities wait for no one. We've launched ${name} because ${audienceText} deserve better tracking. Our smart ring logs workout reps, sleep, and calories in a sleek shell. Click below to claim your pre-order spot.`;
      } else if (tone === 'witty') {
        copy.headline = `Your fingers have been feeling a bit empty lately...`;
        copy.body = `Hello friend,\n\nWe noticed you've been working hard but missing the metrics. Enter ${name}: ${desc}\n\nIt is the smart titanium ring that acts as your private coach. Join thousands of ${audienceText} who leveled up today.`;
      } else if (tone === 'inspiring') {
        copy.headline = `Designed for greatness: The story of ${name}`;
        copy.body = `Hello,\n\nWe believe technology should seamlessly blend into your daily life. That's why we created ${name}.\n\nBy tracking workout volume, recovery scores, and sleep architecture, it guides ${audienceText} towards self-mastery. Read the launch note inside.`;
      } else {
        copy.headline = `Product Announcement: Introducing ${name}`;
        copy.body = `Dear Subscriber,\n\nWe are pleased to introduce ${name}, our latest smart health device designed for ${audienceText}. Constructed from aerospace titanium, it monitors sleep stages, calories, and workouts. Full specifications are linked below.`;
      }

      copy.ctr = `${(baseCtr + 12.0).toFixed(2)}%`; // Treated as Open Rate
      copy.cpc = 'N/A (Newsletter)';
      copy.score = `${Math.floor(88 + baseCtr * 0.5)}/100`;
    }

    return copy;
  };

  const triggerDeploy = () => {
    setShowDeployModal(true);
  };

  return (
    <section id="playground" className="courses" ref={revealRef} aria-label="Playground Studio" style={{ position: 'relative', padding: '100px 0' }}>
      {/* Background Orbs */}
      <div 
        className="parallax-orb" 
        aria-hidden="true" 
        style={{
          width: '500px',
          height: '500px',
          background: 'rgba(74, 154, 142, 0.03)',
          top: '20%',
          right: '-250px',
          position: 'absolute'
        }}
      ></div>
      <div className="gradient-bloom bloom-indigo" style={{ width: '450px', height: '450px', left: '-150px', bottom: '15%', animationDelay: '-6s' }}></div>

      <div className="container">
        {/* Header */}
        <div className="courses-header" style={{ marginBottom: '48px' }}>
          <span className="section-label">Playground</span>
          <h2 className="section-title">Veltrix AI Marketing Studio</h2>
          <p className="section-desc">Experience autonomous campaign building. Enter your product details, pick a channel, and generate your marketing creatives instantly.</p>
        </div>

        {/* Dashboard Grid */}
        <div 
          ref={tiltRef}
          style={tiltStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="playground-dashboard glass-card"
        >
          {/* Left Panel: Inputs */}
          <div className="playground-left">
            <h3 className="timeline-title" style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {ICONS.bolt} Campaign Parameters
            </h3>

            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              {/* Product Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Product Name</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Eco Bottle"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(74, 154, 142, 0.25)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--text-bright)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(74, 154, 142, 0.25)'}
                  required
                />
              </div>

              {/* Product Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Product Hooks & Desc</label>
                <textarea 
                  rows="4"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Describe your product value propositions..."
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(74, 154, 142, 0.25)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--text-bright)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    lineHeight: '1.5',
                    resize: 'none',
                    transition: 'border-color var(--transition-fast)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(74, 154, 142, 0.25)'}
                  required
                />
              </div>

              {/* Channel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Marketing Channel</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {CHANNELS.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannel(ch.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: channel === ch.id ? 'var(--accent)' : 'rgba(74, 154, 142, 0.15)',
                        background: channel === ch.id ? 'rgba(74, 154, 142, 0.15)' : 'rgba(15, 20, 25, 0.4)',
                        color: channel === ch.id ? 'var(--accent-light)' : 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: channel === ch.id ? '600' : '400',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {ch.icon} {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone & Audience */}
              <div className="playground-tone-audience" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(74, 154, 142, 0.25)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: 'var(--text-bright)',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  >
                    {TONES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(74, 154, 142, 0.25)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: 'var(--text-bright)',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  >
                    {AUDIENCES.map(a => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="btn btn-primary"
                style={{
                  marginTop: '12px',
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  opacity: isGenerating ? 0.7 : 1
                }}
              >
                {isGenerating ? 'Generating Campaign...' : 'Generate Campaign'}
                {!isGenerating && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: Output & Mockup */}
          <div className="playground-right">
            {/* Blank State */}
            {!isGenerating && !campaignGenerated && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, textAlign: 'center', color: 'var(--text-muted)', gap: '16px' }}>
                {ICONS.targetLarge}
                <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', fontWeight: '600' }}>Ready to Launch</h4>
                <p style={{ fontSize: '0.85rem', maxWidth: '300px' }}>Fill out the campaign parameters on the left and click Generate to see the autonomous copywriting & performance mockup.</p>
              </div>
            )}

            {/* Generating State */}
            {isGenerating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '20px' }}>
                <div className="preloader-spinner" style={{ borderTopColor: 'var(--accent)', width: '40px', height: '40px' }} />
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}>
                  <h4 style={{ color: 'var(--text-bright)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px' }}>Veltrix Agent Compiling</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent-light)', height: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '16px' }}>
                    {loadingText}
                  </p>
                  
                  {/* Progress Bar Container */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, var(--accent), var(--accent-light))', transition: 'width 0.1s ease', borderRadius: '99px' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>{progress}% Complete</span>
                </div>
              </div>
            )}

            {/* Success Generated State */}
            {campaignGenerated && generatedData && (
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '20px', height: '100%' }}>
                {/* Header Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(0, 0, 0, 0.25)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(74, 154, 142, 0.1)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>CTR Prediction</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--accent-light)', fontFamily: 'var(--font-heading)' }}>{generatedData.ctr}</strong>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Est. CPC</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--text-bright)', fontFamily: 'var(--font-heading)' }}>{generatedData.cpc}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Success Score</span>
                    <strong style={{ fontSize: '1.25rem', color: '#ffbd2e', fontFamily: 'var(--font-heading)' }}>{generatedData.score}</strong>
                  </div>
                </div>

                {/* Tabs Selector */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button
                    onClick={() => setActiveTab('mockup')}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: activeTab === 'mockup' ? 'var(--accent-light)' : 'var(--text-muted)',
                      borderBottom: activeTab === 'mockup' ? '2px solid var(--accent)' : 'none',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {ICONS.brush} Visual Mockup
                  </button>
                  <button
                    onClick={() => setActiveTab('copy')}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: activeTab === 'copy' ? 'var(--accent-light)' : 'var(--text-muted)',
                      borderBottom: activeTab === 'copy' ? '2px solid var(--accent)' : 'none',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {ICONS.file} Copywriting Content
                  </button>
                </div>

                {/* Tab Contents */}
                <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '330px', paddingRight: '4px' }}>
                  {activeTab === 'copy' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                      {channel !== 'x' && (
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Subject / Headline</span>
                          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-bright)', fontSize: '0.9rem', fontWeight: '600', marginTop: '4px' }}>
                            {generatedData.headline}
                          </div>
                        </div>
                      )}
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Primary Content</span>
                        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                          {generatedData.body}
                        </div>
                      </div>
                      {generatedData.hashtags && (
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Hashtags</span>
                          <div style={{ color: 'var(--accent-light)', fontSize: '0.8rem', marginTop: '4px' }}>
                            {generatedData.hashtags}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mockup Visual Representation */
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {channel === 'meta' && (
                        /* Meta Ad Instagram style card */
                        <div style={{ width: '100%', maxWidth: '340px', background: '#192028', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--bg-primary)', fontSize: '0.65rem' }}>VT</div>
                              <div>
                                <div style={{ fontWeight: '600', color: 'var(--text-bright)' }}>{productName}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Sponsored</div>
                              </div>
                            </div>
                            <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>•••</span>
                          </div>
                          
                          {/* Main Text */}
                          <div style={{ color: 'var(--text-primary)', fontSize: '0.75rem', lineHeight: '1.4' }}>{generatedData.body}</div>
                          
                          {/* Image Placeholder */}
                          <div style={{ height: '150px', borderRadius: '8px', background: 'linear-gradient(135deg, #131a21, #243545)', border: '1px solid rgba(74, 154, 142, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74, 154, 142, 0.12) 0%, transparent 70%)' }} />
                            <div style={{ color: 'var(--accent-light)', stroke: 'var(--accent-light)', zIndex: 1 }}>{ICONS.image}</div>
                            <div style={{ color: 'var(--text-bright)', fontSize: '0.75rem', fontWeight: '600', zIndex: 1 }}>{productName} Campaign</div>
                          </div>
                          
                          {/* CTA Row */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                            <div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{productName.toUpperCase()}</div>
                              <div style={{ fontWeight: '600', color: 'var(--text-bright)', fontSize: '0.75rem' }}>{generatedData.headline}</div>
                            </div>
                            <div style={{ background: 'var(--accent)', color: 'var(--bg-primary)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                              {generatedData.cta}
                            </div>
                          </div>
                        </div>
                      )}

                      {channel === 'google' && (
                        /* Google Search style card */
                        <div style={{ width: '100%', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                            <span>https://www.google.com</span>
                            <span>›</span>
                            <span>{productName.toLowerCase().replace(/\s+/g, '')}</span>
                          </div>
                          <a href="#playground" onClick={(e) => e.preventDefault()} style={{ color: '#4da6ff', fontSize: '1.05rem', fontWeight: '600', hover: { textDecoration: 'underline' } }}>
                            {generatedData.headline}
                          </a>
                          <div style={{ color: 'var(--text-primary)', fontSize: '0.78rem', lineHeight: '1.4' }}>
                            <span style={{ color: 'var(--accent-light)', fontWeight: '700', fontSize: '0.7rem', border: '1px solid var(--accent)', borderRadius: '3px', padding: '0 3px', marginRight: '6px' }}>Ad</span>
                            {generatedData.body}
                          </div>
                        </div>
                      )}

                      {channel === 'x' && (
                        /* X / Twitter style card */
                        <div style={{ width: '100%', maxWidth: '340px', background: '#131a21', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', display: 'flex', gap: '10px', fontSize: '0.8rem', textAlign: 'left' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>
                            {productName[0]}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: '700', color: 'var(--text-bright)' }}>{productName}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>@{productName.replace(/\s+/g, '')} · Ad</span>
                            </div>
                            <div style={{ color: 'var(--text-primary)', fontSize: '0.78rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                              {generatedData.body}
                            </div>
                            <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '8px', maxWidth: '240px', fontSize: '0.75rem', alignItems: 'center' }}>
                              <span style={{ display: 'flex', alignItems: 'center' }}>{ICONS.chat} 42</span>
                              <span style={{ display: 'flex', alignItems: 'center' }}>{ICONS.repeat} 12</span>
                              <span style={{ display: 'flex', alignItems: 'center' }}>{ICONS.heart} 158</span>
                              <span style={{ display: 'flex', alignItems: 'center' }}>{ICONS.chart} 1.8K</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {channel === 'email' && (
                        /* Email style card */
                        <div style={{ width: '100%', background: '#192028', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontSize: '0.78rem', textAlign: 'left' }}>
                          <div style={{ background: '#131a21', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div><span style={{ color: 'var(--text-muted)' }}>From:</span> <strong style={{ color: 'var(--text-bright)' }}>{productName} Team</strong> &lt;news@{productName.toLowerCase().replace(/\s+/g, '')}.com&gt;</div>
                            <div><span style={{ color: 'var(--text-muted)' }}>Subject:</span> <strong style={{ color: 'var(--text-bright)' }}>{generatedData.headline}</strong></div>
                          </div>
                          
                          <div style={{ padding: '20px 16px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                            <div style={{ width: '100%', height: '40px', background: 'linear-gradient(90deg, var(--accent-dim), var(--accent))', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
                              {productName.toUpperCase()} NEWS
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{generatedData.body}</div>
                            
                            <a href="#playground" onClick={(e) => e.preventDefault()} style={{ alignSelf: 'center', background: 'var(--accent)', color: 'var(--bg-primary)', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', textDecoration: 'none', marginTop: '6px' }}>
                              {generatedData.cta}
                            </a>
                            
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                              You are receiving this because you subscribed to updates from {productName}.<br />
                              Unsubscribe | Manage preferences
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Deploy Button */}
                <button
                  onClick={triggerDeploy}
                  className="btn btn-secondary"
                  style={{
                    marginTop: 'auto',
                    justifyContent: 'center',
                    padding: '12px',
                    borderColor: 'rgba(74, 154, 142, 0.4)',
                    background: 'rgba(74, 154, 142, 0.08)',
                    color: 'var(--accent-light)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {ICONS.rocket} Sync & Deploy Campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showDeployModal && (
        <div 
          className="modal-overlay-animate"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="glass-card modal-content-animate" 
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-glow), 0 20px 50px rgba(0,0,0,0.6)',
              borderColor: 'var(--accent)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(74, 154, 142, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              border: '2px solid var(--accent)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '0' }}>Campaign Deployed!</h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Veltrix has successfully uploaded your campaign asset structure to <strong>Meta Ads Manager</strong> and <strong>Google Ads API</strong> endpoints.
            </p>
            <div style={{
              width: '100%',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div><strong>Brand:</strong> {productName}</div>
              <div><strong>Active channels:</strong> {channel === 'meta' ? 'Meta Ads' : channel === 'google' ? 'Google Search' : channel === 'x' ? 'X Organic' : 'Email (Newsletters)'}</div>
              <div><strong>Optimization:</strong> Autonomous Bid & Copy Rotation (ON)</div>
            </div>
            <button
              onClick={() => setShowDeployModal(false)}
              className="btn btn-primary"
              style={{
                marginTop: '12px',
                padding: '10px 24px'
              }}
            >
              Back to Studio
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
