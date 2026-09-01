import React from 'react';
import { Sparkles, Trophy, Shuffle } from 'lucide-react';

interface PresetCardProps {
  id: 'spica' | 'newEra' | 'random';
  title: string;
  subtitle: string;
  description: string;
  icon: 'spica' | 'newEra' | 'random';
  badge: string;
  onSelect: (type: 'spica' | 'newEra' | 'random') => void;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  id,
  title,
  subtitle,
  description,
  icon,
  badge,
  onSelect,
}) => {
  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-amber-500/50 rounded-3xl p-6 flex flex-col justify-between gap-4 transition-all duration-200 shadow-xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="p-2.5 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700/80 group-hover:scale-110 transition-transform">
            {icon === 'spica' && <Trophy className="w-5 h-5" />}
            {icon === 'newEra' && <Sparkles className="w-5 h-5" />}
            {icon === 'random' && <Shuffle className="w-5 h-5" />}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
            {badge}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-100 group-hover:text-amber-300 transition-colors">
            {title}
          </h3>
          <p className="text-xs font-semibold text-amber-400/90 mt-0.5">{subtitle}</p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onSelect(id)}
        className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md shadow-amber-500/20"
      >
        Load Preset Roster
      </button>
    </div>
  );
};
