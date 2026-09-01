import React from 'react';
import { Sparkles } from 'lucide-react';

interface ArchetypeHeaderProps {
  badge: string;
  title: string;
  description: string;
  strategy: string;
  gradient: string;
  border: string;
  accent: string;
  activeCount: number;
}

export const ArchetypeHeader: React.FC<ArchetypeHeaderProps> = ({
  badge,
  title,
  description,
  strategy,
  gradient,
  border,
  accent,
  activeCount,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${border} bg-gradient-to-br ${gradient} p-6 sm:p-8 shadow-2xl`}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-950/60 border border-slate-700/60 text-xs font-black tracking-wide text-amber-300 backdrop-blur-md">
            {badge}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-950/60 border border-slate-700/60 text-xs font-bold text-slate-300 backdrop-blur-md">
            {activeCount} Oshis Active
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-200/90 mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-700/40 flex items-start gap-3 text-xs">
          <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${accent}`} />
          <div>
            <strong className="font-bold text-slate-100">Tactical Recommendation: </strong>
            <span className="text-slate-200/90">{strategy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
