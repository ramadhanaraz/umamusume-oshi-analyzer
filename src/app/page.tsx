// app/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { Eye, ArrowLeft, Save } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { traineeRepository } from '../repositories/traineeRepository';
import { calculateAnalysis } from '../utils/calculator';
import { useRosterStore } from '../stores/useRosterStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useUIStore } from '../stores/useUIStore';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ViewContainer } from '../components/ViewContainer';
import { ModalContainer } from '../components/ModalContainer';
import { Trainee } from '../types/trainee';

function HomeContent() {
  const searchParams = useSearchParams();

  const {
    slots,
    isSharedPreview,
    copied,
    loadRosterFromStorage,
    loadRosterFromUrlParam,
    exitSharedPreview,
    confirmImportShared,
    handleShare,
    selectTraineeForSlot,
    addFirstEmpty,
    removeByRank,
    reorderSlots,
    reorderList,
    clearRoster,
    autoFillRemaining,
    loadPreset,
    exportCSV,
  } = useRosterStore();

  const { weightMode, setWeightMode, filterMode, setFilterMode, mode, setMode, loadSavedSettings } =
    useSettingsStore();

  const {
    activeTab,
    setActiveTab,
    activeSlotRank,
    actionMenuRank,
    openedFromActionMenu,
    isClearModalOpen,
    isImportConfirmOpen,
    isExportOpen,
    setActiveSlotRank,
    setActionMenuRank,
    setOpenedFromActionMenu,
    setIsClearModalOpen,
    setIsImportConfirmOpen,
    setIsExportOpen,
  } = useUIStore();

  const allTrainees = traineeRepository.getAllTraineesSync();

  useEffect(() => {
    loadSavedSettings();
    const sharedParam = searchParams.get('roster') || searchParams.get('r');
    if (sharedParam) {
      const decodedSettings = loadRosterFromUrlParam(sharedParam);
      if (decodedSettings) {
        if (decodedSettings.weightMode) setWeightMode(decodedSettings.weightMode);
        if (decodedSettings.filterMode) setFilterMode(decodedSettings.filterMode);
      }
    } else {
      loadRosterFromStorage();
    }
  }, [searchParams, loadSavedSettings, loadRosterFromUrlParam, loadRosterFromStorage, setWeightMode, setFilterMode]);

  const activeTrainees = slots.filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null);
  const activeCount = activeTrainees.length;
  const analysis = calculateAnalysis(slots, mode, weightMode, filterMode);

  const activeTraineeRanks = activeTrainees.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.trainee.id] = curr.rank;
    return acc;
  }, {});

  const activeMenuTrainee = actionMenuRank ? slots[actionMenuRank - 1]?.trainee : null;

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <div className="sticky top-0 z-40 w-full flex flex-col shadow-xl bg-[#070b16]/95 backdrop-blur-xl border-b border-slate-800/80">
        {isSharedPreview && (
          <div className="w-full bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/30 px-4 py-2.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn select-none">
            <div className="flex items-center gap-2.5 text-amber-300">
              <Eye className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">
                You are viewing a <strong>shared roster from a link</strong>. Your personal Top 50 remains safely saved.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={exitSharedPreview}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Restore My List</span>
              </button>
              <button
                type="button"
                onClick={() => setIsImportConfirmOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as My List</span>
              </button>
            </div>
          </div>
        )}

        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mode={mode}
          isReadOnly={isSharedPreview}
          setMode={setMode}
          activeCount={activeCount}
          totalCount={allTrainees.length}
          onOpenExport={() => setIsExportOpen(true)}
        />
      </div>

      <ViewContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        isSharedPreview={isSharedPreview}
        weightMode={weightMode}
        setWeightMode={setWeightMode}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        analysis={analysis}
        slots={slots}
        activeTrainees={activeTrainees}
        activeCount={activeCount}
        trainees={allTrainees}
        onSelectSlot={(r) => {
          setOpenedFromActionMenu(false);
          setActiveSlotRank(r);
        }}
        onOpenActionMenu={(r) => setActionMenuRank(r)}
        onOpenModal={(r) => {
          setOpenedFromActionMenu(false);
          setActiveSlotRank(r);
        }}
        onRemove={removeByRank}
        onReorderList={reorderList}
        onLoadPreset={loadPreset}
        onAutoFillRemaining={autoFillRemaining}
        onClear={() => activeCount > 0 && setIsClearModalOpen(true)}
        onAddTrainee={addFirstEmpty}
        onOpenExportCard={() => setIsExportOpen(true)}
        onShare={() => handleShare(weightMode, filterMode)}
        onExportCSV={exportCSV}
        copied={copied}
      />

      <Footer />

      <ModalContainer
        trainees={allTrainees}
        slots={slots}
        activeCount={activeCount}
        activeTraineeRanks={activeTraineeRanks}
        analysis={analysis}
        mode={mode}
        weightMode={weightMode}
        filterMode={filterMode}
        isExportOpen={isExportOpen}
        onCloseExport={() => setIsExportOpen(false)}
        activeSlotRank={activeSlotRank}
        openedFromActionMenu={openedFromActionMenu}
        onSelectTrainee={(t) => {
          if (activeSlotRank) {
            selectTraineeForSlot(activeSlotRank, t);
            setActiveSlotRank(null);
            setActionMenuRank(null);
            setOpenedFromActionMenu(false);
          }
        }}
        onCloseTraineeModal={() => {
          setActiveSlotRank(null);
          setOpenedFromActionMenu(false);
        }}
        onBackToActionMenu={() => {
          setActionMenuRank(activeSlotRank);
          setActiveSlotRank(null);
          setOpenedFromActionMenu(false);
        }}
        actionMenuRank={actionMenuRank}
        activeMenuTrainee={activeMenuTrainee}
        onCloseActionMenu={() => setActionMenuRank(null)}
        onChangeTraineeFromAction={(r) => {
          setActionMenuRank(null);
          setActiveSlotRank(r);
          setOpenedFromActionMenu(true);
        }}
        onMoveToRank={reorderSlots}
        onRemoveTrainee={removeByRank}
        isClearModalOpen={isClearModalOpen}
        onCloseClearModal={() => setIsClearModalOpen(false)}
        onConfirmClear={() => {
          clearRoster();
          setIsClearModalOpen(false);
        }}
        isImportConfirmOpen={isImportConfirmOpen}
        onCloseImportConfirm={() => setIsImportConfirmOpen(false)}
        onConfirmImportShared={() => {
          confirmImportShared();
          setIsImportConfirmOpen(false);
        }}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14]" />}>
      <HomeContent />
    </Suspense>
  );
}
