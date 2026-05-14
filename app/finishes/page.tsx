'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CATEGORIES, type FinishCategory } from '@/lib/designer/types';
import { FINISH_CATALOG, CATEGORY_IMAGES } from '@/lib/data/catalog';

// Pintest lifestyle images for hero panels
const LIFESTYLE_IMAGES = [
  '/pintest%20images/Which%20wallpaper%20should%20I%20choose_.jpeg',
  '/pintest%20images/Home%20bedroom%20Decorate.jpeg',
  '/pintest%20images/Wall%20panels%20designing.jpeg',
];

export default function FinishesPage() {
  const [active, setActive] = useState<FinishCategory | 'All'>('All');

  const categories = CATEGORIES;
  const finishes = active === 'All' ? FINISH_CATALOG : FINISH_CATALOG.filter((f) => f.category === active);

  return (
    <div className="min-h-screen bg-bone">

      {/* Hero Header — pintest lifestyle triptych */}
      <section className="border-b border-rule">
        {/* Triptych banner */}
        <div className="grid grid-cols-3 h-[40vh] overflow-hidden">
          {LIFESTYLE_IMAGES.map((src, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img
                src={src}
                alt=""
                aria-hidden
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-forest/20" />
            </div>
          ))}
          {/* Overlay title anchored to bottom-left of the whole banner */}
          <div className="absolute inset-0 col-span-3 flex items-end pointer-events-none z-10">
            {/* intentionally empty — text is below */}
          </div>
        </div>

        {/* Text row */}
        <div className="py-16 px-[var(--grid-margin)] flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-xs uppercase tracking-widest opacity-60 mb-4 block">The Collection</span>
            <h1 className="text-display">All <span className="italic">Finishes.</span></h1>
          </div>
          <p className="text-body opacity-70 max-w-md leading-relaxed">
            65+ hand-crafted architectural surfaces. Each finish is formulated in Lagos using mineral pigments and natural aggregates.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-[88px] z-30 bg-bone/90 backdrop-blur-sm border-b border-rule px-[var(--grid-margin)]">
        <div className="flex gap-0 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative px-6 py-5 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                active === cat ? 'text-forest font-medium' : 'text-ink opacity-50 hover:opacity-80'
              }`}
            >
              {cat}
              {active === cat && (
                <motion.div
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-forest"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="px-[var(--grid-margin)] py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-rule"
          >
            {finishes.map((finish, i) => (
              <Link
                key={finish.id}
                href={`/finishes/${finish.id}`}
                className="group relative bg-bone overflow-hidden aspect-[3/4] flex flex-col justify-end"
              >
                {/* Full-bleed lifestyle photo — no blend mode */}
                <div className="absolute inset-0">
                  <img
                    src={CATEGORY_IMAGES[finish.category] ?? CATEGORY_IMAGES['Texture']}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Colour tint chip in top-left corner */}
                  <div
                    className="absolute top-4 left-4 w-5 h-5 border border-bone/40"
                    style={{ backgroundColor: finish.hex }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                </div>

                {/* Info */}
                <div className="relative z-10 p-6">
                  <motion.div
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                  >
                    <span className="text-[9px] uppercase tracking-widest text-bone/60 block mb-1">{finish.category}</span>
                    <h3 className="text-ui" style={{ color: 'white' }}>{finish.name}</h3>
                    <p className="text-[10px] text-bone/60 mt-1 max-w-[160px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {finish.description}
                    </p>
                  </motion.div>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-8 h-8 border border-bone/20 flex items-center justify-center text-bone opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-petra">
                  <span className="text-[10px]">→</span>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-20 text-center">
          <p className="text-xs uppercase tracking-widest opacity-50">{finishes.length} finishes shown</p>
        </div>
      </section>

      {/* Inspiration strip — pintest images */}
      <section className="border-t border-b border-rule overflow-hidden">
        <div className="grid grid-cols-3 h-[30vh]">
          {[
            '/pintest%20images/%23gold%20%23or.jpeg',
            '/pintest%20images/download%20(2).jpeg',
            '/pintest%20images/download%20(3).jpeg',
          ].map((src, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img src={src} alt="" aria-hidden className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-forest/10 group-hover:bg-forest/0 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-[var(--grid-margin)] bg-chalk">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-title mb-3">Not sure where to start?</h2>
            <p className="text-body opacity-60 leading-relaxed">Take our 2-minute discovery quiz for curated recommendations.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/discover" className="btn-primary btn-lift">Start Discovery Quiz &rarr;</Link>
            <Link href="/sample-box" className="btn-outline btn-lift">Order Sample Box</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
