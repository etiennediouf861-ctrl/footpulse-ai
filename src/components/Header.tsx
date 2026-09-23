import React from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Sliders, Calculator, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  isSimulating: boolean;
  onToggleSimulating: () => void;
  simulationSpeed: number;
  onChangeSpeed: (speed: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onTriggerTestGoal: () => void;
  onOpenKellyModal: () => void;
  onOpenCombiner?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSimulating,
  onToggleSimulating,
  simulationSpeed,
  onChangeSpeed,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onTriggerTestGoal,
  onOpenKellyModal,
  onOpenCombiner,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0d1322]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-xl font-black text-white shadow-lg shadow-emerald-500/20">
            ⚽
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0d1322]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                FootPulse <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                LIVE
              </span>
              <span className="rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                100% Gratuit & Illimité
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Analyse temps réel, scores exacts IA, cotes de valeur & gestion de capital
            </p>
          </div>
        </div>

        {/* Center: Live Simulation Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl p-1.5">
          <button
            onClick={onToggleSimulating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isSimulating
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
            title={isSimulating ? 'Mettre le match en pause' : 'Reprendre le match en direct'}
          >
            {isSimulating ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>En Direct</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-1.5">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition ${
                  simulationSpeed === speed
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={`Vitesse d'avance ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Combiner Button */}
          {onOpenCombiner && (
            <button
              onClick={onOpenCombiner}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 hover:bg-amber-500/30 transition shadow-sm"
              title="Ouvrir le générateur de combinés intelligents optimisés par IA"
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>🎯 Combiner</span>
            </button>
          )}

          {/* Kelly Calculator Button */}
          <button
            onClick={onOpenKellyModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/30 transition shadow-sm"
            title="Ouvrir le calculateur de mise Kelly Criterion (EV+)"
          >
            <Calculator className="h-3.5 w-3.5 text-emerald-400" />
            <span>Calculateur Kelly (EV+)</span>
          </button>

          {/* Quick Test Goal */}
          <button
            onClick={onTriggerTestGoal}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Simule un but immédiat pour tester l'alerte sonore et visuelle"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            <span className="hidden sm:inline">Tester But</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`rounded-xl border p-2 text-xs transition ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-emerald-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'Désactiver les sons' : 'Activer les sons de stade et sifflet'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Settings modal */}
          <button
            onClick={onOpenSettings}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:border-slate-700 hover:text-white transition"
            title="Paramètres des alertes"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
