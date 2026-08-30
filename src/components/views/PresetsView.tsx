'use client';

import React from 'react';
import { Sparkles, Share2, Download, Image as ImageIcon, Zap } from 'lucide-react';

interface PresetsViewProps {
  onLoadPreset: (presetId: string) => void;
  onOpenExportCard: () => void;
  onShare: () => void;
  onExportCSV: () => void;
  copied: boolean;
}

export const PresetsView: React.FC<PresetsViewProps> = ({
  onLoadPreset,
  onOpenExportCard,
  onShare,
  onExportCSV,
  copied,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Section: Presets */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>One-Click Team Presets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onLoadPreset('new-era')}
            className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              New Era Legends
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Epiphaneia, Daring Tact, Cesario, Almond Eye & recent aces.
            </p>
          </button>

          <button
            onClick={() => onLoadPreset('spica')}
            className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-rose-500/50 text-left transition-all group"
          >
            <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
              Team Spica & Classics
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Special Week, Suzuka, Teio, McQueen, Vodka, Gold Ship.
            </p>
          </button>

          <button
            onClick={() => onLoadPreset('random')}
            className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
          >
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Shuffle Random 50
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Instantly pick 50 randomized trainees across all rarities.
            </p>
          </button>
        </div>
      </div>

      {/* Bottom 3-Card Export & Share Suite */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Visual Card Export */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
              <ImageIcon className="w-4 h-4" />
              <span>Export Summary Card</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fancy sharing your Oshis? Generate a high-res 1200×675 image card showcasing your Top 5 trainees and archetype for you to share.
            </p>
          </div>
          <button
            onClick={onOpenExportCard}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Image Card</span>
          </button>
        </div>

        {/* 2. Shareable URL */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Share2 className="w-4 h-4" />
              <span>Shareable URL</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate a compressed URL string encoding your entire 50-trainee roster to send to friends.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onShare()} // <-- Wrap in arrow function
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Shareable Link'}</span>
          </button>
        </div>

        {/* 3. CSV Spreadsheet Backup */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Download className="w-4 h-4" />
              <span>CSV Export & Backup</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download your Top 50 rankings formatted with all raw aptitude grades for spreadsheet use.
            </p>
          </div>
          <button
            onClick={onExportCSV}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download .CSV File</span>
          </button>
        </div>

      </div>

    </div>
  );
};