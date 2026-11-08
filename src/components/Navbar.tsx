import React from 'react';
import { Flame, Bell, Shield, User, Globe, Trophy } from 'lucide-react';
import { Language, Player } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface NavbarProps {
  language: Language;
  onLanguageToggle: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  currentPlayer: Player | null;
  isAdmin: boolean;
  onOpenAuth: (defaultTab?: 'login' | 'register' | 'admin') => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageToggle,
  activeSection,
  onNavigate,
  unreadCount,
  onOpenNotifications,
  currentPlayer,
  isAdmin,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
}) => {
  const t = translations[language];

  const handleNavClick = (section: string) => {
    sounds.playClick();
    onNavigate(section);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly adheres to Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (Action Area) */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => handleNavClick('tournaments')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            aria-label="MP FIGHTER ESPORTS Home"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-red-500/70 shadow-lg shadow-red-950/60 bg-slate-950 shrink-0 group-hover:ring-amber-400 group-hover:shadow-amber-500/20 transition-all">
              <img
                src="/assets/aistudio/file_00000000dee0821182b5698a015323ab_5677176c.png"
                alt="MP FIGHTER ESPORTS Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-white whitespace-nowrap shrink-0 group-hover:text-amber-400 transition-colors">
              {t.brandName}
            </span>
          </button>

          {/* Zone 2: 5 clean single-line nav links with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('tournaments')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'tournaments' ? 'text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.navTournaments}
            </button>
            <button
              onClick={() => handleNavClick('schedule')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'schedule' ? 'text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.navSchedule}
            </button>
            <button
              onClick={() => handleNavClick('points')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'points' ? 'text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.navPointsTable}
            </button>
            <button
              onClick={() => handleNavClick('winners')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'winners' ? 'text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.navWinners}
            </button>
            <button
              onClick={() => handleNavClick('results')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'results' ? 'text-amber-400 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.navResults}
            </button>
          </nav>

          {/* Zone 3: Primary action & controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => {
                sounds.playClick();
                onLanguageToggle();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-amber-500/50 hover:text-white transition-all whitespace-nowrap cursor-pointer"
              title="Toggle Hindi / English"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenNotifications();
              }}
              className="relative p-2 text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:text-amber-400 hover:border-slate-700 transition-all cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Admin Switcher */}
            {isAdmin ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAdmin();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/50 rounded-lg hover:bg-amber-900/60 transition-all whitespace-nowrap cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.adminPanel}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAuth('admin');
                }}
                className="p-2 text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Admin Login"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}

            {/* Player Auth / Profile */}
            {currentPlayer ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenProfile();
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-gradient-to-r from-orange-950/60 to-slate-900 border border-orange-500/40 rounded-lg hover:border-orange-500 transition-all whitespace-nowrap cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  {currentPlayer.ign.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white tracking-wide truncate max-w-[90px]">
                    {currentPlayer.ign}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    ₹{currentPlayer.balance}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAuth('login');
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-lg hover:brightness-110 shadow-md shadow-orange-900/30 transition-all whitespace-nowrap cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2 text-xs font-medium text-slate-400">
        <button
          onClick={() => handleNavClick('tournaments')}
          className={`px-2 py-1 rounded transition-colors ${activeSection === 'tournaments' ? 'text-amber-400 font-bold' : ''}`}
        >
          {t.navTournaments}
        </button>
        <button
          onClick={() => handleNavClick('schedule')}
          className={`px-2 py-1 rounded transition-colors ${activeSection === 'schedule' ? 'text-amber-400 font-bold' : ''}`}
        >
          {t.navSchedule}
        </button>
        <button
          onClick={() => handleNavClick('points')}
          className={`px-2 py-1 rounded transition-colors ${activeSection === 'points' ? 'text-amber-400 font-bold' : ''}`}
        >
          {t.navPointsTable}
        </button>
        <button
          onClick={() => handleNavClick('winners')}
          className={`px-2 py-1 rounded transition-colors ${activeSection === 'winners' ? 'text-amber-400 font-bold' : ''}`}
        >
          {t.navWinners}
        </button>
        <button
          onClick={() => handleNavClick('results')}
          className={`px-2 py-1 rounded transition-colors ${activeSection === 'results' ? 'text-amber-400 font-bold' : ''}`}
        >
          {t.navResults}
        </button>
      </div>
    </header>
  );
};
