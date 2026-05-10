'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UtilityBar() {
  return (
    <motion.div 
      initial={{ y: -32 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-8 bg-ink text-bone flex items-center justify-between px-4 lg:px-8 text-[10px] tracking-widest uppercase z-50 sticky top-0"
    >
      {/* Left: Region Selector */}
      <div className="hidden lg:flex gap-4 opacity-70">
        <span>Lagos</span>
        <span className="opacity-30">·</span>
        <span>Abuja</span>
        <span className="opacity-30">·</span>
        <span>Port Harcourt</span>
        <span className="opacity-30">·</span>
        <span>Ibadan</span>
      </div>

      {/* Center: Trade Link */}
      <Link href="/trade" className="hover:opacity-100 transition-opacity flex-1 lg:flex-none text-center">
        For Architects & Designers &rarr;
      </Link>

      {/* Right: Sample Box Pill */}
      <div className="hidden lg:block">
        <Link 
          href="/sample-box" 
          className="bg-bone text-ink px-3 py-1 rounded-full font-bold hover:bg-petra hover:text-bone transition-colors"
        >
          Order Sample Box
        </Link>
      </div>
    </motion.div>
  );
}
