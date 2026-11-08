import React from 'react';
import { X, Bell, KeyRound, CheckCircle2, ShieldAlert, Check, Copy } from 'lucide-react';
import { NotificationItem, Language, Tournament } from '../types';
import { translations } from '../translations';
import { sounds } from '../utils/audio';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  language: Language;
  onMarkAllRead: () => void;
  onSelectTournamentRoom?: (tournamentId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  language,
  onMarkAllRead,
  onSelectTournamentRoom,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-xl font-bold text-white uppercase">
              {t.notificationsTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onMarkAllRead();
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
            >
              {t.markAllRead}
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

        {/* List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {t.noNotifications}
            </div>
          ) : (
            notifications.map((item) => {
              const isRoom = item.type === 'room_released';
              const isSuccess = item.type === 'registration_success';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !item.read
                      ? 'bg-slate-950 border-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isRoom
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                          : isSuccess
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isRoom ? (
                        <KeyRound className="w-4 h-4" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <ShieldAlert className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-white">
                          {language === 'hi' ? item.titleHi : item.title}
                        </span>
                        <span className="text-[11px] text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">
                        {language === 'hi' ? item.messageHi : item.message}
                      </p>

                      {isRoom && item.roomId && onSelectTournamentRoom && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              if (item.tournamentId) {
                                onSelectTournamentRoom(item.tournamentId);
                                onClose();
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                          >
                            {language === 'hi' ? 'रूम देखें' : 'View Room Credentials'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
