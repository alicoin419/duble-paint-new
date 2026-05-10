'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const HERO_IMAGES = [
  { src: '/hero-1.png', title: 'Cappadocia' },
  { src: '/hero-2.png', title: 'Marvellino' },
  { src: '/hero-3.png', title: 'Stucco-tec' },
  { src: '/hero-4.webp', title: 'Joyaux' },
  { src: '/hero-5.webp', title: 'Petra' },
  { src: '/hero-6.webp', title: 'Metallica' },
  { src: '/hero-7.webp', title: 'Sieka' },
  { src: '/hero-8.webp', title: 'Sun-ba' },
  { src: '/hero-9.webp', title: 'Sadaf' },
];

export default function Hero() {
  // Triple the list for a seamless infinite loop
  const infiniteImages = [...HERO_IMAGES, ...HERO_IMAGES, ...HERO_IMAGES];

  return (
    <section className="relative h-[95vh] w-full flex flex-col justify-end overflow-hidden bg-bone">
      {/* Soft Infinite Movement Canvas */}
      <div className="absolute inset-0 z-0 flex items-center">
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: '-33.33%' }}
          transition={{ 
            duration: 40, 
            ease: "linear", 
            repeat: Infinity 
          }}
          className="flex gap-[10vw] pl-[10vw]"
        >
          {infiniteImages.map((img, i) => (
            <div key={i} className="relative w-[30vw] aspect-[4/5] flex-shrink-0 group">
              {/* Soft Shadow/Glow */}
              <div className="absolute inset-10 bg-ink/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative w-full h-full transform transition-transform duration-1000 group-hover:scale-105">
                <Image 
                  src={img.src} 
                  alt={img.title}
                  fill
                  priority
                  quality={100}
                  className="object-contain drop-shadow-2xl"
                  sizes="30vw"
                />
              </div>
              
              {/* Product Label (Floating) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] uppercase tracking-[0.4em] text-ink/40">{img.title}</span>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Soft Edge Fades for "Luxurious" feel */}
        <div className="absolute inset-y-0 left-0 w-[20vw] bg-gradient-to-r from-bone to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-[20vw] bg-gradient-to-l from-bone to-transparent z-10" />
      </div>

      {/* Hero Content (Floating Editorial Overlay) */}
      <div className="relative z-20 p-[var(--grid-margin)] w-full pointer-events-none">
        <div className="max-w-2xl flex gap-8 items-start">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 160 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-[2px] bg-petra mt-4 hidden lg:block"
          />

          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4"
            >
              <span className="text-spec text-ink/30 tracking-[0.5em] uppercase">
                The Atelier Collection &middot; 2025
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-hero text-ink leading-[0.8] tracking-tighter"
            >
              Surfaces <br />
              <span className="italic">that Breathe.</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex gap-8 pointer-events-auto"
            >
              <button className="btn-primary">Explore Textures</button>
              <button className="btn-ghost">Order Sample Box &rarr;</button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Global Grain Texture */}
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none z-30" />
    </section>
  );
}
