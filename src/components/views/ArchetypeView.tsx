'use client';

import React from 'react';
import { Trainee, TerminologyMode } from '../../types/trainee';
import { AnalysisResult } from '../../utils/calculator';
import { ArchetypeHeader } from './archetype/ArchetypeHeader';
import { TraineeMiniCard } from '../common/TraineeMiniCard';

interface ArchetypeViewProps {
  analysis: AnalysisResult;
  activeTrainees: { rank: number; trainee: Trainee }[];
  mode: TerminologyMode;
}

export const ArchetypeView: React.FC<ArchetypeViewProps> = ({
  analysis,
  activeTrainees,
  mode,
}) => {
  const { archetype, activeCount } = analysis;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      <ArchetypeHeader
        badge={archetype.badge}
        title={archetype.title}
        description={archetype.description}
        strategy={archetype.strategy}
        gradient={archetype.gradient}
        border={archetype.border}
        accent={archetype.accent}
        activeCount={activeCount}
      />

      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>Active Roster Core</span>
          <span className="text-xs text-slate-400 font-medium">({activeCount} Trainees)</span>
        </h3>

        {activeCount === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No trainees in your roster yet. Add trainees to reveal your custom stable composition.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeTrainees.map(({ rank, trainee }) => (
              <TraineeMiniCard
                key={trainee.id}
                trainee={trainee}
                mode={mode}
                assignedRank={rank}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
