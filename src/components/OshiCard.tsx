'use client';

import React from 'react';
import { Trainee, TerminologyMode, TERMINOLOGY } from '../types/trainee';
import { getGradeBadgeStyle, getGradeTextColor, getRankPillStyle } from '../utils/gradeStyles';
import { Trash2, GripVertical } from 'lucide-react';
import { useSortable, defaultAnimateLayoutChanges, AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface OshiCardProps {
  rank: number;
  trainee: Trainee;
  mode: TerminologyMode;
  totalCount: number;
  isCompact?: boolean;
  isOverlay?: boolean;
  onOpenActionMenu?: (rank: number) => void;
  onRemove?: (rank: number) => void;
}

const customAnimateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }
  return true;
};

export const OshiCard: React.FC<OshiCardProps> = ({
  rank,
  trainee,
  mode,
  isCompact = false,
  isOverlay = false,
  onOpenActionMenu,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: trainee.id,
    animateLayoutChanges: customAnimateLayoutChanges,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const dict = TERMINOLOGY[mode];

  const stylePrefix = {
    front: mode === 'global' ? 'FR' : '逃',
    pace: mode === 'global' ? 'PC' : '先',
    late: mode === 'global' ? 'LS' : '差',
    end: mode === 'global' ? 'EC' : '追',
  };

  const distPrefix = {
    short: mode === 'global' ? 'SP' : '短',
    mile: mode === 'global' ? 'MI' : 'マ',
    medium: mode === 'global' ? 'MD' : '中',
    long: mode === 'global' ? 'LG' : '長',
  };

  const rankBadge = (
    <div className={`${isCompact ? 'w-7 h-7 text-xs rounded-lg' : 'w-9 h-9 text-sm rounded-xl'} flex items-center justify-center shrink-0 ${getRankPillStyle(rank)}`}>
      #{rank}
    </div>
  );

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const overlayClasses = isOverlay
    ? 'border-pink-500 shadow-2xl shadow-pink-500/30 scale-[1.02] cursor-grabbing bg-[#11192e]'
    : '';

  if (isCompact) {
    return (
      <div
        ref={!isOverlay ? setNodeRef : undefined}
        style={!isOverlay ? style : undefined}
        onClick={() => onOpenActionMenu && onOpenActionMenu(rank)}
        className={`w-full flex items-center justify-between gap-2.5 p-2 px-3 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-pink-500/40 hover:bg-[#11192e] shadow-sm group select-none cursor-pointer ${overlayClasses}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {rankBadge}
          <span className="text-xl shrink-0 select-none">{trainee.emoji}</span>
          <div className="min-w-0 flex items-baseline gap-2 truncate">
            <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate">
              {trainee.nameEn}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium truncate hidden md:inline">
              ({trainee.nameJp})
            </span>
          </div>

          <div className="text-[10px] font-medium text-slate-400 hidden xl:flex items-center gap-1.5 bg-slate-950/90 px-2 py-0.5 rounded-md border border-slate-800/80 shrink-0 shadow-inner">
            <span>{dict.surface.turf}: <strong className={getGradeTextColor(trainee.surface.turf)}>{trainee.surface.turf}</strong></span>
            <span className="text-slate-600">•</span>
            <span>{dict.surface.dirt}: <strong className={getGradeTextColor(trainee.surface.dirt)}>{trainee.surface.dirt}</strong></span>
          </div>
        </div>

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

        <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(rank);
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-200 p-1 rounded hover:bg-slate-800/80 touch-none transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // Expanded View
  return (
    <div
      ref={!isOverlay ? setNodeRef : undefined}
      style={!isOverlay ? style : undefined}
      onClick={() => onOpenActionMenu && onOpenActionMenu(rank)}
      className={`w-full flex flex-wrap lg:flex-nowrap items-center justify-between gap-3.5 p-3.5 px-4 rounded-2xl bg-[#0e1424] border border-slate-800/80 hover:border-pink-500/40 hover:bg-[#11192e] shadow-md group select-none cursor-pointer ${overlayClasses}`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {rankBadge}
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

          <div className="inline-flex items-center gap-1.5 bg-slate-950/90 px-2 py-0.5 rounded-md border border-slate-800/80 text-[10px] font-medium text-slate-400 mt-1 shadow-inner">
            <span>{dict.surface.turf}: <strong className={getGradeTextColor(trainee.surface.turf)}>{trainee.surface.turf}</strong></span>
            <span className="text-slate-600">•</span>
            <span>{dict.surface.dirt}: <strong className={getGradeTextColor(trainee.surface.dirt)}>{trainee.surface.dirt}</strong></span>
          </div>
        </div>
      </div>

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

      <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-2" onClick={(e) => e.stopPropagation()}>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(rank);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Remove from Roster"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/80 touch-none transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};