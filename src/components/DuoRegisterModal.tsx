import React, { useState } from 'react';
import { X, Users, Crosshair, Phone, ShieldCheck, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { Tournament, Language, Player, DuoTeam } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface DuoRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: Tournament | null;
  language: Language;
  currentPlayer: Player | null;
  onRegisterSuccess: (team: DuoTeam) => void;
}

export const DuoRegisterModal: React.FC<DuoRegisterModalProps> = ({
  isOpen,
  onClose,
  tournament,
  language,
  currentPlayer,
  onRegisterSuccess,
}) => {
  const t = translations[language];

  const [teamName, setTeamName] = useState('');
  const [p1Ign, setP1Ign] = useState(currentPlayer?.ign || '');
  const [p1Uid, setP1Uid] = useState(currentPlayer?.uid || '');
  const [p1Phone, setP1Phone] = useState(currentPlayer?.phone || '');

  const [p2Ign, setP2Ign] = useState('');
  const [p2Uid, setP2Uid] = useState('');
  const [p2Phone, setP2Phone] = useState('');

  const [agreeRules, setAgreeRules] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedTeam, setSubmittedTeam] = useState<DuoTeam | null>(null);
  const [slipCopied, setSlipCopied] = useState(false);

  if (!isOpen || !tournament) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!teamName.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपनी टीम का नाम दर्ज करें' : 'Please enter your Team Name');
      return;
    }
    if (!p1Ign.trim() || !p1Uid.trim() || !p1Phone.trim()) {
      setErrorMsg(language === 'hi' ? 'खिलाड़ी 1 की सभी जानकारी भरें' : 'Please fill all details for Player 1');
      return;
    }
    if (!p2Ign.trim() || !p2Uid.trim() || !p2Phone.trim()) {
      setErrorMsg(language === 'hi' ? 'खिलाड़ी 2 की सभी जानकारी भरें' : 'Please fill all details for Player 2');
      return;
    }

    // UID validation: numeric, 8-12 digits
    const uidRegex = /^\d{8,12}$/;
    if (!uidRegex.test(p1Uid.trim())) {
      setErrorMsg(language === 'hi' ? 'खिलाड़ी 1 की फ्री फायर यूआईडी में केवल 8-12 अंक होने चाहिए' : 'Player 1 Free Fire UID must be 8-12 numbers only');
      return;
    }
    if (!uidRegex.test(p2Uid.trim())) {
      setErrorMsg(language === 'hi' ? 'खिलाड़ी 2 की फ्री फायर यूआईडी में केवल 8-12 अंक होने चाहिए' : 'Player 2 Free Fire UID must be 8-12 numbers only');
      return;
    }

    if (p1Uid.trim() === p2Uid.trim()) {
      setErrorMsg(language === 'hi' ? 'दोनों खिलाड़ियों की यूआईडी अलग-अलग होनी चाहिए' : 'Both players must have different Free Fire UIDs');
      return;
    }

    if (!agreeRules) {
      setErrorMsg(language === 'hi' ? 'कृपया नियमों और फेयर प्ले शर्तों को स्वीकार करें' : 'Please accept the fair-play tournament terms');
      return;
    }

    const assignedSlot = tournament.registeredSlots + 1;
    const newTeam: DuoTeam = {
      id: `team-${Date.now()}`,
      tournamentId: tournament.id,
      teamName: teamName.trim().toUpperCase(),
      player1: {
        ign: p1Ign.trim(),
        uid: p1Uid.trim(),
        phone: p1Phone.trim(),
      },
      player2: {
        ign: p2Ign.trim(),
        uid: p2Uid.trim(),
        phone: p2Phone.trim(),
      },
      slotNumber: assignedSlot,
      registeredAt: 'Just now',
      status: 'confirmed',
    };

    sounds.playBooyah();
    setSubmittedTeam(newTeam);
    onRegisterSuccess(newTeam);
  };

  const handleCopySlip = () => {
    if (!submittedTeam) return;
    const slipText = `🔥 MP FIGHTER DUO TOURNAMENT PASS 🔥\nTournament: ${tournament.title}\nMap: ${tournament.gameMap}\nDate: ${tournament.scheduleDate}\nAssigned Slot: #${submittedTeam.slotNumber}\nTeam Name: ${submittedTeam.teamName}\nPlayer 1: ${submittedTeam.player1.ign} (UID: ${submittedTeam.player1.uid})\nPlayer 2: ${submittedTeam.player2.ign} (UID: ${submittedTeam.player2.uid})\nRoom ID & Password unlocks 15m before match!`;
    navigator.clipboard.writeText(slipText).then(() => {
      sounds.playSuccess();
      setSlipCopied(true);
      setTimeout(() => setSlipCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-100">
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

        {submittedTeam ? (
          /* Confirmation Receipt View */
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white uppercase">
                {t.registrationSuccess}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                {t.registrationSuccessDetail}
              </p>
            </div>

            {/* Official Tournament Pass Card */}
            <div className="p-5 bg-slate-950 border border-amber-500/40 rounded-xl relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-slate-950 text-[11px] font-bold uppercase rounded-bl-lg">
                Slot #{submittedTeam.slotNumber}
              </div>

              <div className="text-xs text-amber-400 font-mono mb-1">
                MP FIGHTER DUO ENTRY PASS
              </div>
              <h4 className="font-display text-xl font-bold text-white mb-2">
                {submittedTeam.teamName}
              </h4>

              <div className="text-xs text-slate-400 mb-4">
                <span>{tournament.title}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{tournament.gameMap}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{tournament.scheduleDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg">
                  <div className="text-slate-400 text-[11px]">{t.player1Title}</div>
                  <div className="font-bold text-white">{submittedTeam.player1.ign}</div>
                  <div className="text-amber-400 font-mono">UID: {submittedTeam.player1.uid}</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg">
                  <div className="text-slate-400 text-[11px]">{t.player2Title}</div>
                  <div className="font-bold text-white">{submittedTeam.player2.ign}</div>
                  <div className="text-amber-400 font-mono">UID: {submittedTeam.player2.uid}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopySlip}
                className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {slipCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{slipCopied ? t.copied : (language === 'hi' ? 'पास कॉपी करें' : 'Copy Duo Pass')}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'पूर्ण करें' : 'Done & Return'}
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <Users className="w-4 h-4" />
                <span>{tournament.gameMap} · {tournament.matchType}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white uppercase">
                {t.duoRegTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {tournament.title} · {t.entryFee}: <strong className="text-emerald-400">{tournament.entryFee === 0 ? t.free : `₹${tournament.entryFee}`}</strong>
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Team Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.teamName} <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder={t.teamNamePlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white placeholder-slate-600"
                />
              </div>

              {/* Player 1 Section */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-3">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{t.player1Title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.ignLabel}</label>
                    <input
                      type="text"
                      required
                      value={p1Ign}
                      onChange={(e) => setP1Ign(e.target.value)}
                      placeholder={t.ignPlaceholder}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:border-amber-500 focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.uidLabel}</label>
                    <input
                      type="text"
                      required
                      value={p1Uid}
                      onChange={(e) => setP1Uid(e.target.value)}
                      placeholder={t.uidPlaceholder}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:border-amber-500 focus:outline-none text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.phoneLabel}</label>
                    <input
                      type="tel"
                      required
                      value={p1Phone}
                      onChange={(e) => setP1Phone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:border-amber-500 focus:outline-none text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Player 2 Section */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-3">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{t.player2Title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.ignLabel}</label>
                    <input
                      type="text"
                      required
                      value={p2Ign}
                      onChange={(e) => setP2Ign(e.target.value)}
                      placeholder="e.g. MP_KILLER_07"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:border-amber-500 focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.uidLabel}</label>
                    <input
                      type="text"
                      required
                      value={p2Uid}
                      onChange={(e) => setP2Uid(e.target.value)}
                      placeholder="e.g. 2049182741"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:border-amber-500 focus:outline-none text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.phoneLabel}</label>
                    <input
                      type="tel"
                      required
                      value={p2Phone}
                      onChange={(e) => setP2Phone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:border-amber-500 focus:outline-none text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agreeRules"
                  checked={agreeRules}
                  onChange={(e) => setAgreeRules(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="agreeRules" className="text-xs text-slate-400 cursor-pointer">
                  {t.rulesAgreement}
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 rounded-xl shadow-lg shadow-orange-950/50 transition-all cursor-pointer text-center"
                >
                  {t.confirmAndRegister}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
