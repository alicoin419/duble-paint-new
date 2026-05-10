import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Finish {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface AppState {
  sampleBox: Finish[];
  addToSampleBox: (finish: Finish) => void;
  removeFromSampleBox: (id: string) => void;
  clearSampleBox: () => void;
  
  moodboard: Finish[];
  addToMoodboard: (finish: Finish) => void;
  removeFromMoodboard: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      sampleBox: [],
      addToSampleBox: (finish) => set((state) => {
        if (state.sampleBox.length >= 5) return state; // Max 5 samples
        if (state.sampleBox.find((f) => f.id === finish.id)) return state;
        return { sampleBox: [...state.sampleBox, finish] };
      }),
      removeFromSampleBox: (id) => set((state) => ({
        sampleBox: state.sampleBox.filter((f) => f.id !== id)
      })),
      clearSampleBox: () => set({ sampleBox: [] }),

      moodboard: [],
      addToMoodboard: (finish) => set((state) => {
        if (state.moodboard.find((f) => f.id === finish.id)) return state;
        return { moodboard: [...state.moodboard, finish] };
      }),
      removeFromMoodboard: (id) => set((state) => ({
        moodboard: state.moodboard.filter((f) => f.id !== id)
      })),
    }),
    {
      name: 'ddp-storage',
    }
  )
);
