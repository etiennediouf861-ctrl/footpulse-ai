import React, { useEffect } from 'react';
import { GoalAlert } from '../types/football';
import { Volume2, X, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playGoalCelebrationSound } from '../utils/audio';

interface GoalAlertModalProps {
  alert: GoalAlert | null;
  onClose: () => void;
  soundEnabled: boolean;
}

export const GoalAlertModal: React.FC<GoalAlertModalProps> = ({
  alert,
  onClose,
  soundEnabled,
}) => {
  useEffect(() => {
    if (!alert) return;

    // Trigger sound if enabled
    if (soundEnabled) {
      playGoalCelebrationSound();
    }

    // Trigger vibrant stadium confetti fireworks
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ec4899', '#ffffff'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    // Auto dismiss after 7 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 7500);

    return () => clearTimeout(timer);
  }, [alert, soundEnabled, onClose]);

  if (!alert) return null;

  return (
    <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-slate-900 via-[#0d1c2d] to-slate-950 p-6 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl">
        {/* Glowing top line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400 animate-pulse" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-2xl shadow-inner animate-bounce">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/40 animate-pulse">
                  ALERTE BUT EN DIRECT !
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{alert.minute}&apos;</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {alert.scoringTeamName} marque !
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-slate-950/60 p-4 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Buteur : <span className="text-emerald-400 font-bold">{alert.scorer}</span>
              </p>
              {alert.assist && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Passe décisive : <span className="text-slate-300">{alert.assist}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Nouveau Score</span>
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {alert.newScore.home} - {alert.newScore.away}
              </span>
            </div>
          </div>

          {alert.xgValue !== undefined && (
            <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Valeur Expected Goal (xG) de l&apos;occasion :
              </span>
              <span className="font-mono font-bold text-amber-400">
                {alert.xgValue.toFixed(2)} xG
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            {soundEnabled ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Volume2 className="h-3.5 w-3.5" /> Son des tribunes actif
              </span>
            ) : (
              <span>Son désactivé</span>
            )}
          </span>
          <span className="text-slate-400 italic">Mise à jour des probabilités IA en cours...</span>
        </div>
      </div>
    </div>
  );
};
