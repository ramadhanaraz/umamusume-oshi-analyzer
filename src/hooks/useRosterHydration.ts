// hooks/useRosterHydration.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Trainee, WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { OshiSlot } from '../utils/calculator';
import { encodeRosterToUrl, decodeRosterFromUrl } from '../utils/urlSerializer';
import { TRAINEES } from '../data/trainees';

const TOTAL_SLOTS = 50;
const LOCAL_STORAGE_ROSTER_KEY = 'umamusume-top50-roster';
const LOCAL_STORAGE_SETTINGS_KEY = 'umamusume-top50-calc-settings';

const createEmptySlots = (): OshiSlot[] =>
  Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
    rank: i + 1,
    trainee: null,
  }));

export function useRosterHydration() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Roster Slots State
  const [slots, setSlots] = useState<OshiSlot[]>(createEmptySlots);

  // Calculation Formula States
  const [weightMode, setWeightMode] = useState<WeightingMode>('tiered');
  const [filterMode, setFilterMode] = useState<AptitudeFilterMode>('aOnly');

  // Preview & Hydration Flags
  const [isSharedPreview, setIsSharedPreview] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // ----------------------------------------------------
  // 1. Initial Hydration: Load LocalStorage OR Shared Link
  // ----------------------------------------------------
  useEffect(() => {
    const sharedParam = searchParams.get('roster') || searchParams.get('r');

    if (sharedParam) {
      // 1A. Shared Link Mode: Decode and display without touching LocalStorage
      const decoded = decodeRosterFromUrl(sharedParam, TRAINEES);
      if (decoded && decoded.trainees.length > 0) {
        const incomingSlots: OshiSlot[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
          rank: i + 1,
          trainee: decoded.trainees[i] || null,
        }));

        setSlots(incomingSlots);
        setWeightMode(decoded.weightMode);
        setFilterMode(decoded.filterMode);
        setIsSharedPreview(true);
        setIsLoaded(true);
        return;
      }
    }

    // 1B. Personal Mode: Load saved roster & formula settings from LocalStorage
    try {
      const savedRoster = localStorage.getItem(LOCAL_STORAGE_ROSTER_KEY);
      if (savedRoster) {
        const parsedIds: string[] = JSON.parse(savedRoster);
        const map = new Map(TRAINEES.map((t) => [t.id, t]));
        const loadedSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
          rank: i + 1,
          trainee: parsedIds[i] ? map.get(parsedIds[i]) || null : null,
        }));
        setSlots(loadedSlots);
      } else {
        setSlots(createEmptySlots());
      }

      const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.weightMode) setWeightMode(parsed.weightMode);
        if (parsed.filterMode) setFilterMode(parsed.filterMode);
      }
    } catch (e) {
      console.error('Failed to load data from LocalStorage:', e);
    }

    setIsSharedPreview(false);
    setIsLoaded(true);
  }, [searchParams]);

  // ----------------------------------------------------
  // 2. Auto-save to LocalStorage (Personal Mode Only)
  // ----------------------------------------------------
  useEffect(() => {
    // Strictly guard against saving while uninitialized or in shared preview mode
    if (!isLoaded || isSharedPreview) return;

    try {
      const ids = slots.map((s) => s.trainee?.id || '');
      localStorage.setItem(LOCAL_STORAGE_ROSTER_KEY, JSON.stringify(ids));

      const settings = { weightMode, filterMode };
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save data to LocalStorage:', e);
    }
  }, [slots, weightMode, filterMode, isLoaded, isSharedPreview]);

  // ----------------------------------------------------
  // 3. Shared Preview Actions
  // ----------------------------------------------------
  const exitPreview = useCallback(() => {
    try {
      const savedRoster = localStorage.getItem(LOCAL_STORAGE_ROSTER_KEY);
      let restoredSlots = createEmptySlots();

      if (savedRoster) {
        const parsedIds: string[] = JSON.parse(savedRoster);
        const map = new Map(TRAINEES.map((t) => [t.id, t]));
        restoredSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
          rank: i + 1,
          trainee: parsedIds[i] ? map.get(parsedIds[i]) || null : null,
        }));
      }
      setSlots(restoredSlots);

      const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setWeightMode(parsed.weightMode || 'tiered');
        setFilterMode(parsed.filterMode || 'aOnly');
      } else {
        setWeightMode('tiered');
        setFilterMode('aOnly');
      }
    } catch (e) {
      console.error('Failed to restore personal data from LocalStorage:', e);
    }

    setIsSharedPreview(false);

    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', pathname);
    }
    router.replace(pathname);
  }, [pathname, router]);

  const confirmImportShared = useCallback(() => {
    try {
      const ids = slots.map((s) => s.trainee?.id || '');
      localStorage.setItem(LOCAL_STORAGE_ROSTER_KEY, JSON.stringify(ids));

      const settings = { weightMode, filterMode };
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));

      setIsSharedPreview(false);

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', pathname);
      }
      router.replace(pathname);
    } catch (e) {
      console.error('Failed to overwrite LocalStorage with shared roster:', e);
    }
  }, [slots, weightMode, filterMode, pathname, router]);

  const handleShare = async (
    overrideWeight?: WeightingMode,
    overrideFilter?: AptitudeFilterMode
  ) => {
    if (typeof window === 'undefined') return;

    // Sanitize to prevent React Click Events from being passed as weight mode
    const validWeights: WeightingMode[] = ['equal', 'tiered', 'linear'];
    const validFilters: AptitudeFilterMode[] = ['aOnly', 'acViable', 'allGrades'];

    const targetWeight =
      typeof overrideWeight === 'string' && validWeights.includes(overrideWeight)
        ? overrideWeight
        : weightMode;

    const targetFilter =
      typeof overrideFilter === 'string' && validFilters.includes(overrideFilter)
        ? overrideFilter
        : filterMode;

    const compressed = encodeRosterToUrl(slots, targetWeight, targetFilter);
    const url = `${window.location.origin}${window.location.pathname}?roster=${compressed}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return {
    slots,
    setSlots,
    weightMode,
    setWeightMode,
    filterMode,
    setFilterMode,
    isSharedPreview,
    copied,
    exitPreview,
    confirmImportShared,
    handleShare,
  };
}