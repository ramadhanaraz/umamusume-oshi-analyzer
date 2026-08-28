'use client';

import React from 'react';
import { TerminologyMode, TERMINOLOGY } from '../types/trainee';
import { OshiSlot } from '../utils/calculator';
import { getGradeBadgeStyle, getGradeTextColor, getRankPillStyle } from '../utils/gradeStyles';
import { ArrowRight } from 'lucide-react';

interface TopFiveOshisProps {
  slots: OshiSlot[];
  mode: TerminologyMode;
  onSelectSlot: (rank: number) => void;
  onOpenActionMenu: (rank: number) => void;
  onManageTop50: () => void;
}

export const TopFiveOshis: React.FC<TopFiveOshisProps> = ({
  slots,
  mode,
  onSelectSlot,
  onOpenActionMenu,
  onManageTop50,
}) => {
  const topFive = slots.slice(0, 5);
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

  return (
    <div className="p-6 rounded-3xl bg-[#0e1424] border border-amber-500/20 shadow-xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base select-none">👑</span>
          <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
            I WAS BORN FOR DEM OSHIS
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            (Top 5 Oshis • Rank 1–5)
          </span>
        </div>

        <button
          onClick={onManageTop50}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 border border-pink-500/20 text-xs font-bold transition-all active:scale-95 shadow-sm"
        >
          <span>Manage Top 50</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {topFive.map((slot) => {
          const trainee = slot.trainee;

          if (!trainee) {
            return (
              <div
                key={slot.rank}
                onClick={() => onSelectSlot(slot.rank)}
                className="p-4 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 hover:border-pink-500/40 hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center text-center min-h-[175px] cursor-pointer group"
              >
                <span className={`px-2.5 py-0.5 rounded-md text-xs mb-2 ${getRankPillStyle(slot.rank)}`}>
                  #{slot.rank}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-pink-300 transition-colors font-medium">
                  + Empty Slot
                </span>
              </div>
            );
          }

          return (
            <div
              key={slot.rank}
              onClick={() => onOpenActionMenu(slot.rank)}
              className="p-3.5 rounded-2xl bg-[#0e1424] border border-slate-800/80 hover:border-pink-500/40 hover:bg-[#11192e] transition-all flex flex-col justify-between gap-2.5 shadow-md cursor-pointer group"
            >
              {/* Top Sub-Bar: Rank Badge + Surface Badge */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className={`px-2 py-0.5 rounded-md text-[11px] ${getRankPillStyle(slot.rank)}`}>
                  #{slot.rank}
                </span>
                <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5 bg-slate-950/90 px-2 py-0.5 rounded-md border border-slate-800/80 shadow-inner">
                  <span>{dict.surface.turf}: <strong className={getGradeTextColor(trainee.surface.turf)}>{trainee.surface.turf}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>{dict.surface.dirt}: <strong className={getGradeTextColor(trainee.surface.dirt)}>{trainee.surface.dirt}</strong></span>
                </div>
              </div>

              {/* Character Identity */}
              <div className="flex items-center gap-2.5 min-w-0 my-0.5">
                <span className="text-2xl shrink-0 select-none">{trainee.emoji}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white group-hover:text-pink-300 transition-colors truncate">
                    {trainee.nameEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">{trainee.nameJp}</p>
                </div>
              </div>

              {/* Bottom Matrix: Style & Distance Pills */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60 text-[10px]">
                <div className="flex items-center justify-between gap-1">
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.style.front)}`}>
                    {stylePrefix.front}:{trainee.style.front}
                  </span>
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.style.pace)}`}>
                    {stylePrefix.pace}:{trainee.style.pace}
                  </span>
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.style.late)}`}>
                    {stylePrefix.late}:{trainee.style.late}
                  </span>
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.style.end)}`}>
                    {stylePrefix.end}:{trainee.style.end}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.distance.short)}`}>
                    {distPrefix.short}:{trainee.distance.short}
                  </span>
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.distance.mile)}`}>
                    {distPrefix.mile}:{trainee.distance.mile}
                  </span>
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.distance.medium)}`}>
                    {distPrefix.medium}:{trainee.distance.medium}
                  </span>
                  <span className={`flex-1 text-center py-0.5 rounded border font-mono font-bold ${getGradeBadgeStyle(trainee.distance.long)}`}>
                    {distPrefix.long}:{trainee.distance.long}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};