'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const STEPS = [
  {
    id: 'persona',
    question: 'Define your perspective.',
    options: [
      { id: 'architect', label: 'Architect', image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2689&auto=format&fit=crop' },
      { id: 'designer', label: 'Designer', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2716&auto=format&fit=crop' },
      { id: 'contractor', label: 'Contractor', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop' },
      { id: 'homeowner', label: 'Homeowner', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop' },
    ]
  },
  {
    id: 'mood',
    question: 'Select a tonal direction.',
    options: [
      { id: 'mineral', label: 'Mineral', color: '#C8C3B8' },
      { id: 'pearl', label: 'Pearl', color: '#F5F1EB' },
      { id: 'earth', label: 'Earth', color: '#8C7B6B' },
      { id: 'ink', label: 'Ink', color: '#0F0F0D' },
      { id: 'bronze', label: 'Bronze', color: '#C4873A' },
      { id: 'linen', label: 'Linen', color: '#EDEAE3' },
    ]
  },
  // More steps would follow...
];

export default function QuizPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const handleSelect = (optionId: string) => {
    setAnswers({ ...answers, [currentStep.id]: optionId });
    if (stepIndex < STEPS.length - 1) {
      setDirection(1);
      setStepIndex(stepIndex + 1);
    } else {
      // End of quiz logic
      console.log('Quiz Finished:', answers);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex(stepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink text-bone z-[100] flex flex-col overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-bone/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-petra"
        />
      </div>

      {/* Header */}
      <div className="p-8 flex justify-between items-center z-10">
        <Link href="/" className="text-ui opacity-40 hover:opacity-100 transition-opacity">&larr; Exit</Link>
        <span className="text-spec opacity-40">Step {stepIndex + 1} of {STEPS.length}</span>
        {stepIndex > 0 ? (
          <button onClick={handleBack} className="text-ui opacity-40 hover:opacity-100 transition-opacity">Back</button>
        ) : <div />}
      </div>

      {/* Quiz Content */}
      <div className="flex-1 relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={{
              enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 lg:p-24"
          >
            <h2 className="text-display mb-16 text-center max-w-2xl">{currentStep.question}</h2>

            <div className={`grid gap-4 w-full max-w-6xl ${currentStep.id === 'persona' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3'}`}>
              {currentStep.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className="group relative aspect-square overflow-hidden border border-bone/10 hover:border-petra transition-colors text-left p-6 flex flex-col justify-end"
                >
                  {'image' in option && option.image && (
                    <div className="absolute inset-0 z-0">
                      <img src={option.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" alt={option.label} />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                    </div>
                  )}
                  {'color' in option && option.color && (
                    <div className="absolute inset-0 z-0" style={{ backgroundColor: option.color }}>
                       <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/0 transition-colors" />
                    </div>
                  )}
                  <span className="relative z-10 text-ui group-hover:translate-x-2 transition-transform">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
