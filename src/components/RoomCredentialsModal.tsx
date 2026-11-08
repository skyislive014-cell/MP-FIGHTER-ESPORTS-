import React, { useState, useEffect } from 'react';
import { X, KeyRound, Copy, Check, ShieldAlert, Clock, AlertCircle, Smartphone, Lock, Unlock } from 'lucide-react';
import { Tournament, Language, Player } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface RoomCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: Tournament | null;
  language: Language;
  currentPlayer: Player | null;
  isAdmin: boolean;
  onUnlockByAdmin?: (tournamentId: string) => void;
}

export const RoomCredentialsModal: React.FC<RoomCredentialsModalProps> = ({
  isOpen,
  onClose,
  tournament,
  language,
  currentPlayer,
  isAdmin,
  onUnlockByAdmin,
}) => {
  const t = translations[language];
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [countdownMinutes, setCountdownMinutes] = useState(14);
  const [countdownSeconds, setCountdownSeconds] = useState(45);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdownSeconds((sec) => {
        if (sec > 0) return sec - 1;
        setCountdownMinutes((min) => (min > 0 ? min - 1 : 0));
        return 59;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !tournament) return null;

  const isRegistered = currentPlayer?.registeredTournamentIds.includes(tournament.id);
  const canView = isRegistered || isAdmin || tournament.roomStatus === 'unlocked';
  const isUnlocked = tournament.roomStatus === 'unlocked';

  const copyRoomId = () => {
    if (!tournament.roomId) return;
    navigator.clipboard.writeText(tournament.roomId).then(() => {
      sounds.playSuccess();
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    });
  };

  const copyRoomPass = () => {
    if (!tournament.roomPassword) return;
    navigator.clipboard.writeText(tournament.roomPassword).then(() => {
      sounds.playSuccess();
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
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

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <KeyRound className="w-4 h-4" />
          <span>{tournament.gameMap} · {tournament.matchType}</span>
        </div>
        <h3 className="font-display text-2xl font-bold text-white uppercase mb-1">
          {t.roomModalTitle}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {tournament.title} · {tournament.scheduleDate}
        </p>

        {/* Access State Conditioning */}
        {!canView ? (
          /* Not registered & Not unlocked */
          <div className="p-5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-center mb-6">
            <Lock className="w-10 h-10 mx-auto text-amber-500 mb-2" />
            <div className="font-bold text-white text-sm mb-1">
              {language === 'hi' ? 'केवल पंजीकृत टीमों के लिए आरक्षित' : 'Protected Room Credentials'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {language === 'hi'
                ? 'कस्टम रूम आईडी और पासवर्ड केवल उन खिलाड़ियों को दिखाई देगा जिन्होंने इस टूर्नामेंट में अपनी डुओ टीम रजिस्टर की है।'
                : 'Room ID & Password are only accessible by players who registered their duo team for this match or Tournament Admins.'}
            </p>
            <div className="text-[11px] text-slate-400">
              {language === 'hi' ? 'कृपया पहले अपनी डुओ टीम रजिस्टर करें' : 'Please register your duo team on the tournament card'}
            </div>
          </div>
        ) : !isUnlocked && !isAdmin ? (
          /* Registered, but room is locked until 15m before match */
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center mb-6">
            <Clock className="w-10 h-10 mx-auto text-amber-400 animate-spin mb-3" style={{ animationDuration: '6s' }} />
            <div className="font-display text-xl font-bold text-white uppercase mb-1">
              {language === 'hi' ? 'रूम आईडी जल्द जारी होगी' : 'Room ID Locked'}
            </div>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mb-4">
              {t.roomLockedNotice}
            </p>
            {/* Countdown timer */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-amber-500/30 rounded-xl font-mono text-base font-bold text-amber-400">
              <span>{String(countdownMinutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span>{String(countdownSeconds).padStart(2, '0')}s</span>
            </div>
          </div>
        ) : (
          /* Unlocked Credentials Display */
          <div className="space-y-4 mb-6">
            {isAdmin && !isUnlocked && (
              <div className="p-3 bg-amber-950/60 border border-amber-500/50 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                <span>Admin View (Room is currently locked for normal players)</span>
                {onUnlockByAdmin && (
                  <button
                    onClick={() => onUnlockByAdmin(tournament.id)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300"
                  >
                    Release Now
                  </button>
                )}
              </div>
            )}

            {/* Room ID Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  {t.roomIdLabel}
                </span>
                <span className="font-mono text-2xl font-black text-amber-400 tracking-wider">
                  {tournament.roomId || '83920194'}
                </span>
              </div>
              <button
                onClick={copyRoomId}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? t.copied : t.copyId}</span>
              </button>
            </div>

            {/* Room Password Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  {t.roomPassLabel}
                </span>
                <span className="font-mono text-2xl font-black text-white tracking-widest">
                  {tournament.roomPassword || '778'}
                </span>
              </div>
              <button
                onClick={copyRoomPass}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPass ? t.copied : t.copyPass}</span>
              </button>
            </div>
          </div>
        )}

        {/* Free Fire Join Steps */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-2 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.howToJoinTitle}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{t.step1}</p>
          <p className="text-slate-300 leading-relaxed">{t.step2}</p>
          <p className="text-slate-300 leading-relaxed">{t.step3}</p>
        </div>

        <div className="text-[11px] text-red-400/90 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>{t.warningNotice}</span>
        </div>
      </div>
    </div>
  );
};
