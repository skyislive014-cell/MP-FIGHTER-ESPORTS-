import React from 'react';
import { Trophy, Medal, Flame, Skull, Award, DollarSign } from 'lucide-react';
import { Winner, Language } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface WinnersHallOfFameProps {
  winners: Winner[];
  language: Language;
}

export const WinnersHallOfFame: React.FC<WinnersHallOfFameProps> = ({ winners, language }) => {
  const t = translations[language];

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Grand Booyah Champions</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-wide uppercase">
            {t.winnersTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t.winnersSubtitle}
          </p>
        </div>
      </div>

      {/* Winners Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {winners.map((win) => (
          <div
            key={win.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all"
          >
            {/* Top Banner with Trophy Art */}
            <div className="relative p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="max-w-[70%]">
                <div className="text-xs font-mono text-amber-400 mb-1">
                  {win.date} · {win.map}
                </div>
                <h3 className="font-display text-2xl font-bold text-white tracking-wide truncate">
                  {language === 'hi' ? win.tournamentTitleHi : win.tournamentTitle}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  Prize Pool: <strong className="text-white font-mono">₹{win.prizePool.toLocaleString()}</strong>
                </div>
              </div>

              {/* Trophy Visual */}
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-amber-500/40 bg-slate-950 shrink-0 shadow-lg shadow-amber-950/50">
                <img
                  src={win.trophyImage || '/src/assets/images/esports_champion_trophy_1794112327479.jpg'}
                  alt="Esports Trophy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Podium Standings */}
            <div className="p-6 space-y-3">
              {/* Champion (1st Place) */}
              <div className="p-4 bg-gradient-to-r from-amber-950/60 to-slate-950 border border-amber-500/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/30">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                      {t.champion}
                    </div>
                    <div className="font-display text-lg font-bold text-white">
                      {win.championTeam}
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      {win.championPlayers.join(' & ')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">{t.prizeWon}</div>
                  <div className="font-mono text-base font-black text-emerald-400">
                    ₹{win.championPrize.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* 2nd & 3rd Place */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 2nd */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">
                      {t.runnerUp}
                    </div>
                    <div className="font-display text-base font-bold text-slate-200">
                      {win.runnerUpTeam}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {win.runnerUpPlayers.join(' & ')}
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-200">
                    ₹{win.runnerUpPrize.toLocaleString()}
                  </div>
                </div>

                {/* 3rd */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">
                      {t.thirdPlace}
                    </div>
                    <div className="font-display text-base font-bold text-slate-300">
                      {win.thirdTeam}
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-300">
                    ₹{win.thirdPrize.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Tournament MVP Spotlight */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-slate-400 font-medium">{t.mvp}:</span>
                  <span className="font-mono font-bold text-amber-400">{win.mvpPlayer}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-slate-300">
                  <Skull className="w-3.5 h-3.5 text-red-400" />
                  <span>{win.mvpKills} Kills</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
