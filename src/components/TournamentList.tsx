import React, { useState } from 'react';
import { Trophy, Users, Clock, MapPin, KeyRound, Shield, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Tournament, Language, Player } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface TournamentListProps {
  tournaments: Tournament[];
  language: Language;
  onSelectTournamentForRegistration: (tournament: Tournament) => void;
  onOpenRoomModal: (tournament: Tournament) => void;
  currentPlayer: Player | null;
}

export const TournamentList: React.FC<TournamentListProps> = ({
  tournaments,
  language,
  onSelectTournamentForRegistration,
  onOpenRoomModal,
  currentPlayer,
}) => {
  const t = translations[language];
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'free'>('all');
  const [expandedRulesId, setExpandedRulesId] = useState<string | null>(null);

  const filteredTournaments = tournaments.filter((tour) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return tour.status === 'upcoming';
    if (filter === 'ongoing') return tour.status === 'ongoing';
    if (filter === 'completed') return tour.status === 'completed';
    if (filter === 'free') return tour.entryFee === 0;
    return true;
  });

  const isPlayerRegistered = (tournamentId: string) => {
    return currentPlayer?.registeredTournamentIds.includes(tournamentId);
  };

  const toggleRules = (id: string) => {
    sounds.playClick();
    setExpandedRulesId(expandedRulesId === id ? null : id);
  };

  return (
    <section className="mb-12">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-wide uppercase">
            {t.allTournaments}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Free Fire Duo custom matches with automated point systems & cash rewards
          </p>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.allTournaments}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('upcoming');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.upcoming}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('ongoing');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'ongoing'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.ongoing}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('free');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'free'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.freeEntry}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('completed');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'completed'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.completed}
          </button>
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTournaments.map((tour) => {
          const registered = isPlayerRegistered(tour.id);
          const isFull = tour.registeredSlots >= tour.maxSlots;
          const slotsPercentage = Math.round((tour.registeredSlots / tour.maxSlots) * 100);

          return (
            <div
              key={tour.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all flex flex-col shadow-lg shadow-black/40 group"
            >
              {/* Card Header with Map Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={tour.bannerImage || '/src/assets/images/ff_bermuda_arena_1794112327694.jpg'}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-slate-700 rounded-md text-amber-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tour.gameMap}</span>
                  </div>
                  <div className="px-2 py-1 text-xs font-semibold bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-md text-slate-300">
                    {tour.matchType}
                  </div>
                </div>

                <div className="absolute top-3 right-3">
                  {tour.status === 'ongoing' ? (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase bg-red-950/90 text-red-400 border border-red-500/80 rounded-md flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      {t.ongoing}
                    </span>
                  ) : tour.status === 'completed' ? (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-800 text-slate-300 rounded-md">
                      {t.completed}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40 rounded-md">
                      {tour.entryFee === 0 ? t.free : `₹${tour.entryFee}`}
                    </span>
                  )}
                </div>

                {/* Bottom title on card image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide truncate">
                    {language === 'hi' ? tour.titleHi : tour.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tour.scheduleDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tour.server}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                {/* Prize Breakdown & Fee */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-4 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">{t.prizePool}</div>
                    <div className="text-base font-bold font-mono text-amber-400">
                      ₹{tour.prizePool.toLocaleString()}
                    </div>
                  </div>
                  <div className="border-x border-slate-800">
                    <div className="text-[11px] text-slate-400">{t.firstPrize}</div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      ₹{tour.prizeBreakdown.first.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">{t.perKill}</div>
                    <div className="text-base font-bold font-mono text-white">
                      ₹{tour.prizeBreakdown.perKill}
                    </div>
                  </div>
                </div>

                {/* Slots Progress Gauge */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.slots} ({tour.registeredSlots}/{tour.maxSlots} Duos)</span>
                    </span>
                    <span className={`font-mono font-semibold ${isFull ? 'text-red-400' : 'text-amber-400'}`}>
                      {isFull ? t.full : `${tour.maxSlots - tour.registeredSlots} left`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isFull
                          ? 'bg-red-500'
                          : slotsPercentage > 75
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${Math.min(slotsPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Room Release Status Indicator */}
                <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-950/60 rounded-lg border border-slate-800/60 mb-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className={`w-3.5 h-3.5 ${tour.roomStatus === 'unlocked' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-slate-300">
                      {tour.roomStatus === 'unlocked' ? t.unlockedRoomMsg : t.lockedRoomMsg}
                    </span>
                  </div>
                  <span className={`font-semibold uppercase text-[11px] ${
                    tour.roomStatus === 'unlocked' ? 'text-emerald-400' : 'text-amber-500'
                  }`}>
                    {tour.roomStatus === 'unlocked' ? 'OPEN' : 'LOCKED'}
                  </span>
                </div>

                {/* Rules Dropdown Drawer */}
                <div className="border-t border-slate-800/80 pt-3 mb-4">
                  <button
                    onClick={() => toggleRules(tour.id)}
                    className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <Shield className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'hi' ? 'टूर्नामेंट नियम व एंटी-हैक दिशा-निर्देश' : 'Tournament Rules & Anti-Hack Policy'}</span>
                    </span>
                    {expandedRulesId === tour.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {expandedRulesId === tour.id && (
                    <div className="mt-2 p-3 bg-slate-950 rounded-lg text-xs text-slate-300 space-y-1.5 border border-slate-800">
                      {(language === 'hi' ? tour.rulesHi : tour.rulesEn).map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold shrink-0">›</span>
                          <span className="leading-relaxed">{rule}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 pt-2">
                  {/* Register Duo CTA */}
                  {tour.status === 'upcoming' && !isFull && !registered && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSelectTournamentForRegistration(tour);
                      }}
                      className="flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 rounded-xl shadow-md shadow-orange-950/40 transition-all cursor-pointer whitespace-nowrap text-center"
                    >
                      {t.joinNow}
                    </button>
                  )}

                  {registered && (
                    <div className="flex-1 py-2.5 px-3 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.registered}</span>
                    </div>
                  )}

                  {isFull && !registered && (
                    <div className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-400 bg-slate-800/60 rounded-xl text-center">
                      {t.full}
                    </div>
                  )}

                  {/* Room ID & Password Button */}
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenRoomModal(tour);
                    }}
                    className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      tour.roomStatus === 'unlocked'
                        ? 'bg-amber-950/70 border border-amber-500 text-amber-300 hover:bg-amber-900/80 shadow-md shadow-amber-950/40'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.viewRoom}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
