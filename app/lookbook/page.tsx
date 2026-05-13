'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const CHAPTERS = [
  {
    number: '01',
    title: 'Mineral Silence',
    subtitle: 'Stone & Concrete',
    extract: 'Where geology meets architecture. An exploration of raw mineral surfaces — concrete, basalt, and travertine — stripped of decoration and left to speak through texture alone.',
    image: '/posts/641279800_2110078083158893_6285086235248295224_n.jpg',
    finishes: ['Cemento', 'Basalt', 'Travertino'],
    palette: ['#8A8A84', '#505050', '#C8B89A'],
  },
  {
    number: '02',
    title: 'Warm Earth',
    subtitle: 'Texture',
    extract: 'Ancient ochres and terracotta. Surfaces that carry the memory of Anatolian cliffs and West African laterite — warm, grounded, and profoundly human.',
    image: '/posts/670464277_18431455924137654_2021129107031105779_n.jpg',
    finishes: ['Cappadocia', 'Sieka', 'Sun-ba'],
    palette: ['#C4873A', '#B5875A', '#D4A96A'],
  },
  {
    number: '03',
    title: 'Liquid Metal',
    subtitle: 'Metallic',
    extract: 'Light in motion. Gold leaf, burnished silver, and volcanic obsidian surfaces that shift with the sun — luxurious finishes engineered for the most demanding interiors.',
    image: '/posts/649871712_18424424908137654_7323097420623266103_n.jpg',
    finishes: ['Aurum', 'Argentum', 'Onyx'],
    palette: ['#C9A84C', '#B0B8C0', '#2A2A2A'],
  },
  {
    number: '04',
    title: 'Pearl Light',
    subtitle: 'Pearlescent',
    extract: 'Iridescence as architecture. Surfaces that breathe with colour — shifting from champagne to violet as the light moves, transforming rooms through the hour.',
    image: '/posts/656425529_18428235988137654_5437037602706613576_n.jpg',
    finishes: ['Marvellino', 'Joyaux', 'Petra'],
    palette: ['#B8A898', '#9B8EA0', '#C4873A'],
  },
];

export default function LookbookPage() {
  return (
    <div className="bg-bone">
      {/* Hero */}
      <section className="py-32 px-[var(--grid-margin)] border-b border-rule">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-6">The Lookbook</span>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h1 className="text-display">Chapters in <span className="italic">Materiality.</span></h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-body opacity-60 leading-relaxed">
                Four meditations on surface, light, and space. Each chapter explores a distinct material language — from raw mineral earth to liquid metallic — through the lens of Double Design's finish catalogue.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Chapters */}
      {CHAPTERS.map((chapter, i) => (
        <article key={chapter.number} className={`grid grid-cols-1 lg:grid-cols-12 border-b border-rule ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
            className={`relative overflow-hidden aspect-[4/3] lg:aspect-auto ${i % 2 === 0 ? 'lg:col-span-7 lg:order-1' : 'lg:col-span-7 lg:order-2'}`}
          >
            <img
              src={chapter.image}
              alt={chapter.title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
            <div className="absolute top-8 left-8">
              <span className="text-bone/60 text-spec uppercase tracking-widest">Chapter {chapter.number}</span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: i % 2 === 0 ? 32 : -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:col-span-5 p-12 lg:p-16 flex flex-col justify-center ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1 border-r border-rule'}`}
          >
            <span className="text-[10px] uppercase tracking-widest opacity-40 mb-6">{chapter.subtitle}</span>
            <h2 className="text-title mb-6">{chapter.title}</h2>
            <p className="text-body opacity-60 leading-relaxed mb-10">{chapter.extract}</p>

            {/* Palette */}
            <div className="flex gap-3 mb-10">
              {chapter.palette.map((hex, j) => (
                <div
                  key={j}
                  className="w-10 h-10 border border-rule"
                  style={{ backgroundColor: hex }}
                  title={chapter.finishes[j]}
                />
              ))}
              <div className="ml-2 flex flex-col justify-center gap-1">
                {chapter.finishes.map((name) => (
                  <span key={name} className="text-[10px] opacity-40 uppercase tracking-wide">{name}</span>
                ))}
              </div>
            </div>

            <Link
              href={`/finishes?category=${encodeURIComponent(chapter.subtitle)}`}
              className="btn-ghost self-start"
            >
              Explore {chapter.subtitle} &rarr;
            </Link>
          </motion.div>
        </article>
      ))}

      {/* CTA */}
      <section className="py-32 px-[var(--grid-margin)] bg-ink text-bone text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-display mb-8">Begin your <span className="italic">project.</span></h2>
          <p className="text-body opacity-60 mb-12 max-w-md mx-auto">
            Request samples, consult with our design team, or visit a showroom near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sample-box" className="btn-primary">Order Sample Box &rarr;</Link>
            <Link href="/showrooms" className="btn-outline border-bone text-bone hover:bg-bone hover:text-ink">Find a Showroom</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
