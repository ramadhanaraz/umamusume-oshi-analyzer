// components/ViewContainer.tsx
'use client';

import React from 'react';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { OshiSlot, AnalysisResult } from '../utils/calculator';
import { TabType } from './Header';
import { HeroArchetype } from './HeroArchetype';
import { SettingsBar } from './SettingsBar';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { TopFiveOshis } from './TopFiveOshis';
import { RosterView } from './views/RosterView';
import { DatabaseView } from './views/DatabaseView';
import { ArchetypeView } from './views/ArchetypeView';
import { PresetsView } from './views/PresetsView';
import { SorterView } from './views/SorterView';

interface ViewContainerProps {
  // Navigation & Terminology
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mode: TerminologyMode;

  // Settings & Analysis
  weightMode: WeightingMode;
  setWeightMode: (w: WeightingMode) => void;
  filterMode: AptitudeFilterMode;
  setFilterMode: (f: AptitudeFilterMode) => void;
  analysis: AnalysisResult;

  // Roster & Data
  slots: OshiSlot[];
  activeTrainees: { rank: number; trainee: Trainee }[];
  activeCount: number;
  trainees: Trainee[];

  // User Actions
  onSelectSlot: (rank: number) => void;
  onOpenActionMenu: (rank: number) => void;
  onOpenModal: (rank: number) => void;
  onRemove: (rank: number) => void;
  onReorderList: (trainees: Trainee[]) => void;
  onLoadPreset: (presetId: 'spica' | 'newEra' | 'new-era' | 'random') => void;
  onAutoFillRemaining: () => void;
  onClear: () => void;
  onAddTrainee: (trainee: Trainee) => void;
  onOpenExportCard: () => void;
  onShare: () => void;
  onExportCSV: () => void;
  copied: boolean;
  isSharedPreview?: boolean;
}

export const ViewContainer: React.FC<ViewContainerProps> = ({
  activeTab,
  setActiveTab,
  mode,
  weightMode,
  setWeightMode,
  filterMode,
  setFilterMode,
  analysis,
  slots,
  activeTrainees,
  activeCount,
  trainees,
  onSelectSlot,
  onOpenActionMenu,
  onOpenModal,
  onRemove,
  onReorderList,
  onLoadPreset,
  onAutoFillRemaining,
  onClear,
  onAddTrainee,
  onOpenExportCard,
  onShare,
  onExportCSV,
  copied,
  isSharedPreview = false,
}) => {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      {/* 1. Dashboard View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          <HeroArchetype
            archetype={analysis.archetype}
            activeCount={activeCount}
            isReadOnly={isSharedPreview}
            onFillMore={() => setActiveTab('roster')}
          />
          <TopFiveOshis
            slots={slots}
            mode={mode}
            isReadOnly={isSharedPreview}
            onSelectSlot={onSelectSlot}
            onOpenActionMenu={onOpenActionMenu}
            onManageTop50={() => setActiveTab('roster')}
          />
          <SettingsBar
            weightMode={weightMode}
            setWeightMode={setWeightMode}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          />
          <AnalyticsDashboard mode={mode} analysis={analysis} />
        </div>
      )}

      {/* 2. Roster View */}
      {activeTab === 'roster' && (
        <RosterView
          activeTrainees={activeTrainees}
          activeCount={activeCount}
          mode={mode}
          isReadOnly={isSharedPreview}
          onOpenActionMenu={onOpenActionMenu}
          onOpenModal={onOpenModal}
          onRemove={onRemove}
          onReorderList={onReorderList}
          onLoadPreset={onLoadPreset}
          onAutoFillRemaining={onAutoFillRemaining}
          onClear={onClear}
          onGoToDatabase={() => setActiveTab('database')}
          onGoToSorter={() => setActiveTab('sorter')}
        />
      )}

      {/* 3. Database View */}
      {activeTab === 'database' && (
        <DatabaseView
          trainees={trainees}
          activeTraineeIds={activeTrainees.map((s) => s.trainee.id)}
          activeTraineeRanks={activeTrainees.reduce<Record<string, number>>((acc, curr) => {
            acc[curr.trainee.id] = curr.rank;
            return acc;
          }, {})}
          onAddTrainee={onAddTrainee}
          onRemoveTrainee={onRemove}
          mode={mode}
          isReadOnly={isSharedPreview}
          maxSlots={50}
        />
      )}

      {/* 4. Archetype Details View */}
      {activeTab === 'archetype' && (
        <ArchetypeView
          archetype={analysis.archetype}
          mode={mode}
          styleRaw={analysis.styleRaw}
        />
      )}

      {/* 5. Oshi Sorter Matchmaker View */}
      {activeTab === 'sorter' && (
        <SorterView
          trainees={trainees}
          mode={mode}
          activeCount={activeCount}
          onApplyRoster={(sorted50) => {
            onReorderList(sorted50);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* 6. Presets & Backup View */}
      {activeTab === 'presets' && (
        <PresetsView
          onLoadPreset={onLoadPreset}
          onOpenExportCard={onOpenExportCard}
          onShare={onShare}
          onExportCSV={onExportCSV}
          copied={copied}
        />
      )}
    </div>
  );
};