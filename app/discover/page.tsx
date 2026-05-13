'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FINISH_CATALOG } from '@/lib/data/catalog';
import { type FinishCategory } from '@/lib/designer/types';

const MOOD_TO_CATEGORIES: Record<string, FinishCategory[]> = {
  mineral: ['Stone & Concrete', 'Stucco'],
  pearl:   ['Pearlescent', 'Polished Plaster'],
  earth:   ['Texture'],
  ink:     ['Metallic'],
  bronze:  ['Metallic', 'Texture'],
  linen:   ['Glaze', 'Polished Plaster'],
};

const STEPS = [
  {
    id: 'persona',
    question: 'Define your perspective.',
    options: [
      { id: 'architect',  label: 'Architect',  image: '/posts/657745442_18428327476137654_3867590858736087448_n.jpg' },
      { id: 'designer',   label: 'Designer',   image: '/posts/652999374_18425621443137654_2853474462635297911_n.jpg' },
      { id: 'contractor', label: 'Contractor', image: '/posts/650895184_18424943902137654_7919832335211725751_n.jpg' },
      { id: 'homeowner',  label: 'Homeowner',  image: '/posts/655964368_18428326249137654_6608690836982725613_n.jpg' },
    ],
  },
  {
    id: 'mood',
    question: 'Select a tonal direction.',
    options: [
      { id: 'mineral', label: 'Mineral', color: '#C8C3B8' },
      { id: 'pearl',   label: 'Pearl',   color: '#F5F1EB' },
      { id: 'earth',   label: 'Earth',   color: '#8C7B6B' },
      { id: 'ink',     label: 'Ink',     color: '#0F0F0D' },
      { id: 'bronze',  label: 'Bronze',  color: '#C4873A' },
      { id: 'linen',   label: 'Linen',   color: '#EDEAE3' },
    ],
  },
  {
    id: 'space',
    question: 'What kind of space?',
    options: [
      { id: 'living',     label: 'Living Areas',   image: '/posts/656425529_18428235988137654_5437037602706613576_n.jpg' },
      { id: 'bedroom',    label: 'Bedrooms',        image: '/posts/641279800_2110078083158893_6285086235248295224_n.jpg' },
      { id: 'commercial', label: 'Commercial',      image: '/posts/684252494_1339249504685900_1835448542080863034_n.jpg' },
      { id: 'exterior',   label: 'Exterior',        image: '/posts/683094682_18433530136137654_329903382301534974_n.jpg' },
    ],
  },
];

export default function QuizPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentStep = STEPS[stepIndex];
  const progress = showResults ? 100 : ((stepIndex + 1) / STEPS.length) * 100;

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [currentStep.id]: optionId };
    setAnswers(newAnswers);
    if (stepIndex < STEPS.length - 1) {
      setDirection(1);
      setStepIndex(stepIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex(stepIndex - 1);
    }
  };

  const moodAnswer = answers['mood'] as string | undefined;
  const recommendedCategories = moodAnswer ? MOOD_TO_CATEGORIES[moodAnswer] ?? [] : [];
  const results = recommendedCategories.length > 0
    ? FINISH_CATALOG.filter((f) => recommendedCategories.includes(f.category)).slice(0, 8)
    : FINISH_CATALOG.slice(0, 8);

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
        <span className="text-spec opacity-40">
          {showResults ? 'Results' : `Step ${stepIndex + 1} of ${STEPS.length}`}
        </span>
        {(stepIndex > 0 || showResults) ? (
          <button onClick={handleBack} className="text-ui opacity-40 hover:opacity-100 transition-opacity">Back</button>
        ) : <div />}
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-y-auto">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {showResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 lg:p-16"
            >
              <div className="text-center mb-12">
                <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-4">Your Curation</span>
                <h2 className="text-display mb-4">
                  {moodAnswer ? `${moodAnswer.charAt(0).toUpperCase() + moodAnswer.slice(1)} ` : ''}
                  <span className="italic">Finishes.</span>
                </h2>
                <p className="text-body opacity-50 max-w-md mx-auto">
                  Based on your selections, we recommend these finishes for your project.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10 max-w-5xl mx-auto mb-12">
                {results.map((finish, i) => (
                  <motion.div
                    key={finish.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={`/finishes/${finish.id}`}
                      className="group relative aspect-square overflow-hidden flex flex-col justify-end block"
                    >
                      <div
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundColor: finish.hex }}
                      />
                      <img
                        src={finish.image}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                      <div className="relative z-10 p-4">
                        <span className="text-[9px] uppercase tracking-widest opacity-50 block">{finish.category}</span>
                        <h3 className="text-ui">{finish.name}</h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sample-box" className="btn-primary bg-petra border-petra">Order Sample Box &rarr;</Link>
                <Link href="/finishes" className="btn-outline border-bone text-bone hover:bg-bone hover:text-ink">Browse All Finishes</Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={stepIndex}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 lg:p-24"
            >
              <h2 className="text-display mb-16 text-center max-w-2xl">{currentStep.question}</h2>

              <div className={`grid gap-4 w-full max-w-6xl ${currentStep.id === 'mood' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
