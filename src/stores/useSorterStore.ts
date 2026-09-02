import { create } from 'zustand';

interface SorterSimpleState {
  hasActiveSession: boolean;
  setHasActiveSession: (val: boolean) => void;
}

export const useSorterStore = create<SorterSimpleState>((set) => ({
  hasActiveSession: false,
  setHasActiveSession: (hasActiveSession) => set({ hasActiveSession }),
}));
