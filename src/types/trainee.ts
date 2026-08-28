export type AptitudeGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Trainee {
  id: string;
  nameEn: string;
  nameJp: string;
  emoji: string;
  baseRarity: 1 | 2 | 3;
  costumes: string[];
  surface: {
    turf: AptitudeGrade;
    dirt: AptitudeGrade;
  };
  distance: {
    short: AptitudeGrade;
    mile: AptitudeGrade;
    medium: AptitudeGrade;
    long: AptitudeGrade;
  };
  style: {
    front: AptitudeGrade;
    pace: AptitudeGrade;
    late: AptitudeGrade;
    end: AptitudeGrade;
  };
}

export type TerminologyMode = 'global' | 'jp';
export type WeightingMode = 'equal' | 'tiered' | 'linear';
export type AptitudeFilterMode = 'aOnly' | 'acViable' | 'allGrades';

export interface TerminologyDictionary {
  surface: {
    turf: string;
    dirt: string;
  };
  style: {
    front: string;
    pace: string;
    late: string;
    end: string;
  };
  distance: {
    short: string;
    mile: string;
    medium: string;
    long: string;
  };
}

export const TERMINOLOGY: Record<TerminologyMode, TerminologyDictionary> = {
  global: {
    surface: {
      turf: 'Turf',
      dirt: 'Dirt',
    },
    style: {
      front: 'Front Runner',
      pace: 'Pace Chaser',
      late: 'Late Surger',
      end: 'End Closer',
    },
    distance: {
      short: 'Sprint',
      mile: 'Mile',
      medium: 'Medium',
      long: 'Long',
    },
  },
  jp: {
    surface: {
      turf: 'Turf (芝)',
      dirt: 'Dirt (ダート)',
    },
    style: {
      front: 'Runner (逃げ)',
      pace: 'Leader (先行)',
      late: 'Betweener (差し)',
      end: 'Chaser (追込)',
    },
    distance: {
      short: 'Short (短距離)',
      mile: 'Mile (マイル)',
      medium: 'Medium (中距離)',
      long: 'Long (長距離)',
    },
  },
};