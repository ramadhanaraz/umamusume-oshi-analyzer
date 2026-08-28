'use client';

import React from 'react';
import { ArchetypeDetails } from '../../utils/calculator';
import { TerminologyMode, TERMINOLOGY } from '../../types/trainee';

interface ArchetypeViewProps {
  archetype: ArchetypeDetails;
  mode: TerminologyMode;
  styleRaw: { front: number; pace: number; late: number; end: number };
}

export const ArchetypeView: React.FC<ArchetypeViewProps> = ({
  archetype,
  mode,
  styleRaw,
}) => {
  const dict = TERMINOLOGY[mode];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${archetype.gradient} border ${archetype.border} shadow-2xl space-y-3 text-white`}>
        <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-amber-200 text-xs font-bold uppercase tracking-widest border border-white/10">
          {archetype.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">{archetype.title}</h2>
        <p className="text-xs sm:text-sm text-white/95 leading-relaxed">{archetype.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Strategy Point Multipliers</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{dict.style.front}:</span>
              <span className="font-mono font-bold text-white">{styleRaw.front.toFixed(1)} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{dict.style.pace}:</span>
              <span className="font-mono font-bold text-white">{styleRaw.pace.toFixed(1)} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{dict.style.late}:</span>
              <span className="font-mono font-bold text-white">{styleRaw.late.toFixed(1)} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{dict.style.end}:</span>
              <span className="font-mono font-bold text-white">{styleRaw.end.toFixed(1)} pts</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Champions Meeting Recommendation</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {archetype.strategy}
          </p>
        </div>
      </div>
    </div>
  );
};