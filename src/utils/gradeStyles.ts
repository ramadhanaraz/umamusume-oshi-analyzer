// utils/gradeStyles.ts

import { AptitudeGrade } from '../types/trainee';

/**
 * Returns Tailwind classes for filled pill badges (bg, border, text)
 */
export const getGradeBadgeStyle = (grade?: AptitudeGrade): string => {
  switch (grade) {
    case 'S':
    case 'A':
      return 'bg-orange-950/70 border-orange-500/60 text-orange-300';
    case 'B':
      return 'bg-rose-950/70 border-rose-500/60 text-rose-300';
    case 'C':
      return 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300';
    case 'D':
      return 'bg-sky-950/70 border-sky-500/60 text-sky-300';
    case 'E':
      return 'bg-purple-950/70 border-purple-500/60 text-purple-300';
    case 'F':
    case 'G':
    default:
      return 'bg-slate-900/80 border-slate-800 text-slate-500';
  }
};

/**
 * Returns Tailwind classes for inline aptitude text coloring (e.g. Surface badges)
 */
export const getGradeTextColor = (grade?: AptitudeGrade): string => {
  switch (grade) {
    case 'S':
    case 'A':
      return 'text-orange-400 font-bold';
    case 'B':
      return 'text-rose-400 font-bold';
    case 'C':
      return 'text-emerald-400 font-bold';
    case 'D':
      return 'text-sky-400 font-bold';
    case 'E':
      return 'text-purple-400 font-bold';
    case 'F':
    case 'G':
    default:
      return 'text-slate-500 font-medium';
  }
};

/**
 * Returns Tailwind classes for rank number indicators
 */
export const getRankPillStyle = (rank: number): string => {
  if (rank === 1) {
    return 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black shadow-md shadow-amber-500/25';
  }
  if (rank === 2) {
    return 'bg-gradient-to-r from-slate-100 to-slate-300 text-slate-950 font-black shadow-md shadow-slate-300/20';
  }
  if (rank === 3) {
    return 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 font-black shadow-md shadow-amber-900/30';
  }
  // Ranks 4, 5, and above now use matching gray/slate frosted outline
  return 'bg-slate-900/90 text-slate-300 border border-slate-700/80 font-black backdrop-blur-sm shadow-md';
};