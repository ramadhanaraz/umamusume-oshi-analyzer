'use client';

import React from 'react';
import { ArchetypeDetails } from '../utils/calculator';
import { Sparkles } from 'lucide-react';

interface HeroArchetypeProps {
  archetype: ArchetypeDetails;
  activeCount: number;
  onFillMore: () => void;
}

export const HeroArchetype: React.FC<HeroArchetypeProps> = ({
  archetype,
  activeCount,
  onFillMore,
}) => {
  return (
    <div className={`rounded-3xl bg-gradient-to-r ${archetype.gradient} p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border ${archetype.border} transition-all duration-500`}>
      <div className="space-y-3 max-w-2xl">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md ${archetype.accent} text-xs font-bold border border-white/15 shadow-sm`}>
          <span>{archetype.badge}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm">
          {archetype.title}
        </h2>

        <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
          {archetype.description}
        </p>

        <div className={`flex items-start gap-2 pt-1 text-xs ${archetype.accent} font-medium`}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white font-bold">Recommended Strategy:</strong> {archetype.strategy}
          </span>
        </div>
      </div>

      <div className="w-full md:w-auto shrink-0 bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center justify-center min-w-[210px] text-center shadow-xl">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75">
          Top Oshis Analyzed
        </span>
        <span className="text-4xl sm:text-5xl font-black text-white my-1 tracking-tight">
          {activeCount}
        </span>
        <span className="text-xs text-white/80 font-medium">
          out of 50 slots filled
        </span>
        {activeCount < 50 && (
          <button
            onClick={onFillMore}
            className="w-full mt-3 py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs transition-all shadow-md active:scale-95"
          >
            + Fill More Oshis
          </button>
        )}
      </div>
    </div>
  );
};