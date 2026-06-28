import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Do I need to connect my live advertising accounts to test Veltrix?",
    answer:
      "No. You can write, edit, and run predictive performance diagnostics on your campaigns entirely within the Veltrix Studio Playground without connecting any external channels.",
  },
  {
    question: "Which marketing networks and social channels are supported?",
    answer:
      "Veltrix currently integrates with Meta Ads (Facebook & Instagram), Google Search Ads, X (Twitter) organic, and standard SMTP or CRM-based email systems (such as Mailchimp or Klaviyo).",
  },
  {
    question: "How do the AI performance predictions work?",
    answer:
      "Our models are trained on millions of historical multi-channel ad cycles. When you input campaign details, Veltrix simulates performance and predicts Click-Through Rates (CTR) and Cost Per Acquisition (CPA) with up to 92% accuracy.",
  },
  {
    question: "Can I approve or customize copy variations before they deploy?",
    answer:
      'Absolutely. While Veltrix can run in fully autonomous mode (creating and adjusting variations in the background), you can switch to "Review First" mode to verify and manually edit copies before they are pushed live.',
  },
  {
    question: "How does autonomous bid optimization work?",
    answer:
      "Once linked to your Meta or Google Ads accounts, Veltrix monitors real-time performance. It runs minor A/B copy tests and dynamically shifts your budget to the highest-performing ad variations to maximize ROAS.",
  },
  {
    question: "Can I cancel my subscription or change plans?",
    answer:
      "Yes. Billing is subscription-based (monthly or annual). You can upgrade, downgrade, or cancel your plan at any time directly from your dashboard. Annual plans come with a 14-day money-back guarantee.",
  },
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  return (
    <motion.div
      ref={ref}
      className="border-b border-slate-100/80 transition-colors duration-200"
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.23, 1, 0.32, 1] }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group outline-none"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-body font-medium text-slate-800 transition-colors duration-150 group-hover:text-slate-950">
          {faq.question}
        </span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 transition-colors duration-150 group-hover:bg-slate-100 shrink-0 ml-4">
          {open ? (
            <Minus className="h-4.5 w-4.5 text-slate-900 transition-transform duration-200" />
          ) : (
            <Plus className="h-4.5 w-4.5 text-slate-500 transition-transform duration-200 group-hover:text-slate-900" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-8">
              <p className="text-sm font-body font-light text-slate-500 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-20 md:py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="inline-block bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 text-[10px] font-body font-bold text-slate-500 uppercase tracking-widest mb-4">
            Support
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading italic text-slate-900 leading-tight tracking-tight">
            Frequently Asked
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-500 font-body font-light">
            Everything you need to know about setting up and running campaigns with Veltrix.
          </p>
        </motion.div>

        {/* Divider-based clean list */}
        <div className="border-t border-slate-100 flex flex-col pt-2">
          {faqs.map((f, i) => (
            <FAQItem key={i} faq={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
