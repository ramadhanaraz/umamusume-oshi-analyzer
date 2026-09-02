// components/ModalContainer.tsx
'use client';

import React from 'react';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { OshiSlot, AnalysisResult } from '../utils/calculator';
import { ExportCardModal } from './modals/ExportCardModal';
import { TraineeModal } from './modals/TraineeModal';
import { CardActionModal } from './modals/CardActionModal';
import { ConfirmModal } from './modals/ConfirmModal';

interface ModalContainerProps {
  trainees: Trainee[];
  slots: OshiSlot[];
  activeCount: number;
  activeTraineeRanks: Record<string, number>;
  analysis: AnalysisResult;
  mode: TerminologyMode;
  weightMode?: WeightingMode;
  filterMode?: AptitudeFilterMode;

  isExportOpen: boolean;
  onCloseExport: () => void;

  activeSlotRank: number | null;
  openedFromActionMenu: boolean;
  onSelectTrainee: (trainee: Trainee) => void;
  onCloseTraineeModal: () => void;
  onBackToActionMenu?: () => void;

  actionMenuRank: number | null;
  activeMenuTrainee: Trainee | null;
  onCloseActionMenu: () => void;
  onChangeTraineeFromAction: (rank: number) => void;
  onMoveToRank: (sourceRank: number, targetRank: number) => void;
  onRemoveTrainee: (rank: number) => void;

  isClearModalOpen: boolean;
  onCloseClearModal: () => void;
  onConfirmClear: () => void;

  isImportConfirmOpen: boolean;
  onCloseImportConfirm: () => void;
  onConfirmImportShared: () => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  trainees,
  slots,
  activeCount,
  activeTraineeRanks,
  analysis,
  mode,
  weightMode = 'tiered',
  filterMode = 'aOnly',
  isExportOpen,
  onCloseExport,
  activeSlotRank,
  openedFromActionMenu,
  onSelectTrainee,
  onCloseTraineeModal,
  onBackToActionMenu,
  actionMenuRank,
  activeMenuTrainee,
  onCloseActionMenu,
  onChangeTraineeFromAction,
  onMoveToRank,
  onRemoveTrainee,
  isClearModalOpen,
  onCloseClearModal,
  onConfirmClear,
  isImportConfirmOpen,
  onCloseImportConfirm,
  onConfirmImportShared,
}) => {
  return (
    <>
      <ExportCardModal
        isOpen={isExportOpen}
        onClose={onCloseExport}
        slots={slots}
        mode={mode}
        weightMode={weightMode}
        filterMode={filterMode}
        archetype={analysis?.archetype}
        stylePct={analysis?.stylePct}
        distPct={analysis?.distPct}
        strategyScores={analysis?.styleRaw}
        distanceScores={analysis?.distanceRaw}
      />

      {activeSlotRank !== null && (
        <TraineeModal
          rank={activeSlotRank}
          trainees={trainees}
          activeTraineeRanks={activeTraineeRanks}
          onSelect={onSelectTrainee}
          onClose={onCloseTraineeModal}
          onBack={openedFromActionMenu ? onBackToActionMenu : undefined}
        />
      )}

      {actionMenuRank !== null && activeMenuTrainee && (
        <CardActionModal
          rank={actionMenuRank}
          trainee={activeMenuTrainee}
          totalCount={activeCount}
          onClose={onCloseActionMenu}
          onChangeTrainee={onChangeTraineeFromAction}
          onMoveToRank={onMoveToRank}
          onRemove={onRemoveTrainee}
        />
      )}

      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Clear Top 50 Roster?"
        description="Are you sure you want to remove all trainees from your Top 50 list? This action will reset all assigned slots and cannot be undone."
        confirmLabel="Clear All Slots"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={onConfirmClear}
        onClose={onCloseClearModal}
      />

      <ConfirmModal
        isOpen={isImportConfirmOpen}
        title="Replace Your Top 50 Roster?"
        description="Saving this shared roster will overwrite your personal Top 50 list stored in this browser. Are you sure you want to proceed?"
        confirmLabel="Save & Overwrite"
        cancelLabel="Keep My List"
        variant="danger"
        onConfirm={onConfirmImportShared}
        onClose={onCloseImportConfirm}
      />
    </>
  );
};