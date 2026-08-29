'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Copy, Check, X, Sparkles, Trophy } from 'lucide-react';
import { StrategyScores, DistanceScores, ArchetypeResult } from '../../types/trainee';
import { OshiSlot, encodeRosterToUrl } from '../../utils/calculator';
import { AppLogo } from '../AppLogo';

interface ExportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: OshiSlot[];
  archetype?: ArchetypeResult;
  strategyScores?: StrategyScores;
  distanceScores?: DistanceScores;
}

const STYLE_LABELS: Record<string, string> = {
  front: 'Runner (逃げ)',
  pace: 'Leader (先行)',
  late: 'Betweener (差し)',
  end: 'Chaser (追込)',
};

const DISTANCE_LABELS: Record<string, string> = {
  short: 'Short (短距離)',
  mile: 'Mile (マイル)',
  medium: 'Medium (中距離)',
  long: 'Long (長距離)',
};

export const ExportCardModal: React.FC<ExportCardModalProps> = ({
  isOpen,
  onClose,
  slots = [],
  archetype = { name: 'Balanced All-Rounder', title: 'Versatile Stable', description: 'Evenly distributed styles' },
  strategyScores = { front: 0, pace: 0, late: 0, end: 0 },
  distanceScores = { short: 0, mile: 0, medium: 0, long: 0 },
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const safeStrategy: StrategyScores = strategyScores || { front: 0, pace: 0, late: 0, end: 0 };
  const safeDistance: DistanceScores = distanceScores || { short: 0, mile: 0, medium: 0, long: 0 };
  const top10 = (slots || []).slice(0, 10);
  const filledCount = (slots || []).filter((s) => s.trainee !== null).length;

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
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
    const compressed = encodeRosterToUrl(slots);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-pink-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Export Stable Summary Card
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex flex-col items-center">
          
          {/* Action Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-xs text-slate-400">
              Assigned Slots: <strong className="text-white font-mono font-bold">{filledCount}/50</strong>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
              </button>
              <button
                onClick={handleDownloadPng}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-500/25 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Rendering HD Image...' : 'Download PNG Card'}</span>
              </button>
            </div>
          </div>

          {/* Export Canvas Frame */}
          <div className="w-full overflow-x-auto flex justify-center pb-2">
            <div
              ref={cardRef}
              className="w-[960px] min-w-[960px] bg-[#070b16] border border-slate-800 rounded-2xl p-7 text-white space-y-6 relative overflow-hidden select-none"
              style={{
                backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(244, 63, 94, 0.18), transparent)',
              }}
            >
              {/* Card Banner */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3.5">
                  <AppLogo size="md" />
                  <div>
                    <h1 className="text-lg font-black tracking-tight leading-none bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
                      Umamusume Top 50 Oshi Strategy Analyzer
                    </h1>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Stable Archetype Profile & Top Trainee Strategy Distribution
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    Stable Archetype
                  </span>
                  <span className="text-sm font-black text-amber-300">
                    {archetype?.name || 'All-Rounder'}
                  </span>
                </div>
              </div>

              {/* Main Content: Top 10 + Scores */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Top 10 Showcase */}
                <div className="col-span-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Top 10 Crowned Oshis</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    {top10.map((slot) => {
                      const t = slot.trainee;
                      return (
                        <div
                          key={slot.rank}
                          className="flex flex-col items-center bg-slate-900/90 border border-slate-800/90 rounded-xl p-2 relative overflow-hidden text-center"
                        >
                          <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] font-mono font-black text-amber-300">
                            #{slot.rank}
                          </div>

                          <div className="w-13 h-13 my-1 rounded-lg overflow-hidden bg-slate-950 border border-slate-700/60 flex items-center justify-center">
                            {t?.image ? (
                              <img src={t.image} alt={t.nameEn} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">{t?.emoji || '❓'}</span>
                            )}
                          </div>

                          <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-0.5">
                            {t?.nameEn || 'Unassigned'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strategy & Distance Breakdown */}
                <div className="col-span-5 space-y-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  
                  {/* Style Distribution */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Running Style Distribution
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(safeStrategy).map(([key, val]) => (
                        <div key={key} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                          <span className="text-slate-400 text-[10px] truncate">{STYLE_LABELS[key] || key}</span>
                          <span className="font-mono font-black text-cyan-300 text-[11px] ml-1">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distance Affinity */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Distance Specialty
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(safeDistance).map(([key, val]) => (
                        <div key={key} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                          <span className="text-slate-400 text-[10px] truncate">{DISTANCE_LABELS[key] || key}</span>
                          <span className="font-mono font-black text-rose-300 text-[11px] ml-1">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  <span>Generated via Umamusume Top 50 Oshi Analyzer</span>
                </div>
                <span>Data by GameTora • Open Source GNU GPL-3.0</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};