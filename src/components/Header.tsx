'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  ListOrdered,
  Database,
  Sparkles,
  Swords,
  FolderDown,
  Globe,
} from 'lucide-react';
import { AppLogo } from './AppLogo';

export type TabType = 'dashboard' | 'roster' | 'database' | 'archetype' | 'sorter' | 'presets';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mode: 'global' | 'jp';
  setMode: (m: 'global' | 'jp') => void;
  activeCount: number;
  totalCount: number;
  onOpenExport: () => void;
  isReadOnly?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  activeCount,
  totalCount,
  onOpenExport,
  isReadOnly = false,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutGrid },
    { id: 'roster', label: `My Top 50 Oshis (${activeCount})`, icon: ListOrdered },
    { id: 'database', label: `All Playable Trainees (${totalCount || 133})`, icon: Database },
    ...(!isReadOnly
      ? [
          { id: 'sorter' as TabType, label: '🏆 Oshi Sorter', icon: Swords },
        ]
      : []),
    { id: 'archetype', label: 'Strategy Center', icon: Sparkles },
    ...(!isReadOnly
      ? [
          { id: 'presets' as TabType, label: 'Share & Export', icon: FolderDown },
        ]
      : []),
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    setActiveTab('dashboard');
    if (typeof window !== 'undefined' && window.location.search) {
      e.preventDefault();
      window.location.href = window.location.pathname;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b16]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0 space-y-4">
        
        {/* Top Branding & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Clickable App Logo & Title */}
          <Link
            href="/"
            onClick={handleLogoClick}
            title="Reset to clean URL and return to Dashboard"
            className="flex items-center gap-3.5 group cursor-pointer select-none transition-all duration-200 active:scale-[0.99]"
          >
            <div className="translate-y-[1.5px] shrink-0 transition-transform duration-300 group-hover:scale-105">
              <AppLogo />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base sm:text-xl font-black tracking-tight leading-snug bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                Umamusume Top 50 Oshi Strategy Analyzer
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-snug mt-0.5 group-hover:text-slate-300 transition-colors">
                Rank your favorite 50 trainees to determine your optimal running style and race affinity.
              </p>
            </div>
          </Link>

          {/* Right Action Group */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            {/* Terminology Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <span className="px-2 text-slate-400 text-[11px] flex items-center gap-1 font-medium">
                <Globe className="w-3 h-3 text-slate-400" />
                Terminology:
              </span>
              <button
                type="button"
                onClick={() => setMode('global')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  mode === 'global' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Global
              </button>
              <button
                type="button"
                onClick={() => setMode('jp')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  mode === 'jp' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                JP
              </button>
            </div>

            {/* Roster Counter */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300">
              Count: <span className="text-pink-400">{activeCount}</span> / 50
            </div>

            {/* Export Card Shortcut */}
            <button
              type="button"
              disabled={isReadOnly}
              onClick={!isReadOnly ? onOpenExport : undefined}
              title={isReadOnly ? 'Export card is disabled in shared preview mode' : 'Export Strategy Card'}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isReadOnly
                  ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/20 active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Export Card</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-slate-800/60 pt-1 -mb-[1px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap rounded-t-lg ${
                  isActive
                    ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};