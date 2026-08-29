import { Trainee, AptitudeGrade, TerminologyMode, WeightingMode, AptitudeFilterMode, TERMINOLOGY } from '../types/trainee';
import LZString from 'lz-string';

export const APTITUDE_MATRICES: Record<AptitudeFilterMode, Record<AptitudeGrade, number>> = {
  aOnly: {
    S: 10,
    A: 10,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
  },
  acViable: {
    S: 10,
    A: 10,
    B: 5,
    C: 2,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
  },
  allGrades: {
    S: 10,
    A: 10,
    B: 7,
    C: 4,
    D: 2,
    E: 1,
    F: 0.5,
    G: 0,
  },
};

export function getRankWeight(rank: number, mode: WeightingMode): number {
  if (mode === 'equal') return 1.0;
  if (mode === 'tiered') {
    if (rank <= 5) return 4.0;
    if (rank <= 15) return 2.5;
    if (rank <= 30) return 1.5;
    return 1.0;
  }
  return Math.max(1, 51 - rank);
}

export interface OshiSlot {
  rank: number;
  trainee: Trainee | null;
}

export interface ArchetypeDetails {
  badge: string;
  title: string;
  description: string;
  strategy: string;
  gradient: string;
  border: string;
  accent: string;
}

export function calculateAnalysis(
  slots: OshiSlot[],
  mode: TerminologyMode = 'global',
  weightMode: WeightingMode = 'tiered',
  filterMode: AptitudeFilterMode = 'aOnly'
) {
  const active = slots.filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null);
  const gradeMatrix = APTITUDE_MATRICES[filterMode];
  const dict = TERMINOLOGY[mode];

  const styleRaw = { front: 0, pace: 0, late: 0, end: 0 };
  const distanceRaw = { short: 0, mile: 0, medium: 0, long: 0 };
  const surfaceRaw = { turf: 0, dirt: 0 };

  let turfCount = 0;
  let dirtCount = 0;

  active.forEach(({ rank, trainee }) => {
    const weight = getRankWeight(rank, weightMode);

    styleRaw.front += (gradeMatrix[trainee.style.front] || 0) * weight;
    styleRaw.pace += (gradeMatrix[trainee.style.pace] || 0) * weight;
    styleRaw.late += (gradeMatrix[trainee.style.late] || 0) * weight;
    styleRaw.end += (gradeMatrix[trainee.style.end] || 0) * weight;

    distanceRaw.short += (gradeMatrix[trainee.distance.short] || 0) * weight;
    distanceRaw.mile += (gradeMatrix[trainee.distance.mile] || 0) * weight;
    distanceRaw.medium += (gradeMatrix[trainee.distance.medium] || 0) * weight;
    distanceRaw.long += (gradeMatrix[trainee.distance.long] || 0) * weight;

    surfaceRaw.turf += (gradeMatrix[trainee.surface.turf] || 0) * weight;
    surfaceRaw.dirt += (gradeMatrix[trainee.surface.dirt] || 0) * weight;

    if (['S', 'A'].includes(trainee.surface.turf)) turfCount++;
    if (['S', 'A', 'B'].includes(trainee.surface.dirt)) dirtCount++;
  });

  const totalStyle = Object.values(styleRaw).reduce((a, b) => a + b, 0);
  const totalDist = Object.values(distanceRaw).reduce((a, b) => a + b, 0);
  const totalSurf = Object.values(surfaceRaw).reduce((a, b) => a + b, 0);

  const stylePct = {
    front: totalStyle > 0 ? Math.round((styleRaw.front / totalStyle) * 100) : 0,
    pace: totalStyle > 0 ? Math.round((styleRaw.pace / totalStyle) * 100) : 0,
    late: totalStyle > 0 ? Math.round((styleRaw.late / totalStyle) * 100) : 0,
    end: totalStyle > 0 ? Math.round((styleRaw.end / totalStyle) * 100) : 0,
  };

  const distPct = {
    short: totalDist > 0 ? Math.round((distanceRaw.short / totalDist) * 100) : 0,
    mile: totalDist > 0 ? Math.round((distanceRaw.mile / totalDist) * 100) : 0,
    medium: totalDist > 0 ? Math.round((distanceRaw.medium / totalDist) * 100) : 0,
    long: totalDist > 0 ? Math.round((distanceRaw.long / totalDist) * 100) : 0,
  };

  const surfPct = {
    turf: totalSurf > 0 ? Math.round((surfaceRaw.turf / totalSurf) * 100) : 0,
    dirt: totalSurf > 0 ? Math.round((surfaceRaw.dirt / totalSurf) * 100) : 0,
  };

  const maxStyleKey = (Object.keys(styleRaw) as Array<keyof typeof styleRaw>).reduce((a, b) =>
    styleRaw[a] > styleRaw[b] ? a : b
  );

  const maxDistKey = (Object.keys(distanceRaw) as Array<keyof typeof distanceRaw>).reduce((a, b) =>
    distanceRaw[a] > distanceRaw[b] ? a : b
  );

  let archetype: ArchetypeDetails;

  if (active.length === 0) {
    archetype = {
      badge: '🏇 Stable Initializing',
      title: 'Awaiting Trainer Roster',
      description: 'Select your favorite Uma Musume trainees to calculate your running style distribution, distance affinity radar, and personalized trainer archetype.',
      strategy: 'Add your top Oshis in the ranking list to receive custom inheritance advice and race tactics.',
      gradient: 'from-slate-850 via-slate-900 to-[#0e1424]',
      border: 'border-slate-800',
      accent: 'text-slate-400',
    };
  } else if (stylePct[maxStyleKey] >= 30) {
    switch (maxStyleKey) {
      case 'front':
        archetype = {
          badge: mode === 'global' ? '👑 Unstoppable Spearhead' : '👑 逃げ切りスペシャリスト',
          title: mode === 'global' ? 'The Front Runner Trailblazer' : 'The Runner (逃げ) Specialist',
          description: `Your Top Oshis embody ${dict.style.front} tactics—controlling tempo from the gate, seizing lead position, and commanding the turf from wire to wire.`,
          strategy: 'Prioritize raw Speed & Power with early acceleration skills like Groundwork (地固め) and Escape Artist.',
          gradient: 'from-blue-700 via-sky-600 to-cyan-500',
          border: 'border-cyan-400/30',
          accent: 'text-cyan-200',
        };
        break;
      case 'pace':
        archetype = {
          badge: mode === 'global' ? '👑 Consistent Dominator' : '👑 先行マエストロ',
          title: mode === 'global' ? 'The Pace Chaser Tactician' : 'The Leader (先行) Tactician',
          description: `Your Top Oshis embody ${dict.style.pace} tactics—stability, composure, and lethal mid-race positioning for reliable high win rates.`,
          strategy: 'Prioritize Speed & Stamina with reliable acceleration skills like Speed Star and Racing Genius.',
          gradient: 'from-emerald-700 via-emerald-600 to-teal-500',
          border: 'border-emerald-400/30',
          accent: 'text-emerald-200',
        };
        break;
      case 'late':
        archetype = {
          badge: mode === 'global' ? '👑 Midfield Infiltrator' : '👑 疾風怒濤の差し',
          title: mode === 'global' ? 'The Late Surger Infiltrator' : 'The Betweener (差し) Infiltrator',
          description: `Your Top Oshis embody ${dict.style.late} tactics—biding time in the pack, carving lines through traffic, and exploding into the final stretch.`,
          strategy: "Prioritize Power & Acceleration skills like Let's Anabolic! (レッツ・アナボリック！) and Outpace.",
          gradient: 'from-[#ea580c] via-[#f97316] to-[#f43f5e]',
          border: 'border-orange-400/30',
          accent: 'text-amber-200',
        };
        break;
      case 'end':
        archetype = {
          badge: mode === 'global' ? '👑 Backfield Assassin' : '👑 一撃必殺の追込',
          title: mode === 'global' ? 'The End Closer Sniper' : 'The Chaser (追込) Sniper',
          description: `Your Top Oshis embody ${dict.style.end} tactics—conserving energy in the rear before unleashing a thunderous top-speed sprint.`,
          strategy: 'Prioritize Power & top-end Speed with iconic acceleration triggers like Straightaway Spurt (迫る影).',
          gradient: 'from-rose-800 via-red-600 to-pink-600',
          border: 'border-rose-400/30',
          accent: 'text-rose-200',
        };
        break;
    }
  } else {
    archetype = {
      badge: mode === 'global' ? '👑 Strategic Maestro' : '👑 オールラウンダー',
      title: mode === 'global' ? 'The Versatile All-Rounder' : 'The All-Rounder (オールラウンダー)',
      description: 'Your Top Oshis span a balanced variety of racing disciplines, giving your stable supreme adaptability across every distance bracket.',
      strategy: 'Build flexible team compositions with multi-style cornering skills and balanced inheritance lines.',
      gradient: 'from-indigo-700 via-purple-600 to-pink-600',
      border: 'border-purple-400/30',
      accent: 'text-purple-200',
    };
  }

  return {
    activeCount: active.length,
    styleRaw,
    stylePct,
    distPct,
    distanceRaw,
    surfPct,
    turfCount,
    dirtCount,
    dominantStyleKey: maxStyleKey,
    dominantDistName: dict.distance[maxDistKey],
    archetype,
  };
}

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