'use client';

import React from 'react';
import { Trainee, TerminologyMode, AptitudeGrade } from '../types/trainee';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface OshiCardProps {
  rank: number;
  trainee: Trainee;
  mode: TerminologyMode;
  totalCount: number;
  onOpenModal: (rank: number) => void;
  onRemove: (rank: number) => void;
  onMove: (rank: number, direction: 'up' | 'down') => void;
}

const getGradeBadgeStyle = (grade: AptitudeGrade) => {
  switch (grade) {
    case 'S':
    case 'A':
      return 'bg-rose-950/70 border-rose-500/60 text-rose-300';
    case 'B':
      return 'bg-amber-900/60 border-amber-500/60 text-amber-300';
    case 'C':
      return 'bg-yellow-950/60 border-yellow-500/60 text-yellow-300';
    case 'D':
      return 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300';
    case 'E':
      return 'bg-sky-950/60 border-sky-500/60 text-sky-300';
    case 'F':
    case 'G':
    default:
      return 'bg-slate-900/80 border-slate-800 text-slate-500';
  }
};

const getRankBadge = (rank: number) => {
  if (rank === 1) {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
        #{rank}
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-slate-300/20 shrink-0">
        #{rank}
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-700 text-amber-100 font-black text-sm flex items-center justify-center shadow-md shadow-amber-900/30 shrink-0">
        #{rank}
      </div>
    );
  }
  if (rank <= 5) {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 font-black text-xs flex items-center justify-center shrink-0">
        #{rank}
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
      #{rank}
    </div>
  );
};

export const OshiCard: React.FC<OshiCardProps> = ({
  rank,
  trainee,
  mode,
  totalCount,
  onOpenModal,
  onRemove,
  onMove,
}) => {
  const stylePrefix = {
    front: mode === 'global' ? 'FR' : '逃',
    pace: mode === 'global' ? 'PC' : '先',
    late: mode === 'global' ? 'LS' : '差',
    end: mode === 'global' ? 'EC' : '追',
  };

  const distPrefix = {
    short: mode === 'global' ? 'ST' : '短',
    mile: mode === 'global' ? 'MI' : 'マ',
    medium: mode === 'global' ? 'MD' : '中',
    long: mode === 'global' ? 'LG' : '長',
  };

  return (
    <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-between gap-3.5 p-3.5 px-4 rounded-2xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700 transition-all shadow-md group">
      {/* Left Column: Rank, Emoji, Trainee Names & Surface info */}
      <div
        onClick={() => onOpenModal(rank)}
        className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
      >
        {getRankBadge(rank)}
        <span className="text-2xl shrink-0 select-none">{trainee.emoji}</span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 truncate">
            <h4 className="text-sm font-black text-white group-hover:text-pink-300 transition-colors truncate">
              {trainee.nameEn}
            </h4>
            <span className="text-[11px] text-slate-400 font-medium truncate hidden sm:inline">
              ({trainee.nameJp})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Turf: <strong className="text-slate-200 font-bold">{trainee.surface.turf}</strong>
            <span className="mx-1.5 text-slate-600">•</span>
            Dirt: <strong className="text-slate-200 font-bold">{trainee.surface.dirt}</strong>
          </p>
        </div>
      </div>

      {/* Middle Column: Running Style and Distance Aptitudes */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
        {/* Style Aptitudes */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider hidden xl:inline">Style:</span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.front)}`}>
            {stylePrefix.front}: {trainee.style.front}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.pace)}`}>
            {stylePrefix.pace}: {trainee.style.pace}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.late)}`}>
            {stylePrefix.late}: {trainee.style.late}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.end)}`}>
            {stylePrefix.end}: {trainee.style.end}
          </span>
        </div>

        {/* Distance Aptitudes */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider hidden xl:inline">Dist:</span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.short)}`}>
            {distPrefix.short}: {trainee.distance.short}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.mile)}`}>
            {distPrefix.mile}: {trainee.distance.mile}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.medium)}`}>
            {distPrefix.medium}: {trainee.distance.medium}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.long)}`}>
            {distPrefix.long}: {trainee.distance.long}
          </span>
        </div>
      </div>

      {/* Right Column: Reorder and Delete Controls */}
      <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-2">
        <button
          onClick={() => onMove(rank, 'up')}
          disabled={rank === 1}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
          title="Move Rank Up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => onMove(rank, 'down')}
          disabled={rank === totalCount}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
          title="Move Rank Down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(rank)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all ml-1"
          title="Remove from Roster"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};