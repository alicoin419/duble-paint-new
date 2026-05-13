'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const SYSTEMS = [
  {
    code: 'DDP-EXT',
    name: 'Doublie One — Exterior Putty',
    tagline: 'Ready-to-use. Crack-free. Built for Nigeria.',
    description: 'Doublie One is a ready-to-use exterior putty that creates smooth, crack-free wall surfaces before painting. Engineered for extreme UV exposure, humidity, and thermal cycling common in the Nigerian climate.',
    image: '/posts/683094682_18433530136137654_329903382301534974_n.jpg',
    specs: ['Elastomeric formula', 'UV-stable pigments', 'Crack-bridging', 'SON certified'],
  },
  {
    code: 'DDP-INT',
    name: 'Interior Decorative Range',
    tagline: 'Tuscania, Marvellino, Texture — precision surfaces.',
    description: 'Our premium interior coating range spans Tuscania acrylic decorative, Marvellino pearlescent, and Texture water-based finishes. Zero VOC options for residential and healthcare environments. Washable, mould-resistant, Grade A.',
    image: '/posts/641279800_2110078083158893_6285086235248295224_n.jpg',
    specs: ['Zero VOC options', 'Washable Grade A', 'Mould-resistant', 'Rapid dry 2–4hr'],
  },
  {
    code: 'DDP-SPEC',
    name: 'Special & Premium Range',
    tagline: 'When the brief demands more.',
    description: 'The DDP Special and Premium lines are formulated for projects where standard coatings won\'t suffice. High-hide, low-odour, superior coverage — available in custom tints through our showrooms.',
    image: '/posts/655964368_18428326249137654_6608690836982725613_n.jpg',
    specs: ['High-hide formula', 'Custom tinting', 'Superior coverage', 'Low odour'],
  },
  {
    code: 'DDP-PRIME',
    name: 'DDP Primer & Preparatory Systems',
    tagline: 'The foundation of every great finish.',
    description: 'Acrylic Sealer/Primer, anti-fungal primer, and textured primer systems. Every DDP topcoat performs best over a DDP primer — our preparatory range is formulated specifically for Nigerian substrate conditions.',
    image: '/posts/670886078_938525142301372_2195265172357648157_n.jpg',
    specs: ['Anti-fungal formula', 'Deep penetration', 'Multi-surface', 'PGN endorsed'],
  },
];

export default function ArchitecturalPage() {
  return (
    <div className="bg-bone">
      {/* Hero */}
      <section className="py-32 px-[var(--grid-margin)] border-b border-rule bg-ink text-bone">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end"
        >
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-6">Architectural Coatings</span>
            <h1 className="text-display">Science at the <span className="italic">surface.</span></h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-body opacity-60 leading-relaxed mb-8">
              Beyond decorative finishes. DDP's architectural coating systems are specified on Nigeria's most demanding infrastructure, commercial, and residential projects.
            </p>
            <Link href="/trade" className="btn-outline border-bone text-bone hover:bg-bone hover:text-ink">
              Trade & Specification Support &rarr;
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Systems */}
      {SYSTEMS.map((system, i) => (
        <motion.article
          key={system.code}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-12 border-b border-rule"
        >
          <div className={`relative overflow-hidden aspect-[4/3] lg:aspect-auto ${i % 2 === 0 ? 'lg:col-span-7 lg:order-1' : 'lg:col-span-7 lg:order-2'}`}>
            <img
              src={system.image}
              alt={system.name}
              className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105"
            />
            <div className="absolute top-6 left-6 bg-ink/80 backdrop-blur-sm px-3 py-1">
              <span className="text-bone font-mono text-[10px] tracking-widest">{system.code}</span>
            </div>
          </div>

          <div className={`lg:col-span-5 p-10 lg:p-16 flex flex-col justify-center ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1 border-r border-rule'}`}>
            <h2 className="text-title mb-3">{system.name}</h2>
            <p className="text-body italic opacity-50 mb-6">{system.tagline}</p>
            <p className="text-xs opacity-60 leading-relaxed mb-8">{system.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {system.specs.map((spec) => (
                <div key={spec} className="border border-rule px-3 py-2">
                  <span className="text-[10px] uppercase tracking-wide opacity-60">{spec}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <button className="btn-ghost">Download Datasheet</button>
              <Link href="/trade" className="btn-primary">Request Specification</Link>
            </div>
          </div>
        </motion.article>
      ))}

      {/* PGN Endorsement */}
      <section className="py-16 px-[var(--grid-margin)] bg-chalk border-y border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          <div className="lg:col-span-3 relative aspect-[4/3] overflow-hidden">
            <img
              src="/posts/658436103_18428684548137654_4294175725695157346_n.jpg"
              alt="PGN Official Product Endorsement"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-9">
            <span className="text-[10px] uppercase tracking-widest text-petra block mb-3">Industry Certification</span>
            <h3 className="text-title mb-3">Officially endorsed by the Painters' Guild of Nigeria.</h3>
            <p className="text-xs opacity-60 leading-relaxed max-w-xl">
              Double Guard (Weathershield) by Double Design Paints is officially endorsed by the PGN in recognition of its demonstrated quality performance and consistent industry support. Endorsement valid 20th February 2026 – 20th February 2028.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-[var(--grid-margin)] bg-chalk">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-rule border border-rule">
          {[
            { num: '200+', label: 'Projects specified' },
            { num: '1.2M', label: 'Square metres coated' },
            { num: 'PGN', label: 'Guild endorsed' },
            { num: '10 yr', label: 'System warranties' },
          ].map((s) => (
            <div key={s.label} className="px-8 py-10 text-center">
              <div className="text-display text-petra mb-2">{s.num}</div>
              <div className="text-[10px] uppercase tracking-widest opacity-40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-[var(--grid-margin)] text-center">
        <h2 className="text-title mb-4">Specify with <span className="italic">confidence.</span></h2>
        <p className="text-body opacity-60 mb-10 max-w-md mx-auto">
          Our technical team provides project-specific support from specification through application.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link href="/trade" className="btn-primary">Trade & Specification &rarr;</Link>
          <Link href="/showrooms" className="btn-outline">Visit a Showroom</Link>
        </div>
      </section>
    </div>
  );
}
