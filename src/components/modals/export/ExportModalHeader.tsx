import React from 'react';
import { X, Sparkles, Download } from 'lucide-react';

interface ExportModalHeaderProps {
  onClose: () => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export const ExportModalHeader: React.FC<ExportModalHeaderProps> = ({
  onClose,
  onDownload,
  isGenerating,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-black text-slate-100">Export Strategy Card</h3>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDownload}
          disabled={isGenerating}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-amber-500/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Generating Image...' : 'Save PNG'}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
