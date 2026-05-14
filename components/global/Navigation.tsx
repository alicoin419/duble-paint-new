'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
  const { sampleBox } = useStore();

  return (
    <nav className="sticky top-8 w-full h-16 lg:h-20 bg-bone/90 backdrop-blur-md border-b border-rule z-40 px-8 lg:px-10 flex items-center justify-between">
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-bone z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
               <Image 
                 src="/logo.webp" 
                 alt="Dubble Paint Logo" 
                 width={120} 
                 height={40} 
                 className="h-8 w-auto object-contain"
               />
               <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} /></button>
            </div>
            
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display hover:text-forest transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Link 
                href="/sample-box" 
                className="btn-primary text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Order Sample Box
              </Link>
              <Link 
                href="/trade" 
                className="btn-outline text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trade Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
