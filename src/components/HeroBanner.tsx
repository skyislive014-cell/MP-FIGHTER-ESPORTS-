import React from 'react';
import { Flame, ShieldAlert, KeyRound, Trophy, Crosshair, Users, ChevronRight } from 'lucide-react';
import { Language, Tournament } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface HeroBannerProps {
  language: Language;
  onRegisterClick: () => void;
  onScheduleClick: () => void;
  onOpenRoomModal: (tournament: Tournament) => void;
  activeTournament: Tournament | null;
  totalPrizeDistributed: number;
  totalDuosRegistered: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onRegisterClick,
  onScheduleClick,
  onOpenRoomModal,
  activeTournament,
  totalPrizeDistributed,
  totalDuosRegistered,
}) => {
  const t = translations[language];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl mb-8">
      {/* Background Graphic with scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_esports_banner_1794112327194.jpg"
          alt="MP FIGHTER Free Fire Esports Arena"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-4xl">
        {/* Top Kicker without pill badges */}
        <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
          <div className="w-6 h-6 rounded-md overflow-hidden ring-1 ring-red-500/80 shadow-md shadow-red-950/50 shrink-0">
            <img
              src="/assets/aistudio/file_00000000dee0821182b5698a015323ab_5677176c.png"
              alt="MP FIGHTER"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span>{t.brandTagline}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-300 font-mono">SEASON 2026</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-wide leading-none uppercase mb-4 text-balance">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6 font-normal">
          {t.heroSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => {
              sounds.playClick();
              onRegisterClick();
            }}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-xl hover:brightness-110 shadow-lg shadow-orange-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Crosshair className="w-4 h-4" />
            <span>{t.heroActionRegister}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onScheduleClick();
            }}
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl hover:border-amber-500/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t.heroActionSchedule}</span>
          </button>

          {activeTournament && activeTournament.roomStatus === 'unlocked' && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenRoomModal(activeTournament);
              }}
              className="flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-amber-300 bg-amber-950/80 border border-amber-500 rounded-xl hover:bg-amber-900 shadow-md shadow-amber-950/60 transition-all cursor-pointer animate-pulse whitespace-nowrap shrink-0"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>{t.viewRoom} ({activeTournament.gameMap})</span>
            </button>
          )}
        </div>

        {/* Quantitative Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
          <div>
            <div className="text-slate-400 mb-0.5">{t.totalPrizeDistributed}</div>
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-amber-400">
              ₹{totalPrizeDistributed.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">{t.verifiedTeams}</div>
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
              {totalDuosRegistered}+ Duos
            </div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">{t.map} Rotation</div>
            <div className="text-lg sm:text-xl font-bold text-slate-200">
              Bermuda / Nexterra
            </div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Rules Standard</div>
            <div className="text-lg sm:text-xl font-bold text-emerald-400">
              Anti-Cheat Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
