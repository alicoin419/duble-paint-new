'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const SHOWROOMS = [
  {
    city: 'Lagos',
    area: 'Victoria Island',
    address: '14 Akin Adesola Street, Victoria Island, Lagos 101233',
    hours: 'Mon–Fri 8am–6pm · Sat 9am–4pm',
    phone: '+234 801 234 5678',
    image: '/posts/684252494_1339249504685900_1835448542080863034_n.jpg',
    flagship: true,
    description: 'Our flagship space — stocking the full DDP catalogue across Decorative, Special, Premium and Texture ranges. A working application studio and curated archive of every finish.',
  },
  {
    city: 'Abuja',
    area: 'Maitama District',
    address: '7 Diplomatic Drive, Maitama, Abuja FCT 900271',
    hours: 'Mon–Fri 9am–6pm · Sat 10am–3pm',
    phone: '+234 802 345 6789',
    image: '/posts/641279800_2110078083158893_6285086235248295224_n.jpg',
    flagship: false,
    description: 'Serving the capital\'s growing architectural community with full finish sampling and on-site consultation services.',
  },
  {
    city: 'Port Harcourt',
    area: 'GRA Phase 2',
    address: '22 Rumuola Road, GRA Phase 2, Port Harcourt 500211',
    hours: 'Mon–Fri 8am–5pm · Sat 9am–2pm',
    phone: '+234 803 456 7890',
    image: '/posts/656425529_18428235988137654_5437037602706613576_n.jpg',
    flagship: false,
    description: 'DDP\'s southern hub — stocking the full catalogue with specialist knowledge in industrial and marine-grade coatings.',
  },
  {
    city: 'Ibadan',
    area: 'Bodija Estate',
    address: '5 Olorunsogo Close, Bodija, Ibadan 200233',
    hours: 'Mon–Fri 9am–5pm · Sat 9am–1pm',
    phone: '+234 804 567 8901',
    image: '/posts/649871712_18424424908137654_7323097420623266103_n.jpg',
    flagship: false,
    description: 'Our newest location, serving the rapidly expanding residential and commercial construction market in Ibadan.',
  },
];

export default function ShowroomsPage() {
  const [active, setActive] = useState(0);
  const selected = SHOWROOMS[active];

  return (
    <div className="min-h-screen bg-bone">
      {/* Header */}
      <section className="py-24 px-[var(--grid-margin)] border-b border-rule">
        <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-4">Visit Us</span>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <h1 className="text-display">Our <span className="italic">Showrooms.</span></h1>
          <p className="text-body opacity-60 max-w-md">
            Four locations across Nigeria. Each showroom carries the complete DDP collection, with resident consultants available for project specification.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[70vh]">
        {/* Sidebar List */}
        <div className="lg:col-span-4 border-r border-rule">
          {SHOWROOMS.map((s, i) => (
            <button
              key={s.city}
              onClick={() => setActive(i)}
              className={`w-full text-left p-8 border-b border-rule transition-colors group ${
                active === i ? 'bg-ink text-bone' : 'hover:bg-chalk'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-[9px] uppercase tracking-widest block mb-1 ${active === i ? 'opacity-50' : 'opacity-40'}`}>
                    {s.flagship ? '★ Flagship' : s.area}
                  </span>
                  <h3 className="text-title">{s.city}</h3>
                </div>
                <span className={`text-[10px] uppercase tracking-widest mt-1 transition-transform group-hover:translate-x-1 ${active === i ? 'opacity-60' : 'opacity-20'}`}>→</span>
              </div>
              <p className={`text-xs leading-relaxed ${active === i ? 'opacity-60' : 'opacity-40'}`}>{s.address}</p>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-8 flex flex-col"
        >
          {/* Image */}
          <div className="relative h-72 lg:h-96 overflow-hidden">
            <img
              src={selected.image}
              alt={selected.city}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/60" />
            {selected.flagship && (
              <div className="absolute top-8 right-8 bg-petra text-bone text-[10px] uppercase tracking-widest px-4 py-2">
                Flagship Store
              </div>
            )}
            <div className="absolute bottom-8 left-8 text-bone">
              <span className="text-[10px] uppercase tracking-widest opacity-60 block mb-1">{selected.area}</span>
              <h2 className="text-title">{selected.city}</h2>
            </div>
          </div>

          {/* Info */}
          <div className="p-8 lg:p-12 flex-1 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-body opacity-60 leading-relaxed mb-8">{selected.description}</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="opacity-40 mt-0.5 shrink-0" />
                  <span className="text-xs opacity-60 leading-relaxed">{selected.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="opacity-40 shrink-0" />
                  <span className="text-xs opacity-60">{selected.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="opacity-40 shrink-0" />
                  <a href={`tel:${selected.phone}`} className="text-xs opacity-60 hover:text-petra transition-colors">
                    {selected.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-end md:justify-start">
              <h4 className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Plan your visit</h4>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(selected.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center"
              >
                Get Directions &rarr;
              </a>
              <Link href="/trade" className="btn-ghost text-center">
                Book a Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trade CTA */}
      <section className="border-t border-rule py-16 px-[var(--grid-margin)] bg-chalk">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-title mb-1">Trade & Architect programme</h3>
            <p className="text-body opacity-60">Priority access, exclusive pricing, and dedicated technical support.</p>
          </div>
          <Link href="/trade" className="btn-outline shrink-0">Learn About Trade Access &rarr;</Link>
        </div>
      </section>
    </div>
  );
}
