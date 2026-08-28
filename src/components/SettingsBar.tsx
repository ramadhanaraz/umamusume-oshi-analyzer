'use client';

import React from 'react';
import { WeightingMode, AptitudeFilterMode } from '../types/trainee';

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
    <div className="p-3.5 rounded-2xl bg-[#0e1424] border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
        <div className="w-5 h-5 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20 text-[11px]">
          i
        </div>
        <span>Calculation Settings:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Weighting Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Weighting:</span>
          <button
            onClick={() => setWeightMode('equal')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
              weightMode === 'equal' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Equal (1×)
          </button>
          <button
            onClick={() => setWeightMode('tiered')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
              weightMode === 'tiered' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tiered (Top 1–5 = 4×)
          </button>
          <button
            onClick={() => setWeightMode('linear')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
              weightMode === 'linear' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Linear (50× → 1×)
          </button>
        </div>

        {/* Aptitude Filter Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Aptitude Filter:</span>
          <button
            onClick={() => setFilterMode('aOnly')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
              filterMode === 'aOnly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            A Rank Only
          </button>
          <button
            onClick={() => setFilterMode('acViable')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
              filterMode === 'acViable' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            A–C Viable
          </button>
          <button
            onClick={() => setFilterMode('allGrades')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
              filterMode === 'allGrades' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Grades Weighted
          </button>
        </div>
      </div>
    </div>
  );
};