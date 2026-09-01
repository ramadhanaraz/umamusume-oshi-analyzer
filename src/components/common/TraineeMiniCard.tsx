import React from 'react';
import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
import { Trainee, TerminologyMode } from '../../types/trainee';
import { traineeRepository } from '../../repositories/traineeRepository';

interface TraineeMiniCardProps {
  trainee: Trainee;
  mode?: TerminologyMode;
  isSelected?: boolean;
  assignedRank?: number;
  onSelect?: (trainee: Trainee) => void;
}

export const TraineeMiniCard: React.FC<TraineeMiniCardProps> = ({
  trainee,
  mode = 'global',
  isSelected = false,
  assignedRank,
  onSelect,
}) => {
  const portraitUrl = traineeRepository.getPortraitUrl(trainee.image || trainee.id);
  const displayName = mode === 'global' ? trainee.nameEn : trainee.nameJp;

  return (
    <div
      onClick={() => onSelect?.(trainee)}
      className={`group relative flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500/80 shadow-md shadow-amber-500/10'
          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 bg-slate-950">
        <Image
          src={portraitUrl}
          alt={trainee.nameEn}
          fill
          sizes="44px"
          className="object-cover group-hover:scale-105 transition-transform"
        />
        {assignedRank && (
          <span className="absolute top-0 left-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1 py-0.5 rounded-br-md">
            #{assignedRank}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
          {displayName}
        </h4>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
          <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 font-semibold">
            {'★'.repeat(trainee.baseRarity)}
          </span>
          <span className="truncate">{trainee.nameJp}</span>
        </div>
      </div>

      <div className="shrink-0">
        {isSelected ? (
          <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 inline-flex items-center">
            <Check className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="p-1.5 rounded-xl bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700 inline-flex items-center transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};
