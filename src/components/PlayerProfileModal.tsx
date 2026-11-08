import React from 'react';
import { X, User, Trophy, Skull, Flame, Wallet, LogOut, KeyRound, MapPin, Shield } from 'lucide-react';
import { Player, Tournament, Language } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  tournaments: Tournament[];
  language: Language;
  onLogout: () => void;
  onOpenRoomModal: (tournament: Tournament) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
  player,
  tournaments,
  language,
  onLogout,
  onOpenRoomModal,
}) => {
  const t = translations[language];

  if (!isOpen || !player) return null;

  const registeredTournaments = tournaments.filter((t) =>
    player.registeredTournamentIds.includes(t.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-0.5 shadow-lg shadow-orange-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-display text-2xl font-black text-amber-400">
              {player.ign.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                {player.ign}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-md">
                {player.role}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              FF UID: <span className="text-white font-bold">{player.uid}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{player.city || 'Bhopal'}, {player.state}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wallet</span>
            </div>
            <div className="font-mono text-lg font-bold text-emerald-400">
              ₹{player.balance}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Skull className="w-3.5 h-3.5 text-red-400" />
              <span>Total Kills</span>
            </div>
            <div className="font-mono text-lg font-bold text-white">
              {player.totalKills}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Booyahs</span>
            </div>
            <div className="font-mono text-lg font-bold text-amber-400">
              {player.booyahs}
            </div>
          </div>
        </div>

        {/* Registered Tournaments */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Registered Tournaments ({registeredTournaments.length})
          </h4>
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {registeredTournaments.length === 0 ? (
              <div className="p-4 bg-slate-950 rounded-xl text-center text-xs text-slate-500">
                You haven't joined any tournaments yet.
              </div>
            ) : (
              registeredTournaments.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white truncate max-w-[200px]">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {t.gameMap} · {t.scheduleDate}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenRoomModal(t);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-950/80 border border-amber-500/50 rounded-lg text-amber-300 font-bold hover:bg-amber-900 transition-colors cursor-pointer shrink-0"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Room</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onLogout();
            onClose();
          }}
          className="w-full py-2.5 px-4 text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};
