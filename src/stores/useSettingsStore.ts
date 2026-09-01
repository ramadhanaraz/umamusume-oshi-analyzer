import { create } from 'zustand';
import { WeightingMode, AptitudeFilterMode, TerminologyMode } from '../types/trainee';

const SETTINGS_STORAGE_KEY = 'umamusume-top50-calc-settings';
const TERMINOLOGY_STORAGE_KEY = 'umamusume-top50-terminology-mode';

interface SettingsState {
  weightMode: WeightingMode;
  filterMode: AptitudeFilterMode;
  mode: TerminologyMode;

  setWeightMode: (mode: WeightingMode) => void;
  setFilterMode: (mode: AptitudeFilterMode) => void;
  setMode: (mode: TerminologyMode) => void;
  loadSavedSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  weightMode: 'tiered',
  filterMode: 'aOnly',
  mode: 'global',

  setWeightMode: (weightMode) => {
    set({ weightMode });
    if (typeof window !== 'undefined') {
      try {
        const current = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...current, weightMode }));
      } catch (e) {
        console.error('Failed to save weightMode to LocalStorage', e);
      }
    }
  },

  setFilterMode: (filterMode) => {
    set({ filterMode });
    if (typeof window !== 'undefined') {
      try {
        const current = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...current, filterMode }));
      } catch (e) {
        console.error('Failed to save filterMode to LocalStorage', e);
      }
    }
  },

  setMode: (mode) => {
    set({ mode });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TERMINOLOGY_STORAGE_KEY, mode);
      } catch (e) {
        console.error('Failed to save terminology mode to LocalStorage', e);
      }
    }
  },

  loadSavedSettings: () => {
    if (typeof window === 'undefined') return;
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.weightMode) set({ weightMode: parsed.weightMode });
        if (parsed.filterMode) set({ filterMode: parsed.filterMode });
      }

      const savedMode = localStorage.getItem(TERMINOLOGY_STORAGE_KEY);
      if (savedMode === 'global' || savedMode === 'jp') {
        set({ mode: savedMode });
      }
    } catch (e) {
      console.error('Failed to load settings from LocalStorage', e);
    }
  },
}));
