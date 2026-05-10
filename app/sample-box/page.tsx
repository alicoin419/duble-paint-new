'use client';

import { useStore } from "@/lib/store/useStore";
import { X, Check } from "lucide-react";
import Link from "next/link";

const MOCK_FINISHES = [
  { id: '1', name: 'Cappadocia', category: 'Texture', image: 'https://images.unsplash.com/photo-1541824894976-3f0f90768e91?q=80&w=2670&auto=format&fit=crop' },
  { id: '2', name: 'Marvellino', category: 'Pearlescent', image: 'https://images.unsplash.com/photo-1615873966503-09717764670c?q=80&w=2670&auto=format&fit=crop' },
  { id: '3', name: 'Stucco-tec', category: 'Stucco', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop' },
  { id: '4', name: 'Joyaux', category: 'Metallic', image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2670&auto=format&fit=crop' },
  { id: '5', name: 'Petra', category: 'Stone', image: 'https://images.unsplash.com/photo-1518717755992-c5d0ae2da951?q=80&w=2670&auto=format&fit=crop' },
  { id: '6', name: 'Metallica', category: 'Metallic', image: 'https://images.unsplash.com/photo-1505235617560-d99bd4348882?q=80&w=2670&auto=format&fit=crop' },
];

export default function SampleBoxPage() {
  const { sampleBox, addToSampleBox, removeFromSampleBox } = useStore();

  const isSelected = (id: string) => sampleBox.some(f => f.id === id);

  return (
    <div className="min-h-screen bg-bone">
      <div className="grid grid-cols-1 lg:grid-cols-10">
        
        {/* Left 60%: Builder */}
        <div className="lg:col-span-6 p-8 lg:p-16 border-r border-rule">
          <header className="mb-16">
             <h1 className="text-display mb-4">Sample <span className="italic">Box.</span></h1>
             <p className="text-body opacity-60">Select up to 5 finishes to receive your bespoke tactile palette.</p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MOCK_FINISHES.map((finish) => (
              <button 
                key={finish.id}
                onClick={() => isSelected(finish.id) ? removeFromSampleBox(finish.id) : addToSampleBox(finish)}
                className={`relative aspect-square group overflow-hidden border transition-all duration-300 ${isSelected(finish.id) ? 'border-petra' : 'border-rule hover:border-ink'}`}
              >
                <img src={finish.image} alt={finish.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSelected(finish.id) ? 'scale-105' : ''}`} />
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/0 transition-colors" />
                
                <div className="absolute top-4 right-4">
                  {isSelected(finish.id) && (
                    <div className="w-6 h-6 bg-petra flex items-center justify-center text-bone">
                      <Check size={14} />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 text-left">
                  <span className="text-[8px] uppercase tracking-widest text-bone opacity-60">{finish.category}</span>
                  <h3 className="text-ui text-bone">{finish.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 40%: Summary (Sticky) */}
        <div className="lg:col-span-4 p-8 lg:p-16 h-fit lg:sticky lg:top-32">
          <div className="border border-rule p-8">
            <h2 className="text-ui mb-8 flex justify-between">
              Your Selection
              <span className="font-mono">{sampleBox.length} / 5</span>
            </h2>

            <div className="space-y-4 mb-12">
              {sampleBox.length === 0 && (
                <p className="text-xs opacity-40 italic">No finishes selected yet.</p>
              )}
              {sampleBox.map((finish) => (
                <div key={finish.id} className="flex justify-between items-center py-2 border-b border-rule group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone">
                      <img src={finish.image} className="w-full h-full object-cover" alt={finish.name} />
                    </div>
                    <span className="text-xs uppercase tracking-wide">{finish.name}</span>
                  </div>
                  <button 
                    onClick={() => removeFromSampleBox(finish.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs opacity-60 uppercase tracking-widest">
                <span>Shipping</span>
                <span>Complementary</span>
              </div>
              <div className="hr-rule" />
              <button 
                disabled={sampleBox.length === 0}
                className="btn-primary w-full disabled:opacity-30 disabled:pointer-events-none"
              >
                Confirm Order &rarr;
              </button>
              <p className="text-[10px] opacity-40 text-center uppercase tracking-widest mt-4">Free delivery 3–5 days across Nigeria</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
