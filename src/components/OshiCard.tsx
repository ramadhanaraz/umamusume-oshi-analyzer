'use client';

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, MoreVertical } from 'lucide-react';
import { Trainee, TerminologyMode } from '../types/trainee';
import { getGradeBadgeStyle, getRankPillStyle } from '../utils/gradeStyles';

interface OshiCardProps {
  rank: number;
  trainee: Trainee;
  mode: TerminologyMode;
  totalCount: number;
  isCompact?: boolean;
  isOverlay?: boolean;
  isReadOnly?: boolean;
  onOpenActionMenu?: (rank: number) => void;
  onRemove?: (rank: number) => void;
  onMoveToRank?: (sourceRank: number, targetRank: number) => void;
}

export const OshiCard: React.FC<OshiCardProps> = ({
  rank,
  trainee,
  mode,
  totalCount,
  isCompact = false,
  isOverlay = false,
  isReadOnly = false,
  onOpenActionMenu,
  onRemove,
  onMoveToRank,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: trainee.id, disabled: isReadOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditingRank, setIsEditingRank] = useState(false);
  const [inputRank, setInputRank] = useState<string>(rank.toString());

  // Keep synced with live rank adjustments
  useEffect(() => {
    setInputRank(rank.toString());
  }, [rank]);

  const handleRankSubmit = () => {
    setIsEditingRank(false);
    const parsed = parseInt(inputRank, 10);
    if (isNaN(parsed) || parsed < 1 || parsed === rank) {
      setInputRank(rank.toString());
      return;
    }
    const clampedRank = Math.min(Math.max(1, parsed), totalCount);
    setInputRank(clampedRank.toString());
    onMoveToRank?.(rank, clampedRank);
  };

  const labels = {
    front: mode === 'jp' ? '逃' : 'FR',
    pace: mode === 'jp' ? '先' : 'PC',
    late: mode === 'jp' ? '差' : 'LS',
    end: mode === 'jp' ? '追' : 'EC',
    short: mode === 'jp' ? '短' : 'SP',
    mile: mode === 'jp' ? 'マ' : 'MI',
    medium: mode === 'jp' ? '中' : 'MD',
    long: mode === 'jp' ? '長' : 'LG',
  };

  const displayName = mode === 'jp' ? trainee.nameJp || trainee.nameEn : trainee.nameEn;
  const subName = mode === 'jp' ? trainee.nameEn : trainee.nameJp;

  // ----------------------------------------------------
  // A. COMPACT VIEW: Ultra-Slim, Fast Reordering Row
  // ----------------------------------------------------
  if (isCompact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...(!isReadOnly ? attributes : {})}
        {...(!isReadOnly ? listeners : {})}
        className={`group flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-[#0b101e]/80 border border-slate-800/80 transition-all select-none ${
          isReadOnly
            ? 'cursor-default'
            : 'cursor-grab active:cursor-grabbing hover:border-slate-700 hover:bg-[#0e1424]'
        } ${isDragging ? 'opacity-30' : 'opacity-100'} ${
          isOverlay ? 'shadow-2xl ring-2 ring-pink-500 bg-[#0d1426] z-50' : ''
        }`}
      >
        {/* Left: Dedicated Numbering Pill + Emoji + Name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`h-6 min-w-[28px] px-1.5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${getRankPillStyle(
              rank
            )}`}
          >
            #{rank}
          </div>

          <span className="text-base leading-none select-none shrink-0 -translate-y-[0.5px]">
            {trainee.emoji || '🐴'}
          </span>

          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-bold text-white truncate">{displayName}</span>
            {subName && (
              <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                ({subName})
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions (Hidden when read-only) */}
        {!isReadOnly && (
          <div
            className="flex items-center gap-1 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled={isOverlay}
              onClick={(e) => {
                e.stopPropagation();
                onOpenActionMenu?.(rank);
              }}
              aria-label="Card Actions"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isOverlay}
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(rank);
              }}
              aria-label="Remove Trainee"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-60"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // B. EXPANDED VIEW: Rich Character Card with Interactive Rank Box
  // ----------------------------------------------------
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isReadOnly ? attributes : {})}
      {...(!isReadOnly ? listeners : {})}
      className={`group relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-3xl bg-[#0b101e]/90 border border-slate-800/90 transition-all select-none ${
        isReadOnly
          ? 'cursor-default'
          : 'cursor-grab active:cursor-grabbing hover:border-slate-700 hover:bg-[#0e1424]'
      } ${isDragging ? 'opacity-30' : 'opacity-100'} ${
        isOverlay ? 'shadow-2xl ring-2 ring-pink-500 bg-[#0d1426] z-50' : ''
      }`}
    >
      {/* Left: Rank Box + Portrait Avatar + Name */}
      <div className="flex items-center gap-3.5 min-w-0">
        {isReadOnly ? (
          <div
            className={`h-8 min-w-[34px] px-2 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-md ${getRankPillStyle(
              rank
            )}`}
          >
            #{rank}
          </div>
        ) : (
          <div
            className="relative shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isEditingRank ? (
              <input
                type="number"
                min={1}
                max={totalCount}
                value={inputRank}
                autoFocus
                onFocus={(e) => e.target.select()}
                onChange={(e) => setInputRank(e.target.value)}
                onBlur={handleRankSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  } else if (e.key === 'Escape') {
                    setInputRank(rank.toString());
                    setIsEditingRank(false);
                  }
                }}
                className="h-8 w-12 rounded-xl text-center text-xs font-black bg-slate-950 text-amber-300 border-2 border-pink-500 shadow-xl outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingRank(true);
                }}
                title={`Click to jump to rank (1–${totalCount})`}
                className={`h-8 min-w-[34px] px-2 rounded-xl flex items-center justify-center text-xs font-black shadow-md transition-all hover:scale-105 active:scale-95 cursor-text hover:ring-2 hover:ring-pink-500/50 ${getRankPillStyle(
                  rank
                )}`}
              >
                #{rank}
              </button>
            )}
          </div>
        )}

        {/* Square Portrait Avatar */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0 shadow-md">
          {trainee.image ? (
            <>
              <img
                src={trainee.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60 scale-125"
              />
              <img
                src={trainee.image}
                alt={displayName}
                className="relative z-10 w-full h-full object-cover object-top"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {trainee.emoji || '🐴'}
            </div>
          )}
        </div>

        {/* Character Info & Track Surface Capsules */}
        <div className="flex flex-col min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-black text-white truncate tracking-tight">
              {displayName}
            </h4>
            {subName && (
              <span className="text-[11px] text-slate-400 font-medium truncate hidden md:inline">
                ({subName})
              </span>
            )}
          </div>

          {/* Surface Aptitude Pills */}
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <div className="flex items-center gap-1 text-slate-400">
              <span>Turf:</span>
              <span
                className={`px-1.5 py-0.2 rounded border font-bold text-[9px] ${getGradeBadgeStyle(
                  trainee.surface?.turf
                )}`}
              >
                {trainee.surface?.turf || 'G'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Dirt:</span>
              <span
                className={`px-1.5 py-0.2 rounded border font-bold text-[9px] ${getGradeBadgeStyle(
                  trainee.surface?.dirt
                )}`}
              >
                {trainee.surface?.dirt || 'G'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: 2x4 Aptitude Grid & Action Buttons */}
      <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
        {/* 2x4 Aptitude Matrix */}
        <div className="space-y-1 font-mono text-center">
          {/* Row 1: Running Styles */}
          <div className="grid grid-cols-4 gap-1">
            {(['front', 'pace', 'late', 'end'] as const).map((key) => {
              const grade = trainee.style?.[key] || 'G';
              return (
                <div
                  key={key}
                  className={`px-2 py-0.5 rounded border text-[9px] font-bold flex items-center gap-1 ${getGradeBadgeStyle(
                    grade
                  )}`}
                >
                  <span className="opacity-70 text-[8px]">{labels[key]}:</span>
                  <span>{grade}</span>
                </div>
              );
            })}
          </div>

          {/* Row 2: Distances */}
          <div className="grid grid-cols-4 gap-1">
            {(['short', 'mile', 'medium', 'long'] as const).map((key) => {
              const grade = trainee.distance?.[key] || 'G';
              return (
                <div
                  key={key}
                  className={`px-2 py-0.5 rounded border text-[9px] font-bold flex items-center gap-1 ${getGradeBadgeStyle(
                    grade
                  )}`}
                >
                  <span className="opacity-70 text-[8px]">{labels[key]}:</span>
                  <span>{grade}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons (Hidden when read-only) */}
        {!isReadOnly && (
          <div
            className="flex items-center gap-1 pl-2 border-l border-slate-800"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled={isOverlay}
              onClick={(e) => {
                e.stopPropagation();
                onOpenActionMenu?.(rank);
              }}
              aria-label="Card Actions"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={isOverlay}
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(rank);
              }}
              aria-label="Remove Trainee"
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};