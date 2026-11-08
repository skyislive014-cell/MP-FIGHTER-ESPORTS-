import React, { useState } from 'react';
import { Trophy, Search, Flame, Skull, Medal, ArrowUp, RefreshCw } from 'lucide-react';
import { PointsTableRow, Language } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface LivePointsTableProps {
  pointsTable: PointsTableRow[];
  language: Language;
  onRefresh?: () => void;
}

export const LivePointsTable: React.FC<LivePointsTableProps> = ({
  pointsTable,
  language,
  onRefresh,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = pointsTable.filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.teamName.toLowerCase().includes(q) ||
      row.players.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>Official Scoring Rules Active</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-wide uppercase">
            {t.pointsTableTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t.pointsTableSubtitle}
          </p>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchTeamPlaceholder}
              className="pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white w-48 sm:w-64"
            />
          </div>

          {onRefresh && (
            <button
              onClick={() => {
                sounds.playClick();
                onRefresh();
              }}
              className="p-2 text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Refresh Leaderboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Esports Leaderboard Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Scoring Rule Explainer Strip */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <span>#1 (Booyah): <strong className="text-amber-400 font-mono">12 pts</strong></span>
            <span aria-hidden="true">·</span>
            <span>#2: <strong className="text-slate-200 font-mono">9 pts</strong></span>
            <span aria-hidden="true">·</span>
            <span>#3: <strong className="text-slate-200 font-mono">8 pts</strong></span>
            <span aria-hidden="true">·</span>
            <span>#4: <strong className="text-slate-200 font-mono">7 pts</strong></span>
            <span aria-hidden="true">·</span>
            <span>#5: <strong className="text-slate-200 font-mono">6 pts</strong></span>
          </div>
          <div className="text-amber-400 font-semibold flex items-center gap-1">
            <Skull className="w-3.5 h-3.5" />
            <span>Each Kill = 1 Point</span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="py-3.5 pl-6 pr-3 font-semibold text-center w-16">{t.rank}</th>
                <th className="py-3.5 px-4 font-semibold">{t.team}</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">{t.players}</th>
                <th className="py-3.5 px-3 font-semibold text-center">{t.played}</th>
                <th className="py-3.5 px-3 font-semibold text-center">{t.booyahCount}</th>
                <th className="py-3.5 px-3 font-semibold text-center">{t.killPts}</th>
                <th className="py-3.5 px-3 font-semibold text-center">{t.placementPts}</th>
                <th className="py-3.5 pl-3 pr-6 font-semibold text-right text-amber-400">{t.totalPts}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {filteredRows.map((row) => {
                const isFirst = row.rank === 1;
                const isSecond = row.rank === 2;
                const isThird = row.rank === 3;

                return (
                  <tr
                    key={row.teamId}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isFirst
                        ? 'bg-amber-950/20'
                        : isSecond
                        ? 'bg-slate-800/20'
                        : ''
                    }`}
                  >
                    {/* Rank with Trophy / Badge */}
                    <td className="py-3.5 pl-6 pr-3 text-center">
                      <div className="flex items-center justify-center">
                        {isFirst ? (
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/30">
                            1
                          </div>
                        ) : isSecond ? (
                          <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center">
                            2
                          </div>
                        ) : isThird ? (
                          <div className="w-7 h-7 rounded-full bg-amber-800 text-white font-black text-xs flex items-center justify-center">
                            3
                          </div>
                        ) : (
                          <span className="font-mono text-slate-400 font-bold">
                            #{row.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Team Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-display text-base font-bold text-white tracking-wide flex items-center gap-2">
                        <span>{row.teamName}</span>
                        {isFirst && (
                          <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 rounded font-sans">
                            BOOYAH!
                          </span>
                        )}
                      </div>
                      <div className="md:hidden text-[11px] text-slate-400 mt-0.5">
                        {row.players.join(' & ')}
                      </div>
                    </td>

                    {/* Players */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-300">
                      <div className="flex items-center gap-2">
                        {row.players.map((player, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-slate-950 border border-slate-800 rounded font-mono text-slate-300"
                          >
                            {player}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Matches */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-400">
                      {row.matchesPlayed}
                    </td>

                    {/* Booyahs */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400 tabular-nums">
                        {row.booyahs > 0 && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                        {row.booyahs}
                      </span>
                    </td>

                    {/* Kill Points */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums font-semibold text-slate-200">
                      {row.killPoints}
                    </td>

                    {/* Placement Points */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-300">
                      {row.placementPoints}
                    </td>

                    {/* Total Points */}
                    <td className="py-3.5 pl-3 pr-6 text-right font-mono tabular-nums">
                      <span className="text-base font-black text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {row.totalPoints}
                      </span>
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
