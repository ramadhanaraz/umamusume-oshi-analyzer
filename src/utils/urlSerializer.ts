import LZString from 'lz-string';
import { Trainee } from '../types/trainee';
import { OshiSlot } from './calculator';

// Safe resolver for lz-string across both ESM and CommonJS Next.js bundles
const getLZ = () => {
  if (typeof LZString !== 'undefined' && LZString.compressToEncodedURIComponent) {
    return LZString;
  }
  // @ts-expect-error fallback for default export
  return LZString?.default || LZString;
};

export function encodeRosterToUrl(slots: OshiSlot[]): string {
  try {
    const lz = getLZ();
    const ids = slots.map((s) => s.trainee?.id || '').join(',');
    return lz.compressToEncodedURIComponent(ids);
  } catch (err) {
    console.error('Failed to encode roster to URL:', err);
    return '';
  }
}

export function decodeRosterFromUrl(compressed: string, database: Trainee[]): (Trainee | null)[] {
  try {
    if (!compressed) return [];
    const lz = getLZ();
    const raw = lz.decompressFromEncodedURIComponent(compressed);
    if (!raw) return [];

    const ids = raw.split(',');
    const map = new Map(database.map((t) => [t.id, t]));
    return ids.map((id) => (id.trim() ? map.get(id.trim()) || null : null));
  } catch (err) {
    console.error('Failed to decode roster from URL:', err);
    return [];
  }
}