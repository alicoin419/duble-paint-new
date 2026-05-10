'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Finishes', href: '/finishes' },
  { name: 'Coatings', href: '/architectural' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'Trade', href: '/trade' },
  { name: 'Showrooms', href: '/showrooms' },
  { name: 'Designer', href: '/designer' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-8 w-full h-16 lg:h-20 bg-bone/80 backdrop-blur-md border-b border-rule z-40 px-4 lg:px-8 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-ink">
          <rect width="40" height="40" fill="currentColor" fillOpacity="0.05"/>
          <path d="M10 10H30V30H10V10Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M15 15H25V25H15V15Z" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform"/>
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg tracking-tight">Double Design</span>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">Paints</span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="text-ui hover:text-petra transition-colors relative group"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-petra transition-all group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-6">
        <button className="hover:text-petra transition-colors"><Search size={20} /></button>
        <Link href="/trade/portal" className="hover:text-petra transition-colors"><User size={20} /></Link>
        <Link href="/sample-box" className="flex items-center gap-2 group">
          <div className="relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-petra text-[8px] flex items-center justify-center text-bone">0</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sample Box</span>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button 
        className="lg:hidden text-ink"
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
               <span className="font-display text-xl">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} /></button>
            </div>
            
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display hover:text-petra transition-colors"
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
