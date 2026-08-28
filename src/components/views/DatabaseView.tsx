'use client';

import React, { useState } from 'react';
import { Trainee } from '../../types/trainee';
import { Search, Plus, Check } from 'lucide-react';

interface DatabaseViewProps {
  trainees: Trainee[];
  activeTraineeIds: string[];
  onAddTrainee: (trainee: Trainee) => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  trainees,
  activeTraineeIds,
  onAddTrainee,
}) => {
  const [query, setQuery] = useState('');

  const filtered = trainees.filter(
    (t) =>
      t.nameEn.toLowerCase().includes(query.toLowerCase()) ||
      t.nameJp.includes(query)
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Filter trainees by name (English or Japanese)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#0e1424] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((trainee) => {
          const isSelected = activeTraineeIds.includes(trainee.id);
          return (
            <div
              key={trainee.id}
              className="p-3.5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl select-none">{trainee.emoji}</span>
                  <div>
                    <h4 className="text-xs font-black text-white">{trainee.nameEn}</h4>
                    <p className="text-[10px] text-slate-400">{trainee.nameJp}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                  {trainee.baseRarity}★
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-950/70 p-2 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-400">Distance: </span>
                  <span className="font-bold text-slate-200">
                    {trainee.distance.short === 'A' ? 'Sht ' : ''}
                    {trainee.distance.mile === 'A' ? 'Mil ' : ''}
                    {trainee.distance.medium === 'A' ? 'Med ' : ''}
                    {trainee.distance.long === 'A' ? 'Lng ' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Surface: </span>
                  <span className="font-bold text-slate-200">
                    {trainee.surface.turf === 'A' ? 'Turf ' : ''}
                    {trainee.surface.dirt === 'A' ? 'Dirt ' : ''}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onAddTrainee(trainee)}
                className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    : 'bg-pink-600 hover:bg-pink-500 text-white shadow-sm'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>In Roster</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Top 50</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};