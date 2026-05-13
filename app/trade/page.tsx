'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const TIERS = [
  {
    name: 'Associate',
    price: 'Free',
    description: 'For independent designers and contractors exploring the DDP catalogue.',
    features: [
      'Access to full finish library',
      'Sample box (up to 5 finishes)',
      'Technical specification sheets',
      'Digital moodboard tools',
    ],
    cta: 'Register Free',
    highlighted: false,
  },
  {
    name: 'Registered Trade',
    price: '₦50,000/yr',
    description: 'For active professionals with ongoing project work.',
    features: [
      'Everything in Associate',
      '15% trade discount on all orders',
      'Extended sample programme (up to 15)',
      'Dedicated trade account manager',
      'Priority showroom access',
    ],
    cta: 'Apply for Trade',
    highlighted: true,
  },
  {
    name: 'Practice Partner',
    price: 'Custom',
    description: 'For architectural practices and large-scale contractors.',
    features: [
      'Everything in Registered Trade',
      'Negotiated project pricing',
      'On-site technical consultation',
      'Custom colour matching service',
      'Joint marketing opportunities',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

const BENEFITS = [
  { title: 'Technical Library', body: 'Full access to application guides, SDS sheets, and installation specifications for every finish.' },
  { title: 'Dedicated Support', body: 'A named account manager who understands your projects and specification requirements.' },
  { title: 'Sample Programme', body: 'Expanded sample allocations with overnight delivery to your studio or site.' },
  { title: 'Project Pricing', body: 'Volume-based pricing for projects over 200m² — speak to your account manager.' },
  { title: 'Continuing Education', body: 'Quarterly application masterclasses at our showrooms. CPD-certified.' },
  { title: 'Preview Access', body: 'First access to new finish releases and seasonal collections before public launch.' },
];

export default function TradePage() {
  const [formState, setFormState] = useState<'idle' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sent');
  };

  return (
    <div className="bg-bone">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden border-b border-rule">
        <div className="absolute inset-0 z-0">
          <img
            src="/posts/650895184_18424943902137654_7919832335211725751_n.jpg"
            alt="DDP Trade Programme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/60" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-[var(--grid-margin)] pb-24 pt-48 text-bone max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-widest opacity-50 block mb-6">Trade Programme</span>
          <h1 className="text-display mb-8">Built for those who <span className="italic">specify.</span></h1>
          <p className="text-body opacity-70 leading-relaxed mb-10">
            Double Design Paints partners with architects, interior designers, and contractors who demand precision, consistency, and the highest quality of material specification.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Link href="/trade/portal" className="btn-primary">Access Trade Portal &rarr;</Link>
            <a href="#tiers" className="btn-outline border-bone text-bone hover:bg-bone hover:text-ink">View Membership Tiers</a>
          </div>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-[var(--grid-margin)] bg-chalk">
        <div className="mb-16">
          <h2 className="text-title mb-2 uppercase tracking-widest">Why Trade Members Choose DDP</h2>
          <div className="hr-rule" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="bg-chalk p-8 hover:bg-bone transition-colors group"
            >
              <span className="text-spec opacity-30 font-mono block mb-4">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-ui mb-3">{b.title}</h3>
              <p className="text-xs opacity-60 leading-relaxed">{b.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="py-24 px-[var(--grid-margin)]">
        <div className="mb-16 text-center">
          <h2 className="text-display mb-4">Membership <span className="italic">Tiers.</span></h2>
          <p className="text-body opacity-60">Choose the level of access that suits your practice.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-rule max-w-5xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`p-10 flex flex-col ${tier.highlighted ? 'bg-ink text-bone' : 'bg-bone'}`}
            >
              {tier.highlighted && (
                <span className="text-[9px] uppercase tracking-widest text-petra mb-6">Most Popular</span>
              )}
              <h3 className="text-title mb-2">{tier.name}</h3>
              <div className="text-display mb-4">{tier.price}</div>
              <p className={`text-xs leading-relaxed mb-8 ${tier.highlighted ? 'opacity-60' : 'opacity-50'}`}>{tier.description}</p>
              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className={`text-xs flex items-start gap-3 ${tier.highlighted ? 'opacity-70' : 'opacity-60'}`}>
                    <span className="text-petra shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/trade/portal"
                className={`btn-primary text-center ${tier.highlighted ? 'bg-petra border-petra hover:bg-petra/90' : ''}`}
              >
                {tier.cta} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Enquiry */}
      <section className="py-24 px-[var(--grid-margin)] bg-chalk border-t border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-5xl mx-auto">
          <div className="lg:col-span-5">
            <h2 className="text-title mb-4">Trade <span className="italic">Enquiries.</span></h2>
            <p className="text-body opacity-60 leading-relaxed mb-8">
              Speak with our trade team about project-specific requirements, custom formulations, or large-volume pricing.
            </p>
            <div className="space-y-3 text-xs opacity-60">
              <p>trade@doubledesignpaints.com</p>
              <p>+234 801 234 5678</p>
              <p>Mon–Fri, 8am–6pm WAT</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {formState === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-rule p-12 text-center"
              >
                <span className="text-petra text-4xl block mb-4">✓</span>
                <h3 className="text-title mb-2">Enquiry received.</h3>
                <p className="text-xs opacity-60">Your trade team contact will respond within one business day.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: 'name', label: 'Full Name', type: 'text' },
                  { name: 'company', label: 'Practice / Company', type: 'text' },
                  { name: 'email', label: 'Email Address', type: 'email' },
                  { name: 'phone', label: 'Phone Number', type: 'tel' },
                ].map((field) => (
                  <div key={field.name} className="border-b border-rule py-3 flex justify-between items-center group focus-within:border-ink">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 w-40 shrink-0">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      required
                      className="flex-1 bg-transparent text-body text-right outline-none placeholder:opacity-20"
                      placeholder="—"
                    />
                  </div>
                ))}
                <div className="border-b border-rule py-3 group focus-within:border-ink">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-3">Project Details</label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full bg-transparent text-body outline-none resize-none placeholder:opacity-20 text-sm"
                    placeholder="Describe your project or enquiry..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Submit Enquiry &rarr;</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
