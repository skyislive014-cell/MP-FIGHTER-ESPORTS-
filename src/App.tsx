import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TournamentList } from './components/TournamentList';
import { MatchSchedule } from './components/MatchSchedule';
import { LivePointsTable } from './components/LivePointsTable';
import { WinnersHallOfFame } from './components/WinnersHallOfFame';
import { MatchResults } from './components/MatchResults';
import { DuoRegisterModal } from './components/DuoRegisterModal';
import { RoomCredentialsModal } from './components/RoomCredentialsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { StorageService } from './services/storage';
import { Tournament, DuoTeam, Player, PointsTableRow, Winner, MatchResult, NotificationItem, Language } from './types';
import { translations } from './translations';
import { sounds } from './utils/audio';
import { Flame, Shield, KeyRound, Trophy, Crosshair, Users, Bell, ExternalLink } from 'lucide-react';

export default function App() {
  // App state
  const [language, setLanguage] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<string>('tournaments');

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [duoTeams, setDuoTeams] = useState<DuoTeam[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [pointsTable, setPointsTable] = useState<PointsTableRow[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Modal controls
  const [duoModalTour, setDuoModalTour] = useState<Tournament | null>(null);
  const [roomModalTour, setRoomModalTour] = useState<Tournament | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<{ open: boolean; tab: 'login' | 'register' | 'admin' }>({
    open: false,
    tab: 'login',
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setLanguage(StorageService.getLanguage());
    setTournaments(StorageService.getTournaments());
    setDuoTeams(StorageService.getDuoTeams());
    setCurrentPlayer(StorageService.getCurrentPlayer());
    setPointsTable(StorageService.getPointsTable());
    setWinners(StorageService.getWinners());
    setMatchResults(StorageService.getMatchResults());
    setNotifications(StorageService.getNotifications());
    setIsAdmin(StorageService.isAdminLoggedIn());
  }, []);

  const t = translations[language];

  // Language toggle
  const handleLanguageToggle = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    StorageService.setLanguage(nextLang);
  };

  // Duo Registration success
  const handleDuoRegisterSuccess = (newTeam: DuoTeam) => {
    StorageService.registerDuoTeam(newTeam);
    setDuoTeams(StorageService.getDuoTeams());
    setTournaments(StorageService.getTournaments());
    setCurrentPlayer(StorageService.getCurrentPlayer());

    // Add confirmation notification
    const tour = tournaments.find((t) => t.id === newTeam.tournamentId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Duo Team Registered!',
      titleHi: 'डुओ टीम पंजीकृत!',
      message: `Your duo "${newTeam.teamName}" is registered for ${tour?.title || 'Tournament'}. Slot #${newTeam.slotNumber} confirmed.`,
      messageHi: `आपकी डुओ टीम "${newTeam.teamName}" ${tour?.titleHi || 'टूर्नामेंट'} के लिए पंजीकृत हो गई है। स्लॉट #${newTeam.slotNumber} पक्का हुआ।`,
      timestamp: 'Just now',
      type: 'registration_success',
      read: false,
      tournamentId: newTeam.tournamentId,
    };
    StorageService.addNotification(notif);
    setNotifications(StorageService.getNotifications());
  };

  // Room Unlock by Admin
  const handleUnlockRoom = (tournamentId: string) => {
    const updated = tournaments.map((t) =>
      t.id === tournamentId ? { ...t, roomStatus: 'unlocked' as const } : t
    );
    StorageService.saveTournaments(updated);
    setTournaments(updated);
    sounds.playBooyah();
  };

  // Update Points Table
  const handleUpdatePointsTable = (updatedTable: PointsTableRow[]) => {
    StorageService.savePointsTable(updatedTable);
    setPointsTable(StorageService.getPointsTable());
  };

  // Broadcast Notification
  const handleBroadcastNotification = (notif: NotificationItem) => {
    StorageService.addNotification(notif);
    setNotifications(StorageService.getNotifications());
  };

  // Auth Handlers
  const handlePlayerLoginSuccess = (player: Player) => {
    StorageService.saveCurrentPlayer(player);
    setCurrentPlayer(player);
  };

  const handleAdminLoginSuccess = () => {
    StorageService.setAdminLoggedIn(true);
    setIsAdmin(true);
    setIsAdminDashboardOpen(true);
  };

  const handleLogout = () => {
    StorageService.saveCurrentPlayer(null);
    setCurrentPlayer(null);
    sounds.playClick();
  };

  const handleAdminLogout = () => {
    StorageService.setAdminLoggedIn(false);
    setIsAdmin(false);
    sounds.playClick();
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const totalPrizeDistributed = winners.reduce((acc, w) => acc + w.prizePool, 0) + 12500;
  const activeUnlockedTournament = tournaments.find((t) => t.roomStatus === 'unlocked');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageToggle={handleLanguageToggle}
        activeSection={activeSection}
        onNavigate={(section) => {
          setActiveSection(section);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        currentPlayer={currentPlayer}
        isAdmin={isAdmin}
        onOpenAuth={(tab = 'login') => setAuthModalState({ open: true, tab })}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
      />

      {/* Live Custom Room Broadcast Banner (if any room is live) */}
      {activeUnlockedTournament && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-slate-950 py-2 px-4 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping shrink-0" />
              <span>
                {language === 'hi'
                  ? `कस्टम रूम खुला है: ${activeUnlockedTournament.titleHi} (${activeUnlockedTournament.gameMap})`
                  : `CUSTOM ROOM OPEN: ${activeUnlockedTournament.title} (${activeUnlockedTournament.gameMap})`}
              </span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setRoomModalTour(activeUnlockedTournament);
              }}
              className="px-3 py-1 bg-slate-950 text-amber-400 rounded-md font-mono hover:bg-slate-900 transition-colors cursor-pointer text-center whitespace-nowrap"
            >
              {language === 'hi' ? 'आईडी व पासवर्ड कॉपी करें' : 'View Room ID & Password'}
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        {activeSection === 'tournaments' && (
          <HeroBanner
            language={language}
            onRegisterClick={() => {
              const target = tournaments.find((t) => t.status === 'upcoming') || tournaments[0];
              if (target) setDuoModalTour(target);
            }}
            onScheduleClick={() => setActiveSection('schedule')}
            onOpenRoomModal={(tour) => setRoomModalTour(tour)}
            activeTournament={activeUnlockedTournament || null}
            totalPrizeDistributed={totalPrizeDistributed}
            totalDuosRegistered={duoTeams.length + 38}
          />
        )}

        {/* Dynamic Section Routing */}
        {activeSection === 'tournaments' && (
          <TournamentList
            tournaments={tournaments}
            language={language}
            onSelectTournamentForRegistration={(tour) => setDuoModalTour(tour)}
            onOpenRoomModal={(tour) => setRoomModalTour(tour)}
            currentPlayer={currentPlayer}
          />
        )}

        {activeSection === 'schedule' && (
          <MatchSchedule
            tournaments={tournaments}
            language={language}
            onOpenRoomModal={(tour) => setRoomModalTour(tour)}
            onSelectTournamentForRegistration={(tour) => setDuoModalTour(tour)}
            currentPlayer={currentPlayer}
          />
        )}

        {activeSection === 'points' && (
          <LivePointsTable
            pointsTable={pointsTable}
            language={language}
            onRefresh={() => {
              setPointsTable(StorageService.getPointsTable());
            }}
          />
        )}

        {activeSection === 'winners' && (
          <WinnersHallOfFame winners={winners} language={language} />
        )}

        {activeSection === 'results' && (
          <MatchResults results={matchResults} language={language} />
        )}
      </main>

      {/* Modals & Dialogs */}
      {/* 1. Duo Team Registration Modal */}
      <DuoRegisterModal
        isOpen={!!duoModalTour}
        onClose={() => setDuoModalTour(null)}
        tournament={duoModalTour}
        language={language}
        currentPlayer={currentPlayer}
        onRegisterSuccess={handleDuoRegisterSuccess}
      />

      {/* 2. Room Credentials Modal */}
      <RoomCredentialsModal
        isOpen={!!roomModalTour}
        onClose={() => setRoomModalTour(null)}
        tournament={roomModalTour}
        language={language}
        currentPlayer={currentPlayer}
        isAdmin={isAdmin}
        onUnlockByAdmin={handleUnlockRoom}
      />

      {/* 3. Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        language={language}
        onMarkAllRead={() => {
          StorageService.markAllNotificationsRead();
          setNotifications(StorageService.getNotifications());
        }}
        onSelectTournamentRoom={(tourId) => {
          const match = tournaments.find((t) => t.id === tourId);
          if (match) setRoomModalTour(match);
        }}
      />

      {/* 4. Player & Admin Auth Modal */}
      <AuthModal
        isOpen={authModalState.open}
        onClose={() => setAuthModalState({ open: false, tab: 'login' })}
        defaultTab={authModalState.tab}
        language={language}
        onPlayerLoginSuccess={handlePlayerLoginSuccess}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 5. Player Profile Modal */}
      <PlayerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        player={currentPlayer}
        tournaments={tournaments}
        language={language}
        onLogout={handleLogout}
        onOpenRoomModal={(tour) => {
          setIsProfileOpen(false);
          setRoomModalTour(tour);
        }}
      />

      {/* 6. Admin Command Center Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        tournaments={tournaments}
        duoTeams={duoTeams}
        pointsTable={pointsTable}
        language={language}
        onUpdateTournaments={(updated) => {
          StorageService.saveTournaments(updated);
          setTournaments(updated);
        }}
        onUpdatePointsTable={handleUpdatePointsTable}
        onBroadcastNotification={handleBroadcastNotification}
        onAdminLogout={handleAdminLogout}
      />

      {/* Esports Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5 font-display text-lg font-bold text-white tracking-wider">
            <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-red-500/60 bg-slate-900 shrink-0">
              <img
                src="/assets/aistudio/file_00000000dee0821182b5698a015323ab_5677176c.png"
                alt="MP FIGHTER Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span>MP FIGHTER ESPORTS</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <span>Free Fire Community Tournament Hub</span>
            <span aria-hidden="true">·</span>
            <span>Madhya Pradesh, India</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                sounds.playClick();
                setAuthModalState({ open: true, tab: 'admin' });
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Admin Access
            </button>
          </div>

          <div className="font-mono text-slate-600 text-[11px]">
            © 2026 MP FIGHTER. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
