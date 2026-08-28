'use client';

import React, { useState } from 'react';
import { Trainee, TerminologyMode } from '../../types/trainee';
import { OshiCard } from '../OshiCard';
import { Reorder } from 'framer-motion';
import {
  Sparkles,
  Trash2,
  Search,
  Plus,
  Layers,
  List,
  Maximize2,
  Minimize2,
  Wand2,
  X,
} from 'lucide-react';

interface RosterViewProps {
  activeTrainees: { rank: number; trainee: Trainee }[];
  activeCount: number;
  mode: TerminologyMode;
  onOpenActionMenu: (rank: number) => void;
  onOpenModal: (rank: number) => void;
  onRemove: (rank: number) => void;
  onMove: (rank: number, direction: 'up' | 'down') => void;
  onReorderList: (reorderedTrainees: Trainee[]) => void;
  onLoadPreset: (type: 'random') => void;
  onAutoFillRemaining: () => void;
  onClear: () => void;
  onGoToDatabase: () => void;
}

type AptitudeFilter = 'ALL' | 'TURF' | 'DIRT' | 'FRONT' | 'PACE' | 'LATE' | 'END' | 'SHORT' | 'MILE' | 'MEDIUM' | 'LONG';

interface TierDefinition {
  id: string;
  name: string;
  minRank: number;
  maxRank: number;
  multiplier: string;
  badgeEmoji: string;
  accentBorder: string;
  headerBg: string;
  textColor: string;
  pillBg: string;
}

const TIERS: TierDefinition[] = [
  {
    id: 'tier-1',
    name: 'I born for dem Oshis',
    minRank: 1,
    maxRank: 5,
    multiplier: '4.0× Multiplier',
    badgeEmoji: '👑',
    accentBorder: 'border-amber-500/30',
    headerBg: 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent',
    textColor: 'text-amber-300',
    pillBg: 'bg-amber-400/10 text-amber-300 border-amber-500/30',
  },
  {
    id: 'tier-2',
    name: 'Beloved Ones',
    minRank: 6,
    maxRank: 15,
    multiplier: '2.5× Multiplier',
    badgeEmoji: '💖',
    accentBorder: 'border-rose-500/30',
    headerBg: 'bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-transparent',
    textColor: 'text-rose-300',
    pillBg: 'bg-rose-400/10 text-rose-300 border-rose-500/30',
  },
  {
    id: 'tier-3',
    name: 'Oshi Pick',
    minRank: 16,
    maxRank: 30,
    multiplier: '1.5× Multiplier',
    badgeEmoji: '⭐',
    accentBorder: 'border-purple-500/30',
    headerBg: 'bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent',
    textColor: 'text-purple-300',
    pillBg: 'bg-purple-400/10 text-purple-300 border-purple-500/30',
  },
  {
    id: 'tier-4',
    name: 'I Like Them Equally',
    minRank: 31,
    maxRank: 50,
    multiplier: '1.0× Multiplier',
    badgeEmoji: '✨',
    accentBorder: 'border-slate-700/60',
    headerBg: 'bg-gradient-to-r from-slate-800/40 via-slate-900/30 to-transparent',
    textColor: 'text-slate-300',
    pillBg: 'bg-slate-800 text-slate-300 border-slate-700',
  },
];

export const RosterView: React.FC<RosterViewProps> = ({
  activeTrainees,
  activeCount,
  mode,
  onOpenActionMenu,
  onOpenModal,
  onRemove,
  onMove,
  onReorderList,
  onLoadPreset,
  onAutoFillRemaining,
  onClear,
  onGoToDatabase,
}) => {
  const [viewStyle, setViewStyle] = useState<'tiered' | 'continuous'>('tiered');
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTag, setFilterTag] = useState<AptitudeFilter>('ALL');

  const fullTraineeList = activeTrainees.map((s) => s.trainee);

  const filteredTrainees = activeTrainees.filter(({ trainee }) => {
    const matchesSearch =
      searchQuery === '' ||
      trainee.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.nameJp.includes(searchQuery);

    if (!matchesSearch) return false;

    switch (filterTag) {
      case 'TURF':
        return ['S', 'A'].includes(trainee.surface.turf);
      case 'DIRT':
        return ['S', 'A', 'B'].includes(trainee.surface.dirt);
      case 'FRONT':
        return ['S', 'A'].includes(trainee.style.front);
      case 'PACE':
        return ['S', 'A'].includes(trainee.style.pace);
      case 'LATE':
        return ['S', 'A'].includes(trainee.style.late);
      case 'END':
        return ['S', 'A'].includes(trainee.style.end);
      case 'SHORT':
        return ['S', 'A'].includes(trainee.distance.short);
      case 'MILE':
        return ['S', 'A'].includes(trainee.distance.mile);
      case 'MEDIUM':
        return ['S', 'A'].includes(trainee.distance.medium);
      case 'LONG':
        return ['S', 'A'].includes(trainee.distance.long);
      case 'ALL':
      default:
        return true;
    }
  });

  const filterChips: { id: AptitudeFilter; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'TURF', label: 'Turf (芝)' },
    { id: 'DIRT', label: 'Dirt (ダート)' },
    { id: 'FRONT', label: mode === 'global' ? 'Front Runner' : '逃げ' },
    { id: 'PACE', label: mode === 'global' ? 'Pace Chaser' : '先行' },
    { id: 'LATE', label: mode === 'global' ? 'Late Surger' : '差し' },
    { id: 'END', label: mode === 'global' ? 'End Closer' : '追込' },
    { id: 'SHORT', label: 'Short (短)' },
    { id: 'MILE', label: 'Mile (マ)' },
    { id: 'MEDIUM', label: 'Medium (中)' },
    { id: 'LONG', label: 'Long (長)' },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto animate-fadeIn">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-[#0e1424] p-4 sm:p-5 rounded-3xl border border-slate-800/90 shadow-xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white">Top 50 Oshi Ranking List</h2>
          <p className="text-xs text-slate-400 mt-0.5">Drag handle to smoothly reorder or click an Uma for options</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewStyle('tiered')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all text-xs ${
                viewStyle === 'tiered'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tiered View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tiered</span>
            </button>
            <button
              onClick={() => setViewStyle('continuous')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all text-xs ${
                viewStyle === 'continuous'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Continuous View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Continuous</span>
            </button>
          </div>

          {/* Density Toggle */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setIsCompact(false)}
              className={`p-1.5 rounded-lg font-bold transition-all ${
                !isCompact ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Expanded Detailed View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsCompact(true)}
              className={`p-1.5 rounded-lg font-bold transition-all ${
                isCompact ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Compact View"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto-Fill Remaining */}
          {activeCount > 0 && activeCount < 50 && (
            <button
              onClick={onAutoFillRemaining}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fill Rest ({50 - activeCount})</span>
            </button>
          )}

          <button
            onClick={() => onLoadPreset('random')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Random 50</span>
          </button>

          <button
            onClick={onClear}
            disabled={activeCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all disabled:opacity-30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filters */}
      {activeCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#0e1424] border border-slate-800/80 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search trainees within your Top 50..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {(searchQuery || filterTag !== 'ALL') && (
              <div className="text-[11px] text-slate-400 font-semibold px-2 shrink-0">
                Showing <strong className="text-pink-400">{filteredTrainees.length}</strong> of {activeCount}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1">
              Filter:
            </span>
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterTag(chip.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  filterTag === chip.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Empty State Screen */}
      {activeCount === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-5xl select-none">🏇</div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-black text-white">Your Top 50 List is Empty!</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Go to the <strong className="text-slate-200">Uma Database</strong> tab or click quick fill to populate your favorite characters and start analyzing!
            </p>
          </div>
          <button
            onClick={onGoToDatabase}
            className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Browse Database</span>
          </button>
        </div>
      ) : viewStyle === 'tiered' ? (
        /* 4. Tiered Fluid Reorder View */
        <div className="space-y-6">
          {TIERS.map((tier) => {
            const tierTrainees = filteredTrainees.filter(
              (t) => t.rank >= tier.minRank && t.rank <= tier.maxRank
            );
            const isCurrentFillingTier =
              activeCount + 1 >= tier.minRank && activeCount + 1 <= tier.maxRank;

            if (tierTrainees.length === 0 && (!isCurrentFillingTier || searchQuery || filterTag !== 'ALL')) {
              return null;
            }

            return (
              <div
                key={tier.id}
                className={`p-4 sm:p-5 rounded-3xl bg-[#0e1424] border ${tier.accentBorder} shadow-xl space-y-3`}
              >
                <div className={`p-3 sm:px-4 rounded-2xl ${tier.headerBg} border border-slate-800/60 flex flex-wrap items-center justify-between gap-2`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl select-none">{tier.badgeEmoji}</span>
                    <div>
                      <h3 className={`text-sm font-black ${tier.textColor}`}>
                        {tier.name}
                        <span className="text-xs font-semibold text-slate-400 ml-2">
                          (Rank {tier.minRank}–{tier.maxRank})
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${tier.pillBg}`}>
                      {tier.multiplier}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {tierTrainees.length} / {tier.maxRank - tier.minRank + 1}
                    </span>
                  </div>
                </div>

                {/* Reorder Group per tier */}
                <Reorder.Group
                  axis="y"
                  values={tierTrainees.map((s) => s.trainee)}
                  onReorder={(newTierItems) => {
                    // Update global full list preserving other tiers
                    const newFull = [...fullTraineeList];
                    const startIdx = tier.minRank - 1;
                    newTierItems.forEach((t, i) => {
                      newFull[startIdx + i] = t;
                    });
                    onReorderList(newFull);
                  }}
                  className="space-y-2 pt-1"
                >
                  {tierTrainees.map(({ rank, trainee }) => (
                    <OshiCard
                      key={trainee.id}
                      rank={rank}
                      trainee={trainee}
                      mode={mode}
                      totalCount={activeCount}
                      isCompact={isCompact}
                      onOpenActionMenu={onOpenActionMenu}
                      onRemove={onRemove}
                    />
                  ))}
                </Reorder.Group>

                {isCurrentFillingTier && activeCount < 50 && !searchQuery && filterTag === 'ALL' && (
                  <button
                    onClick={() => onOpenModal(activeCount + 1)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 hover:border-pink-500/60 hover:bg-slate-900/50 transition-all text-xs font-bold text-slate-400 hover:text-pink-300 group"
                  >
                    <Plus className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                    <span>Add Rank #{activeCount + 1} Oshi</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* 5. Continuous Fluid Reorder View */
        <div>
          <Reorder.Group
            axis="y"
            values={filteredTrainees.map((s) => s.trainee)}
            onReorder={(newOrderedList) => onReorderList(newOrderedList)}
            className="space-y-2"
          >
            {filteredTrainees.map(({ rank, trainee }) => (
              <OshiCard
                key={trainee.id}
                rank={rank}
                trainee={trainee}
                mode={mode}
                totalCount={activeCount}
                isCompact={isCompact}
                onOpenActionMenu={onOpenActionMenu}
                onRemove={onRemove}
              />
            ))}
          </Reorder.Group>

          {activeCount < 50 && !searchQuery && filterTag === 'ALL' && (
            <button
              onClick={() => onOpenModal(activeCount + 1)}
              className="w-full mt-2 flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#0e1424]/60 border border-dashed border-slate-800 hover:border-pink-500/60 hover:bg-slate-900/50 transition-all text-xs font-bold text-slate-400 hover:text-pink-300 group"
            >
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
              <span>Add Rank #{activeCount + 1} Oshi</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};