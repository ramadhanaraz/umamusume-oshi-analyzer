'use client';

import React from 'react';
import { TerminologyMode } from '../types/trainee';
import {
  LayoutDashboard,
  ListOrdered,
  Database,
  Sparkles,
  FolderInput,
  Globe,
  Download,
  Users,
} from 'lucide-react';

export type TabType = 'dashboard' | 'roster' | 'database' | 'archetype' | 'presets';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mode: TerminologyMode;
  setMode: (mode: TerminologyMode) => void;
  activeCount: number;
  totalCount: number;
  onExportCSV: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  activeCount,
  totalCount,
  onExportCSV,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0b101d]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        {/* Brand & Subtitle */}
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

        {/* Global Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Count: <strong className="text-pink-400 font-black">{activeCount}</strong> / 50</span>
          </div>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
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
          <span>Uma Database ({totalCount})</span>
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
  );
};