'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Check, Star, Users, Trash2 } from 'lucide-react';
import { Trainee, TerminologyMode, TERMINOLOGY } from '../../types/trainee';
import { getGradeBadgeStyle } from '../../utils/gradeStyles';

export type AptitudeFilterTag =
  | 'turf'
  | 'dirt'
  | 'front'
  | 'pace'
  | 'late'
  | 'end'
  | 'short'
  | 'mile'
  | 'medium'
  | 'long';

interface DatabaseViewProps {
  trainees: Trainee[];
  activeTraineeIds: string[];
  activeTraineeRanks?: Record<string, number>;
  onAddTrainee: (trainee: Trainee) => void;
  onRemoveTrainee?: (rank: number) => void;
  mode?: TerminologyMode;
  maxSlots?: number;
  isReadOnly?: boolean;
}

// 1★ Bronze, 2★ Silver, 3★ Gold Theme Resolver
const getRarityTheme = (rarity: 1 | 2 | 3 = 3) => {
  if (rarity === 1) {
    return {
      badge: 'bg-amber-950/40 border-amber-700/60 text-amber-500',
      star: 'fill-amber-500 text-amber-500',
      label: '1★',
    };
  }
  if (rarity === 2) {
    return {
      badge: 'bg-slate-400/15 border-slate-400/40 text-slate-200',
      star: 'fill-slate-300 text-slate-300',
      label: '2★',
    };
  }
  return {
    badge: 'bg-amber-400/10 border-amber-400/40 text-amber-300',
    star: 'fill-amber-300 text-amber-300',
    label: '3★',
  };
};

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  trainees = [],
  activeTraineeIds = [],
  activeTraineeRanks = {},
  onAddTrainee,
  onRemoveTrainee,
  mode = 'global',
  maxSlots = 50,
  isReadOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<AptitudeFilterTag[]>([]);

  const dict = TERMINOLOGY[mode] || TERMINOLOGY.global;
  const isFiltering = searchQuery.trim() !== '' || selectedFilters.length > 0;
  const isRosterFull = activeTraineeIds.length >= maxSlots;

  const isAptitudeViable = (tag: AptitudeFilterTag, trainee: Trainee): boolean => {
    switch (tag) {
      case 'turf':
        return ['S', 'A'].includes(trainee.surface.turf);
      case 'dirt':
        return ['S', 'A', 'B'].includes(trainee.surface.dirt);
      case 'front':
        return ['S', 'A'].includes(trainee.style.front);
      case 'pace':
        return ['S', 'A'].includes(trainee.style.pace);
      case 'late':
        return ['S', 'A'].includes(trainee.style.late);
      case 'end':
        return ['S', 'A'].includes(trainee.style.end);
      case 'short':
        return ['S', 'A'].includes(trainee.distance.short);
      case 'mile':
        return ['S', 'A'].includes(trainee.distance.mile);
      case 'medium':
        return ['S', 'A'].includes(trainee.distance.medium);
      case 'long':
        return ['S', 'A'].includes(trainee.distance.long);
      default:
        return true;
    }
  };

  const handleToggleFilter = (tag: AptitudeFilterTag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const filteredTrainees = useMemo(() => {
    return trainees.filter((trainee) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchEn = trainee.nameEn?.toLowerCase().includes(q);
        const matchJp = trainee.nameJp?.includes(q);
        if (!matchEn && !matchJp) return false;
      }

      if (selectedFilters.length === 0) return true;

      const surfaceFilters = selectedFilters.filter((f) => ['turf', 'dirt'].includes(f));
      const styleFilters = selectedFilters.filter((f) => ['front', 'pace', 'late', 'end'].includes(f));
      const distanceFilters = selectedFilters.filter((f) => ['short', 'mile', 'medium', 'long'].includes(f));

      if (surfaceFilters.length > 0) {
        const matchSurface = surfaceFilters.some((tag) => isAptitudeViable(tag, trainee));
        if (!matchSurface) return false;
      }

      if (styleFilters.length > 0) {
        const matchStyle = styleFilters.some((tag) => isAptitudeViable(tag, trainee));
        if (!matchStyle) return false;
      }

      if (distanceFilters.length > 0) {
        const matchDistance = distanceFilters.some((tag) => isAptitudeViable(tag, trainee));
        if (!matchDistance) return false;
      }

      return true;
    });
  }, [trainees, searchQuery, selectedFilters]);

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
    <div className="space-y-4 w-full animate-fadeIn select-none">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-[#0e1424] p-4 sm:p-5 rounded-3xl border border-slate-800/90 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-inner shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              All Playable Roster
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse and pick from all {trainees.length} official playable trainees
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Top 50 Roster:</span>
          <span className="font-mono font-black text-pink-400">
            {activeTraineeIds.length} / {maxSlots}
          </span>
        </div>
      </div>

      {/* Sticky Database Filter Header (Mobile Optimized) */}
      <div className="sticky top-[185px] sm:top-[116px] md:top-[120px] z-30 py-1.5 sm:py-3 pb-2 sm:pb-5 bg-[#070b16]/95 backdrop-blur-md shadow-[0_12px_24px_-10px_rgba(7,11,22,0.95)] transition-all">
        <div className="p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl space-y-2 sm:space-y-3">
          {/* Search Input & Counter */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by English or Japanese name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-2 sm:top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-[10px] sm:text-[11px] font-mono font-semibold px-1 sm:px-2 shrink-0 text-right text-slate-400">
              <strong className={isFiltering ? 'text-pink-400 font-bold' : 'text-white'}>
                {filteredTrainees.length}
              </strong>
              <span className="text-slate-500">/{trainees.length}</span>
            </div>
          </div>

          {/* Horizontally Scrollable Filter Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto custom-scrollbar pb-1 pt-0.5 text-[10px] sm:text-[11px] touch-pan-x">
            <button
              type="button"
              onClick={handleClearFilters}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
                selectedFilters.length === 0
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/25'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              All
            </button>

            <div className="h-4 sm:h-5 w-px bg-slate-800 shrink-0" />

            {/* Surface */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 bg-slate-950/50 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-800/60">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1.5 sm:px-2">
                Surface:
              </span>
              {(
                [
                  { id: 'turf', label: 'Turf', emoji: '🌿' },
                  { id: 'dirt', label: 'Dirt', emoji: '🏜️' },
                ] as const
              ).map((chip) => {
                const isSelected = selectedFilters.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleToggleFilter(chip.id)}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-4 sm:h-5 w-px bg-slate-800 shrink-0" />

            {/* Style */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 bg-slate-950/50 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-800/60">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1.5 sm:px-2">
                Style:
              </span>
              {(
                [
                  { id: 'front', label: mode === 'jp' ? '逃げ (FR)' : 'Front' },
                  { id: 'pace', label: mode === 'jp' ? '先行 (PC)' : 'Pace' },
                  { id: 'late', label: mode === 'jp' ? '差し (LS)' : 'Late' },
                  { id: 'end', label: mode === 'jp' ? '追込 (EC)' : 'End' },
                ] as const
              ).map((chip) => {
                const isSelected = selectedFilters.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleToggleFilter(chip.id)}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="h-4 sm:h-5 w-px bg-slate-800 shrink-0" />

            {/* Distance */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 bg-slate-950/50 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-800/60">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1.5 sm:px-2">
                Dist:
              </span>
              {(
                [
                  { id: 'short', label: mode === 'jp' ? '短距離 (SP)' : 'Sprint' },
                  { id: 'mile', label: mode === 'jp' ? 'マイル (MI)' : 'Mile' },
                  { id: 'medium', label: mode === 'jp' ? '中距離 (MD)' : 'Medium' },
                  { id: 'long', label: mode === 'jp' ? '長距離 (LG)' : 'Long' },
                ] as const
              ).map((chip) => {
                const isSelected = selectedFilters.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleToggleFilter(chip.id)}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Database Grid Showcase */}
      {filteredTrainees.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl flex flex-col items-center justify-center text-center space-y-3">
          <div className="text-4xl select-none">🔍</div>
          <h3 className="text-base font-black text-white">No Trainees Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            No characters match your current search query or active filter criteria.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredTrainees.map((trainee) => {
            const isInRoster = activeTraineeIds.includes(trainee.id);
            const assignedRank = activeTraineeRanks[trainee.id];
            const displayName = mode === 'jp' ? trainee.nameJp || trainee.nameEn : trainee.nameEn;
            const subName = mode === 'jp' ? trainee.nameEn : trainee.nameJp;

            const rarityTheme = getRarityTheme(trainee.baseRarity);

            return (
              <div
                key={trainee.id}
                className={`p-4 rounded-3xl bg-[#0b101e]/90 border transition-all flex flex-col justify-between space-y-3.5 ${
                  isInRoster
                    ? 'border-emerald-500/40 bg-[#0c1626]/80 shadow-md ring-1 ring-emerald-500/10'
                    : 'border-slate-800/90 hover:border-slate-700/90 hover:bg-[#0e1424]'
                }`}
              >
                {/* Card Top: Portrait, Name & Base Star Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0 shadow-md">
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
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          {trainee.emoji || '🐴'}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-white truncate tracking-tight">
                        {displayName}
                      </h4>
                      {subName && (
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {subName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-0.5 px-2 py-0.5 rounded-lg border text-[10px] font-black shrink-0 ${rarityTheme.badge}`}
                  >
                    <Star className={`w-3 h-3 ${rarityTheme.star}`} />
                    <span>{rarityTheme.label}</span>
                  </div>
                </div>

                {/* Card Middle: Surface & 2x4 Aptitude Grid */}
                <div className="space-y-2 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between font-mono text-[10px] pb-1 border-b border-slate-800/60">
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

                  <div className="space-y-1 font-mono text-center">
                    {/* Row 1: Running Styles */}
                    <div className="grid grid-cols-4 gap-1">
                      {(['front', 'pace', 'late', 'end'] as const).map((key) => {
                        const grade = trainee.style?.[key] || 'G';
                        return (
                          <div
                            key={key}
                            className={`py-0.5 rounded border text-[9px] font-bold flex items-center justify-center gap-0.5 ${getGradeBadgeStyle(
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
                            className={`py-0.5 rounded border text-[9px] font-bold flex items-center justify-center gap-0.5 ${getGradeBadgeStyle(
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
                </div>

                {/* Card Bottom: In-Roster Status & Quick Remove */}
                <div>
                  {isInRoster ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>In Top 50 {assignedRank ? `(#${assignedRank})` : ''}</span>
                      </div>

                      {/* Quick Trash Button (Hidden in Read-Only Mode) */}
                      {!isReadOnly && assignedRank && onRemoveTrainee && (
                        <button
                          type="button"
                          onClick={() => onRemoveTrainee(assignedRank)}
                          title={`Remove ${displayName} (#${assignedRank}) from Top 50`}
                          aria-label={`Remove ${displayName} from Top 50`}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-all active:scale-90 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isRosterFull || isReadOnly}
                      onClick={() => !isReadOnly && onAddTrainee(trainee)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        isReadOnly
                          ? 'bg-slate-900/60 border border-slate-800 text-slate-500 cursor-not-allowed'
                          : isRosterFull
                          ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/25 active:scale-95'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>
                        {isReadOnly
                          ? 'Read Only (Shared Roster)'
                          : isRosterFull
                          ? 'Top 50 Full'
                          : 'Add to Top 50'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};