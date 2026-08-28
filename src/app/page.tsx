'use client';

import React, { useState, useEffect } from 'react';
import { TRAINEES } from '../data/trainees';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode, TERMINOLOGY } from '../types/trainee';
import { OshiSlot, calculateAnalysis, encodeRosterToUrl, decodeRosterFromUrl } from '../utils/calculator';
import { Header, TabType } from '../components/Header';
import { HeroArchetype } from '../components/HeroArchetype';
import { SettingsBar } from '../components/SettingsBar';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { TopFiveOshis } from '../components/TopFiveOshis';
import { RosterView } from '../components/views/RosterView';
import { DatabaseView } from '../components/views/DatabaseView';
import { ArchetypeView } from '../components/views/ArchetypeView';
import { PresetsView } from '../components/views/PresetsView';
import { TraineeModal } from '../components/TraineeModal';
import { CardActionModal } from '../components/CardActionModal';
import { ConfirmModal } from '../components/ConfirmModal';

export default function Home() {
  const [slots, setSlots] = useState<OshiSlot[]>(
    Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null }))
  );
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mode, setMode] = useState<TerminologyMode>('global');
  const [weightMode, setWeightMode] = useState<WeightingMode>('tiered');
  const [filterMode, setFilterMode] = useState<AptitudeFilterMode>('aOnly');
  const [activeSlotRank, setActiveSlotRank] = useState<number | null>(null);
  const [actionMenuRank, setActionMenuRank] = useState<number | null>(null);
  const [openedFromActionMenu, setOpenedFromActionMenu] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const compressed = new URLSearchParams(window.location.search).get('r');
    if (compressed) {
      const decoded = decodeRosterFromUrl(compressed, TRAINEES);
      if (decoded.length > 0) {
        setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: decoded[i] || null })));
      }
    }
  }, []);

  const activeTrainees = slots.filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null);
  const activeCount = activeTrainees.length;
  const analysis = calculateAnalysis(slots, mode, weightMode, filterMode);
  const labels = TERMINOLOGY[mode];

  const activeTraineeRanks = activeTrainees.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.trainee.id] = curr.rank;
    return acc;
  }, {});

  // Handles both new assignments and automatic rank-swapping for existing trainees
  const handleSelectTrainee = (trainee: Trainee) => {
    if (!activeSlotRank) return;
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const existingIndex = current.findIndex((t) => t.id === trainee.id);

    if (existingIndex !== -1) {
      if (activeSlotRank <= current.length) {
        // Swap trainees between the two ranks
        const temp = current[activeSlotRank - 1];
        current[activeSlotRank - 1] = current[existingIndex];
        current[existingIndex] = temp;
      } else {
        // Move trainee to the end of the list
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

    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
    setActiveSlotRank(null);
    setActionMenuRank(null);
    setOpenedFromActionMenu(false);
  };

  const handleAddFirstEmpty = (trainee: Trainee) => {
    if (activeCount >= 50) return alert('Your Top 50 roster is full!');
    if (activeTraineeRanks[trainee.id] !== undefined) {
      return alert(`${trainee.nameEn} is already in your Top 50 at Rank #${activeTraineeRanks[trainee.id]}!`);
    }
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    current.push(trainee);
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  };

  const handleRemove = (rank: number) => {
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    current.splice(rank - 1, 1);
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  };

  const handleMove = (rank: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? rank - 1 : rank + 1;
    if (target < 1 || target > activeCount) return;
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const temp = current[rank - 1];
    current[rank - 1] = current[target - 1];
    current[target - 1] = temp;
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  };

  const handleReorder = (sourceRank: number, targetRank: number) => {
    if (sourceRank === targetRank || targetRank < 1 || targetRank > activeCount) return;
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const [moved] = current.splice(sourceRank - 1, 1);
    current.splice(targetRank - 1, 0, moved);
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  };

  const handleReorderList = (newTrainees: Trainee[]) => {
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: newTrainees[i] || null })));
  };

  const handleTriggerClear = () => {
    if (activeCount > 0) {
      setIsClearModalOpen(true);
    }
  };
  
  const handleConfirmClear = () => {
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null })));
  };

  const handleAutoFillRemaining = () => {
    const currentList = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    if (currentList.length >= 50) return;

    const chosenIds = new Set(currentList.map((t) => t.id));
    const available = TRAINEES.filter((t) => !chosenIds.has(t.id)).sort(() => 0.5 - Math.random());
    const needed = 50 - currentList.length;
    const toAdd = available.slice(0, needed);
    const fullList = [...currentList, ...toAdd];

    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: fullList[i] || null })));
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

  const handleLoadPreset = (type: 'spica' | 'newEra' | 'random') => {
    let selected: Trainee[] = [];
    if (type === 'newEra') {
      const ids = ['epiphaneia', 'fusaichi-pandora', 'rulership', 'curren-bouquetdor', 'gentildonna', 'red-desire', 'daring-heart', 'admire-groove', 'lucky-lilac', 'north-flight', 'victoire-pisa', 'loves-only-you', 'almond-eye', 'sounds-of-earth', 'kiseki', 'bubble-gum-fellow', 'stay-gold', 'nakayama-festa', 'dream-journey', 'buena-vista'];
      selected = TRAINEES.filter((t) => ids.includes(t.id));
    } else if (type === 'spica') {
      const ids = ['special-week', 'silence-suzuka', 'tokai-teio', 'vodka', 'daiwa-scarlet', 'gold-ship', 'mejiro-mcqueen', 'symboli-rudolf', 'air-groove', 'narita-brian', 'rice-shower', 'grass-wonder', 'el-condor-pasa', 'taiki-shuttle', 'oguri-cap', 'twin-turbo', 'nice-nature', 'king-halo', 'winning-ticket', 'agnes-tachyon'];
      selected = TRAINEES.filter((t) => ids.includes(t.id));
    } else {
      selected = [...TRAINEES].sort(() => 0.5 - Math.random()).slice(0, 50);
    }
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: selected[i] || null })));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?r=${encodeRosterToUrl(slots)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeMenuTrainee = actionMenuRank ? slots[actionMenuRank - 1]?.trainee : null;

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        activeCount={activeCount}
        totalCount={TRAINEES.length}
        onExportCSV={handleExportCSV}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <HeroArchetype archetype={analysis.archetype} activeCount={activeCount} onFillMore={() => setActiveTab('roster')} />
            <SettingsBar weightMode={weightMode} setWeightMode={setWeightMode} filterMode={filterMode} setFilterMode={setFilterMode} />
            <AnalyticsDashboard mode={mode} analysis={analysis} />
            <TopFiveOshis
              slots={slots}
              mode={mode}
              onSelectSlot={(r) => {
                setOpenedFromActionMenu(false);
                setActiveSlotRank(r);
              }}
              onOpenActionMenu={(r) => setActionMenuRank(r)}
              onManageTop50={() => setActiveTab('roster')}
            />
          </div>
        )}

        {activeTab === 'roster' && (
          <RosterView
            activeTrainees={activeTrainees}
            activeCount={activeCount}
            mode={mode}
            onOpenActionMenu={(r) => setActionMenuRank(r)}
            onOpenModal={(r) => {
              setOpenedFromActionMenu(false);
              setActiveSlotRank(r);
            }}
            onRemove={handleRemove}
            onMove={handleMove}
            onReorderList={handleReorderList}
            onLoadPreset={handleLoadPreset}
            onAutoFillRemaining={handleAutoFillRemaining}
            onClear={handleTriggerClear}
            onGoToDatabase={() => setActiveTab('database')}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseView
            trainees={TRAINEES}
            activeTraineeIds={activeTrainees.map((s) => s.trainee.id)}
            onAddTrainee={handleAddFirstEmpty}
          />
        )}

        {activeTab === 'archetype' && (
          <ArchetypeView archetype={analysis.archetype} mode={mode} styleRaw={analysis.styleRaw} />
        )}

        {activeTab === 'presets' && (
          <PresetsView onLoadPreset={handleLoadPreset} onShare={handleShare} onExportCSV={handleExportCSV} copied={copied} />
        )}
      </div>

      {/* Trainee Selection Modal */}
      {activeSlotRank !== null && (
        <TraineeModal
          rank={activeSlotRank}
          trainees={TRAINEES}
          activeTraineeRanks={activeTraineeRanks}
          onSelect={handleSelectTrainee}
          onClose={() => {
            setActiveSlotRank(null);
            setOpenedFromActionMenu(false);
          }}
          onBack={
            openedFromActionMenu
              ? () => {
                  setActionMenuRank(activeSlotRank);
                  setActiveSlotRank(null);
                  setOpenedFromActionMenu(false);
                }
              : undefined
          }
        />
      )}

      {/* Card Action Menu Modal */}
      {actionMenuRank !== null && activeMenuTrainee && (
        <CardActionModal
          rank={actionMenuRank}
          trainee={activeMenuTrainee}
          totalCount={activeCount}
          onClose={() => setActionMenuRank(null)}
          onChangeTrainee={(r) => {
            setActionMenuRank(null);
            setActiveSlotRank(r);
            setOpenedFromActionMenu(true);
          }}
          onMoveToRank={handleReorder}
          onRemove={handleRemove}
        />
      )}

      {/* Confirmation Dialog (Renders on Top) */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Clear Top 50 Roster?"
        description="Are you sure you want to remove all trainees from your Top 50 list? This action will reset all assigned slots and cannot be undone."
        confirmLabel="Clear All Slots"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmClear}
        onClose={() => setIsClearModalOpen(false)}
      />
    </main>
  );
}