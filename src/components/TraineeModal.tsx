'use client';

import React, { useState } from 'react';
import { Trainee } from '../types/trainee';
import { Search, X } from 'lucide-react';

interface TraineeModalProps {
  rank: number;
  trainees: Trainee[];
  onSelect: (trainee: Trainee) => void;
  onClose: () => void;
}

export const TraineeModal: React.FC<TraineeModalProps> = ({
  rank,
  trainees,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const filtered = trainees.filter(
    (t) =>
      t.nameEn.toLowerCase().includes(query.toLowerCase()) ||
      t.nameJp.includes(query)
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-slate-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div>
            <h3 className="text-sm font-bold text-white">Select Rank #{rank} Oshi</h3>
            <p className="text-[11px] text-slate-400">Choose from {trainees.length} playable trainees</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by English or Japanese name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              autoFocus
            />
          </div>
        </div>

        <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 custom-scrollbar">
          {filtered.map((trainee) => (
            <button
              key={trainee.id}
              onClick={() => onSelect(trainee)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-pink-500 hover:bg-slate-800/50 transition-all text-left group"
            >
              <span className="text-xl select-none">{trainee.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 group-hover:text-pink-300 truncate">{trainee.nameEn}</p>
                <p className="text-[10px] text-slate-400 truncate">{trainee.nameJp}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};