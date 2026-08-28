'use client';

import React, { useState, useEffect } from 'react';
import { TRAINEES } from '../data/trainees';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode, TERMINOLOGY } from '../types/trainee';
import { OshiSlot, calculateAnalysis, encodeRosterToUrl, decodeRosterFromUrl } from '../utils/calculator';
import { Header, TabType } from '../components/Header';
import { HeroArchetype } from '../components/HeroArchetype';
import { SettingsBar } from '../components/SettingsBar';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { RosterView } from '../components/views/RosterView';
import { DatabaseView } from '../components/views/DatabaseView';
import { ArchetypeView } from '../components/views/ArchetypeView';
import { PresetsView } from '../components/views/PresetsView';
import { TraineeModal } from '../components/TraineeModal';
import { CardActionModal } from '../components/CardActionModal';
import { Zap } from 'lucide-react';

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

  // Map of active trainee IDs to their current rank for instant duplicate lookup
  const activeTraineeRanks = activeTrainees.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.trainee.id] = curr.rank;
    return acc;
  }, {});

  const handleSelectTrainee = (trainee: Trainee) => {
    if (!activeSlotRank) return;
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    
    // Check if trainee already exists in another slot
    const existingIndex = current.findIndex((t) => t.id === trainee.id);
    if (existingIndex !== -1 && existingIndex !== activeSlotRank - 1) {
      alert(`${trainee.nameEn} is already in your Top 50 at Rank #${existingIndex + 1}!`);
      return;
    }

    if (activeSlotRank <= current.length) {
      current[activeSlotRank - 1] = trainee;
    } else {
      current.push(trainee);
    }

    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
    setActiveSlotRank(null);
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

  // Drag-and-drop or Jump to Rank reorder
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

  const handleClear = () => {
    if (confirm('Clear all slots in your Top 50 list?')) {
      setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null })));
    }
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
      s.trainee.distance.short, s.trainee.distance.mile, s.trainee.distance.medium, s.trainee.distance.long,
      s.trainee.style.front, s.trainee.style.pace, s.trainee.style.late, s.trainee.style.end,
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

            <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Top 5 Core Oshis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {slots.slice(0, 5).map((slot) => (
                  <div key={slot.rank} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {slot.rank}
                      </span>
                      {slot.trainee ? (
                        <>
                          <span className="text-xl shrink-0">{slot.trainee.emoji}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{slot.trainee.nameEn}</p>
                            <p className="text-[10px] text-slate-400 truncate">{slot.trainee.nameJp}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Empty Slot</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roster' && (
          <RosterView
            activeTrainees={activeTrainees}
            activeCount={activeCount}
            mode={mode}
            onOpenActionMenu={(r) => setActionMenuRank(r)}
            onOpenModal={(r) => setActiveSlotRank(r)}
            onRemove={handleRemove}
            onMove={handleMove}
            onReorderList={handleReorderList}
            onLoadPreset={handleLoadPreset}
            onAutoFillRemaining={handleAutoFillRemaining}
            onClear={handleClear}
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
          <ArchetypeView archetype={analysis.archetype} labels={labels} styleRaw={analysis.styleRaw} />
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
          onClose={() => setActiveSlotRank(null)}
        />
      )}

      {/* Card Action Menu Modal */}
      {actionMenuRank !== null && activeMenuTrainee && (
        <CardActionModal
          rank={actionMenuRank}
          trainee={activeMenuTrainee}
          totalCount={activeCount}
          onClose={() => setActionMenuRank(null)}
          onChangeTrainee={(r) => setActiveSlotRank(r)}
          onMoveToRank={handleReorder}
          onRemove={handleRemove}
        />
      )}
    </main>
  );
}