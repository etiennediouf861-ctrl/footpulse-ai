import React, { useState } from 'react';
import {
  Layers,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Check,
  Calculator,
  Zap,
  Sparkles,
  ArrowRight,
  Plus,
  Cpu
} from 'lucide-react';
import { PRESET_TICKETS, ALL_SELECTIONS_POOL, Selection } from './SmartBetBuilderView';

interface FloatingBetslipProps {
  onOpenKelly?: (odds: number, prob: number, name: string) => void;
  onNavigateToSmartBuilder: () => void;
}

export const FloatingBetslip: React.FC<FloatingBetslipProps> = ({
  onOpenKelly,
  onNavigateToSmartBuilder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPicks, setSelectedPicks] = useState<Selection[]>([
    ALL_SELECTIONS_POOL[0], // Real Madrid vs Man City BTTS
    ALL_SELECTIONS_POOL[6], // Inter Milan vs Milan AC
  ]);
  const [stake, setStake] = useState<number>(20);
  const [isCopied, setIsCopied] = useState(false);

  // Math calculations
  const totalOdds = selectedPicks.length > 0
    ? Number(selectedPicks.reduce((acc, p) => acc * p.odds, 1).toFixed(2))
    : 1.0;

  const jointProb = selectedPicks.length > 0
    ? Number((selectedPicks.reduce((acc, p) => acc * (p.probability / 100), 1) * 100).toFixed(1))
    : 0;

  const avgEv = selectedPicks.length > 0
    ? Number((selectedPicks.reduce((acc, p) => acc + p.evPercentage, 0) / selectedPicks.length).toFixed(1))
    : 0;

  const potentialPayout = (stake * totalOdds).toFixed(2);
  const netProfit = (stake * (totalOdds - 1)).toFixed(2);

  const removePick = (id: string) => {
    setSelectedPicks((prev) => prev.filter((p) => p.id !== id));
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESET_TICKETS.find((t) => t.id === presetId);
    if (preset) {
      setSelectedPicks(preset.selections);
      setIsOpen(true);
    }
  };

  const handleCopy = () => {
    const text =
      `🎯 TICKET COMBINÉ IA FOOTPULSE\n` +
      `Cote Totale : @${totalOdds.toFixed(2)} | EV+ Moyen : +${avgEv}%\n\n` +
      selectedPicks
        .map(
          (s, i) =>
            `${i + 1}. [${s.sportIcon} ${s.league}] ${s.match}\n   👉 Prono : ${s.pick} @${s.odds.toFixed(2)}`
        )
        .join('\n\n') +
      `\n\n💰 Mise : ${stake}€ | Gain Potentiel : ${potentialPayout}€ (+${netProfit}€ net)\nGénéré sur FootPulse AI`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full sm:w-96 select-none font-sans">
      {/* Expanded Drawer */}
      {isOpen && (
        <div className="rounded-3xl border border-emerald-500/40 bg-[#0c1424] p-4 shadow-2xl shadow-emerald-950/50 mb-2 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 font-black">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>Panier de Combiné</span>
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 font-mono">
                    {selectedPicks.length} match(s)
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Assemblez vos pronostics en un combiné optimisé</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Minimiser"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 1-Click Fast Presets */}
          <div className="mb-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              ⚡ Générateur Express en 1 Clic :
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => loadPreset('ticket-safe')}
                className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition text-slate-200"
              >
                <span className="truncate">🛡️ Safe</span>
                <span className="font-mono text-emerald-400 font-bold">@2.18</span>
              </button>
              <button
                onClick={() => loadPreset('ticket-value')}
                className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition text-slate-200"
              >
                <span className="truncate">⚡ Max EV+</span>
                <span className="font-mono text-cyan-400 font-bold">@4.25</span>
              </button>
              <button
                onClick={() => loadPreset('ticket-multisport')}
                className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition text-slate-200"
              >
                <span className="truncate">🌟 Multi-Sports</span>
                <span className="font-mono text-purple-400 font-bold">@4.76</span>
              </button>
              <button
                onClick={() => loadPreset('ticket-jackpot')}
                className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition text-slate-200"
              >
                <span className="truncate">🚀 Jackpot 4x</span>
                <span className="font-mono text-amber-400 font-bold">@12.85</span>
              </button>
            </div>
          </div>

          {/* Picks List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 mb-3 scrollbar-thin">
            {selectedPicks.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                Aucun match sélectionné. Cliquez sur un prono pour l&apos;ajouter au combiné.
              </div>
            ) : (
              selectedPicks.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl bg-slate-900/90 border border-slate-800 p-2 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>{p.sportIcon}</span>
                      <span className="truncate">{p.match}</span>
                    </div>
                    <span className="font-bold text-white block truncate">{p.pick}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-amber-400">@{p.odds.toFixed(2)}</span>
                    <button
                      onClick={() => removePick(p.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Retirer du combiné"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculations Summary */}
          {selectedPicks.length > 0 && (
            <div className="rounded-2xl bg-slate-950 border border-slate-800/80 p-3 mb-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Cote Combinée Totale :</span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  @{totalOdds.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Espérance Mathématique (EV+) :</span>
                <span className="font-mono font-bold text-emerald-400">+{avgEv}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span>Mise ({stake} €) → Gain potentiel :</span>
                <span className="font-mono font-black text-emerald-300">
                  {potentialPayout} €
                </span>
              </div>
            </div>
          )}

          {/* Quick Stake Selector */}
          <div className="flex items-center gap-1.5 mb-3">
            {[10, 20, 50, 100].map((val) => (
              <button
                key={val}
                onClick={() => setStake(val)}
                className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  stake === val
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {val} €
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="space-y-1.5">
            {/* Deep Pre-Bet Analysis Trigger */}
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToSmartBuilder();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-cyan-300 font-bold py-2 text-xs transition"
              title="Consulter l'audit approfondi xG, H2H, compositions et cotes avant de parier"
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>🔬 Recherche & Analyse Approfondie Pré-Combiné</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={selectedPicks.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2.5 text-xs shadow-lg shadow-emerald-950 transition disabled:opacity-50"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{isCopied ? 'Combiné Copié !' : 'Copier le Ticket Combiné'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              {onOpenKelly && selectedPicks.length > 0 && (
                <button
                  onClick={() =>
                    onOpenKelly(totalOdds, jointProb, `Combiné IA (${selectedPicks.length} matchs)`)
                  }
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-1.5 text-[11px] font-bold transition"
                  title="Calculer la mise exacte Kelly"
                >
                  <Calculator className="h-3 w-3 text-emerald-400" />
                  <span>Mise Kelly</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToSmartBuilder();
                }}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-1.5 text-[11px] font-bold transition"
              >
                <span>Tous les filtres</span>
                <ArrowRight className="h-3 w-3 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#0c1a2e] via-[#092224] to-[#0a1824] border border-emerald-500/50 p-3 shadow-2xl shadow-slate-950/80 hover:border-emerald-400 transition group backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 font-black shadow-md">
            <Layers className="h-4 w-4 fill-current" />
            {selectedPicks.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold border-2 border-slate-950">
                {selectedPicks.length}
              </span>
            )}
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <span>🎯 Mon Combiné IA</span>
              <span className="font-mono text-amber-400 font-bold">@{totalOdds.toFixed(2)}</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              {selectedPicks.length} sélection(s) • EV+ : +{avgEv}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[10px] uppercase font-bold text-slate-400 group-hover:text-white transition">
            {isOpen ? 'Fermer' : 'Ouvrir'}
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-slate-300 group-hover:bg-slate-700 transition">
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </div>
        </div>
      </button>
    </div>
  );
};
