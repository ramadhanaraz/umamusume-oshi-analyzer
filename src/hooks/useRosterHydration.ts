'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { OshiSlot } from '../utils/calculator';
import { encodeRosterToUrl, decodeRosterFromUrl } from '../utils/urlSerializer';
import { TRAINEES } from '../data/trainees';

const TOTAL_SLOTS = 50;

const createEmptySlots = (): OshiSlot[] =>
  Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
    rank: i + 1,
    trainee: null,
  }));

export function useRosterHydration() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [slots, setSlots] = useState<OshiSlot[]>(createEmptySlots);
  const [localSavedSlots, setLocalSavedSlots] = useState<OshiSlot[] | null>(null);
  const [isSharedPreview, setIsSharedPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const isHydratedRef = useRef(false);

  useEffect(() => {
    if (isHydratedRef.current) return;

    let storedSlots = createEmptySlots();

    try {
      const saved = localStorage.getItem('umamusume-top50-roster');
      if (saved) {
        const parsedIds: string[] = JSON.parse(saved);
        const map = new Map(TRAINEES.map((t) => [t.id, t]));
        storedSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
          rank: i + 1,
          trainee: parsedIds[i] ? map.get(parsedIds[i]) || null : null,
        }));
        setLocalSavedSlots(storedSlots);
      }
    } catch (e) {
      console.error('LocalStorage load failed:', e);
    }

    const sharedParam = searchParams.get('roster') || searchParams.get('r');
    if (sharedParam) {
      const decodedTrainees = decodeRosterFromUrl(sharedParam, TRAINEES);
      if (decodedTrainees && decodedTrainees.length > 0) {
        const incomingSlots: OshiSlot[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
          rank: i + 1,
          trainee: decodedTrainees[i] || null,
        }));
        setSlots(incomingSlots);
        setIsSharedPreview(true);
        isHydratedRef.current = true;
        return;
      }
    }

    setSlots(storedSlots);
    isHydratedRef.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!isHydratedRef.current || isSharedPreview) return;
    try {
      const ids = slots.map((s) => s.trainee?.id || '');
      localStorage.setItem('umamusume-top50-roster', JSON.stringify(ids));
    } catch (e) {
      console.error('LocalStorage save failed:', e);
    }
  }, [slots, isSharedPreview]);

  const exitPreview = () => {
    setSlots(localSavedSlots || createEmptySlots());
    setIsSharedPreview(false);
    router.replace(pathname);
  };

  const confirmImportShared = () => {
    try {
      const ids = slots.map((s) => s.trainee?.id || '');
      localStorage.setItem('umamusume-top50-roster', JSON.stringify(ids));
      setLocalSavedSlots(slots);
      setIsSharedPreview(false);
      router.replace(pathname);
    } catch (e) {
      console.error('LocalStorage overwrite failed:', e);
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const compressed = encodeRosterToUrl(slots);
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
    isSharedPreview,
    copied,
    exitPreview,
    confirmImportShared,
    handleShare,
  };
}