// components/AnalyticsDashboard.tsx
'use client';

import React from 'react';
import { Flame, Compass, Sparkles, Layers, Route } from 'lucide-react';
import { TerminologyMode, TERMINOLOGY } from '../types/trainee';
import { AnalysisResult } from '../utils/calculator';

interface AnalyticsDashboardProps {
  mode: TerminologyMode;
  analysis: AnalysisResult;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ mode, analysis }) => {
  const dict = TERMINOLOGY[mode] || TERMINOLOGY.global;
  const {
    activeCount,
    stylePct,
    distPct,
    surfPct,
    styleRaw,
    distanceRaw,
    surfaceRaw,
    turfCount,
    dirtCount,
    dominantStyleKey,
    dominantDistName,
  } = analysis;

  const styleKeys: Array<keyof typeof dict.style> = ['front', 'pace', 'late', 'end'];
  const distanceKeys: Array<keyof typeof dict.distance> = ['short', 'mile', 'medium', 'long'];

  const hasTrainees = activeCount > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch animate-fadeIn">
      
      {/* 1. Running Style Distribution Card */}
      <div className="bg-[#0b101e]/90 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Card Header (Fixed English) */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Running Style Share
              </h3>
              <p className="text-[11px] text-slate-400">
                Tactical execution & pacing tendency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
              100% Total
            </span>
          </div>
        </div>

        {/* Style Gauge Rows */}
        <div className="flex-1 flex flex-col justify-between py-1 space-y-2.5 mb-4">
          {styleKeys.map((key) => {
            const pct = stylePct[key] || 0;
            const pts = styleRaw[key] || 0;
            const label = dict.style[key]; // Scoped Aptitude Terminology
            const isDominant = hasTrainees && pts > 0 && (dominantStyleKey === key || pct >= 30);

            return (
              <div
                key={key}
                className={`px-3.5 py-2.5 rounded-2xl border transition-all ${
                  isDominant
                    ? 'bg-slate-900/95 border-slate-700/80 shadow-md ring-1 ring-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span
                    className={`text-xs font-semibold ${
                      isDominant ? 'text-cyan-300 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {label}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-xs font-black text-white">{pct}%</span>
                    <span className="text-[11px] text-slate-500">({pts.toFixed(1)} pts)</span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isDominant
                        ? 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-sm shadow-cyan-500/25'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Style Insight (Fixed English Commentary) */}
        <div className="min-h-[50px] bg-slate-950/60 border border-slate-800/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-xs">
          <Sparkles className={`w-4 h-4 shrink-0 ${hasTrainees ? 'text-amber-400' : 'text-slate-500'}`} />
          {hasTrainees && dominantStyleKey ? (
            <span className="text-slate-300 text-[11px] leading-snug">
              <strong className="text-amber-300">Insight:</strong>{' '}
              {dict.style[dominantStyleKey as keyof typeof dict.style]} is your most prominent tactical archetype ({stylePct[dominantStyleKey as keyof typeof stylePct]}%).
            </span>
          ) : (
            <span className="text-slate-400 text-[11px] leading-snug">
              <strong className="text-slate-300">Insight:</strong>{' '}
              Assign trainees to your Top 50 list to calculate your tactical archetype.
            </span>
          )}
        </div>

      </div>

      {/* 2. Distance & Surface Distribution Card */}
      <div className="bg-[#0b101e]/90 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Card Header (Fixed English) */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Distance & Track Affinity
              </h3>
              <p className="text-[11px] text-slate-400">
                Track range capacity & surface adaptability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono font-bold">
              100% Total
            </span>
          </div>
        </div>

        {/* Section A & B Body */}
        <div className="flex-1 flex flex-col justify-between py-1 space-y-3 mb-4">
          
          {/* Section A: Distance Affinity (Fixed English Section Title) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
              <Route className="w-3.5 h-3.5 text-rose-400" />
              <span>Distance Range</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {distanceKeys.map((key) => {
                const pct = distPct[key] || 0;
                const pts = distanceRaw[key] || 0;
                const label = dict.distance[key]; // Scoped Aptitude Terminology
                const isDominant = hasTrainees && pts > 0 && pct >= 30;

                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded-2xl border transition-all flex flex-col justify-between space-y-1.5 ${
                      isDominant
                        ? 'bg-slate-900/95 border-slate-700/80 shadow-md ring-1 ring-rose-500/10'
                        : 'bg-slate-900/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`text-[11px] truncate font-semibold ${
                          isDominant ? 'text-rose-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="font-mono font-black text-xs text-white">{pct}%</span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isDominant
                            ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 shadow-sm shadow-rose-500/25'
                            : 'bg-slate-700'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 text-right">
                      {pts.toFixed(1)} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Surface Affinity (Fixed English Section Title) */}
          <div className="space-y-1.5 pt-1.5 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Track Surface</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Turf {turfCount} / Dirt {dirtCount} Viable
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Turf Card */}
              <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    🌿 {dict.surface.turf}
                  </span>
                  <span className="font-mono font-black text-xs text-white">
                    {surfPct?.turf || 0}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-sm shadow-emerald-500/20"
                    style={{ width: `${Math.min(100, Math.max(0, surfPct?.turf || 0))}%` }}
                  />
                </div>

                <span className="text-[10px] font-mono text-slate-500 text-right">
                  {(surfaceRaw?.turf || 0).toFixed(1)} pts
                </span>
              </div>

              {/* Dirt Card */}
              <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    🏜️ {dict.surface.dirt}
                  </span>
                  <span className="font-mono font-black text-xs text-white">
                    {surfPct?.dirt || 0}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-700 shadow-sm shadow-amber-500/20"
                    style={{ width: `${Math.min(100, Math.max(0, surfPct?.dirt || 0))}%` }}
                  />
                </div>

                <span className="text-[10px] font-mono text-slate-500 text-right">
                  {(surfaceRaw?.dirt || 0).toFixed(1)} pts
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Distance & Surface Insight (Fixed English Commentary) */}
        <div className="min-h-[50px] bg-slate-950/60 border border-slate-800/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-xs">
          <Sparkles className={`w-4 h-4 shrink-0 ${hasTrainees ? 'text-rose-400' : 'text-slate-500'}`} />
          {hasTrainees && dominantDistName ? (
            <span className="text-slate-300 text-[11px] leading-snug">
              <strong className="text-rose-300">Distance Specialty:</strong>{' '}
              Peak focus in <strong className="text-white">{dominantDistName}</strong> races with{' '}
              <strong className="text-emerald-300">{turfCount} Turf</strong> &{' '}
              <strong className="text-amber-300">{dirtCount} Dirt</strong> runners.
            </span>
          ) : (
            <span className="text-slate-400 text-[11px] leading-snug">
              <strong className="text-slate-300">Distance Specialty:</strong>{' '}
              Assign trainees to analyze your stable’s distance and track surface viability.
            </span>
          )}
        </div>

      </div>

    </div>
  );
};