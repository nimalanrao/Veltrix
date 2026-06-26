import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const FAQ_DATA = [
  {
    q: 'Do I need to connect my live advertising accounts to test Veltrix?',
    a: 'No. You can write, edit, and run predictive performance diagnostics on your campaigns entirely within the Veltrix Studio Playground without connecting any external channels.',
  },
  {
    q: 'Which marketing networks and social channels are supported?',
    a: 'Veltrix currently integrates with Meta Ads (Facebook & Instagram), Google Search Ads, X (Twitter) organic, and standard SMTP or CRM-based email systems (such as Mailchimp or Klaviyo).',
  },
  {
    q: 'How do the AI performance predictions work?',
    a: 'Our models are trained on millions of historical multi-channel ad cycles. When you input campaign details, Veltrix simulates performance and predicts Click-Through Rates (CTR) and Cost Per Acquisition (CPA) with up to 92% accuracy.',
  },
  {
    q: 'Can I approve or customize copy variations before they deploy?',
    a: 'Absolutely. While Veltrix can run in fully autonomous mode (creating and adjusting variations in the background), you can switch to "Review First" mode to verify and manually edit copies before they are pushed live.',
  },
  {
    q: 'How does autonomous bid optimization work?',
    a: 'Once linked to your Meta or Google Ads accounts, Veltrix monitors real-time performance. It runs minor A/B copy tests and dynamically shifts your budget to the highest-performing ad variations to maximize ROAS.',
  },
  {
    q: 'Can I cancel my subscription or change plans?',
    a: 'Yes. Billing is subscription-based (monthly or annual). You can upgrade, downgrade, or cancel your plan at any time directly from your dashboard. Annual plans come with a 14-day money-back guarantee.',
  },
];

const chevronDownIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function FAQItem({ faq, isOpen, onToggle, index }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div 
      ref={ref}
      className={`faq-item reveal ${isVisible ? 'visible' : ''} ${isOpen ? 'open' : ''}`}
      style={{
        transitionDelay: isVisible ? `${index * 80}ms` : '0ms'
      }}
      role="listitem"
    >
      <button 
        className="faq-question" 
        id={`faq-question-${index}`} 
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {faq.q}
        <span className="faq-chevron" aria-hidden="true">{chevronDownIcon}</span>
      </button>
      <div 
        className="faq-answer" 
        role="region" 
        aria-labelledby={`faq-question-${index}`}
        style={{ maxHeight: isOpen ? '300px' : '0' }}
      >
        <p className="faq-answer-inner">{faq.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [headerRef, isHeaderVisible] = useIntersectionObserver();

  const handleToggle = (index) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq" aria-label="Frequently asked questions" style={{ position: 'relative' }}>
      <div 
        className="parallax-orb" 
        aria-hidden="true" 
        style={{
          width: '500px',
          height: '500px',
          background: 'rgba(74, 154, 142, 0.03)',
          top: '20%',
          right: '-200px',
          position: 'absolute'
        }}
      ></div>
      <div className="container">
        <div ref={headerRef} className={`faq-header reveal ${isHeaderVisible ? 'visible' : ''}`}>
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Common questions</h2>
          <p className="section-desc">Everything you need to know before getting started.</p>
        </div>
        <div className="faq-list" id="faq-list" role="list">
          {FAQ_DATA.map((faq, i) => (
            <FAQItem 
              key={i} 
              faq={faq} 
              index={i} 
              isOpen={openIndex === i} 
              onToggle={() => handleToggle(i)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
