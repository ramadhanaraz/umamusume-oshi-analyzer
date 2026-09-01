'use client';

import React from 'react';
import { PresetCard } from './presets/PresetCard';

interface PresetsViewProps {
  onLoadPreset: (type: 'spica' | 'newEra' | 'random') => void;
}

export const PresetsView: React.FC<PresetsViewProps> = ({ onLoadPreset }) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        <h2 className="text-xl font-black text-slate-100 tracking-tight">Roster Presets</h2>
        <p className="text-xs text-slate-400 mt-1">
          Quickly populate your Top 50 list with iconic team rosters or a random selection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PresetCard
          id="spica"
          title="Team Spica & Classics"
          subtitle="Anime Season 1 & 2 Core Roster"
          description="Features Special Week, Silence Suzuka, Tokai Teio, Mejiro McQueen, Gold Ship, Vodka, Daiwa Scarlet, and classic stars."
          icon="spica"
          badge="20 Trainees"
          onSelect={onLoadPreset}
        />

        <PresetCard
          id="newEra"
          title="Beginning of a New Era"
          subtitle="Movie & Modern Generation Stars"
          description="Features Jungle Pocket, Agnes Tachyon, Manhattan Cafe, Dantsu Flame, Fuji Kiseki, and new generation stars."
          icon="newEra"
          badge="20 Trainees"
          onSelect={onLoadPreset}
        />

        <PresetCard
          id="random"
          title="Random Top 50 Fill"
          subtitle="Instant Full Roster Generation"
          description="Fills all 50 slots with a randomized, shuffled assortment of trainees across all rarities and aptitudes."
          icon="random"
          badge="50 Trainees"
          onSelect={onLoadPreset}
        />
      </div>
    </div>
  );
};
