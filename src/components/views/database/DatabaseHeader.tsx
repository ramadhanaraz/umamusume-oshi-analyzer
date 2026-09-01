import React from 'react';
import { SearchBar } from '../../common/SearchBar';

interface DatabaseHeaderProps {
  totalCount: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  rarityFilter: number | 'all';
  onRarityChange: (val: number | 'all') => void;
}

export const DatabaseHeader: React.FC<DatabaseHeaderProps> = ({
  totalCount,
  filteredCount,
  searchQuery,
  onSearchChange,
  rarityFilter,
  onRarityChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 backdrop-blur-md">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-slate-100 tracking-tight">Trainee Database</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
            {filteredCount} / {totalCount}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Browse all available trainees, filter by aptitudes, and add them to your Top 50 roster.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
        <SearchBar
          query={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by name, JP name, or ID..."
        />

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onRarityChange('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              rarityFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ★
          </button>
          {[3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRarityChange(star)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                rarityFilter === star
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {'★'.repeat(star)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
