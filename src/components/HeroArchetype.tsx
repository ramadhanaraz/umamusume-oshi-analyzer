'use client';

import React from 'react';
import { ArchetypeDetails } from '../utils/calculator';
import { Sparkles } from 'lucide-react';

interface HeroArchetypeProps {
  archetype: ArchetypeDetails;
  activeCount: number;
  onFillMore: () => void;
  isReadOnly?: boolean;
}

export const HeroArchetype: React.FC<HeroArchetypeProps> = ({
  archetype,
  activeCount,
  onFillMore,
  isReadOnly = false,
}) => {
  const badgeLabel = archetype.badge.startsWith('👑')
    ? archetype.badge
    : `👑 ${archetype.badge}`;

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${archetype.gradient} border ${archetype.border} shadow-2xl space-y-4 text-white relative overflow-hidden select-none`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Badge, Title, Description & Strategy */}
        <div className="space-y-3.5 max-w-2xl">
          {/* Yellow Capitalized Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-amber-200 text-xs font-bold uppercase tracking-widest border border-white/10 shadow-sm">
            <span>{badgeLabel}</span>
          </div>

          {/* Archetype Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm">
            {archetype.title}
          </h2>

          {/* Narrative Description */}
          <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
            {archetype.description}
          </p>

          {/* Recommended Strategy Callout */}
          <div className={`flex items-start gap-2 pt-1 text-xs ${archetype.accent} font-medium`}>
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong className="text-white font-black">Recommended Strategy:</strong>{' '}
              {archetype.strategy}
            </span>
          </div>
        </div>

        {/* Right Column: Counter Box */}
        <div className="w-full md:w-auto shrink-0 bg-black/25 rounded-2xl p-5 sm:p-6 border border-white/15 flex flex-col items-center justify-center min-w-[210px] text-center shadow-xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">
            Top Oshis Analyzed
          </span>
          <span className="text-4xl sm:text-5xl font-black text-white my-1.5 tracking-tight">
            {activeCount}
          </span>
          <span className="text-xs text-white/80 font-medium">
            out of 50 slots filled
          </span>

          {/* Fill More Action Button (Hidden in Read-Only Mode) */}
          {!isReadOnly && activeCount < 50 && (
            <button
              type="button"
              onClick={onFillMore}
              className="w-full mt-3.5 py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs transition-all shadow-md active:scale-95"
            >
              + Fill More Oshis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};