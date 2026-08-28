'use client';

import React from 'react';
import { TerminologyMode, TERMINOLOGY } from '../types/trainee';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Trophy, Compass, Sparkles } from 'lucide-react';

interface AnalyticsProps {
  mode: TerminologyMode;
  analysis: {
    activeCount: number;
    stylePct: { front: number; pace: number; late: number; end: number };
    distPct: { short: number; mile: number; medium: number; long: number };
    surfPct: { turf: number; dirt: number };
    archetype: { title: string; description: string };
  };
}

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ mode, analysis }) => {
  const labels = TERMINOLOGY[mode];

  const radarData = [
    { subject: labels.front, value: analysis.stylePct.front, fullMark: 100 },
    { subject: labels.pace, value: analysis.stylePct.pace, fullMark: 100 },
    { subject: labels.late, value: analysis.stylePct.late, fullMark: 100 },
    { subject: labels.end, value: analysis.stylePct.end, fullMark: 100 },
  ];

  const distanceData = [
    { name: 'Short', value: analysis.distPct.short, fill: '#38bdf8' },
    { name: 'Mile', value: analysis.distPct.mile, fill: '#34d399' },
    { name: 'Medium', value: analysis.distPct.medium, fill: '#fbbf24' },
    { name: 'Long', value: analysis.distPct.long, fill: '#f87171' },
  ];

  return (
    <div className="space-y-4">
      {/* Archetype Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/20 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Trainer Archetype
        </div>
        <h3 className="text-lg font-black text-white mt-1">{analysis.archetype.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{analysis.archetype.description}</p>
      </div>

      {/* Radar: Running Style */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
        <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" /> Strategy Radar ({mode.toUpperCase()})
        </h4>
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 50]} tick={false} stroke="#334155" />
              <Radar name="Affinity" dataKey="value" stroke="#38bdf8" fill="#0284c7" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distance Distribution */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
        <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Distance Affinity
        </h4>
        <div className="w-full h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distanceData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" hide domain={[0, 60]} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={55} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Surface Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
        <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
          <span>Turf ({analysis.surfPct.turf}%)</span>
          <span>Dirt ({analysis.surfPct.dirt}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div style={{ width: `${analysis.surfPct.turf}%` }} className="bg-emerald-500 transition-all duration-500" />
          <div style={{ width: `${analysis.surfPct.dirt}%` }} className="bg-amber-600 transition-all duration-500" />
        </div>
      </div>
    </div>
  );
};