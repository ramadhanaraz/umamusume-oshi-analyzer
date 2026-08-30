'use client';

import React from 'react';
import { Trainee, TerminologyMode } from '../../../types/trainee';
import { Crown, Star, ArrowRight, Trophy } from 'lucide-react';

interface Phase2SwissProps {
  group: Trainee[];
  currentPicks: { first: string | null; second: string | null };
  round: number;
  clusterIdx: number;
  totalClusters: number;
  totalQualifiers: number;
  mode: TerminologyMode;
  onPick: (id: string) => void;
  onConfirmCluster: () => void;
}

export const Phase2Swiss: React.FC<Phase2SwissProps> = ({
  group,
  currentPicks,
  round,
  clusterIdx,
  totalClusters,
  totalQualifiers,
  mode,
  onPick,
  onConfirmCluster,
}) => {
  const gridLayoutClass =
    group.length === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-3';

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Group Subheader */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                Showdown Round {round}/3 • Group {clusterIdx + 1} of {totalClusters}
              </span>
            </span>
            <span className="text-xs text-slate-300">
              Pick your <strong className="text-amber-400">1st Favorite</strong> & <strong className="text-slate-300">2nd Favorite</strong>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tap your top two choices in this group to help separate your highest faves.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
            Active Faves
          </span>
          <span className="text-sm font-mono font-black text-indigo-400">
            {totalQualifiers} Trainees
          </span>
        </div>
      </div>

      {/* Dynamic Showdown Row with Full Brightness Character Sprites */}
      <div className={`grid ${gridLayoutClass} gap-4`}>
        {group.map((trainee) => {
          const isFirst = currentPicks.first === trainee.id;
          const isSecond = currentPicks.second === trainee.id;

          let borderClass = 'border-slate-800/80 hover:border-slate-600 hover:shadow-lg hover:shadow-black/40';
          if (isFirst) borderClass = 'border-amber-500 bg-amber-950/20 shadow-xl shadow-amber-500/20 scale-[1.02] ring-1 ring-amber-500';
          if (isSecond) borderClass = 'border-slate-300 bg-slate-800/50 shadow-lg shadow-slate-300/15 scale-[1.01] ring-1 ring-slate-300';

          return (
            <button
              key={trainee.id}
              type="button"
              onClick={() => onPick(trainee.id)}
              className={`group relative rounded-2xl overflow-hidden border text-left transition-all duration-300 flex flex-col justify-between aspect-[3/4] p-4 cursor-pointer bg-[#0a0f1d] ${borderClass}`}
            >
              {/* Character Artwork & Ambient Aura */}
              {trainee.image ? (
                <>
                  {/* 1. Soft Ambient Aura */}
                  <img
                    src={trainee.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 saturate-150 brightness-110 pointer-events-none group-hover:opacity-60 transition-opacity duration-300"
                  />

                  {/* 2. 100% Bright Front Character Portrait */}
                  <img
                    src={trainee.image}
                    alt={trainee.nameEn}
                    className="absolute inset-0 w-full h-full object-cover object-top z-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* 3. Bottom Dissolve Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/75 to-transparent pointer-events-none z-[1]" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-slate-600 bg-slate-900">
                  {trainee.emoji || '❓'}
                </div>
              )}

              {/* Status Header Badge */}
              <div className="relative z-10 flex justify-end">
                {isFirst && (
                  <span className="h-6 px-2.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-amber-500/25">
                    <Crown className="w-3.5 h-3.5 fill-slate-950" /> 1st Favorite
                  </span>
                )}
                {isSecond && (
                  <span className="h-6 px-2.5 rounded-lg bg-slate-200 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-slate-300/25">
                    <Star className="w-3.5 h-3.5 fill-slate-950" /> 2nd Favorite
                  </span>
                )}
                {!isFirst && !isSecond && (
                  <span className="h-6 px-2.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-400 font-bold text-[10px] border border-white/10 flex items-center">
                    Unselected
                  </span>
                )}
              </div>

              {/* Trainee Name Vignette */}
              <div className="relative z-10">
                <p className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {mode === 'jp' ? trainee.nameJp || trainee.nameEn : trainee.nameEn}
                </p>
                {mode !== 'jp' && trainee.nameJp && (
                  <p className="text-xs text-indigo-300 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5">
                    {trainee.nameJp}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        onClick={onConfirmCluster}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
      >
        <span>Confirm Choices & Next Showdown</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
};