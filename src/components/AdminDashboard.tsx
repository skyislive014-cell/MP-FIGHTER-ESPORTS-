import React, { useState } from 'react';
import {
  Shield, Plus, KeyRound, Trophy, Users, Send, Trash2, Edit3, CheckCircle,
  AlertTriangle, Flame, Clock, RefreshCw, X, Radio, ArrowLeft
} from 'lucide-react';
import { Tournament, DuoTeam, PointsTableRow, Language, NotificationItem, TournamentMap } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  tournaments: Tournament[];
  duoTeams: DuoTeam[];
  pointsTable: PointsTableRow[];
  language: Language;
  onUpdateTournaments: (tournaments: Tournament[]) => void;
  onUpdatePointsTable: (points: PointsTableRow[]) => void;
  onBroadcastNotification: (notification: NotificationItem) => void;
  onAdminLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  tournaments,
  duoTeams,
  pointsTable,
  language,
  onUpdateTournaments,
  onUpdatePointsTable,
  onBroadcastNotification,
  onAdminLogout,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'tournaments' | 'rooms' | 'scoring' | 'teams' | 'broadcast'>('tournaments');

  // New Tournament State
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newMap, setNewMap] = useState<TournamentMap>('Bermuda');
  const [newEntryFee, setNewEntryFee] = useState(0);
  const [newPrizePool, setNewPrizePool] = useState(2000);
  const [newSchedule, setNewSchedule] = useState('Tomorrow, 8:00 PM IST');
  const [newMaxSlots, setNewMaxSlots] = useState(24);

  // Room Credentials State
  const [selectedTourForRoom, setSelectedTourForRoom] = useState<string>(tournaments[0]?.id || '');
  const [editRoomId, setEditRoomId] = useState('');
  const [editRoomPass, setEditRoomPass] = useState('');
  const [roomSuccessNotice, setRoomSuccessNotice] = useState('');

  // Live Scoring State
  const [livePointsCopy, setLivePointsCopy] = useState<PointsTableRow[]>(pointsTable);

  // Broadcast state
  const [bcTitle, setBcTitle] = useState('');
  const [bcTitleHi, setBcTitleHi] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcMessageHi, setBcMessageHi] = useState('');
  const [bcSuccess, setBcSuccess] = useState(false);

  if (!isOpen) return null;

  // Handler: Create Tournament
  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTour: Tournament = {
      id: `mp-tour-${Date.now()}`,
      title: newTitle.trim(),
      titleHi: newTitleHi.trim() || newTitle.trim(),
      subtitle: 'Free Fire competitive duo clash with live points broadcast',
      gameMap: newMap,
      matchType: 'Duo Custom BR',
      server: 'India (MP Region)',
      entryFee: Number(newEntryFee),
      prizePool: Number(newPrizePool),
      prizeBreakdown: {
        first: Math.round(Number(newPrizePool) * 0.6),
        second: Math.round(Number(newPrizePool) * 0.25),
        third: Math.round(Number(newPrizePool) * 0.15),
        perKill: 20,
      },
      scheduleDate: newSchedule.trim(),
      startTimeIso: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      status: 'upcoming',
      maxSlots: Number(newMaxSlots) || 24,
      registeredSlots: 0,
      bannerImage: newMap === 'Bermuda'
        ? '/src/assets/images/ff_bermuda_arena_1794112327694.jpg'
        : '/src/assets/images/hero_esports_banner_1794112327194.jpg',
      roomId: '',
      roomPassword: '',
      roomStatus: 'locked',
      roomReleaseMinutesBefore: 15,
      rulesEn: [
        'Free Fire official tournament rules apply.',
        'Emulators prohibited. Mobile devices only.',
        'Room ID will be released 15 minutes before match.'
      ],
      rulesHi: [
        'फ्री फायर आधिकारिक ई-स्पोर्ट्स नियम लागू होंगे।',
        'केवल मोबाइल खिलाड़ी मान्य हैं।',
        'मैच से 15 मिनट पहले रूम आईडी जारी की जाएगी।'
      ]
    };

    const updated = [newTour, ...tournaments];
    onUpdateTournaments(updated);
    sounds.playBooyah();
    setIsCreatingTour(false);
    setNewTitle('');
    setNewTitleHi('');
  };

  // Handler: Delete Tournament
  const handleDeleteTournament = (id: string) => {
    if (confirm(language === 'hi' ? 'क्या आप इस टूर्नामेंट को हटाना चाहते हैं?' : 'Are you sure you want to delete this tournament?')) {
      sounds.playClick();
      const updated = tournaments.filter((t) => t.id !== id);
      onUpdateTournaments(updated);
    }
  };

  // Handler: Toggle Tournament Status
  const handleToggleStatus = (id: string, newStatus: 'upcoming' | 'ongoing' | 'completed') => {
    sounds.playClick();
    const updated = tournaments.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    onUpdateTournaments(updated);
  };

  // Handler: Publish Room ID & Pass
  const handlePublishRoom = (unlocked: boolean) => {
    const tour = tournaments.find((t) => t.id === selectedTourForRoom);
    if (!tour) return;

    const updated = tournaments.map((t) => {
      if (t.id === selectedTourForRoom) {
        return {
          ...t,
          roomId: editRoomId || t.roomId || '89432104',
          roomPassword: editRoomPass || t.roomPassword || '442',
          roomStatus: (unlocked ? 'unlocked' : 'locked') as 'unlocked' | 'locked',
        };
      }
      return t;
    });

    onUpdateTournaments(updated);
    sounds.playBooyah();

    if (unlocked) {
      // Send notification alert
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Room ID Released: ${tour.title}`,
        titleHi: `रूम आईडी जारी: ${tour.titleHi || tour.title}`,
        message: `Custom Room ID: ${editRoomId || '89432104'} | Pass: ${editRoomPass || '442'}. Join now within 10 minutes!`,
        messageHi: `कस्टम रूम आईडी: ${editRoomId || '89432104'} | पासवर्ड: ${editRoomPass || '442'}। 10 मिनट के भीतर तुरंत जुड़ें!`,
        timestamp: 'Just now',
        type: 'room_released',
        read: false,
        tournamentId: tour.id,
        roomId: editRoomId || '89432104',
        roomPassword: editRoomPass || '442',
      };
      onBroadcastNotification(notif);
      setRoomSuccessNotice('Room Credentials Published & Broadcasted to all players!');
    } else {
      setRoomSuccessNotice('Room Credentials Locked.');
    }

    setTimeout(() => setRoomSuccessNotice(''), 3000);
  };

  // Handler: Update Duo Live Points
  const handleKillChange = (teamId: string, delta: number) => {
    sounds.playClick();
    setLivePointsCopy((prev) =>
      prev.map((row) => {
        if (row.teamId === teamId) {
          const newKills = Math.max(0, row.kills + delta);
          return {
            ...row,
            kills: newKills,
            killPoints: newKills,
            totalPoints: row.placementPoints + newKills,
          };
        }
        return row;
      })
    );
  };

  const handleBooyahAssign = (teamId: string) => {
    sounds.playBooyah();
    setLivePointsCopy((prev) =>
      prev.map((row) => {
        if (row.teamId === teamId) {
          const newPlacement = 12; // 1st place Booyah = 12 pts
          return {
            ...row,
            booyahs: row.booyahs + 1,
            placementPoints: newPlacement,
            totalPoints: newPlacement + row.killPoints,
          };
        }
        return row;
      })
    );
  };

  const handleSavePointsTable = () => {
    sounds.playSuccess();
    onUpdatePointsTable(livePointsCopy);
    alert(language === 'hi' ? 'अंक तालिका सफलतापूर्वक अपडेट की गई!' : 'Points table saved and published live!');
  };

  // Handler: Broadcast Announcement
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcMessage.trim()) return;

    const notif: NotificationItem = {
      id: `bc-${Date.now()}`,
      title: bcTitle.trim(),
      titleHi: bcTitleHi.trim() || bcTitle.trim(),
      message: bcMessage.trim(),
      messageHi: bcMessageHi.trim() || bcMessage.trim(),
      timestamp: 'Just now',
      type: 'announcement',
      read: false,
    };

    onBroadcastNotification(notif);
    sounds.playSuccess();
    setBcSuccess(true);
    setBcTitle('');
    setBcTitleHi('');
    setBcMessage('');
    setBcMessageHi('');
    setTimeout(() => setBcSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 text-slate-100 my-6 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span>{t.adminTitle}</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded">
                  AUTHENTICATED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {t.adminSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onAdminLogout();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 rounded-lg transition-colors cursor-pointer"
            >
              Admin Exit
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-800/80 overflow-x-auto shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('tournaments');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tournaments' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t.tabManageTournaments}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('rooms');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rooms' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{t.tabRoomReleaser}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('scoring');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scoring' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.tabLiveScoring}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('teams');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'teams' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.tabDuoTeams} ({duoTeams.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('broadcast');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'broadcast' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.tabBroadcast}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* TAB 1: TOURNAMENT MANAGEMENT */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  All Active & Scheduled Tournaments ({tournaments.length})
                </h3>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsCreatingTour(!isCreatingTour);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.createNewTournament}</span>
                </button>
              </div>

              {/* Create Tournament Form Drawer */}
              {isCreatingTour && (
                <form onSubmit={handleCreateTournament} className="p-5 bg-slate-950 border border-amber-500/40 rounded-xl space-y-4">
                  <div className="font-display text-lg font-bold text-amber-400 uppercase">
                    New Free Fire Tournament
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. MP FIGHTER Super Cup"
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Title (Hindi)</label>
                      <input
                        type="text"
                        value={newTitleHi}
                        onChange={(e) => setNewTitleHi(e.target.value)}
                        placeholder="उदा. एमपी फाइटर सुपर कप"
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Battle Map</label>
                      <select
                        value={newMap}
                        onChange={(e) => setNewMap(e.target.value as TournamentMap)}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                      >
                        <option value="Bermuda">Bermuda</option>
                        <option value="Purgatory">Purgatory</option>
                        <option value="Kalahari">Kalahari</option>
                        <option value="Alpine">Alpine</option>
                        <option value="Nexterra">Nexterra</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Entry Fee (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={newEntryFee}
                        onChange={(e) => setNewEntryFee(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Prize Pool (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={newPrizePool}
                        onChange={(e) => setNewPrizePool(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Max Duo Slots</label>
                      <input
                        type="number"
                        min="12"
                        max="24"
                        value={newMaxSlots}
                        onChange={(e) => setNewMaxSlots(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Schedule / Date & Time</label>
                    <input
                      type="text"
                      value={newSchedule}
                      onChange={(e) => setNewSchedule(e.target.value)}
                      placeholder="e.g. Tonight, 9:00 PM IST"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingTour(false)}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                    >
                      Publish Tournament
                    </button>
                  </div>
                </form>
              )}

              {/* Tournament List Table */}
              <div className="space-y-3">
                {tournaments.map((tour) => (
                  <div
                    key={tour.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="text-amber-400 font-bold">{tour.gameMap}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400 font-mono">{tour.scheduleDate}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-emerald-400 font-mono">Prize: ₹{tour.prizePool}</span>
                      </div>
                      <div className="font-display text-lg font-bold text-white">
                        {tour.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Slots: {tour.registeredSlots}/{tour.maxSlots} duos · Room Status:{' '}
                        <strong className={tour.roomStatus === 'unlocked' ? 'text-emerald-400' : 'text-amber-500'}>
                          {tour.roomStatus.toUpperCase()}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Toggle */}
                      <select
                        value={tour.status}
                        onChange={(e) => handleToggleStatus(tour.id, e.target.value as any)}
                        className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Live (Ongoing)</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTournament(tour.id)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Delete Tournament"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ROOM ID & PASS RELEASER */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  {t.tabRoomReleaser}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set Custom Room credentials and publish to all registered duo players with 1 click.
                </p>
              </div>

              {roomSuccessNotice && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{roomSuccessNotice}</span>
                </div>
              )}

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Target Match
                  </label>
                  <select
                    value={selectedTourForRoom}
                    onChange={(e) => setSelectedTourForRoom(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.gameMap} - {t.scheduleDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Free Fire Room ID
                    </label>
                    <input
                      type="text"
                      value={editRoomId}
                      onChange={(e) => setEditRoomId(e.target.value)}
                      placeholder="e.g. 89432104"
                      className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Room Password
                    </label>
                    <input
                      type="text"
                      value={editRoomPass}
                      onChange={(e) => setEditRoomPass(e.target.value)}
                      placeholder="e.g. 778"
                      className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => handlePublishRoom(true)}
                    className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{t.releaseRoomCredentials} (Broadcast)</span>
                  </button>

                  <button
                    onClick={() => handlePublishRoom(false)}
                    className="py-3 px-4 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer"
                  >
                    {t.unreleaseRoom}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE POINTS & SCORING */}
          {activeTab === 'scoring' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-white uppercase">
                    Live Match Score Manager
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust kills & assign Booyah. Total points automatically calculated based on Official Free Fire scoring.
                  </p>
                </div>

                <button
                  onClick={handleSavePointsTable}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Save & Publish Standings
                </button>
              </div>

              {/* Scorer Grid */}
              <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-3 text-center">Booyah</th>
                      <th className="py-3 px-3 text-center">Kills (Kill Pts)</th>
                      <th className="py-3 px-3 text-center">Placement Pts</th>
                      <th className="py-3 px-4 text-right">Total Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {livePointsCopy.map((row) => (
                      <tr key={row.teamId} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-white">
                          <div>{row.teamName}</div>
                          <div className="text-[10px] text-slate-500">{row.players.join(', ')}</div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleBooyahAssign(row.teamId)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
                          >
                            +1 Booyah
                          </button>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleKillChange(row.teamId, -1)}
                              className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-sm font-bold text-white w-6">
                              {row.kills}
                            </span>
                            <button
                              onClick={() => handleKillChange(row.teamId, 1)}
                              className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center font-mono text-slate-300">
                          {row.placementPoints}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-black text-amber-400 text-sm">
                          {row.totalPoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REGISTERED DUOS */}
          {activeTab === 'teams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-white uppercase">
                    All Registered Duo Teams ({duoTeams.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verify player Free Fire UIDs, slot allotments, and contact details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {duoTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-display text-lg font-bold text-white">
                        {team.teamName}
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500 text-slate-950 rounded">
                        Slot #{team.slotNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-900 rounded-lg">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">P1 (Leader)</div>
                        <div className="font-bold text-white truncate">{team.player1.ign}</div>
                        <div className="text-amber-400 font-mono text-[11px]">UID: {team.player1.uid}</div>
                        <div className="text-slate-500 text-[10px]">{team.player1.phone}</div>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded-lg">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">P2 (Partner)</div>
                        <div className="font-bold text-white truncate">{team.player2.ign}</div>
                        <div className="text-amber-400 font-mono text-[11px]">UID: {team.player2.uid}</div>
                        <div className="text-slate-500 text-[10px]">{team.player2.phone}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  Broadcast In-App Announcement
                </h3>
                <p className="text-xs text-slate-400">
                  Sends an instant notification alert to all users in both English & Hindi.
                </p>
              </div>

              {bcSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Announcement Broadcasted to All Players!</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Announcement Title (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={bcTitle}
                    onChange={(e) => setBcTitle(e.target.value)}
                    placeholder="e.g. Schedule Update: Bermuda match postponed by 10m"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    शीर्षक (Hindi)
                  </label>
                  <input
                    type="text"
                    value={bcTitleHi}
                    onChange={(e) => setBcTitleHi(e.target.value)}
                    placeholder="उदा. शेड्यूल अपडेट: बरमूडा मैच 10 मिनट विलंबित"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Message Details (EN) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bcMessage}
                    onChange={(e) => setBcMessage(e.target.value)}
                    placeholder="Provide context or instructions for players..."
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    संदेश विवरण (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={bcMessageHi}
                    onChange={(e) => setBcMessageHi(e.target.value)}
                    placeholder="खिलाड़ियों के लिए विस्तृत निर्देश..."
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.sendBroadcast}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
