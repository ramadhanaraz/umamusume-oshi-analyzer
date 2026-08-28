'use client';

import React, { useState } from 'react';
import { Trainee } from '../types/trainee';
import { X, RefreshCw, ArrowRightLeft, Trash2 } from 'lucide-react';

interface CardActionModalProps {
  rank: number;
  trainee: Trainee;
  totalCount: number;
  onClose: () => void;
  onChangeTrainee: (rank: number) => void;
  onMoveToRank: (fromRank: number, toRank: number) => void;
  onRemove: (rank: number) => void;
}

export const CardActionModal: React.FC<CardActionModalProps> = ({
  rank,
  trainee,
  totalCount,
  onClose,
  onChangeTrainee,
  onMoveToRank,
  onRemove,
}) => {
  const [targetRank, setTargetRank] = useState<string>(rank.toString());

  const parsedRank = parseInt(targetRank, 10);
  const isValid = !isNaN(parsedRank) && parsedRank >= 1 && parsedRank <= totalCount && parsedRank !== rank;

  const handleJumpRank = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onMoveToRank(rank, parsedRank);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">{trainee.emoji}</span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{trainee.nameEn}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20">
                  Rank #{rank}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">{trainee.nameJp}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Options */}
        <div className="p-4 space-y-3">
          {/* Option 1: Change Trainee */}
          <button
            onClick={() => {
              onClose();
              onChangeTrainee(rank);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-pink-500/60 hover:bg-slate-900/60 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-pink-300">Change Trainee</p>
                <p className="text-[10px] text-slate-400">Replace with another Uma from the database</p>
              </div>
            </div>
          </button>

          {/* Option 2: Move to Specific Rank */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Move to Specific Rank</p>
                <p className="text-[10px] text-slate-400">Jump directly to rank 1 to {totalCount}</p>
              </div>
            </div>

            <form onSubmit={handleJumpRank} className="flex items-center gap-2 pt-1">
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 flex-1 focus-within:border-cyan-500 transition-colors">
                <span className="text-xs text-slate-500 mr-2 font-bold">#</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={`1 - ${totalCount}`}
                  value={targetRank}
                  onChange={(e) => setTargetRank(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none placeholder-slate-600"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!isValid}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                Jump
              </button>
            </form>
          </div>

          {/* Option 3: Remove Trainee */}
          <button
            onClick={() => {
              onRemove(rank);
              onClose();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-950/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-300">Remove from Top 50</p>
                <p className="text-[10px] text-rose-400/70">Subsequent Oshis will automatically shift up</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};