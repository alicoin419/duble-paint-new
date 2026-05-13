'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const HERO_IMAGES = [
  { src: '/posts/640836990_18422216551137654_906104790729521505_n.jpg',  title: 'MARJ 268' },
  { src: '/posts/643558668_18423412054137654_7992558779346566483_n.jpg',  title: 'SHOMAR 267' },
  { src: '/posts/649873475_18424616026137654_1951276659491345991_n.jpg',  title: 'TULIP 236' },
  { src: '/posts/652999374_18425621443137654_2853474462635297911_n.jpg',  title: 'MOUDA 245' },
  { src: '/posts/655964368_18428326249137654_6608690836982725613_n.jpg',  title: 'NISAN 270' },
  { src: '/posts/657844121_18429450949137654_6007451794152107908_n.jpg',  title: 'HABAK 265' },
  { src: '/posts/670778429_18432511021137654_7634791149130200903_n.jpg',  title: 'HAIFA 184' },
  { src: '/posts/671066314_18431856091137654_8370656586444899901_n.jpg',  title: 'MAHA 183' },
  { src: '/posts/683220651_18433352575137654_365842362136855464_n.jpg',   title: 'KRONFOL 193' },
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
