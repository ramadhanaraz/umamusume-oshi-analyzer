'use client';

import React, { useState, useEffect } from 'react';
import { TRAINEES } from '../data/trainees';
import { Trainee, TerminologyMode } from '../types/trainee';
import { OshiSlot, calculateAnalysis, encodeRosterToUrl, decodeRosterFromUrl } from '../utils/calculator';
import { OshiCard } from '../components/OshiCard';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { Globe, Share2, Shuffle, Trash2, Search, X } from 'lucide-react';

export default function Home() {
  const [slots, setSlots] = useState<OshiSlot[]>(
    Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null }))
  );
  const [mode, setMode] = useState<TerminologyMode>('global');
  const [activeSlotRank, setActiveSlotRank] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Initialize from URL query parameters if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const compressed = urlParams.get('r');
    if (compressed) {
      const decoded = decodeRosterFromUrl(compressed, TRAINEES);
      if (decoded.length > 0) {
        setSlots((prev) =>
          prev.map((slot, i) => ({ ...slot, trainee: decoded[i] || null }))
        );
      }
    }
  }, []);

  const handleSelectTrainee = (trainee: Trainee) => {
    if (activeSlotRank === null) return;
    setSlots((prev) =>
      prev.map((slot) => (slot.rank === activeSlotRank ? { ...slot, trainee } : slot))
    );
    setActiveSlotRank(null);
    setSearchQuery('');
  };

  const handleRemove = (rank: number) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.rank === rank ? { ...slot, trainee: null } : slot))
    );
  };

  const handleMove = (rank: number, direction: 'up' | 'down') => {
    const targetRank = direction === 'up' ? rank - 1 : rank + 1;
    if (targetRank < 1 || targetRank > 50) return;

    setSlots((prev) => {
      const next = [...prev];
      const sourceIdx = rank - 1;
      const targetIdx = targetRank - 1;
      const temp = next[sourceIdx].trainee;
      next[sourceIdx].trainee = next[targetIdx].trainee;
      next[targetIdx].trainee = temp;
      return next;
    });
  };

  const handleClear = () => {
    setSlots(Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null })));
  };

  const handleLoadPreset = () => {
    const sample = [...TRAINEES].sort(() => 0.5 - Math.random()).slice(0, 50);
    setSlots(sample.map((t, i) => ({ rank: i + 1, trainee: t })));
  };

  const handleShare = () => {
    const code = encodeRosterToUrl(slots);
    const url = `${window.location.origin}${window.location.pathname}?r=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const analysis = calculateAnalysis(slots);
  const filteredTrainees = TRAINEES.filter(
    (t) =>
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameJp.includes(searchQuery)
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
              Umamusume Top 50 Oshi Strategy Analyzer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Rank your favorite 50 trainees to determine your optimal running style and race affinity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* JP / Global Toggle */}
            <button
              onClick={() => setMode((m) => (m === 'global' ? 'jp' : 'global'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-slate-700"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{mode === 'global' ? 'Global (FR/PC/LS/EC)' : 'JP (逃げ/先行/差し/追込)'}</span>
            </button>

            <button
              onClick={handleLoadPreset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 text-slate-300"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" /> Random 50
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
            >
              <Share2 className="w-3.5 h-3.5" /> {copied ? 'Link Copied!' : 'Share URL'}
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 50 Slots Grid */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Oshi Ranking Roster ({analysis.activeCount}/50)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar">
              {slots.map((slot) => (
                <OshiCard
                  key={slot.rank}
                  rank={slot.rank}
                  trainee={slot.trainee}
                  mode={mode}
                  onOpenModal={(r) => setActiveSlotRank(r)}
                  onRemove={handleRemove}
                  onMove={handleMove}
                />
              ))}
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="lg:col-span-1">
            <AnalyticsDashboard mode={mode} analysis={analysis} />
          </div>
        </div>
      </div>

      {/* Trainee Picker Modal */}
      {activeSlotRank !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Select Rank #{activeSlotRank} Oshi</h3>
                <p className="text-xs text-slate-400">Choose from 133 playable trainees</p>
              </div>
              <button
                onClick={() => setActiveSlotRank(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
              {filteredTrainees.map((trainee) => (
                <button
                  key={trainee.id}
                  onClick={() => handleSelectTrainee(trainee)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-400 hover:bg-slate-800/50 transition-all text-left"
                >
                  <span className="text-xl">{trainee.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{trainee.nameEn}</p>
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