'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FINISHES, CATEGORIES, type Finish, type FinishCategory } from '@/lib/designer/types';
import { useStore } from '@/lib/store/useStore';

interface Props {
  activeFinish: Finish;
  onSelect: (finish: Finish) => void;
  selectedSegmentId: string | null;
  opacity: number;
  onOpacityChange: (v: number) => void;
}

export default function FinishPanel({ activeFinish, onSelect, selectedSegmentId, opacity, onOpacityChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<FinishCategory>('All');
  const [addedId, setAddedId] = useState<string | null>(null);
  const addToSampleBox = useStore(s => s.addToSampleBox);
  const sampleBox = useStore(s => s.sampleBox);

  const filtered = activeCategory === 'All'
    ? FINISHES
    : FINISHES.filter(f => f.category === activeCategory);

  const handleAddSample = (finish: Finish, e: React.MouseEvent) => {
    e.stopPropagation();
    addToSampleBox({ id: finish.id, name: finish.name, category: finish.category, image: '' });
    setAddedId(finish.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const inBox = (id: string) => sampleBox.some(f => f.id === id);

  return (
    <div className="flex flex-col gap-8">

      {/* ── Category Filter ── */}
      <div className="flex flex-col gap-3">
        <span className="text-[9px] uppercase tracking-widest opacity-40">Collection</span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-2.5 py-1 text-[9px] uppercase tracking-widest border transition-all ${
                activeCategory === cat
                  ? 'bg-ink text-bone border-ink'
                  : 'border-rule text-slate hover:border-ink hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Finish Grid ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-widest opacity-40">
            {filtered.length} Finishes
          </span>
          {selectedSegmentId && (
            <span className="text-[9px] font-mono text-petra uppercase tracking-wider">
              ↑ Recoloring active surface
            </span>
          )}
        </div>

        <div
          className="grid grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1"
          style={{ scrollbarWidth: 'thin' }}
          role="listbox"
          aria-label="Finish palette"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(finish => {
              const isActive = activeFinish.id === finish.id;
              const isInBox  = inBox(finish.id);
              const wasAdded = addedId === finish.id;

              return (
                <motion.div
                  key={finish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.18 }}
                  className="relative group"
                >
                  <div
                    role="option"
                    aria-selected={isActive}
                    aria-label={`${finish.name} — ${finish.category}`}
                    onClick={() => onSelect(finish)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(finish)}
                    tabIndex={0}
                    className={`w-full flex flex-col gap-1 text-left transition-all cursor-pointer ${
                      isActive ? 'ring-2 ring-ink ring-offset-1' : ''
                    }`}
                  >
                    {/* Swatch */}
                    <div
                      className="w-full aspect-square relative overflow-hidden"
                      style={{ backgroundColor: finish.hex }}
                    >
                      {isActive && (
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/25 pointer-events-none" />
                      )}
                      {/* Add to sample box on hover */}
                      <button
                        onClick={(e) => handleAddSample(finish, e)}
                        aria-label={isInBox ? `${finish.name} already in sample box` : `Add ${finish.name} to sample box`}
                        className={`absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center transition-all
                          ${isInBox || wasAdded
                            ? 'opacity-100 bg-petra text-bone'
                            : 'opacity-0 group-hover:opacity-100 bg-ink/80 text-bone hover:bg-ink'
                          }`}
                        title={isInBox ? 'In sample box' : 'Add to sample box'}
                      >
                        {wasAdded || isInBox
                          ? <Check size={10} aria-hidden="true" />
                          : <ShoppingBag size={10} aria-hidden="true" />
                        }
                      </button>
                    </div>
                    {/* Label */}
                    <span className="text-[8px] uppercase tracking-wider leading-tight px-0.5 truncate w-full">
                      {finish.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Active Finish Info ── */}
      <div className="border border-rule p-3 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 border border-rule" style={{ backgroundColor: activeFinish.hex }} />
          <div>
            <p className="text-[11px] uppercase tracking-widest font-medium leading-tight">{activeFinish.name}</p>
            <p className="text-[9px] opacity-40 uppercase tracking-wide">{activeFinish.category}</p>
          </div>
        </div>
        <p className="text-[9px] opacity-60 leading-relaxed">{activeFinish.description}</p>
      </div>

      {/* ── Opacity / Blend Intensity ── */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-widest opacity-40">Paint Intensity</span>
          <span className="text-[9px] font-mono text-petra">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(opacity * 100)}
          onChange={e => onOpacityChange(Number(e.target.value) / 100)}
          aria-label="Paint intensity"
          className="w-full h-0.5 appearance-none bg-rule accent-petra cursor-pointer"
          style={{ accentColor: 'var(--color-petra)' }}
        />
        <div className="flex justify-between text-[8px] opacity-30 uppercase tracking-widest">
          <span>Sheer</span>
          <span>Full</span>
        </div>
      </div>
    </div>
  );
}
