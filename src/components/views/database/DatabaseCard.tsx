import React from 'react';
import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
import { Trainee, TerminologyMode, TERMINOLOGY } from '../../../types/trainee';
import { GradeBadge } from '../../common/GradeBadge';
import { traineeRepository } from '../../../repositories/traineeRepository';

interface DatabaseCardProps {
  trainee: Trainee;
  mode: TerminologyMode;
  assignedRank?: number;
  onAdd: (trainee: Trainee) => void;
}

export const DatabaseCard: React.FC<DatabaseCardProps> = ({
  trainee,
  mode,
  assignedRank,
  onAdd,
}) => {
  const portraitUrl = traineeRepository.getPortraitUrl(trainee.image || trainee.id);
  const dict = TERMINOLOGY[mode] || TERMINOLOGY.global;
  const isAssigned = assignedRank !== undefined;

  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-all duration-200 shadow-md">
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-700/60 bg-slate-950">
          <Image
            src={portraitUrl}
            alt={trainee.nameEn}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
          {isAssigned && (
            <span className="absolute top-0 left-0 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-br-lg shadow-md">
              #{assignedRank}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
              {'★'.repeat(trainee.baseRarity)}
            </span>
          </div>

          <h3 className="text-xs font-bold text-slate-100 truncate mt-1 group-hover:text-cyan-300 transition-colors">
            {mode === 'global' ? trainee.nameEn : trainee.nameJp}
          </h3>
          <p className="text-[10px] text-slate-400 truncate">{trainee.nameJp}</p>
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-slate-800/60 text-[10px]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-slate-500 font-semibold uppercase">Surface</span>
          <div className="flex gap-1">
            <GradeBadge label={dict.surface.turf} grade={trainee.surface.turf} />
            <GradeBadge label={dict.surface.dirt} grade={trainee.surface.dirt} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-1">
          <span className="text-slate-500 font-semibold uppercase">Distance</span>
          <div className="flex gap-1">
            <GradeBadge label={dict.distance.short.slice(0, 2)} grade={trainee.distance.short} />
            <GradeBadge label={dict.distance.mile.slice(0, 2)} grade={trainee.distance.mile} />
            <GradeBadge label={dict.distance.medium.slice(0, 2)} grade={trainee.distance.medium} />
            <GradeBadge label={dict.distance.long.slice(0, 2)} grade={trainee.distance.long} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-1">
          <span className="text-slate-500 font-semibold uppercase">Style</span>
          <div className="flex gap-1">
            <GradeBadge label={dict.style.front.slice(0, 2)} grade={trainee.style.front} />
            <GradeBadge label={dict.style.pace.slice(0, 2)} grade={trainee.style.pace} />
            <GradeBadge label={dict.style.late.slice(0, 2)} grade={trainee.style.late} />
            <GradeBadge label={dict.style.end.slice(0, 2)} grade={trainee.style.end} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAdd(trainee)}
        disabled={isAssigned}
        className={`w-full py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm ${
          isAssigned
            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 cursor-default'
            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-cyan-500/20'
        }`}
      >
        {isAssigned ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>In Roster (#{assignedRank})</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Roster</span>
          </>
        )}
      </button>
    </div>
  );
};
