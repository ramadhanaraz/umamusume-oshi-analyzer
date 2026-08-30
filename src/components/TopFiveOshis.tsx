'use client';

import React, { useState } from 'react';
import { Crown, ChevronRight, MoreVertical, Plus } from 'lucide-react';
import { Trainee, TerminologyMode } from '../types/trainee';
import { OshiSlot } from '../utils/calculator';
import { getGradeBadgeStyle, getRankPillStyle } from '../utils/gradeStyles';

interface TopFiveOshisProps {
  slots: OshiSlot[];
  mode: TerminologyMode;
  onSelectSlot: (rank: number) => void;
  onOpenActionMenu: (rank: number) => void;
  onManageTop50: () => void;
  isReadOnly?: boolean;
}

export const TopFiveOshis: React.FC<TopFiveOshisProps> = ({
  slots,
  mode,
  onSelectSlot,
  onOpenActionMenu,
  onManageTop50,
  isReadOnly = false,
}) => {
  const top5 = slots.slice(0, 5);
  const [activeOverlay, setActiveOverlay] = useState<Record<number, boolean>>({});

  const toggleOverlay = (rank: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveOverlay((prev) => ({
      ...prev,
      [rank]: !prev[rank],
    }));
  };

  const getCardBorder = (rank: number): string => {
    if (rank === 1) return 'border border-amber-400/90 shadow-lg shadow-amber-500/15';
    if (rank === 2) return 'border border-slate-300/80 shadow-md shadow-slate-300/10';
    if (rank === 3) return 'border border-amber-600/80 shadow-md shadow-amber-800/15';
    return 'border border-slate-700/80 shadow-sm shadow-slate-950/40';
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

  return (
    <div className="bg-[#0b101e]/90 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col space-y-5 animate-fadeIn select-none">
      {/* Unified Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-amber-400 tracking-tight">
              I WAS BORN FOR DEM OSHIS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Top 5 Crowned Oshis • Rank #1–#5 (Tier 1 Priority)
            </p>
          </div>
        </div>

        {/* Right Manage Button (Hidden when Read-Only) */}
        {!isReadOnly && (
          <button
            type="button"
            onClick={onManageTop50}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <span>Manage Top 50</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Top 5 Showcase Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {top5.map((slot) => {
          const t = slot.trainee;
          const isOverlayOpen = activeOverlay[slot.rank];

          return (
            <div
              key={slot.rank}
              onClick={(e) => {
                if (!t) {
                  if (!isReadOnly) onSelectSlot(slot.rank);
                } else {
                  toggleOverlay(slot.rank, e);
                }
              }}
              className={`group relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#0d1426] select-none transition-all duration-300 ${
                !t && isReadOnly ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02] active:scale-98'
              } ${getCardBorder(slot.rank)}`}
            >
              {t?.image ? (
                <>
                  {/* Chromatic background aura */}
                  <img
                    src={t.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-80 scale-135 brightness-125 saturate-[2.2] pointer-events-none group-hover:opacity-95 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Sharp Full Portrait */}
                  <img
                    src={t.image}
                    alt={mode === 'jp' ? t.nameJp : t.nameEn}
                    className="w-full h-full object-cover object-top relative z-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 text-slate-500 group-hover:text-slate-300 transition-colors p-3 text-center">
                  {!isReadOnly && (
                    <div className="w-11 h-11 rounded-full border border-dashed border-slate-700 flex items-center justify-center mb-2 group-hover:border-slate-500">
                      <Plus className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <span className="text-xs font-bold">
                    {isReadOnly ? `Unassigned #${slot.rank}` : `Assign #${slot.rank}`}
                  </span>
                </div>
              )}

              {/* Enlarged Rank Badge */}
              <div
                className={`absolute top-2.5 left-2.5 h-7 min-w-[28px] px-2.5 py-0.5 rounded-lg flex items-center justify-center gap-1 text-xs sm:text-sm font-black tracking-tight z-20 transition-transform ${getRankPillStyle(
                  slot.rank
                )}`}
              >
                <span>{slot.rank === 1 ? '★ 1' : slot.rank}</span>
              </div>

              {/* Action Menu Trigger Button (Hidden in Read-Only Mode) */}
              {!isReadOnly && t && (
                <button
                  type="button"
                  aria-label="Card Actions"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenActionMenu(slot.rank);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-md border border-white/10 z-20 transition-all active:scale-90 shadow-md"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              )}

              {/* Top Overlay: Track Surface Pills */}
              {t && (
                <div
                  className={`absolute inset-x-0 top-0 pt-11 pb-3 px-2 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent z-10 transition-all duration-300 ${
                    isOverlayOpen
                      ? 'translate-y-0 opacity-100'
                      : '-translate-y-full opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-md">
                      <span className="text-slate-300 text-[9px] font-bold tracking-tight">Turf</span>
                      <span
                        className={`px-1.5 py-0.2 rounded border text-[9px] font-black ${getGradeBadgeStyle(
                          t.surface?.turf
                        )}`}
                      >
                        {t.surface?.turf || 'G'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-md">
                      <span className="text-slate-300 text-[9px] font-bold tracking-tight">Dirt</span>
                      <span
                        className={`px-1.5 py-0.2 rounded border text-[9px] font-black ${getGradeBadgeStyle(
                          t.surface?.dirt
                        )}`}
                      >
                        {t.surface?.dirt || 'G'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Default Bottom Name Label */}
              {t && (
                <div
                  className={`absolute inset-x-0 bottom-0 pt-14 pb-2.5 px-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10 flex flex-col transition-all duration-300 ${
                    isOverlayOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 group-hover:opacity-0'
                  }`}
                >
                  <span className="text-xs font-black text-white truncate drop-shadow-md tracking-tight">
                    {mode === 'jp' ? t.nameJp : t.nameEn}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate drop-shadow-sm">
                    {mode === 'jp' ? t.nameEn : t.nameJp}
                  </span>
                </div>
              )}

              {/* Bottom Slide-Up Aptitude Matrix Overlay */}
              {t && (
                <div
                  className={`absolute inset-x-0 bottom-0 p-2.5 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/95 via-slate-950/70 to-transparent z-10 flex flex-col space-y-1.5 transition-all duration-300 ${
                    isOverlayOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="px-0.5">
                    <h4 className="text-xs font-black text-white truncate tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {mode === 'jp' ? t.nameJp : t.nameEn}
                    </h4>
                  </div>

                  <div className="space-y-1 w-full bg-slate-950/75 backdrop-blur-md p-1 rounded-xl border border-slate-800/80 shadow-xl">
                    {/* Row 1: Running Style */}
                    <div className="grid grid-cols-4 gap-1 text-center font-mono">
                      {(['front', 'pace', 'late', 'end'] as const).map((key) => (
                        <div
                          key={key}
                          className={`py-0.5 px-0.5 rounded border text-[9px] leading-tight flex items-center justify-center gap-0.5 shadow-sm ${getGradeBadgeStyle(
                            t.style?.[key]
                          )}`}
                        >
                          <span className="opacity-70 text-[8px] font-medium">{labels[key]}:</span>
                          <strong className="font-black">{t.style?.[key] || 'G'}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Row 2: Distance Range */}
                    <div className="grid grid-cols-4 gap-1 text-center font-mono">
                      {(['short', 'mile', 'medium', 'long'] as const).map((key) => (
                        <div
                          key={key}
                          className={`py-0.5 px-0.5 rounded border text-[9px] leading-tight flex items-center justify-center gap-0.5 shadow-sm ${getGradeBadgeStyle(
                            t.distance?.[key]
                          )}`}
                        >
                          <span className="opacity-70 text-[8px] font-medium">{labels[key]}:</span>
                          <strong className="font-black">{t.distance?.[key] || 'G'}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};