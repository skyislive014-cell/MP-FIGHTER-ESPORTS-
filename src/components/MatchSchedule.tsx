import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Trophy, Shield, KeyRound, ChevronRight, Play } from 'lucide-react';
import { Tournament, Language, Player } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface MatchScheduleProps {
  tournaments: Tournament[];
  language: Language;
  onOpenRoomModal: (tournament: Tournament) => void;
  onSelectTournamentForRegistration: (tournament: Tournament) => void;
  currentPlayer: Player | null;
}

export const MatchSchedule: React.FC<MatchScheduleProps> = ({
  tournaments,
  language,
  onOpenRoomModal,
  onSelectTournamentForRegistration,
  currentPlayer,
}) => {
  const t = translations[language];
  const [tab, setTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  const filteredTournaments = tournaments.filter((t) => t.status === tab);

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Official MP Esports Calendar</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-wide uppercase">
            {t.navSchedule}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track match start times, custom room releases, map rotations, and server schedules
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              sounds.playClick();
              setTab('upcoming');
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'upcoming' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.upcoming}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setTab('ongoing');
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'ongoing' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.ongoing}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setTab('completed');
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'completed' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.completed}
          </button>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {filteredTournaments.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            {language === 'hi' ? 'इस श्रेणी में वर्तमान में कोई मैच निर्धारित नहीं है।' : 'No matches scheduled in this category at the moment.'}
          </div>
        ) : (
          filteredTournaments.map((tour) => {
            const isRegistered = currentPlayer?.registeredTournamentIds.includes(tour.id);
            const isFull = tour.registeredSlots >= tour.maxSlots;

            return (
              <div
                key={tour.id}
                className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all shadow-md"
              >
                {/* Time & Map Icon */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-400 mb-1" />
                    <span className="font-mono text-[10px] font-bold text-slate-300">
                      {tour.status === 'ongoing' ? 'LIVE' : 'IST'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                        {tour.gameMap}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{tour.matchType}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white font-mono">{tour.scheduleDate}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white tracking-wide">
                      {language === 'hi' ? tour.titleHi : tour.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                      <span>Prize: <strong className="text-amber-400 font-mono">₹{tour.prizePool}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Slots: <strong className="text-white font-mono">{tour.registeredSlots}/{tour.maxSlots}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400">{tour.entryFee === 0 ? t.free : `Fee: ₹${tour.entryFee}`}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  {tour.status === 'upcoming' && !isRegistered && !isFull && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSelectTournamentForRegistration(tour);
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      {t.joinNow}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenRoomModal(tour);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      tour.roomStatus === 'unlocked'
                        ? 'bg-amber-950/80 border border-amber-500 text-amber-300 hover:bg-amber-900 shadow-md'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.viewRoom}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
