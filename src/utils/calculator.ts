import { Trainee, AptitudeGrade, TerminologyMode, TERMINOLOGY } from '../types/trainee';
import LZString from 'lz-string';

export const GRADE_POINTS: Record<AptitudeGrade, number> = {
  S: 10,
  A: 9,
  B: 7,
  C: 5,
  D: 3,
  E: 2,
  F: 1,
  G: 0,
};

export interface OshiSlot {
  rank: number;
  trainee: Trainee | null;
}

export function calculateAnalysis(slots: OshiSlot[]) {
  const active = slots.filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null);

  const styleRaw = { front: 0, pace: 0, late: 0, end: 0 };
  const distanceRaw = { short: 0, mile: 0, medium: 0, long: 0 };
  const surfaceRaw = { turf: 0, dirt: 0 };

  active.forEach(({ rank, trainee }) => {
    const weight = 51 - rank; // Rank 1 = 50x, Rank 50 = 1x

    styleRaw.front += (GRADE_POINTS[trainee.style.front] || 0) * weight;
    styleRaw.pace += (GRADE_POINTS[trainee.style.pace] || 0) * weight;
    styleRaw.late += (GRADE_POINTS[trainee.style.late] || 0) * weight;
    styleRaw.end += (GRADE_POINTS[trainee.style.end] || 0) * weight;

    distanceRaw.short += (GRADE_POINTS[trainee.distance.short] || 0) * weight;
    distanceRaw.mile += (GRADE_POINTS[trainee.distance.mile] || 0) * weight;
    distanceRaw.medium += (GRADE_POINTS[trainee.distance.medium] || 0) * weight;
    distanceRaw.long += (GRADE_POINTS[trainee.distance.long] || 0) * weight;

    surfaceRaw.turf += (GRADE_POINTS[trainee.surface.turf] || 0) * weight;
    surfaceRaw.dirt += (GRADE_POINTS[trainee.surface.dirt] || 0) * weight;
  });

  const totalStyle = Object.values(styleRaw).reduce((a, b) => a + b, 0) || 1;
  const totalDist = Object.values(distanceRaw).reduce((a, b) => a + b, 0) || 1;
  const totalSurf = Object.values(surfaceRaw).reduce((a, b) => a + b, 0) || 1;

  const stylePct = {
    front: Math.round((styleRaw.front / totalStyle) * 100),
    pace: Math.round((styleRaw.pace / totalStyle) * 100),
    late: Math.round((styleRaw.late / totalStyle) * 100),
    end: Math.round((styleRaw.end / totalStyle) * 100),
  };

  const distPct = {
    short: Math.round((distanceRaw.short / totalDist) * 100),
    mile: Math.round((distanceRaw.mile / totalDist) * 100),
    medium: Math.round((distanceRaw.medium / totalDist) * 100),
    long: Math.round((distanceRaw.long / totalDist) * 100),
  };

  const surfPct = {
    turf: Math.round((surfaceRaw.turf / totalSurf) * 100),
    dirt: Math.round((surfaceRaw.dirt / totalSurf) * 100),
  };

  // Determine dominant archetype
  const maxStyleKey = (Object.keys(styleRaw) as Array<keyof typeof styleRaw>).reduce((a, b) =>
    styleRaw[a] > styleRaw[b] ? a : b
  );

  let archetype = { title: 'Strategic Maestro (オールラウンダー)', description: 'Balanced across all tactical positions.' };
  if (stylePct[maxStyleKey] >= 32) {
    switch (maxStyleKey) {
      case 'front':
        archetype = { title: 'Blazing Frontrunner (逃げ切りスペシャリスト)', description: 'Values dominant early-race leads and blistering pacing.' };
        break;
      case 'pace':
        archetype = { title: 'Tactical Pacesetter (王道先行マエストロ)', description: 'Favors solid mid-pack positioning and explosive late-corner burst.' };
        break;
      case 'late':
        archetype = { title: 'Midfield Infiltrator (疾風怒濤の差し)', description: 'Specializes in momentum building through the crowd and sweeping turns.' };
        break;
      case 'end':
        archetype = { title: 'Backfield Sniper (一撃必殺の追込)', description: 'Prefers saving all stamina for a thunderous final-stretch sprint.' };
        break;
    }
  }

  return { activeCount: active.length, styleRaw, stylePct, distPct, surfPct, archetype };
}

export function encodeRosterToUrl(slots: OshiSlot[]): string {
  const ids = slots.map((s) => s.trainee?.id || '').join(',');
  return LZString.compressToEncodedURIComponent(ids);
}

export function decodeRosterFromUrl(compressed: string, database: Trainee[]): (Trainee | null)[] {
  try {
    const raw = LZString.decompressFromEncodedURIComponent(compressed);
    if (!raw) return [];
    const ids = raw.split(',');
    const map = new Map(database.map((t) => [t.id, t]));
    return ids.map((id) => map.get(id) || null);
  } catch {
    return [];
  }
}