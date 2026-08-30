'use client';

import { useState, Suspense } from 'react';
import { Eye, ArrowLeft, Save } from 'lucide-react';
import { TRAINEES } from '../data/trainees';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { calculateAnalysis } from '../utils/calculator';
import { useRosterHydration } from '../hooks/useRosterHydration';
import { Header, TabType } from '../components/Header';
import { Footer } from '../components/Footer';
import { ViewContainer } from '../components/ViewContainer';
import { ModalContainer } from '../components/ModalContainer';

const TOTAL_SLOTS = 50;

function HomeContent() {
  const {
    slots,
    setSlots,
    isSharedPreview,
    copied,
    exitPreview,
    confirmImportShared,
    handleShare,
  } = useRosterHydration();

  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mode, setMode] = useState<TerminologyMode>('global');
  const [weightMode, setWeightMode] = useState<WeightingMode>('tiered');
  const [filterMode, setFilterMode] = useState<AptitudeFilterMode>('aOnly');

  // Modal Open / Focus States
  const [activeSlotRank, setActiveSlotRank] = useState<number | null>(null);
  const [actionMenuRank, setActionMenuRank] = useState<number | null>(null);
  const [openedFromActionMenu, setOpenedFromActionMenu] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Derived Roster & Analysis States
  const activeTrainees = slots.filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null);
  const activeCount = activeTrainees.length;
  const analysis = calculateAnalysis(slots, mode, weightMode, filterMode);

  const activeTraineeRanks = activeTrainees.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.trainee.id] = curr.rank;
    return acc;
  }, {});

  const activeMenuTrainee = actionMenuRank ? slots[actionMenuRank - 1]?.trainee : null;

  // Handlers
  const handleSelectTrainee = (trainee: Trainee) => {
    if (!activeSlotRank) return;
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const existingIndex = current.findIndex((t) => t.id === trainee.id);

    if (existingIndex !== -1) {
      if (activeSlotRank <= current.length) {
        const temp = current[activeSlotRank - 1];
        current[activeSlotRank - 1] = current[existingIndex];
        current[existingIndex] = temp;
      } else {
        current.splice(existingIndex, 1);
        current.push(trainee);
      }
    } else {
      if (activeSlotRank <= current.length) {
        current[activeSlotRank - 1] = trainee;
      } else {
        current.push(trainee);
      }
    }

    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
    setActiveSlotRank(null);
    setActionMenuRank(null);
    setOpenedFromActionMenu(false);
  };

  const handleAddFirstEmpty = (trainee: Trainee) => {
    if (activeCount >= TOTAL_SLOTS) return alert('Your Top 50 roster is full!');
    if (activeTraineeRanks[trainee.id] !== undefined) {
      return alert(`${trainee.nameEn} is already in your Top 50 at Rank #${activeTraineeRanks[trainee.id]}!`);
    }
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    current.push(trainee);
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  };

  const handleRemove = (rank: number) => {
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    current.splice(rank - 1, 1);
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  };

  const handleReorder = (sourceRank: number, targetRank: number) => {
    if (sourceRank === targetRank || targetRank < 1 || targetRank > activeCount) return;
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const [moved] = current.splice(sourceRank - 1, 1);
    current.splice(targetRank - 1, 0, moved);
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  };

  const handleReorderList = (newTrainees: Trainee[]) => {
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: newTrainees[i] || null })));
  };

  const handleConfirmClear = () => {
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: null })));
    setIsClearModalOpen(false);
  };

  const handleAutoFillRemaining = () => {
    const currentList = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    if (currentList.length >= TOTAL_SLOTS) return;

    const chosenIds = new Set(currentList.map((t) => t.id));
    const available = TRAINEES.filter((t) => !chosenIds.has(t.id)).sort(() => 0.5 - Math.random());
    const needed = TOTAL_SLOTS - currentList.length;
    const toAdd = available.slice(0, needed);
    const fullList = [...currentList, ...toAdd];

    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: fullList[i] || null })));
  };

  const handleLoadPreset = (type: 'spica' | 'newEra' | 'new-era' | 'random') => {
    let selected: Trainee[] = [];
    if (type === 'newEra' || type === 'new-era') {
      const ids = ['epiphaneia', 'fusaichi-pandora', 'rulership', 'curren-bouquetdor', 'gentildonna', 'red-desire', 'daring-heart', 'admire-groove', 'lucky-lilac', 'north-flight', 'victoire-pisa', 'loves-only-you', 'almond-eye', 'sounds-of-earth', 'kiseki', 'bubble-gum-fellow', 'stay-gold', 'nakayama-festa', 'dream-journey', 'buena-vista'];
      selected = TRAINEES.filter((t) => ids.includes(t.id));
    } else if (type === 'spica') {
      const ids = ['special-week', 'silence-suzuka', 'tokai-teio', 'vodka', 'daiwa-scarlet', 'gold-ship', 'mejiro-mcqueen', 'symboli-rudolf', 'air-groove', 'narita-brian', 'rice-shower', 'grass-wonder', 'el-condor-pasa', 'taiki-shuttle', 'oguri-cap', 'twin-turbo', 'nice-nature', 'king-halo', 'winning-ticket', 'agnes-tachyon'];
      selected = TRAINEES.filter((t) => ids.includes(t.id));
    } else {
      selected = [...TRAINEES].sort(() => 0.5 - Math.random()).slice(0, TOTAL_SLOTS);
    }
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: selected[i] || null })));
  };

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name (EN)', 'Name (JP)', 'Turf', 'Dirt', 'Short', 'Mile', 'Medium', 'Long', 'Front', 'Pace', 'Late', 'End'];
    const rows = activeTrainees.map((s) => [
      s.rank, `"${s.trainee.nameEn}"`, `"${s.trainee.nameJp}"`,
      s.trainee.surface.turf, s.trainee.surface.dirt,
      s.trainee.distance.short, s.trainee.distance.mile,
      s.trainee.distance.medium, s.trainee.distance.long,
      s.trainee.style.front, s.trainee.style.pace,
      s.trainee.style.late, s.trainee.style.end,
    ]);
    const link = document.createElement('a');
    link.href = encodeURI('data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n'));
    link.download = 'umamusume_top50_oshis.csv';
    link.click();
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Unified Sticky App Header & Banner Container */}
      <div className="sticky top-0 z-40 w-full flex flex-col shadow-xl bg-[#070b16]/95 backdrop-blur-xl border-b border-slate-800/80">
        
        {/* Shared Link Banner */}
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
                onClick={exitPreview}
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

        {/* Global Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mode={mode}
          isReadOnly={isSharedPreview}
          setMode={setMode}
          activeCount={activeCount}
          totalCount={TRAINEES.length}
          onOpenExport={() => setIsExportOpen(true)}
        />
      </div>

      {/* Active Tab Views */}
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
        trainees={TRAINEES}
        onSelectSlot={(r) => {
          setOpenedFromActionMenu(false);
          setActiveSlotRank(r);
        }}
        onOpenActionMenu={(r) => setActionMenuRank(r)}
        onOpenModal={(r) => {
          setOpenedFromActionMenu(false);
          setActiveSlotRank(r);
        }}
        onRemove={handleRemove}
        onReorderList={handleReorderList}
        onLoadPreset={handleLoadPreset}
        onAutoFillRemaining={handleAutoFillRemaining}
        onClear={() => activeCount > 0 && setIsClearModalOpen(true)}
        onAddTrainee={handleAddFirstEmpty}
        onOpenExportCard={() => setIsExportOpen(true)}
        onShare={handleShare}
        onExportCSV={handleExportCSV}
        copied={copied}
      />

      {/* Global Footer */}
      <Footer />

      {/* Modals Suite */}
      <ModalContainer
        trainees={TRAINEES}
        slots={slots}
        activeCount={activeCount}
        activeTraineeRanks={activeTraineeRanks}
        analysis={analysis}
        mode={mode}
        isExportOpen={isExportOpen}
        onCloseExport={() => setIsExportOpen(false)}
        activeSlotRank={activeSlotRank}
        openedFromActionMenu={openedFromActionMenu}
        onSelectTrainee={handleSelectTrainee}
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
        onMoveToRank={handleReorder}
        onRemoveTrainee={handleRemove}
        isClearModalOpen={isClearModalOpen}
        onCloseClearModal={() => setIsClearModalOpen(false)}
        onConfirmClear={handleConfirmClear}
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