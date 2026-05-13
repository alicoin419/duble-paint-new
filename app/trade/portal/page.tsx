'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TradePortalPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col">
      {/* Header */}
      <div className="px-[var(--grid-margin)] py-12 border-b border-bone/10">
        <Link href="/trade" className="text-xs opacity-40 hover:opacity-80 transition-opacity">&larr; Trade Programme</Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-[var(--grid-margin)] py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Brand */}
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-4">Double Design Paints</span>
            <h1 className="text-title">Trade <span className="italic">Portal.</span></h1>
          </div>

          {/* Tab Toggle */}
          <div className="flex border border-bone/10 mb-10">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSubmitted(false); }}
                className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-colors ${
                  tab === t ? 'bg-bone text-ink' : 'opacity-40 hover:opacity-70'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Apply for Access'}
              </button>
            ))}
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <span className="text-petra text-4xl block mb-4">✓</span>
              <h3 className="text-title mb-2">{tab === 'login' ? 'Welcome back.' : 'Application received.'}</h3>
              <p className="text-xs opacity-50 mb-8">
                {tab === 'login'
                  ? 'You are now signed in to your trade account.'
                  : 'Your application will be reviewed within 2 business days.'}
              </p>
              <Link href="/" className="btn-outline border-bone text-bone hover:bg-bone hover:text-ink">Back to Home</Link>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="space-y-6"
            >
              {tab === 'register' && (
                <>
                  {[
                    { name: 'name', label: 'Full Name', type: 'text' },
                    { name: 'company', label: 'Practice / Company', type: 'text' },
                  ].map((f) => (
                    <div key={f.name} className="border-b border-bone/10 py-3 focus-within:border-bone/40 transition-colors">
                      <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-2">{f.label}</label>
                      <input
                        type={f.type}
                        required
                        className="w-full bg-transparent outline-none text-sm placeholder:opacity-20 text-bone"
                        placeholder="—"
                      />
                    </div>
                  ))}
                </>
              )}

              <div className="border-b border-bone/10 py-3 focus-within:border-bone/40 transition-colors">
                <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-transparent outline-none text-sm placeholder:opacity-20 text-bone"
                  placeholder="you@practice.com"
                />
              </div>

              <div className="border-b border-bone/10 py-3 focus-within:border-bone/40 transition-colors">
                <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full bg-transparent outline-none text-sm placeholder:opacity-20 text-bone"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn-primary w-full bg-bone text-ink hover:bg-chalk mt-4">
                {tab === 'login' ? 'Sign In &rarr;' : 'Submit Application →'}
              </button>

              {tab === 'login' && (
                <p className="text-[10px] text-center opacity-40">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="underline hover:opacity-80"
                  >
                    Apply for trade access
                  </button>
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
