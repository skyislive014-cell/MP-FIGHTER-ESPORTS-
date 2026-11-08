import React, { useState } from 'react';
import { Trophy, Skull, Crosshair, MapPin, Clock, Award, Shield } from 'lucide-react';
import { MatchResult, Language } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface MatchResultsProps {
  results: MatchResult[];
  language: Language;
}

export const MatchResults: React.FC<MatchResultsProps> = ({ results, language }) => {
  const t = translations[language];
  const [selectedResultId, setSelectedResultId] = useState<string>(results[0]?.id || '');

  const activeResult = results.find((r) => r.id === selectedResultId) || results[0];

  if (!activeResult) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
        No completed match results published yet.
      </div>
    );
  }

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Official Match Scorecard Archive</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-wide uppercase">
            {t.matchResultsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t.matchResultsSubtitle}
          </p>
        </div>

        {/* Match Selector if multiple */}
        {results.length > 1 && (
          <div className="flex items-center gap-2">
            <select
              value={selectedResultId}
              onChange={(e) => {
                sounds.playClick();
                setSelectedResultId(e.target.value);
              }}
              className="px-3 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {results.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.tournamentTitle}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Result Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Match Banner & MVP Spotlight */}
        <div className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeResult.map} Combat Arena</span>
              <span aria-hidden="true">·</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{activeResult.completedAt}</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white tracking-wide">
              {activeResult.tournamentTitle}
            </h3>
          </div>

          {/* MVP Card */}
          {activeResult.mvp && (
            <div className="p-3.5 bg-slate-950 border border-amber-500/40 rounded-xl flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <Skull className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  {t.mvp} of the Match
                </div>
                <div className="font-display text-lg font-bold text-white leading-tight">
                  {activeResult.mvp.ign}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                  <span className="text-amber-400 font-bold">{activeResult.mvp.kills} Kills</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeResult.mvp.damage} DMG</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scorecard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/50">
                <th className="py-3 pl-6 pr-3 font-semibold text-center w-16">{t.rank}</th>
                <th className="py-3 px-4 font-semibold">{t.team}</th>
                <th className="py-3 px-4 font-semibold hidden sm:table-cell">{t.players}</th>
                <th className="py-3 px-3 font-semibold text-center">{t.killPts}</th>
                <th className="py-3 px-3 font-semibold text-center">{t.placementPts}</th>
                <th className="py-3 pl-3 pr-6 font-semibold text-right text-amber-400">{t.totalPts}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {activeResult.teams.map((team) => {
                const isBooyah = team.rank === 1;

                return (
                  <tr
                    key={team.rank}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isBooyah ? 'bg-amber-950/20' : ''
                    }`}
                  >
                    <td className="py-3 pl-6 pr-3 text-center">
                      {isBooyah ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">
                          1
                        </div>
                      ) : (
                        <span className="font-mono text-slate-400 font-bold">
                          #{team.rank}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{team.teamName}</span>
                        {isBooyah && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 rounded">
                            BOOYAH!
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell text-slate-400 font-mono text-xs">
                      {team.player1} & {team.player2}
                    </td>

                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-200">
                      {team.kills}
                    </td>

                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-300">
                      {team.placementPts}
                    </td>

                    <td className="py-3 pl-3 pr-6 text-right font-mono tabular-nums font-bold text-amber-400">
                      {team.totalPts}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
