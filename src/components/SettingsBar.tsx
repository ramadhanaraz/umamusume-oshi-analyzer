'use client';

import React from 'react';
import { WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { SlidersHorizontal, Scale, Layers, CheckCircle2 } from 'lucide-react';

interface SettingsBarProps {
  weightMode: WeightingMode;
  setWeightMode: (mode: WeightingMode) => void;
  filterMode: AptitudeFilterMode;
  setFilterMode: (mode: AptitudeFilterMode) => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  weightMode,
  setWeightMode,
  filterMode,
  setFilterMode,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight">
              Calculation Settings & Formula Engine
            </h3>
            <p className="text-[11px] text-slate-400">
              Customize how trainee ranks and aptitude grades are weighted into your stable archetype
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Oshi Weighting Curve Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-pink-400" /> Rank Multiplier Curve
            </span>
            <span className="text-[10px] text-pink-400 font-mono font-normal">
              {weightMode === 'equal' && '1.0× flat multiplier'}
              {weightMode === 'tiered' && '1–5 (4×) • 6–15 (2.5×) • 16–30 (1.5×) • 31–50 (1×)'}
              {weightMode === 'linear' && '50× → 1× continuous drop'}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Equal Weight */}
            <button
              type="button"
              onClick={() => setWeightMode('equal')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 relative group ${
                weightMode === 'equal'
                  ? 'bg-gradient-to-b from-pink-950/40 to-[#0e1424] border-pink-500/60 shadow-lg shadow-pink-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-black ${weightMode === 'equal' ? 'text-pink-300' : 'text-slate-200'}`}>
                    Equal Weight
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">All 50 slots = 1.0×</p>
                </div>
                {weightMode === 'equal' && <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />}
              </div>

              {/* Flat Graph */}
              <div className="h-8 w-full flex items-end gap-1.5 px-1.5 bg-slate-950/80 rounded-lg p-1 border border-slate-800/60">
                <div className="flex-1 bg-pink-400/80 h-3 rounded-sm" />
                <div className="flex-1 bg-pink-400/80 h-3 rounded-sm" />
                <div className="flex-1 bg-pink-400/80 h-3 rounded-sm" />
                <div className="flex-1 bg-pink-400/80 h-3 rounded-sm" />
                <div className="flex-1 bg-pink-400/80 h-3 rounded-sm" />
              </div>
            </button>

            {/* Tiered Weight */}
            <button
              type="button"
              onClick={() => setWeightMode('tiered')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 relative group ${
                weightMode === 'tiered'
                  ? 'bg-gradient-to-b from-pink-950/40 to-[#0e1424] border-pink-500/60 shadow-lg shadow-pink-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-black ${weightMode === 'tiered' ? 'text-pink-300' : 'text-slate-200'}`}>
                    Tiered Bracket
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">1–5, 6–15, 16–30, 31–50</p>
                </div>
                {weightMode === 'tiered' && <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />}
              </div>

              {/* Stepped Graph */}
              <div className="h-8 w-full flex items-end gap-1.5 px-1.5 bg-slate-950/80 rounded-lg p-1 border border-slate-800/60">
                <div className="flex-1 bg-amber-400 h-[24px] rounded-sm" title="Rank 1–5: 4.0x" />
                <div className="flex-1 bg-rose-500 h-[17px] rounded-sm" title="Rank 6–15: 2.5x" />
                <div className="flex-1 bg-purple-500 h-[11px] rounded-sm" title="Rank 16–30: 1.5x" />
                <div className="flex-1 bg-slate-600 h-[6px] rounded-sm" title="Rank 31–50: 1.0x" />
              </div>
            </button>

            {/* Linear Weight */}
            <button
              type="button"
              onClick={() => setWeightMode('linear')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 relative group ${
                weightMode === 'linear'
                  ? 'bg-gradient-to-b from-pink-950/40 to-[#0e1424] border-pink-500/60 shadow-lg shadow-pink-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-black ${weightMode === 'linear' ? 'text-pink-300' : 'text-slate-200'}`}>
                    Linear Decay
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Rank #1 = 50×, #50 = 1×</p>
                </div>
                {weightMode === 'linear' && <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />}
              </div>

              {/* Smooth Slope */}
              <div className="h-8 w-full flex items-end gap-1 px-1.5 bg-slate-950/80 rounded-lg p-1 border border-slate-800/60">
                {[24, 20, 16, 12, 9, 6, 3].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}px` }}
                    className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-sm"
                  />
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* 2. Aptitude Grade Inclusion Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Aptitude Scoring Matrix
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-normal">
              {filterMode === 'aOnly' && 'Only Native A Grades'}
              {filterMode === 'acViable' && 'A (10), B (5), C (2) pts'}
              {filterMode === 'allGrades' && 'A (10) down to F (0.5) pts'}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* A Rank Only */}
            <button
              type="button"
              onClick={() => setFilterMode('aOnly')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 relative group ${
                filterMode === 'aOnly'
                  ? 'bg-gradient-to-b from-indigo-950/40 to-[#0e1424] border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-black ${filterMode === 'aOnly' ? 'text-indigo-300' : 'text-slate-200'}`}>
                    A-Rank Only
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Strict native specialties</p>
                </div>
                {filterMode === 'aOnly' && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
              </div>

              {/* Full-width Stretched Chips */}
              <div className="h-8 w-full flex items-center gap-1.5 bg-slate-950/80 rounded-lg p-1 border border-slate-800/60">
                <span className="flex-1 text-center py-0.5 rounded bg-orange-950/80 border border-orange-500/70 text-orange-300 text-[10px] font-mono font-bold">
                  A: 10p
                </span>
                <span className="flex-1 text-center py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-600 text-[10px] font-mono line-through">
                  B–G: 0p
                </span>
              </div>
            </button>

            {/* A–C Viable */}
            <button
              type="button"
              onClick={() => setFilterMode('acViable')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 relative group ${
                filterMode === 'acViable'
                  ? 'bg-gradient-to-b from-indigo-950/40 to-[#0e1424] border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-black ${filterMode === 'acViable' ? 'text-indigo-300' : 'text-slate-200'}`}>
                    A–C Viable
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Moddable secondary roles</p>
                </div>
                {filterMode === 'acViable' && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
              </div>

              {/* Full-width Stretched Chips */}
              <div className="h-8 w-full flex items-center gap-1 bg-slate-950/80 rounded-lg p-1 border border-slate-800/60">
                <span className="flex-1 text-center py-0.5 rounded bg-orange-950/80 border border-orange-500/60 text-orange-300 text-[10px] font-mono font-bold">
                  A: 10
                </span>
                <span className="flex-1 text-center py-0.5 rounded bg-rose-950/80 border border-rose-500/60 text-rose-300 text-[10px] font-mono font-bold">
                  B: 5
                </span>
                <span className="flex-1 text-center py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-mono font-bold">
                  C: 2
                </span>
              </div>
            </button>

            {/* All Grades Weighted */}
            <button
              type="button"
              onClick={() => setFilterMode('allGrades')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 relative group ${
                filterMode === 'allGrades'
                  ? 'bg-gradient-to-b from-indigo-950/40 to-[#0e1424] border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-xs font-black ${filterMode === 'allGrades' ? 'text-indigo-300' : 'text-slate-200'}`}>
                    Full Spectrum
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">All grades A–F weighted</p>
                </div>
                {filterMode === 'allGrades' && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
              </div>

              {/* Full-width Stretched Chips */}
              <div className="h-8 w-full flex items-center gap-1 bg-slate-950/80 rounded-lg p-1 border border-slate-800/60 text-[10px] font-mono font-bold">
                <span className="flex-1 text-center py-0.5 rounded bg-orange-950/80 border border-orange-500/60 text-orange-300">
                  A
                </span>
                <span className="flex-1 text-center py-0.5 rounded bg-rose-950/80 border border-rose-500/60 text-rose-300">
                  B
                </span>
                <span className="flex-1 text-center py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                  C
                </span>
                <span className="flex-1 text-center py-0.5 rounded bg-sky-950/80 border border-sky-500/60 text-sky-300">
                  D
                </span>
                <span className="flex-1 text-center py-0.5 rounded bg-purple-950/80 border border-purple-500/60 text-purple-300">
                  E
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};