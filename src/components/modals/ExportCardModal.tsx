// components/modals/ExportCardModal.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Copy, Check, X, Sparkles, Crown } from 'lucide-react';
import { TerminologyMode, TERMINOLOGY, WeightingMode, AptitudeFilterMode } from '../../types/trainee';
import { ArchetypeDetails, OshiSlot } from '../../utils/calculator';
import { getRankPillStyle } from '../../utils/gradeStyles';
import { encodeRosterToUrl } from '../../utils/urlSerializer';
import { AppLogo } from '../AppLogo';

interface ExportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: OshiSlot[];
  mode?: TerminologyMode;
  weightMode?: WeightingMode;
  filterMode?: AptitudeFilterMode;
  archetype?: ArchetypeDetails;
  stylePct?: Record<string, number>;
  distPct?: Record<string, number>;
  strategyScores?: Record<string, number>;
  distanceScores?: Record<string, number>;
}

export const ExportCardModal: React.FC<ExportCardModalProps> = ({
  isOpen,
  onClose,
  slots = [],
  mode = 'global',
  weightMode = 'tiered',
  filterMode = 'aOnly',
  archetype = {
    badge: '🏇 Stable Archetype',
    title: 'The Leader (先行) Tactician',
    description: 'Evenly distributed styles',
    strategy: '',
    gradient: '',
    border: '',
    accent: '',
  },
  stylePct,
  distPct,
  strategyScores = { front: 0, pace: 0, late: 0, end: 0 },
  distanceScores = { short: 0, mile: 0, medium: 0, long: 0 },
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [scale, setScale] = useState(1);

  const CANVAS_WIDTH = 900;
  const CANVAS_HEIGHT = 510;

  // Responsive scale preview calculator for mobile screens
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 32;
        if (availableWidth < CANVAS_WIDTH) {
          setScale(Math.max(availableWidth / CANVAS_WIDTH, 0.32));
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  if (!isOpen) return null;

  const dict = TERMINOLOGY[mode] || TERMINOLOGY.global;
  const filledCount = (slots || []).filter((s) => s.trainee !== null).length;

  const slot1 = slots[0];
  const slot2 = slots[1];
  const slot3 = slots[2];
  const slot4 = slots[3];
  const slot5 = slots[4];

  // Percentage Calculations
  const totalStylePoints = Object.values(strategyScores).reduce((a, b) => a + b, 0) || 1;
  const computedStylePct =
    stylePct || {
      front: Math.round(((strategyScores.front || 0) / totalStylePoints) * 100),
      pace: Math.round(((strategyScores.pace || 0) / totalStylePoints) * 100),
      late: Math.round(((strategyScores.late || 0) / totalStylePoints) * 100),
      end: Math.round(((strategyScores.end || 0) / totalStylePoints) * 100),
    };

  const totalDistPoints = Object.values(distanceScores).reduce((a, b) => a + b, 0) || 1;
  const computedDistPct =
    distPct || {
      short: Math.round(((distanceScores.short || 0) / totalDistPoints) * 100),
      mile: Math.round(((distanceScores.mile || 0) / totalDistPoints) * 100),
      medium: Math.round(((distanceScores.medium || 0) / totalDistPoints) * 100),
      long: Math.round(((distanceScores.long || 0) / totalDistPoints) * 100),
    };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 1,
        style: {
          transform: 'none', // Strictly uncompressed 1:1 render
        },
      });

      const link = document.createElement('a');
      link.download = `umamusume-oshi-summary-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const compressed = encodeRosterToUrl(slots, weightMode, filterMode);
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('roster', compressed);

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const getCardBorder = (rank: number): string => {
    if (rank === 1) return 'border border-amber-400/90 shadow-lg shadow-amber-500/15';
    if (rank === 2) return 'border border-slate-300/80 shadow-md shadow-slate-300/10';
    if (rank === 3) return 'border border-amber-600/80 shadow-md shadow-amber-800/15';
    return 'border border-slate-700/80 shadow-sm shadow-slate-950/40';
  };

  const styleKeys = ['front', 'pace', 'late', 'end'] as const;
  const distanceKeys = ['short', 'mile', 'medium', 'long'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto select-none">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh] my-auto"
      >
        {/* Modal Window Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Export Oshi Summary Card
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Window Body */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex flex-col items-center">

          {/* Quick Actions Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80 shrink-0">
            <div className="text-xs text-slate-400">
              Assigned Slots: <strong className="text-white font-mono font-bold">{filledCount}/50</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Rendering HD Image...' : 'Download PNG Card'}</span>
              </button>
            </div>
          </div>

          {/* Export Scaled Preview Wrapper */}
          <div className="w-full flex justify-center py-1 overflow-hidden">
            <div
              style={{
                width: `${CANVAS_WIDTH * scale}px`,
                height: `${CANVAS_HEIGHT * scale}px`,
              }}
              className="relative shrink-0 flex items-center justify-center transition-all duration-200"
            >
              {/* ---------------------------------------------------------------- */}
              {/* FIXED 900x510 CANONICAL EXPORT CANVAS (Zero Responsive Modifier)  */}
              {/* ---------------------------------------------------------------- */}
              <div
                ref={cardRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
                className="w-[900px] h-[510px] absolute top-0 left-0 bg-[#070b16] border border-slate-800 rounded-2xl p-5 text-white overflow-hidden select-none flex flex-col justify-between"
              >
                {/* Radial Glow Layer */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse 80% 50% at 50% -15%, rgba(244, 63, 94, 0.15), transparent), radial-gradient(ellipse 60% 40% at 95% 95%, rgba(56, 189, 248, 0.08), transparent)',
                  }}
                />

                {/* 1. Card Header Banner (Strictly Non-Responsive Classes) */}
                <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-2.5 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                      <AppLogo size="md" />
                    </div>
                    <div>
                      <h1 className="text-lg font-black tracking-tight leading-none bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
                        Umamusume Top 50 Oshi Strategy Analyzer
                      </h1>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">
                        Oshi Archetype Profile & Strategy Distribution
                      </p>
                    </div>
                  </div>

                  {/* Right Header Stats: Roster Size & Archetype */}
                  <div className="flex items-center gap-3.5">
                    <div className="text-right pr-3.5 border-r border-slate-800/90">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                        ROSTER SIZE
                      </span>
                      <span className="text-xs font-mono font-black text-pink-400">
                        {filledCount} <span className="text-slate-500 font-medium">/ 50</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                        OSHIS ARCHETYPE
                      </span>
                      <span className="text-sm font-black text-amber-300">
                        {archetype?.title || archetype?.badge || 'All-Rounder'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Main Content Layout (Fixed 12-Column Grid) */}
                <div className="relative z-10 grid grid-cols-12 gap-4 items-stretch flex-1 py-1.5">

                  {/* Left: Top 5 Spotlight (Col-Span 7) */}
                  <div className="col-span-7 flex flex-col space-y-2">
                    <div className="flex items-center gap-2 shrink-0">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-black text-amber-400 uppercase tracking-wider text-xs leading-none drop-shadow-sm">
                        I WAS BORN FOR DEM OSHIS
                      </span>
                      <span className="text-slate-400 text-[11px] font-semibold tracking-tight leading-none">
                        (Top 5 Spotlight)
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-2.5 flex-1 min-h-[320px]">
                      {/* Rank #1 Spotlight Card */}
                      <div
                        className={`col-span-6 h-full relative rounded-2xl overflow-hidden bg-[#0d1426] ${getCardBorder(
                          1
                        )}`}
                      >
                        {slot1?.trainee?.image ? (
                          <>
                            <img
                              src={slot1.trainee.image}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-75 scale-135 brightness-125 saturate-[2.2] pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-transparent z-0" />
                            <img
                              src={slot1.trainee.image}
                              alt={mode === 'jp' ? slot1.trainee.nameJp : slot1.trainee.nameEn}
                              className="absolute inset-0 w-full h-full object-cover object-top scale-115 origin-top z-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                            />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-900 text-slate-500">
                            {slot1?.trainee?.emoji || '❓'}
                          </div>
                        )}

                        <div
                          className={`absolute top-2.5 left-2.5 h-6 px-2 rounded-lg flex items-center gap-1 text-xs font-black z-10 ${getRankPillStyle(
                            1
                          )}`}
                        >
                          <span>★ 1</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 pt-16 pb-2.5 px-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10">
                          <p className="text-sm font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                            {slot1?.trainee
                              ? mode === 'jp'
                                ? slot1.trainee.nameJp || slot1.trainee.nameEn
                                : slot1.trainee.nameEn
                              : 'Unassigned'}
                          </p>
                        </div>
                      </div>

                      {/* Ranks #2 to #5 */}
                      <div className="col-span-6 grid grid-cols-2 grid-rows-2 gap-2.5 h-full">
                        {[slot2, slot3, slot4, slot5].map((slot, idx) => {
                          const rankNum = idx + 2;
                          const t = slot?.trainee;

                          return (
                            <div
                              key={rankNum}
                              className={`relative rounded-xl overflow-hidden bg-[#0d1426] ${getCardBorder(
                                rankNum
                              )}`}
                            >
                              {t?.image ? (
                                <>
                                  <img
                                    src={t.image}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-75 scale-135 brightness-125 saturate-[2.2] pointer-events-none"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-transparent z-0" />
                                  <img
                                    src={t.image}
                                    alt={mode === 'jp' ? t.nameJp : t.nameEn}
                                    className="absolute inset-0 w-full h-full object-cover object-top scale-115 origin-top z-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                                  />
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-900 text-slate-500">
                                  {t?.emoji || '❓'}
                                </div>
                              )}

                              <div
                                className={`absolute top-2 left-2 h-5 min-w-[20px] px-1.5 rounded-md flex items-center justify-center text-[10px] font-black z-10 ${getRankPillStyle(
                                  rankNum
                                )}`}
                              >
                                <span>{rankNum}</span>
                              </div>

                              <div className="absolute inset-x-0 bottom-0 pt-8 pb-1.5 px-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
                                <p className="text-[11px] font-black text-white truncate leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                  {t
                                    ? mode === 'jp'
                                      ? t.nameJp || t.nameEn
                                      : t.nameEn
                                    : '—'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Strategy & Distance Breakdown (Col-Span 5) */}
                  <div className="col-span-5 flex flex-col justify-between bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
                    {/* Running Style Breakdown */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-200">
                          Running Style Share
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          100% Total
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {styleKeys.map((key) => {
                          const pct = computedStylePct[key] || 0;
                          const label = dict.style[key];
                          const isDominant = pct >= 30;

                          return (
                            <div key={key} className="bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-800/80 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className={`text-[11px] font-medium ${isDominant ? 'text-cyan-300 font-bold' : 'text-slate-300'}`}>
                                  {label}
                                </span>
                                <span className="font-mono font-black text-xs text-white">
                                  {pct}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isDominant
                                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                      : 'bg-slate-700'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Distance Affinity Share */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-200">
                          Distance Affinity Share
                        </span>
                        <span className="text-[10px] font-mono text-rose-400 font-bold">
                          100% Total
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {distanceKeys.map((key) => {
                          const pct = computedDistPct[key] || 0;
                          const label = dict.distance[key];
                          const isDominant = pct >= 30;

                          return (
                            <div
                              key={key}
                              className="bg-slate-900/90 p-2 rounded-xl border border-slate-800/80 space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className={`text-[10px] truncate ${isDominant ? 'text-rose-300 font-bold' : 'text-slate-400'}`}>
                                  {label}
                                </span>
                                <span className="font-mono font-black text-[11px] text-white">
                                  {pct}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isDominant
                                      ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                                      : 'bg-slate-700'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3. Card Footer */}
                <div className="relative z-10 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    <span>Generated via Umamusume Top 50 Oshi Strategy Analyzer</span>
                  </div>
                  <span>Data by GameTora • Open Source GNU GPL-3.0</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};