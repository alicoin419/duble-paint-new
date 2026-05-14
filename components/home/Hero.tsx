'use client';

import { motion } from 'framer-motion';

// Encoded path handles the space in the directory name
const VIDEO_SRC = '/videos%20hero/Generated%20Video%20May%2014%2C%202026%20-%2012_11AM.mp4';

export default function Hero() {
  return (
    <section className="relative h-[95vh] w-full flex flex-col justify-end overflow-hidden">
      {/* Full-screen background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={VIDEO_SRC}
      />

      {/* WCAG AA overlay — ensures 4.5:1 contrast for text above video */}
      <div className="absolute inset-0 z-10 bg-black/30" />

      {/* Subtle bottom gradient to anchor editorial text */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-20 p-[var(--grid-margin)] w-full pointer-events-none">
        <div className="max-w-2xl flex gap-6 lg:gap-8 items-start">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 160 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-[2px] bg-petra mt-4 hidden lg:block flex-shrink-0"
          />

          <div className="flex flex-col gap-5 md:gap-7 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4"
            >
              <span className="text-[11px] md:text-spec text-bone/70 tracking-[0.4em] md:tracking-[0.5em] uppercase">
                The Atelier Collection &middot; 2025
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-hero text-bone leading-[0.85] tracking-tighter"
              style={{ color: 'white' }}
            >
              Surfaces <br />
              <span className="italic">that Breathe.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-5 lg:gap-8 pointer-events-auto"
            >
              <button className="btn-lift border border-bone px-5 sm:px-6 py-3.5 sm:py-3 uppercase bg-forest text-bone hover:bg-forest-dark hover:border-forest-dark transition-all duration-300 text-ui tracking-widest min-h-[48px]">
                Explore Textures
              </button>
              <button className="btn-lift border border-bone/50 px-5 sm:px-6 py-3.5 sm:py-3 uppercase text-bone hover:border-bone transition-all duration-300 text-ui tracking-widest min-h-[48px]">
                Order Sample Box &rarr;
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global Grain Texture */}
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none z-30" />
    </section>
  );
}
