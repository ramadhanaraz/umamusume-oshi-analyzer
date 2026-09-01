// ViewContainer.tsx
'use client';

import React from 'react';
import { TabType } from './Header';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { RosterView } from './views/RosterView';
import { DatabaseView } from './views/DatabaseView';
import { ArchetypeView } from './views/ArchetypeView';
import { SorterView } from './views/SorterView';
import { PresetsView } from './views/PresetsView';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { OshiSlot, AnalysisResult } from '../utils/calculator';

interface ViewContainerProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mode: TerminologyMode;
  isSharedPreview: boolean;
  weightMode: WeightingMode;
  setWeightMode: (m: WeightingMode) => void;
  filterMode: AptitudeFilterMode;
  setFilterMode: (m: AptitudeFilterMode) => void;
  analysis: AnalysisResult;
  slots: OshiSlot[];
  activeTrainees: { rank: number; trainee: Trainee }[];
  activeCount: number;
  trainees: Trainee[];
  onSelectSlot: (rank: number) => void;
  onOpenActionMenu: (rank: number) => void;
  onOpenModal: (rank: number) => void;
  onRemove: (rank: number) => void;
  onReorderList: (newTrainees: Trainee[]) => void;
  onLoadPreset: (type: 'spica' | 'newEra' | 'random') => void;
  onAutoFillRemaining: () => void;
  onClear: () => void;
  onAddTrainee: (trainee: Trainee) => void;
  onOpenExportCard: () => void;
  onShare: () => void;
  onExportCSV: () => void;
  copied: boolean;
}

export const ViewContainer: React.FC<ViewContainerProps> = ({
  activeTab,
  setActiveTab,
  mode,
  isSharedPreview,
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
}) => {
  const activeTraineeRanks = activeTrainees.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.trainee.id] = curr.rank;
    return acc;
  }, {});

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
      {activeTab === 'dashboard' && (
        <AnalyticsDashboard
          analysis={analysis}
          mode={mode}
        />
      )}

      {activeTab === 'roster' && (
        <RosterView
          slots={slots}
          activeCount={activeCount}
          mode={mode}
          isReadOnly={isSharedPreview}
          copied={copied}
          onSelectSlot={onSelectSlot}
          onOpenActionMenu={onOpenActionMenu}
          onRemove={onRemove}
          onReorderList={onReorderList}
          onAutoFillRemaining={onAutoFillRemaining}
          onClear={onClear}
          onShare={onShare}
          onExportCSV={onExportCSV}
          onOpenExportCard={onOpenExportCard}
        />
      )}

      {activeTab === 'database' && (
        <DatabaseView
          trainees={trainees}
          activeTraineeRanks={activeTraineeRanks}
          mode={mode}
          onAddTrainee={onAddTrainee}
        />
      )}

      {activeTab === 'archetype' && (
        <ArchetypeView
          analysis={analysis}
          activeTrainees={activeTrainees}
          mode={mode}
        />
      )}

      {activeTab === 'sorter' && (
        <SorterView
          trainees={trainees}
          mode={mode}
          activeCount={activeCount}
          onApplyRoster={(sortedList) => {
            onReorderList(sortedList);
            setActiveTab('roster');
          }}
        />
      )}

      {activeTab === 'presets' && (
        <PresetsView
          onLoadPreset={(type) => {
            onLoadPreset(type);
            setActiveTab('roster');
          }}
        />
      )}
    </div>
  );
};
