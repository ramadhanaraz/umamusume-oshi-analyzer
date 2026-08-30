// components/views/sorter/Phase3Arena.tsx
'use client';

import React, { useEffect } from 'react';
import { Trainee, TerminologyMode } from '../../../types/trainee';
import { Crown, Heart, Sparkles, RotateCcw } from 'lucide-react';

interface Phase3ArenaProps {
  left: Trainee;
  right: Trainee;
  comparisonsDone: number;
  totalEstimate: number;
  mode: TerminologyMode;
  onChoose: (choice: 'LEFT' | 'RIGHT' | 'TIE') => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export const Phase3Arena: React.FC<Phase3ArenaProps> = ({
  left,
  right,
  comparisonsDone,
  totalEstimate,
  mode,
  onChoose,
  onUndo,
  canUndo = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        onChoose('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        onChoose('RIGHT');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        onChoose('TIE');
      } else if ((e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') && canUndo && onUndo) {
        onUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChoose, onUndo, canUndo]);

  return (
    <div className="space-y-3 sm:space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="text-center space-y-1 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-amber-500/20 border border-pink-500/30 text-pink-300 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-md">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Championship Duel</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
          Crown Your Ultimate #1 Oshi
        </h2>

        <p className="text-[11px] sm:text-sm text-slate-400">
          Duel <strong className="text-pink-400 font-mono">{comparisonsDone + 1}</strong> of ~{totalEstimate} • Tap your favorite!
        </p>
      </div>

      {/* Side-by-Side 1v1 Split Screen (Side-by-Side on Mobile) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-6">
        {/* Left Candidate */}
        <button
          type="button"
          onClick={() => onChoose('LEFT')}
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-500/30 bg-[#0a0f1d] hover:border-pink-400 transition-all duration-300 p-2.5 sm:p-6 flex flex-col justify-between aspect-[3/4] sm:aspect-square text-left shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer ring-1 ring-pink-500/20 hover:ring-pink-400/40"
        >
          {left.image ? (
            <>
              <img
                src={left.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-45 scale-125 saturate-150 brightness-110 pointer-events-none group-hover:opacity-65 transition-opacity"
              />
              <img
                src={left.image}
                alt={left.nameEn}
                className="absolute inset-0 w-full h-full object-cover object-top z-0 drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 sm:h-32 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/75 to-transparent pointer-events-none z-[1]" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl text-slate-600 bg-slate-900">
              {left.emoji || '❓'}
            </div>
          )}

          <div className="relative z-10 flex justify-between items-center">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-pink-600 text-white font-black text-[9px] sm:text-xs uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white" />
              <span>A</span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-300 hidden sm:inline-block bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              ← or A
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-sm sm:text-3xl font-black text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] truncate">
              {mode === 'jp' ? left.nameJp || left.nameEn : left.nameEn}
            </h3>
            {mode !== 'jp' && left.nameJp && (
              <p className="text-[10px] sm:text-sm text-pink-300 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5 truncate">
                {left.nameJp}
              </p>
            )}
          </div>
        </button>

        {/* Right Candidate */}
        <button
          type="button"
          onClick={() => onChoose('RIGHT')}
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#0a0f1d] hover:border-cyan-400 transition-all duration-300 p-2.5 sm:p-6 flex flex-col justify-between aspect-[3/4] sm:aspect-square text-left shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer ring-1 ring-cyan-500/20 hover:ring-cyan-400/40"
        >
          {right.image ? (
            <>
              <img
                src={right.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-45 scale-125 saturate-150 brightness-110 pointer-events-none group-hover:opacity-65 transition-opacity"
              />
              <img
                src={right.image}
                alt={right.nameEn}
                className="absolute inset-0 w-full h-full object-cover object-top z-0 drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 sm:h-32 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/75 to-transparent pointer-events-none z-[1]" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl text-slate-600 bg-slate-900">
              {right.emoji || '❓'}
            </div>
          )}

          <div className="relative z-10 flex justify-between items-center">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-cyan-600 text-white font-black text-[9px] sm:text-xs uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white" />
              <span>B</span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-300 hidden sm:inline-block bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              → or D
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-sm sm:text-3xl font-black text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] truncate">
              {mode === 'jp' ? right.nameJp || right.nameEn : right.nameEn}
            </h3>
            {mode !== 'jp' && right.nameJp && (
              <p className="text-[10px] sm:text-sm text-cyan-300 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5 truncate">
                {right.nameJp}
              </p>
            )}
          </div>
        </button>
      </div>

      {/* Tie & Undo Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChoose('TIE')}
          className="flex-1 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-pink-500/40 text-slate-200 font-black text-[11px] sm:text-xs transition-all shadow-md active:scale-98 text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>💕 Both Are Absolute Faves!</span>
          <span className="text-slate-400 font-mono text-[10px] hidden md:inline">[↓ / S]</span>
        </button>

        {canUndo && onUndo && (
          <button
            type="button"
            onClick={onUndo}
            className="px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm shrink-0"
            title="Undo previous duel"
          >
            <RotateCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span className="hidden xs:inline">Undo</span>
          </button>
        )}
      </div>
    </div>
  );
};