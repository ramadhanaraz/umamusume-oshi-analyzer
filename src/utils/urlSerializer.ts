import LZString from 'lz-string';
import { Trainee, WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { OshiSlot } from './calculator';

const getLZ = () => {
  if (typeof LZString !== 'undefined' && LZString.compressToEncodedURIComponent) {
    return LZString;
  }
  // @ts-expect-error fallback for default export
  return LZString?.default || LZString;
};

export interface DecodedRosterPayload {
  trainees: (Trainee | null)[];
  weightMode: WeightingMode;
  filterMode: AptitudeFilterMode;
}

/**
 * Compresses trainee IDs along with weightMode and filterMode into a URL-safe string.
 */
export function encodeRosterToUrl(
  slots: OshiSlot[],
  weightMode: WeightingMode = 'tiered',
  filterMode: AptitudeFilterMode = 'aOnly'
): string {
  try {
    const lz = getLZ();
    const ids = slots.map((s) => s.trainee?.id || '');

    const payload = {
      ids,
      w: weightMode,
      f: filterMode,
    };

    return lz.compressToEncodedURIComponent(JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to encode roster to URL:', err);
    return '';
  }
}

/**
 * Decompresses and extracts the roster slots along with their saved calculation modes.
 */
export function decodeRosterFromUrl(
  compressed: string,
  database: Trainee[]
): DecodedRosterPayload {
  const defaultResult: DecodedRosterPayload = {
    trainees: [],
    weightMode: 'tiered',
    filterMode: 'aOnly',
  };

  try {
    if (!compressed) return defaultResult;
    const lz = getLZ();
    const raw = lz.decompressFromEncodedURIComponent(compressed);
    if (!raw) return defaultResult;

    const map = new Map(database.map((t) => [t.id, t]));

    // Format A: Modern JSON payload (Includes calculations)
    if (raw.trim().startsWith('{')) {
      const parsed = JSON.parse(raw);
      const ids: string[] = Array.isArray(parsed.ids) ? parsed.ids : [];
      const trainees = ids.map((id) => (id?.trim() ? map.get(id.trim()) || null : null));

      const validWeights: WeightingMode[] = ['equal', 'tiered', 'linear'];
      const validFilters: AptitudeFilterMode[] = ['aOnly', 'acViable', 'allGrades'];

      return {
        trainees,
        weightMode: validWeights.includes(parsed.w) ? parsed.w : 'tiered',
        filterMode: validFilters.includes(parsed.f) ? parsed.f : 'aOnly',
      };
    }

    // Format B: Legacy CSV fallback
    const ids = raw.split(',');
    const trainees = ids.map((id) => (id.trim() ? map.get(id.trim()) || null : null));
    return {
      trainees,
      weightMode: 'tiered',
      filterMode: 'aOnly',
    };
  } catch (err) {
    console.error('Failed to decode roster from URL:', err);
    return defaultResult;
  }
}