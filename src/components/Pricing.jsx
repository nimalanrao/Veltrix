import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { use3DTilt } from '../hooks/use3DTilt';

const PRICING_DATA = [
  {
    name: 'Starter',
    desc: 'Perfect for solo founders & startups.',
    price: 79,
    period: '/month',
    billing: 'Billed monthly. Cancel anytime.',
    features: [
      '10 autonomous campaigns / mo',
      'Meta & Google Ads integrations',
      'Basic CTR performance prediction',
      'Veltrix standard copy templates',
      'Community forum support',
    ],
    featured: false,
    btnLabel: 'Get started',
    btnClass: 'btn-secondary',
  },
  {
    name: 'Professional',
    desc: 'For growing brands & marketers.',
    price: 119,
    period: '/month',
    billing: 'Billed annually. Save 20%.',
    features: [
      'Unlimited campaigns & copies',
      'Autonomous A/B copy testing',
      'Continuous bid optimization',
      'Advanced tone & audience tuning',
      'Custom webhook integrations',
      'Private Slack channel support',
    ],
    featured: true,
    btnLabel: 'Start free trial',
    btnClass: 'btn-primary',
  },
  {
    name: 'Enterprise',
    desc: 'For marketing agencies & teams.',
    price: 219,
    period: '/month',
    billing: 'Billed monthly. Save on volume.',
    features: [
      'Everything in Professional',
      'Multi-brand profile management',
      'Fine-tuned custom brand models',
      'SSO & role-based admin panel',
      'Dedicated marketing success manager',
      'Priority SLA & API access keys',
    ],
    featured: false,
    btnLabel: 'Contact sales',
    btnClass: 'btn-secondary',
  },
];

const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function PricingCard({ plan, index }) {
  const [revealRef, isVisible] = useIntersectionObserver();
  const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt(10, plan.featured ? 1.03 : 1);

  const setCombinedRefs = (node) => {
    revealRef.current = node;
    tiltRef.current = node;
  };

  let PlanIcon;
  if (plan.name === 'Starter') {
    PlanIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-light)' }}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
      </svg>
    );
  } else if (plan.name === 'Professional') {
    PlanIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-light)' }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    );
  } else {
    PlanIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-light)' }}>
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
      </svg>
    );
  }

  return (
    <article 
      ref={setCombinedRefs}
      className={`pricing-card glass-card reveal ${isVisible ? 'visible' : ''} ${plan.featured ? 'featured' : ''}`}
      style={{
        ...tiltStyle,
        transitionDelay: isVisible ? `${index * 150}ms` : '0ms'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id={`pricing-${plan.name.toLowerCase()}`}
    >
      {plan.featured && <span className="pricing-popular">Most popular</span>}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <div style={{ height: '36px', width: '36px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'linear-gradient(to bottom right, rgba(74, 154, 142, 0.15), rgba(91, 191, 176, 0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {PlanIcon}
        </div>
        <h3 className="pricing-name" style={{ marginBottom: 0 }}>{plan.name}</h3>
      </div>
      
      <p className="pricing-desc">{plan.desc}</p>
      <div className="pricing-amount">
        <span className="pricing-currency">MYR</span>
        <span className="pricing-value">{plan.price}</span>
        <span className="pricing-period">{plan.period}</span>
      </div>
      <p className="pricing-billing">{plan.billing}</p>
      <ul className="pricing-features">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="pricing-feature">
            <span className="pricing-check" aria-hidden="true">{checkIcon}</span>
            {feature}
          </li>
        ))}
      </ul>
      <button 
        className={`btn ${plan.btnClass} pricing-btn`} 
        id={`pricing-btn-${plan.name.toLowerCase()}`}
      >
        {plan.btnLabel}
      </button>
    </article>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="pricing" aria-label="Pricing plans">
      <div 
        className="parallax-orb" 
        aria-hidden="true" 
        style={{
          width: '500px',
          height: '500px',
          background: 'rgba(74, 154, 142, 0.03)',
          bottom: '-150px',
          left: '-150px',
          position: 'absolute'
        }}
      ></div>
      <div className="gradient-bloom bloom-cyan" style={{ width: '600px', height: '600px', left: '10%', top: '10%' }}></div>
      <div className="gradient-bloom bloom-purple" style={{ width: '500px', height: '500px', right: '5%', bottom: '10%', animationDelay: '-5s' }}></div>
      <div className="container">
        <div className="pricing-header">
          <span className="section-label">Pricing</span>
          <h2 className="section-title">Plans that scale with your growth</h2>
          <p className="section-desc">Transparent pricing with no setup fees. Start testing the playground for free and unlock scale when you are ready.</p>
        </div>
        <div className="pricing-grid" id="pricing-grid">
          {PRICING_DATA.map((plan, i) => (
            <PricingCard key={i} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
