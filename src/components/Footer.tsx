'use client';

import React from 'react';
import { Github, Scale, ExternalLink, Heart, Database, Code2 } from 'lucide-react';
import { AppLogo } from './AppLogo';

const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = 2026;
  const appVersion = 'v1.2.0-phase3';
  const lastUpdated = 'August 2026';

  return (
    <footer className="w-full bg-[#080c18] border-t border-slate-800/80 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.35fr_1.05fr_0.85fr_1fr] gap-8 lg:gap-7">
          
          {/* 1. Brand Logo, Title & Disclaimer */}
          <div className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <AppLogo size="xs" />
                <span className="text-sm font-black text-white tracking-tight leading-snug">
                  Umamusume Top 50 Oshi Strategy Analyzer
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                An open-source stable analysis toolkit to calculate your roster archetype, strategy bias, and distance viability across your favorite trainees.
              </p>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal pt-2 border-t border-slate-900">
              Not affiliated with, endorsed by, or sponsored by <strong>Cygames, Inc.</strong> All in-game assets and trademarks belong to their respective owners.
            </p>
          </div>

          {/* 2. Data Credits */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-sm font-black text-white tracking-tight">Data & Asset Credits</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Database stats, trainee base aptitudes, and official character portrait assets are referenced from{' '}
              <a
                href="https://gametora.com/umamusume"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 font-semibold inline-flex items-center gap-1 transition-colors underline underline-offset-2"
              >
                GameTora
                <ExternalLink className="w-3 h-3 inline" />
              </a>
              . Massive thanks to the GameTora team for maintaining comprehensive game documentation.
            </p>
          </div>

          {/* 3. Repository & Support */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-sm font-black text-white tracking-tight">Repository & Support</span>
            </div>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <a
                  href="https://github.com/ramadhanaraz/umamusume-oshi-analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                  <span className="font-semibold">GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                </a>
              </li>
              <li>
                <a
                  href="https://discordapp.com/users/anmi_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="text-[#5865F2] group-hover:text-[#7983f5] transition-colors shrink-0">
                    <DiscordIcon className="w-4 h-4" />
                  </div>
                  <span>
                    Discord: <strong className="text-indigo-300 font-mono font-bold">@anmi_</strong>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                </a>
              </li>
              <li className="text-slate-400 text-[10px] pt-1">
                Contributions, feedback, and issue submissions are always welcome.
              </li>
            </ul>
          </div>

          {/* 4. License & Version */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm font-black text-white tracking-tight">License & Version</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">License:</span>
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold transition-colors inline-flex items-center gap-1"
                >
                  GNU GPL v3.0
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Build:</span>
                <span className="font-mono text-slate-300 font-bold">{appVersion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Updated:</span>
                <span className="text-slate-300">{lastUpdated}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {currentYear} Uma Musume Top 50 Oshi Strategy Analyzer. Open source under GNU GPL-3.0.</p>
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Uma Musume trainers worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
};