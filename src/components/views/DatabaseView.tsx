'use client';

import React, { useState, useMemo } from 'react';
import { Trainee, TerminologyMode } from '../../types/trainee';
import { DatabaseHeader } from './database/DatabaseHeader';
import { DatabaseCard } from './database/DatabaseCard';

interface DatabaseViewProps {
  trainees: Trainee[];
  activeTraineeRanks: Record<string, number>;
  mode: TerminologyMode;
  onAddTrainee: (trainee: Trainee) => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  trainees,
  activeTraineeRanks,
  mode,
  onAddTrainee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<number | 'all'>('all');

  const filteredTrainees = useMemo(() => {
    return trainees.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesEn = t.nameEn.toLowerCase().includes(q);
        const matchesJp = t.nameJp.includes(q);
        const matchesId = t.id.toLowerCase().includes(q);
        if (!matchesEn && !matchesJp && !matchesId) return false;
      }

      if (rarityFilter !== 'all' && t.baseRarity !== rarityFilter) {
        return false;
      }

      return true;
    });
  }, [trainees, searchQuery, rarityFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <DatabaseHeader
        totalCount={trainees.length}
        filteredCount={filteredTrainees.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        rarityFilter={rarityFilter}
        onRarityChange={setRarityFilter}
      />

      {filteredTrainees.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
          <p className="text-sm font-semibold text-slate-400">
            No trainees found matching your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setRarityFilter('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTrainees.map((trainee) => (
            <DatabaseCard
              key={trainee.id}
              trainee={trainee}
              mode={mode}
              assignedRank={activeTraineeRanks[trainee.id]}
              onAdd={onAddTrainee}
            />
          ))}
        </div>
      )}
    </div>
  );
};
