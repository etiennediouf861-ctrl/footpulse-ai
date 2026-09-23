import React from 'react';
import { Volume2, VolumeX, Bell, BellOff, X, Sparkles } from 'lucide-react';
import { playGoalCelebrationSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationsEnabled: boolean;
  onRequestNotifications: () => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  notificationsEnabled,
  onRequestNotifications,
}) => {
  if (!isOpen) return null;

  const handleTestAlert = () => {
    playGoalCelebrationSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Paramètres des Alertes</h3>
              <p className="text-xs text-slate-400">Notifications de buts et sons en direct</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 py-5">
          {/* Sound toggle */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3.5 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${soundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </div>
              <div>
                <div className="font-semibold text-sm text-white">Effets sonores (Stade & Sifflet)</div>
                <div className="text-xs text-slate-400">Sifflet d&apos;arbitre et fanfare de but synthétisés</div>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Browser Notifications toggle */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3.5 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${notificationsEnabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400'}`}>
                {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
              </div>
              <div>
                <div className="font-semibold text-sm text-white">Notifications de Bureau</div>
                <div className="text-xs text-slate-400">Alertes même lorsque l&apos;onglet est en arrière-plan</div>
              </div>
            </div>
            <button
              onClick={onRequestNotifications}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                notificationsEnabled
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {notificationsEnabled ? 'Activées' : 'Activer'}
            </button>
          </div>

          {/* Test Alert Button */}
          <div className="pt-2">
            <button
              onClick={handleTestAlert}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-950/50"
            >
              <Sparkles className="h-4 w-4" />
              Tester le son & confettis de but
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
