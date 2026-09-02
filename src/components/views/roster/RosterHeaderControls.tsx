import React from 'react';
import { Sparkles, Trash2, Shuffle, Download, Share2 } from 'lucide-react';

interface RosterHeaderControlsProps {
  activeCount: number;
  totalSlots: number;
  isReadOnly?: boolean;
  copied?: boolean;
  onAutoFill: () => void;
  onClear: () => void;
  onShare: () => void;
  onExportCSV: () => void;
  onOpenExportCard: () => void;
}

export const RosterHeaderControls: React.FC<RosterHeaderControlsProps> = ({
  activeCount,
  totalSlots,
  isReadOnly = false,
  copied = false,
  onAutoFill,
  onClear,
  onShare,
  onExportCSV,
  onOpenExportCard,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 backdrop-blur-md">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-slate-100 tracking-tight">Top 50 Oshi Roster</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
            {activeCount} / {totalSlots}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Drag & drop cards to reorder your rankings or tap any slot to swap trainees.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {!isReadOnly && (
          <>
            <button
              type="button"
              onClick={onAutoFill}
              disabled={activeCount >= totalSlots}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700/80"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Autofill</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              disabled={activeCount === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/50 disabled:opacity-40 text-slate-300 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700/80 hover:border-rose-500/40"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onShare}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700/80"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>

        <button
          type="button"
          onClick={onExportCSV}
          disabled={activeCount === 0}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700/80"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>CSV</span>
        </button>

        <button
          type="button"
          onClick={onOpenExportCard}
          disabled={activeCount === 0}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>Export Card</span>
        </button>
      </div>
    </div>
  );
};
