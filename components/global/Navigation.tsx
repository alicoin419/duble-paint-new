'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

const NAV_LINKS = [
  { name: 'Finishes',         href: '/finishes' },
  { name: 'Coatings',         href: '/architectural' },
  { name: 'Galerie',          href: '/lookbook' },
  { name: 'Professionals',    href: '/trade' },
  { name: 'Showrooms',        href: '/showrooms' },
  { name: 'Palette Services', href: '/designer' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { sampleBox } = useStore();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  /* ── Mobile drawer (portalled to body to escape backdrop-filter stacking context) ── */
  const mobileMenu = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[59]"
            style={{ background: 'rgba(15,15,13,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed top-0 right-0 h-full w-[82vw] max-w-[340px] z-[60] flex flex-col"
            style={{
              background: 'rgba(15, 15, 13, 0.72)',
              backdropFilter: 'blur(32px) saturate(160%)',
              WebkitBackdropFilter: 'blur(32px) saturate(160%)',
              borderLeft: '1px solid rgba(255,248,231,0.10)',
            }}
          >
            {/* Drawer — top specular line */}
            <div className="absolute inset-x-0 top-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,248,231,0.25), transparent)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5"
              style={{ borderBottom: '1px solid rgba(255,248,231,0.08)' }}>
              <Image
                src="/logo.webp"
                alt="Double Design Paints"
                width={110}
                height={36}
                className="h-7 w-auto object-contain brightness-0 invert opacity-90"
              />
              <button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center transition-colors"
                style={{ color: 'rgba(245,241,235,0.6)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C5A059')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,241,235,0.6)')}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto py-3">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.055, duration: 0.4, ease: [0.22,1,0.36,1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between px-6 py-[18px] transition-all duration-300"
                    style={{
                      borderBottom: '1px solid rgba(255,248,231,0.06)',
                      color: 'rgba(245,241,235,0.75)',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget;
                      el.style.color = '#C5A059';
                      el.style.background = 'rgba(197,160,89,0.06)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      el.style.color = 'rgba(245,241,235,0.75)';
                      el.style.background = 'transparent';
                    }}
                  >
                    <span className="text-[15px] tracking-wide font-display">{link.name}</span>
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.5}
                      className="opacity-30 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#C5A059' }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="px-5 py-5 flex flex-col gap-3"
              style={{ borderTop: '1px solid rgba(255,248,231,0.08)' }}
            >
              <Link
                href="/sample-box"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.18em] uppercase font-display transition-all duration-300"
                style={{
                  background: '#C5A059',
                  color: '#0F0F0D',
                  border: '1px solid #C5A059',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#b08c49'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#C5A059'; }}
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                Order Sample Box
              </Link>
              <Link
                href="/trade"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center py-4 text-[11px] tracking-[0.18em] uppercase font-display transition-all duration-300"
                style={{
                  border: '1px solid rgba(255,248,231,0.20)',
                  color: 'rgba(245,241,235,0.70)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,248,231,0.45)';
                  e.currentTarget.style.color = 'rgba(245,241,235,1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,248,231,0.20)';
                  e.currentTarget.style.color = 'rgba(245,241,235,0.70)';
                }}
              >
                Trade Portal
              </Link>
            </motion.div>

            {/* Brand footnote */}
            <div className="px-6 pb-7 pt-1">
              <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(245,241,235,0.22)' }} className="uppercase">
                Double Design Paints · Lagos
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* ── Liquid-glass nav bar ─────────────────────────────────────────── */}
      <nav
        className="sticky top-8 w-full z-40 flex items-center justify-between px-5 md:px-8 lg:px-10 transition-all duration-500"
        style={{
          height: '60px',
          background: scrolled
            ? 'rgba(255, 248, 231, 0.14)'
            : 'rgba(255, 248, 231, 0.08)',
          backdropFilter:         'blur(28px) saturate(180%)',
          WebkitBackdropFilter:   'blur(28px) saturate(180%)',
          borderBottom: scrolled
            ? '1px solid rgba(255,248,231,0.18)'
            : '1px solid rgba(255,248,231,0.10)',
          /* top specular edge — the "glass rim" */
          boxShadow: scrolled
            ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px rgba(15,15,13,0.08)'
            : 'inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.webp"
            alt="Double Design Paints"
            width={160}
            height={54}
            className="h-9 md:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-ui relative group ${
                link.name === 'Palette Services'
                  ? 'nav-palette-services'
                  : 'hover:text-forest transition-colors'
              }`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-forest transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/sample-box" className="flex items-center gap-2 group relative">
            <ShoppingBag size={20} />
            {sampleBox.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-petra text-[9px] flex items-center justify-center text-bone font-bold">
                {sampleBox.length}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Sample Box
            </span>
          </Link>
        </div>

        {/* Mobile right-side actions */}
        <div className="lg:hidden flex items-center gap-4">
          {/* Bag icon on mobile */}
          <Link href="/sample-box" className="relative flex items-center justify-center w-10 h-10">
            <ShoppingBag size={20} strokeWidth={1.5} className="text-ink" />
            {sampleBox.length > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-bone font-bold"
                style={{ background: '#C5A059', fontSize: '9px' }}
              >
                {sampleBox.length}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-10 h-10 gap-[5px]"
          >
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{ background: '#2F363F' }}
            />
            <span
              className="block w-3.5 h-[1.5px] transition-all duration-300 self-end"
              style={{ background: '#2F363F' }}
            />
          </button>
        </div>
      </nav>

      {mounted && createPortal(mobileMenu, document.body)}
    </>
  );
}
