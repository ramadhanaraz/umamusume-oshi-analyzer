'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Trainee, TerminologyMode, TERMINOLOGY } from '../../types/trainee';
import { OshiCard } from '../OshiCard';
import {
  DndContext,
  closestCenter,
  pointerWithin,
  CollisionDetection,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
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
  onReorderList: (reorderedTrainees: Trainee[]) => void;
  onLoadPreset: (type: 'random') => void;
  onAutoFillRemaining: () => void;
  onClear: () => void;
  onGoToDatabase: () => void;
}

type AptitudeFilterTag = 'TURF' | 'DIRT' | 'FRONT' | 'PACE' | 'LATE' | 'END' | 'SHORT' | 'MILE' | 'MEDIUM' | 'LONG';

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
    name: 'I was born for dem Oshis',
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
  onReorderList,
  onLoadPreset,
  onAutoFillRemaining,
  onClear,
  onGoToDatabase,
}) => {
  const [viewStyle, setViewStyle] = useState<'tiered' | 'continuous'>('tiered');
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<AptitudeFilterTag[]>([]);

  const [orderedTrainees, setOrderedTrainees] = useState<Trainee[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const isFiltering = searchQuery !== '' || selectedFilters.length > 0;
  const dict = TERMINOLOGY[mode];

  const fullTraineeList = useMemo(() => activeTrainees.map((s) => s.trainee), [activeTrainees]);

  const matchesTag = useCallback((trainee: Trainee, tag: AptitudeFilterTag): boolean => {
    switch (tag) {
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
      default:
        return true;
    }
  }, []);

  // Filtered source trainees
  const baseFilteredTrainees = useMemo(() => {
    return activeTrainees.filter(({ trainee }) => {
      const matchesSearch =
        searchQuery === '' ||
        trainee.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainee.nameJp.includes(searchQuery);

      if (!matchesSearch) return false;

      if (selectedFilters.length > 0) {
        return selectedFilters.every((tag) => matchesTag(trainee, tag));
      }

      return true;
    });
  }, [activeTrainees, searchQuery, selectedFilters, matchesTag]);

  // Master slot positions for filtered sub-array projection
  const filteredMasterIndices = useMemo(() => {
    return baseFilteredTrainees.map(({ rank }) => rank - 1);
  }, [baseFilteredTrainees]);

  // Sync state only when not dragging
  useEffect(() => {
    if (!activeDragId) {
      setOrderedTrainees(baseFilteredTrainees.map((item) => item.trainee));
    }
  }, [baseFilteredTrainees, activeDragId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const collisionDetectionStrategy: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
  }, []);

  const handleToggleFilter = (tag: AptitudeFilterTag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  // Immediate in-memory reordering during drag
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedTrainees((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        return arrayMove(prev, oldIndex, newIndex);
      }
      return prev;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    let finalOrder = orderedTrainees;
    if (over && active.id !== over.id) {
      const oldIndex = orderedTrainees.findIndex((t) => t.id === active.id);
      const newIndex = orderedTrainees.findIndex((t) => t.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        finalOrder = arrayMove(orderedTrainees, oldIndex, newIndex);
      }
    }

    if (!isFiltering) {
      onReorderList(finalOrder);
    } else {
      const updatedMaster = [...fullTraineeList];
      filteredMasterIndices.forEach((masterIdx, i) => {
        if (finalOrder[i]) {
          updatedMaster[masterIdx] = finalOrder[i];
        }
      });
      onReorderList(updatedMaster);
    }
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
    setOrderedTrainees(baseFilteredTrainees.map((item) => item.trainee));
  };

  // Map trainees to their live calculated rank positions
  const renderedItems = useMemo(() => {
    return orderedTrainees.map((trainee, index) => {
      const rank = isFiltering
        ? filteredMasterIndices[index] + 1
        : index + 1;
      return { rank, trainee };
    });
  }, [orderedTrainees, isFiltering, filteredMasterIndices]);

  // Live dynamic rank for the floating DragOverlay
  const activeOverlayData = useMemo(() => {
    if (!activeDragId) return null;
    const currentIndex = orderedTrainees.findIndex((t) => t.id === activeDragId);
    if (currentIndex === -1) return null;

    const trainee = orderedTrainees[currentIndex];
    const liveRank = isFiltering
      ? filteredMasterIndices[currentIndex] + 1
      : currentIndex + 1;

    return { rank: liveRank, trainee };
  }, [activeDragId, orderedTrainees, isFiltering, filteredMasterIndices]);

  const filterChips: { id: AptitudeFilterTag; label: string }[] = [
    { id: 'TURF', label: dict.surface.turf },
    { id: 'DIRT', label: dict.surface.dirt },
    { id: 'FRONT', label: dict.style.front },
    { id: 'PACE', label: dict.style.pace },
    { id: 'LATE', label: dict.style.late },
    { id: 'END', label: dict.style.end },
    { id: 'SHORT', label: dict.distance.short },
    { id: 'MILE', label: dict.distance.mile },
    { id: 'MEDIUM', label: dict.distance.medium },
    { id: 'LONG', label: dict.distance.long },
  ];

  return (
    <div className="space-y-4 w-full animate-fadeIn">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-[#0e1424] p-4 sm:p-5 rounded-3xl border border-slate-800/90 shadow-xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white">Top 50 Oshi Ranking List</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFiltering
              ? 'Sorting filtered items within their current ranks'
              : 'Drag handles to smoothly reorder across all ranks & tiers'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
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

          {/* Fill Rest */}
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

      {/* 2. Search & Filter Bar */}
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

            {isFiltering && (
              <div className="text-[11px] text-slate-400 font-semibold px-2 shrink-0">
                Showing <strong className="text-pink-400">{renderedItems.length}</strong> of {activeCount}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-2 pt-0.5">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1">
              Filter:
            </span>

            <button
              onClick={handleClearFilters}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                selectedFilters.length === 0
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              All
            </button>

            {filterChips.map((chip) => {
              const isSelected = selectedFilters.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => handleToggleFilter(chip.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Empty State or DND Lists */}
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
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={orderedTrainees.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {viewStyle === 'tiered' ? (
              <div className="space-y-6">
                {TIERS.map((tier) => {
                  const tierTrainees = renderedItems.filter(
                    (t) => t.rank >= tier.minRank && t.rank <= tier.maxRank
                  );
                  const isCurrentFillingTier =
                    activeCount + 1 >= tier.minRank && activeCount + 1 <= tier.maxRank;

                  if (tierTrainees.length === 0 && (!isCurrentFillingTier || isFiltering)) {
                    return null;
                  }

                  const maxInTier = tier.maxRank - tier.minRank + 1;

                  return (
                    <div
                      key={tier.id}
                      className={`p-4 sm:p-5 rounded-3xl bg-[#0e1424] border ${tier.accentBorder} shadow-xl space-y-3.5`}
                    >
                      <div className={`p-3 sm:px-4 rounded-2xl ${tier.headerBg} border border-slate-800/60 flex flex-wrap items-center justify-between gap-2 shadow-sm`}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl select-none">{tier.badgeEmoji}</span>
                          <h3 className={`text-sm font-black ${tier.textColor}`}>
                            {tier.name}
                            <span className="text-xs font-semibold text-slate-400 ml-2">
                              (Rank {tier.minRank}–{tier.maxRank})
                            </span>
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${tier.pillBg}`}>
                            {tier.multiplier}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            {isFiltering ? `${tierTrainees.length} matches` : `${tierTrainees.length} / ${maxInTier}`}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-0.5">
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

                        {isCurrentFillingTier && activeCount < 50 && !isFiltering && (
                          <button
                            onClick={() => onOpenModal(activeCount + 1)}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 hover:border-pink-500/60 hover:bg-slate-900/50 transition-all text-xs font-bold text-slate-400 hover:text-pink-300 group"
                          >
                            <Plus className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                            <span>Add Rank #{activeCount + 1} Oshi</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5">
                {renderedItems.map(({ rank, trainee }) => (
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

                {activeCount < 50 && !isFiltering && (
                  <button
                    onClick={() => onOpenModal(activeCount + 1)}
                    className="w-full mt-2.5 flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0e1424]/60 border border-dashed border-slate-800 hover:border-pink-500/60 hover:bg-slate-900/50 transition-all text-xs font-bold text-slate-400 hover:text-pink-300 group"
                  >
                    <Plus className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                    <span>Add Rank #{activeCount + 1} Oshi</span>
                  </button>
                )}
              </div>
            )}
          </SortableContext>

          {/* Floating Drag Overlay with Live Dynamic Rank */}
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.3',
                  },
                },
              }),
            }}
          >
            {activeOverlayData ? (
              <OshiCard
                rank={activeOverlayData.rank}
                trainee={activeOverlayData.trainee}
                mode={mode}
                totalCount={activeCount}
                isCompact={isCompact}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};