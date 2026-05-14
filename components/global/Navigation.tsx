'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

const NAV_LINKS = [
  { name: 'Finishes', href: '/finishes' },
  { name: 'Coatings', href: '/architectural' },
  { name: 'Galerie', href: '/lookbook' },
  { name: 'Professionals', href: '/trade' },
  { name: 'Showrooms', href: '/showrooms' },
  { name: 'Palette Services', href: '/designer' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { sampleBox } = useStore();

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const mobileMenu = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-ink/40 z-[59]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-bone z-[60] flex flex-col shadow-2xl"
          >
            {/* Drawer header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-rule">
              <Image
                src="/logo.webp"
                alt="Double Design Paints"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
              <button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:text-forest transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-6 py-4 border-b border-rule text-base font-display text-ink hover:text-forest hover:bg-chalk transition-colors"
                >
                  <span>{link.name}</span>
                  <span className="text-rule opacity-40 text-lg">→</span>
                </Link>
              ))}
            </nav>

            {/* CTAs */}
            <div className="px-6 py-6 flex flex-col gap-3 border-t border-rule">
              <Link
                href="/sample-box"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary text-center py-4 text-xs tracking-widest uppercase"
              >
                Order Sample Box
              </Link>
              <Link
                href="/trade"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-outline text-center py-4 text-xs tracking-widest uppercase"
              >
                Trade Portal
              </Link>
            </div>

            {/* Footer detail */}
            <div className="px-6 pb-6 pt-2">
              <p className="text-[11px] uppercase tracking-widest opacity-30">Made in Lagos since 2015</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
    <nav className="sticky top-8 w-full h-14 md:h-16 lg:h-20 bg-bone/90 backdrop-blur-md border-b border-rule z-40 px-5 md:px-8 lg:px-10 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <Image 
          src="/logo.webp" 
          alt="Dubble Paint Logo" 
          width={180} 
          height={60} 
          className="h-10 w-auto object-contain"
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
        <button className="hover:text-forest transition-colors"><Search size={20} /></button>
        <Link href="/trade/portal" className="hover:text-forest transition-colors"><User size={20} /></Link>
        <Link href="/sample-box" className="flex items-center gap-2 group">
          <div className="relative">
            <ShoppingBag size={20} />
            {sampleBox.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-forest text-[8px] flex items-center justify-center text-bone">{sampleBox.length}</span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sample Box</span>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button
        aria-label="Open main menu"
        className="lg:hidden text-ink hover:text-forest transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

    </nav>
    {mounted && createPortal(mobileMenu, document.body)}
    </>
  );
}
