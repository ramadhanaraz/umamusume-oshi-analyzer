// components/views/ArchetypeView.tsx
'use client';

import React from 'react';
import { ArchetypeDetails } from '../../utils/calculator';
import { TerminologyMode } from '../../types/trainee';
import { 
  Sparkles, 
  Construction, 
  Trophy, 
  Dna, 
  Layers, 
  Compass, 
  ArrowRight,
  Clock,
  Hammer
} from 'lucide-react';

interface ArchetypeViewProps {
  archetype: ArchetypeDetails;
  mode: TerminologyMode;
  styleRaw?: { front: number; pace: number; late: number; end: number };
}

export const ArchetypeView: React.FC<ArchetypeViewProps> = ({
  archetype,
}) => {
  const roadmapItems = [
    {
      icon: Trophy,
      title: 'Champions Meeting (CM) Skill Targeter',
      tag: 'Competitive Meta',
      tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      description:
        "Distance-specific acceleration triggers (e.g., Angling x Scheming, Let's Anabolic, Non-Stop Girl) and essential mid-leg velocity packages calibrated for your preferred style.",
    },
    {
      icon: Dna,
      title: 'Parent Inheritance & Factor Synergy',
      tag: 'Gene Crafting',
      tagColor: 'text-pink-400 bg-pink-400/10 border-pink-400/30',
      description:
        'Inheritance affinity algorithms to discover high-compatibility parent pairings and optimal unique skill inheritances tailored to your Top 50 roster.',
    },
    {
      icon: Layers,
      title: 'Support Card Pull & Scenario Planner',
      tag: 'Gacha Strategy',
      tagColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      description:
        "Customized card priority rankings and spark roadmaps for current and upcoming training scenarios (e.g., Grand Live, L'Arc) based on your running style weights.",
    },
    {
      icon: Compass,
      title: 'Advanced Stat Allocation & Target Benchmarks',
      tag: 'Build Optimization',
      tagColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      description:
        'Target stat caps (Speed/Stamina/Power/Guts/Wisdom) and required stamina thresholds with recovery skill calculations tailored to specific race distances.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn select-none">
      
      {/* 1. Tactical Archetype Identity Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${archetype.gradient} border ${archetype.border} shadow-2xl space-y-4 text-white relative overflow-hidden`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-amber-200 text-xs font-bold uppercase tracking-widest border border-white/10 shadow-sm">
            {archetype.badge}
          </span>
          
          {/* Prominent WIP Banner Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 backdrop-blur-md text-amber-300 border border-amber-400/50 text-xs font-black shadow-lg shadow-amber-950/40">
            <Construction className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="tracking-wide uppercase">Work In Progress (WIP)</span>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-md">
            {archetype.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/95 leading-relaxed max-w-2xl drop-shadow-sm font-medium">
            {archetype.description}
          </p>
        </div>

        <div className={`flex items-start gap-2 pt-2 text-xs ${archetype.accent} font-medium`}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white font-bold">Current Recommendation:</strong>{' '}
            {archetype.strategy}
          </span>
        </div>
      </div>

      {/* 2. WIP Section & Planned Tools Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1424] border border-slate-800/90 shadow-xl space-y-6">
        
        {/* Header with Pronounced WIP Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Strategy & Archetype Intelligence Hub
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-amber-300 uppercase tracking-wider">
                  WIP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Dedicated training strategies, skill inheritance combinations, and support card synergies are currently still in development. Please look forward to that in the future!
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmapItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/90 transition-all flex flex-col justify-between space-y-3.5 shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 shrink-0 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white tracking-tight">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer: Clear WIP / Coming Soon Status */}
                <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-amber-400"></span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span>Coming Soon</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};