'use client';

import React from 'react';
import {
  Flame,
  HeartHandshake,
  Swords,
  Trophy,
  Clock,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Crown,
  Star,
  Check,
  Heart,
} from 'lucide-react';

interface SorterIntroProps {
  totalTrainees: number;
  hasActiveSession?: boolean;
  activeSessionSummary?: string;
  onStart: () => void;
  onContinue?: () => void;
  onStartOver?: () => void;
}

export const SorterIntro: React.FC<SorterIntroProps> = ({
  totalTrainees,
  hasActiveSession = false,
  activeSessionSummary = '',
  onStart,
  onContinue,
  onStartOver,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* Scoped CSS Keyframes for Interactive Chibi & 3-Phase Looped Demos */}
      <style>{`
        /* Chibi Mascot Hop */
        @keyframes chibiHop {
          0% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-18px) scale(1.05); }
          75% { transform: translateY(2px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .chibi-interactive:hover .chibi-avatar {
          animation: chibiHop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* ---------------------------------------------------- */
        /* Phase 1 Demo: Multi-Select Instinct Tap Animation   */
        /* ---------------------------------------------------- */
        @keyframes p1CardTap1 {
          0%, 15% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
          25%, 85% { transform: scale(1.06); border-color: #ec4899; opacity: 1; box-shadow: 0 0 16px rgba(236, 72, 153, 0.4); }
          95%, 100% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
        }
        @keyframes p1CardTap2 {
          0%, 40% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
          50%, 85% { transform: scale(1.06); border-color: #ec4899; opacity: 1; box-shadow: 0 0 16px rgba(236, 72, 153, 0.4); }
          95%, 100% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
        }
        @keyframes p1BadgePop1 {
          0%, 20% { opacity: 0; transform: scale(0.4); }
          25%, 85% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; transform: scale(0.4); }
        }
        @keyframes p1BadgePop2 {
          0%, 45% { opacity: 0; transform: scale(0.4); }
          50%, 85% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; transform: scale(0.4); }
        }

        .anim-p1-card-1 { animation: p1CardTap1 3.8s ease-in-out infinite; }
        .anim-p1-card-2 { animation: p1CardTap2 3.8s ease-in-out infinite; }
        .anim-p1-badge-1 { animation: p1BadgePop1 3.8s ease-in-out infinite; }
        .anim-p1-badge-2 { animation: p1BadgePop2 3.8s ease-in-out infinite; }

        /* ---------------------------------------------------- */
        /* Phase 2 Demo: Gold & Silver Stars Showdown Animation */
        /* ---------------------------------------------------- */
        @keyframes p2GoldCard {
          0%, 15% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
          25%, 85% { transform: scale(1.05); border-color: #f59e0b; opacity: 1; box-shadow: 0 0 16px rgba(245, 158, 11, 0.4); }
          95%, 100% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
        }
        @keyframes p2SilverCard {
          0%, 45% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
          55%, 85% { transform: scale(1.03); border-color: #e2e8f0; opacity: 1; box-shadow: 0 0 14px rgba(226, 232, 240, 0.3); }
          95%, 100% { transform: scale(1); border-color: rgba(51, 65, 85, 0.6); opacity: 0.5; }
        }
        @keyframes p2GoldBadge {
          0%, 20% { opacity: 0; transform: translateY(-4px) scale(0.5); }
          25%, 85% { opacity: 1; transform: translateY(0) scale(1); }
          95%, 100% { opacity: 0; transform: translateY(-4px) scale(0.5); }
        }
        @keyframes p2SilverBadge {
          0%, 50% { opacity: 0; transform: translateY(-4px) scale(0.5); }
          55%, 85% { opacity: 1; transform: translateY(0) scale(1); }
          95%, 100% { opacity: 0; transform: translateY(-4px) scale(0.5); }
        }

        .anim-p2-gold { animation: p2GoldCard 3.8s ease-in-out infinite; }
        .anim-p2-silver { animation: p2SilverCard 3.8s ease-in-out infinite; }
        .anim-p2-gold-badge { animation: p2GoldBadge 3.8s ease-in-out infinite; }
        .anim-p2-silver-badge { animation: p2SilverBadge 3.8s ease-in-out infinite; }

        /* ---------------------------------------------------- */
        /* Phase 3 Demo: 1v1 Duel & #1 Crowned Champion        */
        /* ---------------------------------------------------- */
        @keyframes p3WinnerCard {
          0%, 25% { transform: scale(1); border-color: rgba(236, 72, 153, 0.4); opacity: 0.8; }
          35%, 85% { transform: scale(1.08); border-color: #fb7185; opacity: 1; box-shadow: 0 0 20px rgba(251, 113, 133, 0.5); }
          95%, 100% { transform: scale(1); border-color: rgba(236, 72, 153, 0.4); opacity: 0.8; }
        }
        @keyframes p3LoserCard {
          0%, 25% { transform: scale(1); opacity: 0.8; }
          35%, 85% { transform: scale(0.92); opacity: 0.3; filter: grayscale(40%); }
          95%, 100% { transform: scale(1); opacity: 0.8; filter: grayscale(0%); }
        }
        @keyframes p3CrownShimmer {
          0%, 30% { opacity: 0; transform: scale(0.3) translateY(8px); }
          35%, 85% { opacity: 1; transform: scale(1) translateY(0); }
          95%, 100% { opacity: 0; transform: scale(0.3) translateY(8px); }
        }
        @keyframes p3VsGlow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .anim-p3-winner { animation: p3WinnerCard 3.8s ease-in-out infinite; }
        .anim-p3-loser { animation: p3LoserCard 3.8s ease-in-out infinite; }
        .anim-p3-crown { animation: p3CrownShimmer 3.8s ease-in-out infinite; }
        .anim-p3-vs { animation: p3VsGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Hero Welcome Banner with Agnes Digital Chibi */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-950/40 via-slate-900 to-indigo-950/40 border border-pink-500/25 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Column: Text, Warning & CTA */}
        <div className="space-y-4 text-center md:text-left max-w-2xl relative z-10 flex-1">
          {/* Umander Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-300 border border-rose-500/30 text-xs font-black uppercase tracking-widest shadow-sm">
            <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Umander: The Ultimate Oshi Matchmaker</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Can’t Decide on Your{' '}
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
              Top 50 Oshis?
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Stuck with an empty stable or torn between endless faves among all <strong className="text-white font-bold">{totalTrainees}</strong> trainees? Let Agnes Digital guide you through this fun matchmaker tournament to seamlessly sort and rank your ultimate Oshi roster!
          </p>

          {/* Quick Highlights */}
          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span><strong>~10 Mins</strong> Take Your Time</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
              <span><strong>Zero Stress</strong> • Pure Fave Vibes</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Review Anytime</strong> Before Applying</span>
            </div>
          </div>

          {/* Ongoing Session Detection Banner */}
          {hasActiveSession && (
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs text-indigo-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  <strong>Ongoing Session Detected:</strong> {activeSessionSummary}
                </span>
              </div>
            </div>
          )}

          {/* Dynamic Start / Resume Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5">
            {hasActiveSession ? (
              <>
                <button
                  type="button"
                  onClick={onContinue}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Continue Session</span>
                </button>
                <button
                  type="button"
                  onClick={onStartOver}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2.5 active:scale-95 shrink-0 cursor-pointer"
              >
                <span>Start Oshi Matchmaker</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}

            {/* Agnes Digital Explodes Warning Badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] font-semibold leading-tight shadow-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Warning:</strong> Agnes Digital <em>WILL</em> explode from critical Oshi overload!
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Subtly Glowing Chibi Mascot with Jump Action */}
        <div className="chibi-interactive shrink-0 relative flex flex-col items-center justify-center z-10 px-4 cursor-pointer">
          <div className="absolute inset-4 bg-pink-500/10 blur-2xl rounded-full pointer-events-none transition-opacity duration-300" />
          
          <img
            src="/chibis/AgnesDigitalChibi1-2.png"
            alt="Agnes Digital - Ultimate Oshi Fan"
            className="chibi-avatar w-40 sm:w-52 h-auto drop-shadow-[0_8px_16px_rgba(236,72,153,0.18)] relative z-10 select-none pointer-events-auto will-change-transform"
          />
          <span className="text-[10px] font-mono text-pink-300/90 font-bold tracking-widest mt-2 uppercase bg-black/50 px-3.5 py-1 rounded-full border border-pink-500/30 shadow-md">
            Certified Oshi Connoisseur 🌸
          </span>
        </div>
      </div>

      {/* 3 Interactive Animated Tournament Phase Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 text-center sm:text-left pl-1">
          How The Tournament Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Phase 1 Quick Instinct Picks with Multi-Select Animation */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg">
            <div className="space-y-3.5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">1. Quick Instinct Picks</h3>
              </div>

              {/* Looped Interactive Animated Canvas */}
              <div className="h-28 rounded-2xl bg-[#080d1a] border border-slate-800/80 p-3 flex items-center justify-center gap-2 overflow-hidden relative shadow-inner">
                {/* 5 Mini Simulated Trainee Cards */}
                <div className="w-10 h-16 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between p-1 opacity-40">
                  <div className="w-3 h-3 rounded-full bg-slate-700 mx-auto" />
                  <div className="w-full h-1.5 rounded bg-slate-700" />
                </div>

                {/* Animated Pick #1 */}
                <div className="anim-p1-card-1 w-11 h-18 rounded-lg bg-pink-950/30 border border-slate-700/60 flex flex-col justify-between p-1 relative">
                  <div className="anim-p1-badge-1 absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[8px] font-black flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-400/60 mx-auto mt-1" />
                  <div className="w-full h-1.5 rounded bg-pink-400/40" />
                </div>

                <div className="w-10 h-16 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between p-1 opacity-40">
                  <div className="w-3 h-3 rounded-full bg-slate-700 mx-auto" />
                  <div className="w-full h-1.5 rounded bg-slate-700" />
                </div>

                {/* Animated Pick #2 */}
                <div className="anim-p1-card-2 w-11 h-18 rounded-lg bg-pink-950/30 border border-slate-700/60 flex flex-col justify-between p-1 relative">
                  <div className="anim-p1-badge-2 absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[8px] font-black flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-400/60 mx-auto mt-1" />
                  <div className="w-full h-1.5 rounded bg-pink-400/40" />
                </div>

                <div className="w-10 h-16 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between p-1 opacity-40">
                  <div className="w-3 h-3 rounded-full bg-slate-700 mx-auto" />
                  <div className="w-full h-1.5 rounded bg-slate-700" />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Browse casual groups of your faves. Simply tap whoever catches your eye, or skip freely without overthinking.
              </p>
            </div>

            <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">
              Filter Down Your Faves
            </span>
          </div>

          {/* Card 2: Phase 2 Group Showdowns with Gold/Silver Award Animation */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg">
            <div className="space-y-3.5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">2. Group Showdowns</h3>
              </div>

              {/* Looped Interactive Animated Canvas */}
              <div className="h-28 rounded-2xl bg-[#080d1a] border border-slate-800/80 p-3 flex items-center justify-center gap-3 overflow-hidden relative shadow-inner">
                {/* 1st Favorite (Gold) Card */}
                <div className="anim-p2-gold w-16 h-20 rounded-xl bg-amber-950/20 border border-slate-700/60 flex flex-col justify-between p-1.5 relative">
                  <div className="anim-p2-gold-badge absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black flex items-center gap-0.5 shadow-md">
                    <Crown className="w-2.5 h-2.5 fill-slate-950" /> 1st
                  </div>
                  <div className="w-5 h-5 rounded-full bg-amber-400/40 mx-auto mt-2" />
                  <div className="w-full h-2 rounded bg-amber-400/30" />
                </div>

                {/* Unselected Neutral Card */}
                <div className="w-14 h-18 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col justify-between p-1.5 opacity-35">
                  <div className="w-4 h-4 rounded-full bg-slate-700 mx-auto mt-1" />
                  <div className="w-full h-1.5 rounded bg-slate-700" />
                </div>

                {/* 2nd Favorite (Silver) Card */}
                <div className="anim-p2-silver w-16 h-20 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between p-1.5 relative">
                  <div className="anim-p2-silver-badge absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-950 text-[8px] font-black flex items-center gap-0.5 shadow-md">
                    <Star className="w-2.5 h-2.5 fill-slate-950" /> 2nd
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-300/40 mx-auto mt-2" />
                  <div className="w-full h-2 rounded bg-slate-300/30" />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Watch your selected faves face off in mini-brackets. Award Gold & Silver stars to separate your true Oshis from the pack.
              </p>
            </div>

            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
              Sort Top Contenders
            </span>
          </div>

          {/* Card 3: Phase 3 Championship Duels with 1v1 Crown Animation */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg">
            <div className="space-y-3.5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                  <Swords className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">3. Championship Duels</h3>
              </div>

              {/* Looped Interactive Animated Canvas */}
              <div className="h-28 rounded-2xl bg-[#080d1a] border border-slate-800/80 p-3 flex items-center justify-center gap-3 overflow-hidden relative shadow-inner">
                {/* 1v1 Contender A (Winner) */}
                <div className="anim-p3-winner w-18 h-22 rounded-xl bg-pink-950/30 border border-pink-500/40 flex flex-col justify-between p-2 relative">
                  <div className="anim-p3-crown absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black flex items-center gap-0.5 shadow-lg">
                    <Crown className="w-2.5 h-2.5 fill-slate-950" /> #1 Oshi
                  </div>
                  <div className="w-6 h-6 rounded-full bg-pink-400/50 mx-auto mt-1 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 fill-pink-300 text-pink-300" />
                  </div>
                  <div className="w-full h-2 rounded bg-pink-400/40" />
                </div>

                {/* VS Badge */}
                <div className="anim-p3-vs px-2 py-1 rounded-lg bg-black/70 border border-slate-700 text-[10px] font-black text-rose-400 shadow-md">
                  VS
                </div>

                {/* 1v1 Contender B */}
                <div className="anim-p3-loser w-18 h-22 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col justify-between p-2 relative">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/30 mx-auto mt-1 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-cyan-300" />
                  </div>
                  <div className="w-full h-2 rounded bg-cyan-400/30" />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Direct 1v1 face-offs between your top contenders to crown your unquestioned #1 Ultimate Oshi and finalize your apex ranks.
              </p>
            </div>

            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              Crown Your #1 Oshi
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};