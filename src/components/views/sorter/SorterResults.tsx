'use client';

import React, { useState } from 'react';
import { Trainee, TerminologyMode } from '../../../types/trainee';
import { Sparkles, CheckCircle2, RotateCcw, Check, Heart, Trophy, Flame } from 'lucide-react';

interface SorterResultsProps {
  tier1: Trainee[]; // Ranks 1-5
  tier2: Trainee[]; // Ranks 6-15
  tier3: Trainee[]; // Ranks 16-30
  tier4: Trainee[]; // Ranks 31-50
  mode: TerminologyMode;
  onApplyToRoster: (selected50: Trainee[]) => void;
  onRestart: () => void;
}

const RESULT_TIERS = [
  {
    id: 'tier-1',
    name: 'I was born for dem Oshis',
    ranks: 'Rank #1–#5',
    multiplier: '4.0× Multiplier',
    badgeEmoji: '👑',
    textColor: 'text-amber-300',
    pillBg: 'bg-amber-400/10 text-amber-300 border-amber-500/30',
    headerBg: 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent',
    borderAccent: 'border-amber-500/30',
    cardBorder: 'border-amber-500/60 hover:border-amber-400 shadow-amber-500/10',
    startIndex: 0,
  },
  {
    id: 'tier-2',
    name: 'Beloved Ones',
    ranks: 'Rank #6–#15',
    multiplier: '2.5× Multiplier',
    badgeEmoji: '💖',
    textColor: 'text-rose-300',
    pillBg: 'bg-rose-400/10 text-rose-300 border-rose-500/30',
    headerBg: 'bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-transparent',
    borderAccent: 'border-rose-500/30',
    cardBorder: 'border-rose-500/60 hover:border-rose-400 shadow-rose-500/10',
    startIndex: 5,
  },
  {
    id: 'tier-3',
    name: 'Oshi Pick',
    ranks: 'Rank #16–#30',
    multiplier: '1.5× Multiplier',
    badgeEmoji: '⭐',
    textColor: 'text-purple-300',
    pillBg: 'bg-purple-400/10 text-purple-300 border-purple-500/30',
    headerBg: 'bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent',
    borderAccent: 'border-purple-500/30',
    cardBorder: 'border-purple-500/60 hover:border-purple-400 shadow-purple-500/10',
    startIndex: 15,
  },
  {
    id: 'tier-4',
    name: 'I Like Them Equally',
    ranks: 'Rank #31–#50',
    multiplier: '1.0× Multiplier',
    badgeEmoji: '✨',
    textColor: 'text-slate-300',
    pillBg: 'bg-slate-800 text-slate-300 border-slate-700',
    headerBg: 'bg-gradient-to-r from-slate-800/40 via-slate-900/30 to-transparent',
    borderAccent: 'border-slate-700/60',
    cardBorder: 'border-slate-700/80 hover:border-slate-500 shadow-slate-900/40',
    startIndex: 30,
  },
];

export const SorterResults: React.FC<SorterResultsProps> = ({
  tier1,
  tier2,
  tier3,
  tier4,
  mode,
  onApplyToRoster,
  onRestart,
}) => {
  const fullCalibratedList = [...tier1, ...tier2, ...tier3, ...tier4];
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(fullCalibratedList.map((t) => t.id))
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < 50) next.add(id);
      }
      return next;
    });
  };

  const handleConfirmImport = () => {
    const finalSelection = fullCalibratedList.filter((t) => selectedIds.has(t.id)).slice(0, 50);
    onApplyToRoster(finalSelection);
  };

  const tierDataMap = {
    'tier-1': tier1,
    'tier-2': tier2,
    'tier-3': tier3,
    'tier-4': tier4,
  };

  const topOshi = tier1[0];

  return (
    <div className="space-y-8 animate-fadeIn select-none">
      {/* Scoped Keyframe Animation for Chibi Mascot Jump */}
      <style>{`
        @keyframes chibiHop {
          0% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-18px) scale(1.05); }
          75% { transform: translateY(2px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .chibi-interactive:hover .chibi-avatar {
          animation: chibiHop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* Hero Celebration Banner with Agnes Digital Chibi */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-950/40 via-slate-900 to-indigo-950/40 border border-pink-500/25 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Column: Congratulatory Dialogue, Title & CTAs */}
        <div className="space-y-4 text-center md:text-left max-w-2xl relative z-10 flex-1">
          {/* Matchmaker Completed Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-widest shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Tournament Complete • Oshi Hierarchy Finalized!</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Your Ultimate{' '}
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
              Top 50 Oshis
            </span>{' '}
            Are Crowned!
          </h1>

          {/* Agnes Digital Flavor Speech Bubble */}
          <div className="relative p-4 rounded-2xl bg-slate-950/70 border border-pink-500/30 shadow-inner text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-pink-600 text-white font-black text-[10px] uppercase tracking-wider">
                Agnes Digital
              </span>
              <span className="text-[11px] text-pink-300 font-medium">
                Ecstatic Oshi Connoisseur 🌸
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              &ldquo;Kyaaaaa~! What exquisite taste, Trainer-san! Look at this absolute masterpiece of a pantheon!
              {topOshi && (
                <>
                  {' '}Crowing <strong className="text-amber-300 not-italic font-bold">{mode === 'jp' ? topOshi.nameJp || topOshi.nameEn : topOshi.nameEn}</strong> as your unquestioned #1 is pure genius!
                </>
              )}
              {' '}My heart is overflowing with blessed Uma energy... Thank you for walking this sacred journey with me! Arghhh!&rdquo;
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Review your final oshi rankings below. Uncheck anyone if you wish to exclude them to the list, then apply directly to your main Top 50 oshis.
          </p>

          {/* Global Action Triggers */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5">
            <button
              type="button"
              onClick={handleConfirmImport}
              className="w-full text-white sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-pink-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Apply Selected ({selectedIds.size}/50) to My Top 50</span>
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Run Sorter Again</span>
            </button>
          </div>
        </div>

        {/* Right Column: Agnes Digital Chibi Mascot with Jump Action */}
        <div className="chibi-interactive shrink-0 relative flex flex-col items-center justify-center z-10 px-4 cursor-pointer">
          <div className="absolute inset-4 bg-pink-500/15 blur-2xl rounded-full pointer-events-none transition-opacity duration-300" />
          
          <img
            src="/chibis/AgnesDigitalChibi1-2.png"
            alt="Agnes Digital - Ultimate Oshi Fan"
            className="chibi-avatar w-40 sm:w-52 h-auto drop-shadow-[0_8px_16px_rgba(236,72,153,0.22)] relative z-10 select-none pointer-events-auto will-change-transform"
          />
          <span className="text-[10px] font-mono text-pink-300/90 font-bold tracking-widest mt-2 uppercase bg-black/60 px-3.5 py-1 rounded-full border border-pink-500/30 shadow-md">
            Your Oshis will Thank You! ✨
          </span>
        </div>
      </div>

      {/* Tiers Showcase Container */}
      <div className="space-y-8">
        {RESULT_TIERS.map((tier) => {
          const trainees = tierDataMap[tier.id as keyof typeof tierDataMap] || [];

          return (
            <div key={tier.id} className="space-y-3.5">
              {/* Tier Subheader */}
              <div className={`flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl border ${tier.borderAccent} ${tier.headerBg}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{tier.badgeEmoji}</span>
                  <div>
                    <h3 className={`text-sm font-black tracking-tight ${tier.textColor}`}>
                      {tier.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {tier.ranks}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border ${tier.pillBg}`}>
                  {tier.multiplier}
                </span>
              </div>

              {/* Trainee Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {trainees.map((trainee, idx) => {
                  const rank = tier.startIndex + idx + 1;
                  const isSelected = selectedIds.has(trainee.id);

                  return (
                    <TraineeResultCard
                      key={trainee.id}
                      trainee={trainee}
                      rank={rank}
                      tierBorderClass={tier.cardBorder}
                      isSelected={isSelected}
                      mode={mode}
                      onToggle={() => toggleSelect(trainee.id)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TraineeResultCardProps {
  trainee: Trainee;
  rank: number;
  tierBorderClass: string;
  isSelected: boolean;
  mode: TerminologyMode;
  onToggle: () => void;
}

const TraineeResultCard: React.FC<TraineeResultCardProps> = ({
  trainee,
  rank,
  tierBorderClass,
  isSelected,
  mode,
  onToggle,
}) => {
  // Individual Rank Colors (Gold #1, Silver #2, Bronze #3, Dark Slate for #4+)
  const getRankBadgeStyle = (r: number) => {
    if (r === 1) {
      return 'bg-amber-400 text-slate-950 border border-amber-300 shadow-amber-500/30 font-black';
    }
    if (r === 2) {
      return 'bg-slate-200 text-slate-950 border border-white shadow-slate-200/30 font-black';
    }
    if (r === 3) {
      return 'bg-amber-600 text-white border border-amber-500 shadow-amber-700/30 font-black';
    }
    return 'bg-slate-900/90 text-slate-300 border border-slate-700 shadow-black/40 font-bold';
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 flex flex-col justify-between aspect-[3/4] p-3.5 cursor-pointer bg-[#0a0f1d] ${
        isSelected
          ? `${tierBorderClass} shadow-md`
          : 'border-slate-900 bg-slate-950/60 opacity-35 grayscale scale-[0.98]'
      }`}
    >
      {/* Character Artwork & Soft Ambient Glow */}
      {trainee.image ? (
        <>
          {/* 1. Subtle Ambient Glow */}
          <img
            src={trainee.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 saturate-150 brightness-110 pointer-events-none group-hover:opacity-60 transition-opacity duration-300"
          />

          {/* 2. 100% Full-Brightness Sharp Portrait */}
          <img
            src={trainee.image}
            alt={trainee.nameEn}
            className="absolute inset-0 w-full h-full object-cover object-top z-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
          />

          {/* 3. Localized Bottom Dissolve Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/75 to-transparent pointer-events-none z-[1]" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-4xl text-slate-600 bg-slate-900">
          {trainee.emoji || '❓'}
        </div>
      )}

      {/* Podium-Colored Numbering Badge & Selection Checkbox Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className={`h-7 min-w-[34px] px-2 rounded-lg flex items-center justify-center text-xs shadow-md tracking-tight transition-transform group-hover:scale-105 ${getRankBadgeStyle(
            rank
          )}`}
        >
          {rank === 1 ? '★ 1' : `#${rank}`}
        </span>

        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
              : 'bg-black/60 border border-slate-700 text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </div>

      {/* Trainee Name Vignette */}
      <div className="relative z-10">
        <p className="text-sm font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
          {mode === 'jp' ? trainee.nameJp || trainee.nameEn : trainee.nameEn}
        </p>
        {mode !== 'jp' && trainee.nameJp && (
          <p className="text-[11px] text-pink-300 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5 truncate">
            {trainee.nameJp}
          </p>
        )}
      </div>
    </button>
  );
};