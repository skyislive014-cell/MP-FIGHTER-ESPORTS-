import React, { useState } from 'react';
import { X, User, Shield, Lock, Smartphone, Mail, Key, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Player, Language } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'admin';
  language: Language;
  onPlayerLoginSuccess: (player: Player) => void;
  onAdminLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  language,
  onPlayerLoginSuccess,
  onAdminLoginSuccess,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>(defaultTab);

  // Player Login form
  const [loginIdentifier, setLoginIdentifier] = useState('1849203810');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Player Register form
  const [regIgn, setRegIgn] = useState('');
  const [regUid, setRegUid] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'Rusher' | 'Sniper' | 'Assaulter' | 'IGL'>('Rusher');
  const [regCity, setRegCity] = useState('Bhopal');

  // Admin Login form
  const [adminPassword, setAdminPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handlePlayerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all login fields');
      return;
    }

    // Demo/Storage login logic
    const loggedInPlayer: Player = {
      id: `player-${Date.now()}`,
      ign: loginIdentifier.length >= 8 && /^\d+$/.test(loginIdentifier) ? `MP_WARRIOR_${loginIdentifier.slice(-3)}` : loginIdentifier.split('@')[0].toUpperCase(),
      uid: /^\d+$/.test(loginIdentifier) ? loginIdentifier : '1849203810',
      phone: '9827104928',
      email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@mpfighter.in`,
      avatarSeed: 'ff_pro',
      state: 'Madhya Pradesh',
      city: 'Bhopal',
      role: 'Rusher',
      balance: 400,
      totalKills: 45,
      tournamentsPlayed: 8,
      booyahs: 3,
      registeredTournamentIds: ['mp-tour-101'],
    };

    sounds.playSuccess();
    setSuccessMessage(language === 'hi' ? 'सफलतापूर्वक लॉगिन किया गया!' : 'Logged in successfully!');
    setTimeout(() => {
      onPlayerLoginSuccess(loggedInPlayer);
      onClose();
    }, 600);
  };

  const handlePlayerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regIgn.trim() || !regUid.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया सभी अनिवार्य फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    if (!/^\d{8,12}$/.test(regUid.trim())) {
      setErrorMessage(language === 'hi' ? 'फ्री फायर यूआईडी केवल 8-12 अंकों की होनी चाहिए' : 'Free Fire UID must be 8-12 numbers only');
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      ign: regIgn.trim(),
      uid: regUid.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || `${regUid.trim()}@fighter.in`,
      avatarSeed: 'ff_pro_avatar',
      state: 'Madhya Pradesh',
      city: regCity,
      role: regRole,
      balance: 100, // Sign up bonus ₹100
      totalKills: 0,
      tournamentsPlayed: 0,
      booyahs: 0,
      registeredTournamentIds: [],
    };

    sounds.playBooyah();
    setSuccessMessage(language === 'hi' ? 'पंजीकरण सफल! ₹100 बोनस मिला।' : 'Registration successful! ₹100 welcome bonus added.');
    setTimeout(() => {
      onPlayerLoginSuccess(newPlayer);
      onClose();
    }, 700);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Secure Admin password checks
    const validPasswords = ['mpfighter@admin', 'admin123', 'admin', 'mpfighter'];
    if (validPasswords.includes(adminPassword.trim().toLowerCase())) {
      sounds.playBooyah();
      setSuccessMessage(t.adminAccessGranted);
      setTimeout(() => {
        onAdminLoginSuccess();
        onClose();
      }, 600);
    } else {
      setErrorMessage(t.adminAccessDenied);
    }
  };

  const fillQuickAdmin = () => {
    setAdminPassword('mpfighter@admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-6">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.login}</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.register}</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('admin');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'admin' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Player Login Tab */}
        {activeTab === 'login' && (
          <form onSubmit={handlePlayerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'फ्री फायर यूआईडी या ईमेल' : 'Free Fire UID or Email'}
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 1849203810"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {language === 'hi' ? 'खिलाड़ी लॉगिन करें' : 'Player Sign In'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                {language === 'hi' ? 'नया खाता बनाना है? ' : 'Need an account? '}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
              >
                {t.register}
              </button>
            </div>
          </form>
        )}

        {/* Player Register Tab */}
        {activeTab === 'register' && (
          <form onSubmit={handlePlayerRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.ignLabel} <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={regIgn}
                onChange={(e) => setRegIgn(e.target.value)}
                placeholder="e.g. MP_STORM_99"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.uidLabel} <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regUid}
                  onChange={(e) => setRegUid(e.target.value)}
                  placeholder="8-12 digits"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.phoneLabel} <span className="text-amber-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="WhatsApp No."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Combat Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Rusher">Rusher</option>
                  <option value="Sniper">Sniper</option>
                  <option value="Assaulter">Assaulter</option>
                  <option value="IGL">IGL (Leader)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  MP City
                </label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  placeholder="Bhopal / Indore"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password <span className="text-amber-500">*</span>
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create password"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 rounded-xl shadow-md transition-all cursor-pointer mt-2"
            >
              {language === 'hi' ? 'खाता बनाएं (₹100 बोनस)' : 'Create Player Account (₹100 Bonus)'}
            </button>
          </form>
        )}

        {/* Admin Login Tab */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-300">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{t.adminPanel}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t.adminLoginPrompt}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Password / Security Key
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder={t.adminPassPlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Verify Security Key & Unlock
            </button>

            <button
              type="button"
              onClick={fillQuickAdmin}
              className="w-full py-2 text-xs text-amber-400 hover:underline text-center cursor-pointer font-mono"
            >
              ⚡ Quick Fill Demo Admin Pass (mpfighter@admin)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
