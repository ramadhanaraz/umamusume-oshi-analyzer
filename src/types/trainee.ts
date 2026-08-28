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

export interface StyleLabels {
  front: string;
  pace: string;
  late: string;
  end: string;
}

export const TERMINOLOGY: Record<TerminologyMode, StyleLabels> = {
  global: {
    front: 'Front Runner',
    pace: 'Pace Chaser',
    late: 'Late Surger',
    end: 'End Closer',
  },
  jp: {
    front: 'Runner (逃げ)',
    pace: 'Leader (先行)',
    late: 'Betweener (差し)',
    end: 'Closer (追込)',
  },
};