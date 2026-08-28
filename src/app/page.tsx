'use client';

import React, { useState, useEffect } from 'react';
import { TRAINEES } from '../data/trainees';
import { Trainee, TerminologyMode, WeightingMode, AptitudeFilterMode, TERMINOLOGY } from '../types/trainee';
import { OshiSlot, calculateAnalysis, encodeRosterToUrl, decodeRosterFromUrl } from '../utils/calculator';
import { OshiCard } from '../components/OshiCard';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import {
  LayoutDashboard,
  ListOrdered,
  Database,
  Sparkles,
  FolderInput,
  Globe,
  Download,
  Share2,
  Trash2,
  Search,
  X,
  Plus,
  Check,
  Zap,
  Users
} from 'lucide-react';

type TabType = 'dashboard' | 'roster' | 'database' | 'archetype' | 'presets';

export default function Home() {
  const [slots, setSlots] = useState<OshiSlot[]>(
    Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null }))
  );
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mode, setMode] = useState<TerminologyMode>('global');
  const [weightMode, setWeightMode] = useState<WeightingMode>('tiered');
  const [filterMode, setFilterMode] = useState<AptitudeFilterMode>('aOnly');
  const [activeSlotRank, setActiveSlotRank] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Restore state from URL if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const compressed = urlParams.get('r');
    if (compressed) {
      const decoded = decodeRosterFromUrl(compressed, TRAINEES);
      if (decoded.length > 0) {
        setSlots(
          Array.from({ length: 50 }, (_, i) => ({
            rank: i + 1,
            trainee: decoded[i] || null,
          }))
        );
      }
    }
  }, []);

  const activeTrainees = slots.filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null);
  const activeCount = activeTrainees.length;
  const analysis = calculateAnalysis(slots, mode, weightMode, filterMode);
  const labels = TERMINOLOGY[mode];

  // Select or swap a trainee at a specific rank
  const handleSelectTrainee = (trainee: Trainee, targetRank?: number) => {
    const rankToUse = targetRank ?? activeSlotRank;
    if (!rankToUse) return;

    // Extract current populated trainees
    const currentList = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);

    if (rankToUse <= currentList.length) {
      // Replace existing item
      currentList[rankToUse - 1] = trainee;
    } else {
      // Append to the end
      currentList.push(trainee);
    }

    setSlots(
      Array.from({ length: 50 }, (_, i) => ({
        rank: i + 1,
        trainee: currentList[i] || null,
      }))
    );

    setActiveSlotRank(null);
    setSearchQuery('');
  };

  // Add from Database directly to next empty rank
  const handleAddFirstEmpty = (trainee: Trainee) => {
    if (activeCount >= 50) {
      alert('Your Top 50 roster is full! Remove a trainee or reorder an existing rank.');
      return;
    }
    const currentList = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    currentList.push(trainee);

    setSlots(
      Array.from({ length: 50 }, (_, i) => ({
        rank: i + 1,
        trainee: currentList[i] || null,
      }))
    );
  };

  // Sequential removal (shifts all subsequent cards up)
  const handleRemove = (rank: number) => {
    const currentList = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    currentList.splice(rank - 1, 1); // remove item at rank - 1

    setSlots(
      Array.from({ length: 50 }, (_, i) => ({
        rank: i + 1,
        trainee: currentList[i] || null,
      }))
    );
  };

  // Sequential swap between ranks
  const handleMove = (rank: number, direction: 'up' | 'down') => {
    const targetRank = direction === 'up' ? rank - 1 : rank + 1;
    if (targetRank < 1 || targetRank > activeCount) return;

    const currentList = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const temp = currentList[rank - 1];
    currentList[rank - 1] = currentList[targetRank - 1];
    currentList[targetRank - 1] = temp;

    setSlots(
      Array.from({ length: 50 }, (_, i) => ({
        rank: i + 1,
        trainee: currentList[i] || null,
      }))
    );
  };

  const handleClear = () => {
    if (confirm('Clear all slots in your Top 50 list?')) {
      setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null })));
    }
  };

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name (EN)', 'Name (JP)', 'Turf', 'Dirt', 'Short', 'Mile', 'Medium', 'Long', 'Front', 'Pace', 'Late', 'End'];
    const rows = activeTrainees.map((s) => [
      s.rank,
      `"${s.trainee.nameEn}"`,
      `"${s.trainee.nameJp}"`,
      s.trainee.surface.turf,
      s.trainee.surface.dirt,
      s.trainee.distance.short,
      s.trainee.distance.mile,
      s.trainee.distance.medium,
      s.trainee.distance.long,
      s.trainee.style.front,
      s.trainee.style.pace,
      s.trainee.style.late,
      s.trainee.style.end,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'umamusume_top50_oshis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadPreset = (type: 'spica' | 'newEra' | 'random') => {
    let selected: Trainee[] = [];
    if (type === 'newEra') {
      const newEraIds = ['epiphaneia', 'fusaichi-pandora', 'rulership', 'curren-bouquetdor', 'gentildonna', 'red-desire', 'daring-heart', 'admire-groove', 'lucky-lilac', 'north-flight', 'victoire-pisa', 'loves-only-you', 'almond-eye', 'sounds-of-earth', 'kiseki', 'bubble-gum-fellow', 'stay-gold', 'nakayama-festa', 'dream-journey', 'buena-vista'];
      selected = TRAINEES.filter((t) => newEraIds.includes(t.id));
    } else if (type === 'spica') {
      const spicaIds = ['special-week', 'silence-suzuka', 'tokai-teio', 'vodka', 'daiwa-scarlet', 'gold-ship', 'mejiro-mcqueen', 'symboli-rudolf', 'air-groove', 'narita-brian', 'rice-shower', 'grass-wonder', 'el-condor-pasa', 'taiki-shuttle', 'oguri-cap', 'twin-turbo', 'nice-nature', 'king-halo', 'winning-ticket', 'agnes-tachyon'];
      selected = TRAINEES.filter((t) => spicaIds.includes(t.id));
    } else {
      selected = [...TRAINEES].sort(() => 0.5 - Math.random()).slice(0, 50);
    }

    setSlots(
      Array.from({ length: 50 }, (_, i) => ({
        rank: i + 1,
        trainee: selected[i] || null,
      }))
    );
  };

  const handleShare = () => {
    const code = encodeRosterToUrl(slots);
    const url = `${window.location.origin}${window.location.pathname}?r=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredModalTrainees = TRAINEES.filter(
    (t) =>
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameJp.includes(searchQuery)
  );

  const filteredDbTrainees = TRAINEES.filter(
    (t) =>
      t.nameEn.toLowerCase().includes(dbSearchQuery.toLowerCase()) ||
      t.nameJp.includes(dbSearchQuery)
  );

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0b101d]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-rose-500/20 shrink-0">
              🏇
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent inline-block">
                Umamusume Top 50 Oshi Strategy Analyzer
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                Rank your favorite 50 trainees to determine your optimal running style and race affinity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Terminology Switch */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
              <span className="flex items-center gap-1.5 px-2 text-slate-400 text-[11px] font-medium hidden sm:inline-flex">
                <Globe className="w-3.5 h-3.5" /> Terminology:
              </span>
              <button
                onClick={() => setMode('global')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                  mode === 'global' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setMode('jp')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                  mode === 'jp' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JP
              </button>
            </div>

            {/* Live Count Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Count: <strong className="text-pink-400 font-black">{activeCount}</strong> / 50</span>
            </div>

            {/* Quick Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-3 border-t border-slate-800/60 pt-1 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-pink-500 text-pink-400 bg-pink-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'roster'
                ? 'border-pink-500 text-pink-400 bg-pink-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>My Top 50 List ({activeCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-pink-500 text-pink-400 bg-pink-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Uma Database ({TRAINEES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archetype')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'archetype'
                ? 'border-pink-500 text-pink-400 bg-pink-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Archetype & Strategy</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-pink-500 text-pink-400 bg-pink-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <FolderInput className="w-4 h-4" />
            <span>Import / Export / Presets</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: Dashboard & Analytics */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero Trainer Archetype Card */}
            <div className={`rounded-3xl bg-gradient-to-r ${analysis.archetype.gradient} p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border ${analysis.archetype.border} transition-all duration-500`}>
              <div className="space-y-3 max-w-2xl">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md ${analysis.archetype.accent} text-xs font-bold border border-white/15 shadow-sm`}>
                  <span>{analysis.archetype.badge}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                  {analysis.archetype.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">
                  {analysis.archetype.description}
                </p>
                
                <div className={`flex items-start gap-2 pt-1 text-xs ${analysis.archetype.accent} font-medium`}>
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white font-bold">Recommended Strategy:</strong> {analysis.archetype.strategy}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center justify-center min-w-[210px] text-center shadow-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75">
                  Top Oshis Analyzed
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white my-1 tracking-tight">
                  {activeCount}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  out of 50 slots filled
                </span>
                {activeCount < 50 && (
                  <button
                    onClick={() => setActiveTab('roster')}
                    className="w-full mt-3 py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs transition-all shadow-md active:scale-95"
                  >
                    + Fill More Oshis
                  </button>
                )}
              </div>
            </div>

            {/* Calculation Settings Control Bar */}
            <div className="p-3.5 rounded-2xl bg-[#0e1424] border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
                <div className="w-5 h-5 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20 text-[11px]">
                  i
                </div>
                <span>Calculation Settings:</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Weighting:</span>
                  <button
                    onClick={() => setWeightMode('equal')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      weightMode === 'equal' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Equal (1×)
                  </button>
                  <button
                    onClick={() => setWeightMode('tiered')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      weightMode === 'tiered' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tiered (Top 1–5 = 4×)
                  </button>
                  <button
                    onClick={() => setWeightMode('linear')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      weightMode === 'linear' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Linear (50× → 1×)
                  </button>
                </div>

                <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Aptitude Filter:</span>
                  <button
                    onClick={() => setFilterMode('aOnly')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      filterMode === 'aOnly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    A Rank Only
                  </button>
                  <button
                    onClick={() => setFilterMode('acViable')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      filterMode === 'acViable' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    A–C Viable
                  </button>
                  <button
                    onClick={() => setFilterMode('allGrades')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      filterMode === 'allGrades' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Grades Weighted
                  </button>
                </div>
              </div>
            </div>

            {/* 3-Column Visual Distribution Grid */}
            <AnalyticsDashboard mode={mode} analysis={analysis} />

            {/* Top 5 Core Oshis Row */}
            <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Top 5 Core Oshis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {slots.slice(0, 5).map((slot) => (
                  <div
                    key={slot.rank}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
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
                    {slot.trainee && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold">
                        A
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: My Top 50 List */}
        {activeTab === 'roster' && (
          <div className="space-y-4 max-w-5xl mx-auto animate-fadeIn">
            {/* Roster Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-[#0e1424] p-4 sm:p-5 rounded-3xl border border-slate-800/90 shadow-xl">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">Top 50 Oshi Ranking List</h2>
                <p className="text-xs text-slate-400 mt-0.5">Re-order your favorite Umamusume (Rank 1 to 50)</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleLoadPreset('random')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Random 50 Quick-fill</span>
                </button>
                <button
                  onClick={handleClear}
                  disabled={activeCount === 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all disabled:opacity-30 disabled:hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Empty State vs. Sequential List */}
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
                  onClick={() => setActiveTab('database')}
                  className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse Database</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeTrainees.map(({ rank, trainee }) => (
                  <OshiCard
                    key={`${rank}-${trainee.id}`}
                    rank={rank}
                    trainee={trainee}
                    mode={mode}
                    totalCount={activeCount}
                    onOpenModal={(r) => setActiveSlotRank(r)}
                    onRemove={handleRemove}
                    onMove={handleMove}
                  />
                ))}

                {/* Add Next Oshi Slot Button if less than 50 */}
                {activeCount < 50 && (
                  <button
                    onClick={() => setActiveSlotRank(activeCount + 1)}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0e1424]/60 border border-dashed border-slate-800 hover:border-pink-500/60 hover:bg-slate-900/50 transition-all text-xs font-bold text-slate-400 hover:text-pink-300 group"
                  >
                    <Plus className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                    <span>+ Add Rank #{activeCount + 1} Oshi</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Uma Database */}
        {activeTab === 'database' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Filter 133 trainees by name (English or Japanese)..."
                value={dbSearchQuery}
                onChange={(e) => setDbSearchQuery(e.target.value)}
                className="w-full bg-[#0e1424] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDbTrainees.map((trainee) => {
                const isSelected = activeTrainees.some((s) => s.trainee.id === trainee.id);
                return (
                  <div
                    key={trainee.id}
                    className="p-3.5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl select-none">{trainee.emoji}</span>
                        <div>
                          <h4 className="text-xs font-black text-white">{trainee.nameEn}</h4>
                          <p className="text-[10px] text-slate-400">{trainee.nameJp}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                        {trainee.baseRarity}★
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-950/70 p-2 rounded-xl border border-slate-800/60">
                      <div>
                        <span className="text-slate-400">Distance: </span>
                        <span className="font-bold text-slate-200">
                          {trainee.distance.short === 'A' ? 'Sht ' : ''}
                          {trainee.distance.mile === 'A' ? 'Mil ' : ''}
                          {trainee.distance.medium === 'A' ? 'Med ' : ''}
                          {trainee.distance.long === 'A' ? 'Lng ' : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Surface: </span>
                        <span className="font-bold text-slate-200">
                          {trainee.surface.turf === 'A' ? 'Turf ' : ''}
                          {trainee.surface.dirt === 'A' ? 'Dirt ' : ''}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddFirstEmpty(trainee)}
                      className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          : 'bg-pink-600 hover:bg-pink-500 text-white shadow-sm'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>In Roster</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Top 50</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: Archetype & Strategy */}
        {activeTab === 'archetype' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${analysis.archetype.gradient} border ${analysis.archetype.border} shadow-2xl space-y-3 text-white`}>
              <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-amber-200 text-xs font-bold uppercase tracking-widest border border-white/10">
                {analysis.archetype.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">{analysis.archetype.title}</h2>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed">{analysis.archetype.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Strategy Point Multipliers</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{labels.front}:</span>
                    <span className="font-mono font-bold text-white">{analysis.styleRaw.front.toFixed(1)} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{labels.pace}:</span>
                    <span className="font-mono font-bold text-white">{analysis.styleRaw.pace.toFixed(1)} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{labels.late}:</span>
                    <span className="font-mono font-bold text-white">{analysis.styleRaw.late.toFixed(1)} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{labels.end}:</span>
                    <span className="font-mono font-bold text-white">{analysis.styleRaw.end.toFixed(1)} pts</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Champions Meeting Recommendation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {analysis.archetype.strategy}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: Import / Export / Presets */}
        {activeTab === 'presets' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> One-Click Team Presets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleLoadPreset('newEra')}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 hover:bg-slate-900/60 text-left transition-all group"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-pink-400">New Era Legends</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Epiphaneia, Daring Tact, Cesario, Almond Eye & recent aces.</p>
                </button>
                <button
                  onClick={() => handleLoadPreset('spica')}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 hover:bg-slate-900/60 text-left transition-all group"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-pink-400">Team Spica & Classics</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Special Week, Suzuka, Teio, McQueen, Vodka, Gold Ship.</p>
                </button>
                <button
                  onClick={() => handleLoadPreset('random')}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 hover:bg-slate-900/60 text-left transition-all group"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-pink-400">Shuffle Random 50</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Instantly pick 50 randomized trainees across all rarities.</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cyan-400" /> Shareable URL
                </h3>
                <p className="text-xs text-slate-400">
                  Generate a compressed URL string encoding your entire 50-trainee roster to send to friends.
                </p>
                <button
                  onClick={handleShare}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  {copied ? 'Link Copied to Clipboard!' : 'Copy Shareable Link'}
                </button>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" /> CSV Export & Backup
                </h3>
                <p className="text-xs text-slate-400">
                  Download your Top 50 rankings formatted with all raw aptitude grades for spreadsheet use.
                </p>
                <button
                  onClick={handleExportCSV}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  Download .CSV File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trainee Selection Modal */}
      {activeSlotRank !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <div>
                <h3 className="text-sm font-bold text-white">Select Rank #{activeSlotRank} Oshi</h3>
                <p className="text-[11px] text-slate-400">Choose from 133 playable trainees</p>
              </div>
              <button
                onClick={() => setActiveSlotRank(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by English or Japanese name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 custom-scrollbar">
              {filteredModalTrainees.map((trainee) => (
                <button
                  key={trainee.id}
                  onClick={() => handleSelectTrainee(trainee)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-pink-500 hover:bg-slate-800/50 transition-all text-left group"
                >
                  <span className="text-xl select-none">{trainee.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-pink-300 truncate">{trainee.nameEn}</p>
                    <p className="text-[10px] text-slate-400 truncate">{trainee.nameJp}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}