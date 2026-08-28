'use client';

import React from 'react';
import { Trainee, TerminologyMode, AptitudeGrade } from '../types/trainee';
import { Trash2, GripVertical } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';

interface OshiCardProps {
  rank: number;
  trainee: Trainee;
  mode: TerminologyMode;
  totalCount: number;
  isCompact?: boolean;
  onOpenActionMenu: (rank: number) => void;
  onRemove: (rank: number) => void;
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

const getRankBadge = (rank: number, isCompact?: boolean) => {
  const size = isCompact ? 'w-7 h-7 text-xs rounded-lg' : 'w-9 h-9 text-sm rounded-xl';
  if (rank === 1) {
    return (
      <div className={`${size} bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0`}>
        #{rank}
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className={`${size} bg-slate-200 text-slate-950 font-black flex items-center justify-center shadow-md shadow-slate-300/20 shrink-0`}>
        #{rank}
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className={`${size} bg-amber-700 text-amber-100 font-black flex items-center justify-center shadow-md shadow-amber-900/30 shrink-0`}>
        #{rank}
      </div>
    );
  }
  if (rank <= 5) {
    return (
      <div className={`${size} bg-amber-500/15 text-amber-400 border border-amber-500/30 font-black flex items-center justify-center shrink-0`}>
        #{rank}
      </div>
    );
  }
  return (
    <div className={`${size} bg-slate-900 text-slate-400 border border-slate-800 font-bold flex items-center justify-center shrink-0`}>
      #{rank}
    </div>
  );
};

export const OshiCard: React.FC<OshiCardProps> = ({
  rank,
  trainee,
  mode,
  isCompact = false,
  onOpenActionMenu,
  onRemove,
}) => {
  const dragControls = useDragControls();

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

  if (isCompact) {
    return (
      <Reorder.Item
        value={trainee}
        dragListener={false}
        dragControls={dragControls}
        onClick={() => onOpenActionMenu(rank)}
        className="w-full flex items-center justify-between gap-2.5 p-2 px-3 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-pink-500/40 hover:bg-[#11192e] transition-colors shadow-sm group select-none cursor-pointer"
        whileDrag={{
          scale: 1.02,
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.5), 0px 0px 15px rgba(244, 63, 94, 0.3)',
          zIndex: 50,
          borderColor: '#f43f5e',
        }}
      >
        {/* Left: Rank, Emoji & Trainee Name */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {getRankBadge(rank, true)}
          <span className="text-xl shrink-0 select-none">{trainee.emoji}</span>
          <div className="min-w-0 flex items-baseline gap-2 truncate">
            <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate">
              {trainee.nameEn}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium truncate hidden md:inline">
              ({trainee.nameJp})
            </span>
          </div>
        </div>

        {/* Center: Compact Aptitude Grades */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.front)}`}>
              {stylePrefix.front}:{trainee.style.front}
            </span>
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.pace)}`}>
              {stylePrefix.pace}:{trainee.style.pace}
            </span>
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.late)}`}>
              {stylePrefix.late}:{trainee.style.late}
            </span>
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.style.end)}`}>
              {stylePrefix.end}:{trainee.style.end}
            </span>
          </div>

          <div className="h-3 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1 hidden sm:flex">
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.short)}`}>
              {distPrefix.short}:{trainee.distance.short}
            </span>
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.mile)}`}>
              {distPrefix.mile}:{trainee.distance.mile}
            </span>
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.medium)}`}>
              {distPrefix.medium}:{trainee.distance.medium}
            </span>
            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${getGradeBadgeStyle(trainee.distance.long)}`}>
              {distPrefix.long}:{trainee.distance.long}
            </span>
          </div>
        </div>

        {/* Right Controls: Delete + Drag Handle */}
        <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(rank);
            }}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              dragControls.start(e);
            }}
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-200 p-1 rounded hover:bg-slate-800/80 touch-none transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
      </Reorder.Item>
    );
  }

  // Expanded View
  return (
    <Reorder.Item
      value={trainee}
      dragListener={false}
      dragControls={dragControls}
      onClick={() => onOpenActionMenu(rank)}
      className="w-full flex flex-wrap lg:flex-nowrap items-center justify-between gap-3.5 p-3.5 px-4 rounded-2xl bg-[#0e1424] border border-slate-800/80 hover:border-pink-500/40 hover:bg-[#11192e] transition-colors shadow-md group select-none cursor-pointer"
      whileDrag={{
        scale: 1.02,
        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.5), 0px 0px 15px rgba(244, 63, 94, 0.3)',
        zIndex: 50,
        borderColor: '#f43f5e',
      }}
    >
      {/* Left: Rank, Emoji, Trainee Names & Surfaces */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {getRankBadge(rank, false)}
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

      {/* Middle: Style & Distance Aptitudes */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
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

      {/* Right Controls: Delete + Drag Handle */}
      <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(rank);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          title="Remove from Roster"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            dragControls.start(e);
          }}
          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/80 touch-none transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </Reorder.Item>
  );
};