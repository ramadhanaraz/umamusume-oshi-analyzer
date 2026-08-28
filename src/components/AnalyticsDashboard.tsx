'use client';

import React, { useState } from 'react';
import { TerminologyMode, TERMINOLOGY } from '../types/trainee';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Flame, Target, Sprout, Lightbulb, BarChart2, Compass } from 'lucide-react';

interface AnalyticsProps {
  mode: TerminologyMode;
  analysis: {
    activeCount: number;
    styleRaw: { front: number; pace: number; late: number; end: number };
    stylePct: { front: number; pace: number; late: number; end: number };
    distanceRaw: { short: number; mile: number; medium: number; long: number };
    distPct: { short: number; mile: number; medium: number; long: number };
    surfPct: { turf: number; dirt: number };
    turfCount: number;
    dirtCount: number;
    dominantStyleKey: 'front' | 'pace' | 'late' | 'end';
    dominantDistName: string;
  };
}

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ mode, analysis }) => {
  const labels = TERMINOLOGY[mode];
  // Both default to 'bars' for visual consistency
  const [styleView, setStyleView] = useState<'bars' | 'radar'>('bars');
  const [distView, setDistView] = useState<'bars' | 'radar'>('bars');

  const styleRadarData = [
    { subject: labels.front, value: analysis.stylePct.front },
    { subject: labels.pace, value: analysis.stylePct.pace },
    { subject: labels.late, value: analysis.stylePct.late },
    { subject: labels.end, value: analysis.stylePct.end },
  ];

  const distRadarData = [
    { subject: mode === 'global' ? 'Short' : '短距離', value: analysis.distPct.short },
    { subject: mode === 'global' ? 'Mile' : 'マイル', value: analysis.distPct.mile },
    { subject: mode === 'global' ? 'Medium' : '中距離', value: analysis.distPct.medium },
    { subject: mode === 'global' ? 'Long' : '長距離', value: analysis.distPct.long },
  ];

  const styleItems = [
    { label: labels.front, pct: analysis.stylePct.front, pts: analysis.styleRaw.front, color: 'bg-emerald-400' },
    { label: labels.pace, pct: analysis.stylePct.pace, pts: analysis.styleRaw.pace, color: 'bg-amber-400' },
    { label: labels.late, pct: analysis.stylePct.late, pts: analysis.styleRaw.late, color: 'bg-purple-500' },
    { label: labels.end, pct: analysis.stylePct.end, pts: analysis.styleRaw.end, color: 'bg-rose-500' },
  ];

  const distItems = [
    { label: mode === 'global' ? 'Short (短距離)' : '短距離 (Short)', pct: analysis.distPct.short, pts: analysis.distanceRaw.short, color: 'bg-pink-500' },
    { label: mode === 'global' ? 'Mile (マイル)' : 'マイル (Mile)', pct: analysis.distPct.mile, pts: analysis.distanceRaw.mile, color: 'bg-sky-500' },
    { label: mode === 'global' ? 'Medium (中距離)' : '中距離 (Medium)', pct: analysis.distPct.medium, pts: analysis.distanceRaw.medium, color: 'bg-indigo-500' },
    { label: mode === 'global' ? 'Long (長距離)' : '長距離 (Long)', pct: analysis.distPct.long, pts: analysis.distanceRaw.long, color: 'bg-amber-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. RUNNING STYLE DISTRIBUTION */}
      <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Running Style Distribution</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStyleView('bars')}
                className={`p-1 rounded transition-colors ${styleView === 'bars' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Progress Bars"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setStyleView('radar')}
                className={`p-1 rounded transition-colors ${styleView === 'radar' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Radar Chart"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {styleView === 'bars' ? (
            <div className="space-y-3.5 my-2">
              {styleItems.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-200 font-bold">
                      {item.pct}% <span className="text-slate-500 font-normal">({item.pts.toFixed(1)} pts)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
                    <div
                      style={{ width: `${Math.min(100, Math.max(0, item.pct))}%` }}
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-48 my-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={styleRadarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 60]} tick={false} stroke="#1e293b" />
                  <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.45} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Insight Box (Hidden when count is 0) */}
        {analysis.activeCount > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300 animate-fadeIn">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="text-amber-300 font-bold">Insight:</strong>{' '}
              <span className="text-white font-semibold">{labels[analysis.dominantStyleKey]}</span> is your most frequent running strategy!
            </p>
          </div>
        )}
      </div>

      {/* 2. DISTANCE DISTRIBUTION */}
      <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Distance Distribution</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDistView('bars')}
                className={`p-1 rounded transition-colors ${distView === 'bars' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Progress Bars"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDistView('radar')}
                className={`p-1 rounded transition-colors ${distView === 'radar' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Radar View"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {distView === 'bars' ? (
            <div className="space-y-3.5 my-2">
              {distItems.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-200 font-bold">
                      {item.pct}% <span className="text-slate-500 font-normal">({item.pts.toFixed(1)} pts)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
                    <div
                      style={{ width: `${Math.min(100, Math.max(0, item.pct))}%` }}
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-48 my-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={distRadarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 60]} tick={false} stroke="#1e293b" />
                  <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.45} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Insight Box (Hidden when count is 0) */}
        {analysis.activeCount > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300 animate-fadeIn">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="text-amber-300 font-bold">Distance Specialty:</strong> Your roster peaks in{' '}
              <span className="text-white font-semibold">{analysis.dominantDistName}</span> distance races.
            </p>
          </div>
        )}
      </div>

      {/* 3. SURFACE DISTRIBUTION (Expanded to Fill Container) */}
      <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Surface Distribution</h3>
          </div>

          {/* Expanded Surface Cards */}
          <div className="grid grid-cols-2 gap-3 my-auto py-2">
            {/* Turf Card */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">TURF (芝)</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-300 my-2 tracking-tight">{analysis.surfPct.turf}%</span>
              <span className="text-xs text-emerald-500 font-semibold">{analysis.turfCount} Umas</span>
            </div>

            {/* Dirt Card */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">DIRT (ダート)</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-300 my-2 tracking-tight">{analysis.surfPct.dirt}%</span>
              <span className="text-xs text-amber-500 font-semibold">{analysis.dirtCount} Umas</span>
            </div>
          </div>
        </div>

        {/* Insight Box (Hidden when count is 0) */}
        {analysis.activeCount > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300 animate-fadeIn">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="text-amber-300 font-bold">Track Versatility:</strong> Your list is predominantly{' '}
              <span className="text-white font-semibold">{analysis.surfPct.turf >= analysis.surfPct.dirt ? 'Turf' : 'Dirt'}</span> track oriented.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};