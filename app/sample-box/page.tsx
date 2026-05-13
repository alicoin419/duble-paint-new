'use client';

import { useStore } from "@/lib/store/useStore";
import { X, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_FINISHES = [
  { id: 'cappadocia',  name: 'Cappadocia',  category: 'Texture',          image: '/posts/670464277_18431455924137654_2021129107031105779_n.jpg' },
  { id: 'marvellino', name: 'Marvellino',  category: 'Pearlescent',      image: '/posts/656425529_18428235988137654_5437037602706613576_n.jpg' },
  { id: 'stucco-tec', name: 'Stucco-tec',  category: 'Stucco',           image: '/posts/641279800_2110078083158893_6285086235248295224_n.jpg' },
  { id: 'onyx',       name: 'Onyx',        category: 'Metallic',         image: '/posts/649871712_18424424908137654_7323097420623266103_n.jpg' },
  { id: 'tuscania',   name: 'Tuscania',    category: 'Polished Plaster',  image: '/posts/651591691_18425213830137654_6239825968475969113_n.jpg' },
  { id: 'aurum',      name: 'Aurum',       category: 'Metallic',         image: '/posts/655964368_18428326249137654_6608690836982725613_n.jpg' },
];

export default function SampleBoxPage() {
  const { sampleBox, addToSampleBox, removeFromSampleBox, clearSampleBox } = useStore();
  const [ordered, setOrdered] = useState(false);

  const isSelected = (id: string) => sampleBox.some(f => f.id === id);

  const handleConfirmOrder = () => {
    setOrdered(true);
    clearSampleBox();
  };

  return (
    <div className="min-h-screen bg-bone">
      {/* Order Confirmation Overlay */}
      <AnimatePresence>
        {ordered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-bone max-w-md w-full p-12 text-center"
            >
              <div className="w-12 h-12 bg-petra flex items-center justify-center mx-auto mb-8">
                <Check size={20} className="text-bone" />
              </div>
              <h2 className="text-title mb-3">Order Confirmed.</h2>
              <p className="text-body opacity-60 mb-2">Your sample box is on its way.</p>
              <p className="text-xs opacity-40 mb-10 uppercase tracking-widest">Free delivery within 3–5 business days across Nigeria.</p>
              <div className="space-y-3">
                <Link href="/finishes" className="btn-primary w-full block text-center" onClick={() => setOrdered(false)}>
                  Continue Browsing &rarr;
                </Link>
                <Link href="/" className="btn-ghost w-full block text-center" onClick={() => setOrdered(false)}>
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                onClick={handleConfirmOrder}
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
