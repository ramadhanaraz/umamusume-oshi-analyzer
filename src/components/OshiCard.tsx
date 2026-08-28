'use client';

import React from 'react';
import { Trainee, TerminologyMode, TERMINOLOGY } from '../types/trainee';
import { X, ArrowUp, ArrowDown } from 'lucide-react';

interface OshiCardProps {
  rank: number;
  trainee: Trainee | null;
  mode: TerminologyMode;
  onOpenModal: (rank: number) => void;
  onRemove: (rank: number) => void;
  onMove: (fromRank: number, direction: 'up' | 'down') => void;
}

export const OshiCard: React.FC<OshiCardProps> = ({ rank, trainee, mode, onOpenModal, onRemove, onMove }) => {
  const labels = TERMINOLOGY[mode];

  if (!trainee) {
    return (
      <button
        onClick={() => onOpenModal(rank)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-amber-500/50 transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs group-hover:text-amber-400">
            {rank}
          </span>
          <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300">
            + Select Rank #{rank} Oshi
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-sm transition-all group">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
          {rank}
        </span>
        <span className="text-xl shrink-0">{trainee.emoji}</span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-100 truncate">{trainee.nameEn}</p>
          <p className="text-[10px] text-slate-400 truncate">{trainee.nameJp}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          disabled={rank === 1}
          onClick={() => onMove(rank, 'up')}
          className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          disabled={rank === 50}
          onClick={() => onMove(rank, 'down')}
          className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onRemove(rank)}
          className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};