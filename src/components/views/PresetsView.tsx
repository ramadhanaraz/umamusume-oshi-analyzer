'use client';

import React from 'react';
import { Zap, Share2, Download } from 'lucide-react';

interface PresetsViewProps {
  onLoadPreset: (type: 'newEra' | 'spica' | 'random') => void;
  onShare: () => void;
  onExportCSV: () => void;
  copied: boolean;
}

export const PresetsView: React.FC<PresetsViewProps> = ({
  onLoadPreset,
  onShare,
  onExportCSV,
  copied,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800/90 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> One-Click Team Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onLoadPreset('newEra')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 hover:bg-slate-900/60 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-pink-400">New Era Legends</h4>
            <p className="text-[10px] text-slate-400 mt-1">Epiphaneia, Daring Tact, Cesario, Almond Eye & recent aces.</p>
          </button>
          <button
            onClick={() => onLoadPreset('spica')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 hover:bg-slate-900/60 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-pink-400">Team Spica & Classics</h4>
            <p className="text-[10px] text-slate-400 mt-1">Special Week, Suzuka, Teio, McQueen, Vodka, Gold Ship.</p>
          </button>
          <button
            onClick={() => onLoadPreset('random')}
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
            onClick={onShare}
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
            onClick={onExportCSV}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Download .CSV File
          </button>
        </div>
      </div>
    </div>
  );
};