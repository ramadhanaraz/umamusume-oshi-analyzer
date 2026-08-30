// components/views/sorter/Phase1Triage.tsx
'use client';

import React from 'react';
import { Trainee, TerminologyMode } from '../../../types/trainee';
import { Check, ArrowRight, Heart } from 'lucide-react';

interface Phase1TriageProps {
  group: Trainee[];
  currentPicks: string[];
  cycle: number;
  groupIdx: number;
  totalGroups: number;
  totalQualified: number;
  mode: TerminologyMode;
  onTogglePick: (id: string) => void;
  onConfirmGroup: () => void;
}

export const Phase1Triage: React.FC<Phase1TriageProps> = ({
  group,
  currentPicks,
  cycle,
  groupIdx,
  totalGroups,
  totalQualified,
  mode,
  onTogglePick,
  onConfirmGroup,
}) => {
  const maxPicks = group.length === 5 ? 3 : 2;
  const gridLayoutClass =
    group.length === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : 'grid-cols-3 sm:grid-cols-3 lg:grid-cols-5';

  return (
    <div className="space-y-3 sm:space-y-6 animate-fadeIn select-none">
      {/* Group Subheader (Compact on Mobile) */}
      <div className="flex flex-row items-center justify-between gap-2 bg-slate-950/60 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 uppercase tracking-wider border border-pink-500/30 flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-pink-400 text-pink-400" />
              <span>
                Pass {cycle}/3 • Grp {groupIdx + 1}/{totalGroups}
              </span>
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300">
              Pick up to <strong className="text-pink-400 font-bold">{maxPicks}</strong>
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 hidden xs:block">
            Tap the trainees that catch your eye, or skip freely.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
            Shortlisted
          </span>
          <span className="text-xs sm:text-sm font-mono font-black text-amber-400">
            {totalQualified} <span className="text-slate-500 text-[10px] sm:text-xs">/ 60</span>
          </span>
        </div>
      </div>

      {/* Compact Cards Grid */}
      <div className={`grid ${gridLayoutClass} gap-2 sm:gap-3.5`}>
        {group.map((trainee) => {
          const pickIndex = currentPicks.indexOf(trainee.id);
          const isSelected = pickIndex !== -1;

          return (
            <button
              key={trainee.id}
              type="button"
              onClick={() => onTogglePick(trainee.id)}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden border text-left transition-all duration-300 flex flex-col justify-between aspect-[4/5] sm:aspect-[3/4] p-2 sm:p-3.5 cursor-pointer bg-[#0a0f1d] ${
                isSelected
                  ? 'border-pink-500 bg-pink-950/20 shadow-lg shadow-pink-500/20 scale-[1.02] ring-1 ring-pink-500'
                  : 'border-slate-800/80 hover:border-slate-600 hover:shadow-lg'
              }`}
            >
              {/* Character Artwork */}
              {trainee.image ? (
                <>
                  <img
                    src={trainee.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 saturate-150 brightness-110 pointer-events-none group-hover:opacity-60 transition-opacity"
                  />
                  <img
                    src={trainee.image}
                    alt={trainee.nameEn}
                    className="absolute inset-0 w-full h-full object-cover object-top z-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/75 to-transparent pointer-events-none z-[1]" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl text-slate-600 bg-slate-900">
                  {trainee.emoji || '❓'}
                </div>
              )}

              {/* Selection Status Badge */}
              <div className="relative z-10 flex justify-end">
                {isSelected ? (
                  <span className="h-5 sm:h-6 px-1.5 sm:px-2.5 rounded-md sm:rounded-lg bg-pink-500 text-white font-black text-[9px] sm:text-[11px] flex items-center gap-1 shadow-md shadow-pink-500/30">
                    <Check className="w-3 h-3 stroke-[3]" /> #{pickIndex + 1}
                  </span>
                ) : (
                  <span className="h-5 sm:h-6 px-1.5 sm:px-2.5 rounded-md sm:rounded-lg bg-black/60 backdrop-blur-md text-slate-300 font-bold text-[9px] sm:text-[10px] border border-white/10 flex items-center">
                    Pick
                  </span>
                )}
              </div>

              {/* Trainee Name */}
              <div className="relative z-10">
                <p className="text-xs sm:text-base font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
                  {mode === 'jp' ? trainee.nameJp || trainee.nameEn : trainee.nameEn}
                </p>
                {mode !== 'jp' && trainee.nameJp && (
                  <p className="text-[9px] sm:text-[11px] text-pink-300 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5 truncate">
                    {trainee.nameJp}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Advance Action Button */}
      <button
        type="button"
        onClick={onConfirmGroup}
        className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm transition-all shadow-xl shadow-pink-600/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
      >
        <span>
          {currentPicks.length === 0
            ? 'Skip Group & Continue'
            : `Confirm (${currentPicks.length}) & Next`}
        </span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
      </button>
    </div>
  );
};