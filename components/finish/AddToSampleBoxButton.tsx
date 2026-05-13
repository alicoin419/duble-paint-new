'use client';

import { useStore } from '@/lib/store/useStore';
import { Check } from 'lucide-react';

interface Props {
  finish: { id: string; name: string; category: string; image: string };
}

export default function AddToSampleBoxButton({ finish }: Props) {
  const { sampleBox, addToSampleBox, removeFromSampleBox } = useStore();
  const inBox = sampleBox.some((f) => f.id === finish.id);
  const full = sampleBox.length >= 5 && !inBox;

  return (
    <button
      onClick={() => inBox ? removeFromSampleBox(finish.id) : addToSampleBox(finish)}
      disabled={full}
      className={`btn-primary w-full flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:pointer-events-none ${
        inBox ? 'bg-petra border-petra' : ''
      }`}
    >
      {inBox ? (
        <>
          <Check size={14} /> Added to Sample Box
        </>
      ) : full ? (
        'Sample Box Full (5/5)'
      ) : (
        'Order Sample &rarr;'
      )}
    </button>
  );
}
