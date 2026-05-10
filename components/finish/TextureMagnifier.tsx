'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

interface Props {
  src: string;
  magnifiedSrc: string;
}

export default function TextureMagnifier({ src, magnifiedSrc }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 400, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/5] overflow-hidden cursor-crosshair bg-stone"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Base Image */}
      <img 
        src={src} 
        alt="Texture Preview" 
        className="w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: isHovered ? 0.4 : 1 }}
      />

      {/* Magnifier Lens */}
      <motion.div
        className="absolute pointer-events-none border border-rule overflow-hidden bg-bone shadow-2xl z-20"
        style={{
          width: 400,
          height: 400,
          left: -200,
          top: -200,
          x: useSpring(useMotionValue(0), springConfig), // Placeholder for actual mouse position
          y: useSpring(useMotionValue(0), springConfig),
          opacity: isHovered ? 1 : 0,
          display: isHovered ? 'block' : 'none',
        }}
        animate={{
          x: smoothX.get() * (containerRef.current?.clientWidth || 0),
          y: smoothY.get() * (containerRef.current?.clientHeight || 0),
        }}
      >
        <motion.div
          className="absolute"
          style={{
            width: '400%',
            height: '400%',
            left: 0,
            top: 0,
            x: useSpring(useMotionValue(0), springConfig),
            y: useSpring(useMotionValue(0), springConfig),
          }}
          animate={{
            x: -smoothX.get() * (containerRef.current?.clientWidth || 0) * 4 + 200,
            y: -smoothY.get() * (containerRef.current?.clientHeight || 0) * 4 + 200,
          }}
        >
          <img 
            src={magnifiedSrc} 
            alt="Magnified Texture" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Label */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-ui text-bone bg-ink/20 backdrop-blur-sm px-4 py-2">
              Hover to explore texture
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
