'use client';

import React from 'react';
import { Trainee, TerminologyMode } from '../../types/trainee';
import { OshiCard } from '../OshiCard';
import { Sparkles, Trash2, Search, Plus } from 'lucide-react';

interface RosterViewProps {
  activeTrainees: { rank: number; trainee: Trainee }[];
  activeCount: number;
  mode: TerminologyMode;
  onOpenModal: (rank: number) => void;
  onRemove: (rank: number) => void;
  onMove: (rank: number, direction: 'up' | 'down') => void;
  onLoadPreset: (type: 'random') => void;
  onClear: () => void;
  onGoToDatabase: () => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  activeTrainees,
  activeCount,
  mode,
  onOpenModal,
  onRemove,
  onMove,
  onLoadPreset,
  onClear,
  onGoToDatabase,
}) => {
  return (
    <div className="space-y-4 max-w-5xl mx-auto animate-fadeIn">
      {/* Roster Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-[#0e1424] p-4 sm:p-5 rounded-3xl border border-slate-800/90 shadow-xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white">Top 50 Oshi Ranking List</h2>
          <p className="text-xs text-slate-400 mt-0.5">Re-order your favorite Umamusume (Rank 1 to 50)</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onLoadPreset('random')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Random 50 Quick-fill</span>
          </button>
          <button
            onClick={onClear}
            disabled={activeCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all disabled:opacity-30 disabled:hover:bg-rose-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Empty State vs. Populated List */}
      {activeCount === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-5xl select-none">🏇</div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-black text-white">Your Top 50 List is Empty!</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Go to the <strong className="text-slate-200">Uma Database</strong> tab or click quick fill to populate your favorite characters and start analyzing!
            </p>
          </div>
          <button
            onClick={onGoToDatabase}
            className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Browse Database</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {activeTrainees.map(({ rank, trainee }) => (
            <OshiCard
              key={`${rank}-${trainee.id}`}
              rank={rank}
              trainee={trainee}
              mode={mode}
              totalCount={activeCount}
              onOpenModal={onOpenModal}
              onRemove={onRemove}
              onMove={onMove}
            />
          ))}

          {activeCount < 50 && (
            <button
              onClick={() => onOpenModal(activeCount + 1)}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0e1424]/60 border border-dashed border-slate-800 hover:border-pink-500/60 hover:bg-slate-900/50 transition-all text-xs font-bold text-slate-400 hover:text-pink-300 group"
            >
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
              <span>+ Add Rank #{activeCount + 1} Oshi</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};