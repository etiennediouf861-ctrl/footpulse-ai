import React, { useState, useEffect } from 'react';
import {
  Calculator,
  X,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Percent,
  Wallet
} from 'lucide-react';

interface KellyCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOdds?: number;
  defaultProb?: number;
  selectionTitle?: string;
}

export const KellyCalculatorModal: React.FC<KellyCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultOdds = 2.10,
  defaultProb = 55,
  selectionTitle,
}) => {
  const [bankroll, setBankroll] = useState<number>(1000);
  const [odds, setOdds] = useState<number>(defaultOdds);
  const [probability, setProbability] = useState<number>(defaultProb); // in percent 0-100
  const [fraction, setFraction] = useState<'FULL' | 'HALF' | 'QUARTER'>('HALF');

  // Synchronize when opened with new defaults
  useEffect(() => {
    if (isOpen) {
      setOdds(defaultOdds);
      setProbability(defaultProb);
    }
  }, [isOpen, defaultOdds, defaultProb]);

  if (!isOpen) return null;

  // Calculations
  const p = Math.min(0.99, Math.max(0.01, probability / 100));
  const q = 1 - p;
  const b = Math.max(0.01, odds - 1); // decimal odds minus 1

  // Kelly formula: f* = (bp - q) / b
  const fullKellyFraction = (b * p - q) / b;
  const isValue = fullKellyFraction > 0;

  // Multiplier for fractional Kelly
  let fractionMultiplier = 0.5; // Half Kelly by default
  if (fraction === 'FULL') fractionMultiplier = 1.0;
  if (fraction === 'QUARTER') fractionMultiplier = 0.25;

  const rawRecommendedPct = isValue ? fullKellyFraction * fractionMultiplier * 100 : 0;
  const recommendedPct = Math.min(15, Math.max(0, rawRecommendedPct)); // capped at 15% for safety
  const recommendedStakeEuros = (bankroll * recommendedPct) / 100;

  // Expected Value % = (p * odds - 1) * 100
  const expectedValuePct = (p * odds - 1) * 100;
  const expectedProfitEuro = isValue ? recommendedStakeEuros * (expectedValuePct / 100) : 0;
  const breakevenOdds = 1 / p;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/40 bg-[#0c1424] p-6 sm:p-7 shadow-2xl shadow-emerald-950/60 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-950">
              <Calculator className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Calculateur de Mise Kelly & Money Management</h3>
                <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold uppercase">
                  OUTIL RENTABILITÉ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {selectionTitle ? (
                  <span>
                    Analyse en direct pour : <strong className="text-emerald-300">{selectionTitle}</strong>
                  </span>
                ) : (
                  'La formule mathématique officielle pour maximiser la croissance de votre capital sans risque de ruine.'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Inputs Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Capital Bankroll (€)
            </label>
            <div className="relative">
              <input
                type="number"
                min={50}
                step={50}
                value={bankroll}
                onChange={(e) => setBankroll(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">€</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Votre trésorerie totale</span>
          </div>

          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Cote Bookmaker
            </label>
            <div className="relative">
              <input
                type="number"
                min={1.05}
                step={0.05}
                value={odds}
                onChange={(e) => setOdds(Math.max(1.01, Number(e.target.value)))}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-base font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400/80 font-mono font-bold">@</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Cote affichée (ex: 2.10)</span>
          </div>

          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Probabilité Estimée (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={99}
                step={1}
                value={probability}
                onChange={(e) => setProbability(Math.min(99, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-base font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cyan-400/80 font-mono font-bold">%</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Modèle IA FootPulse</span>
          </div>
        </div>

        {/* Security Fraction Selector */}
        <div className="mb-6 rounded-2xl bg-slate-900/60 border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-400 font-bold">Sécurité Anti-Variance :</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFraction('QUARTER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                fraction === 'QUARTER'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              Quart-Kelly (25% - Prudent)
            </button>
            <button
              onClick={() => setFraction('HALF')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                fraction === 'HALF'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              Demi-Kelly (50% - Standard Pro)
            </button>
            <button
              onClick={() => setFraction('FULL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                fraction === 'FULL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              Plein Kelly (100% - Agressif)
            </button>
          </div>
        </div>

        {/* Result Card */}
        {isValue ? (
          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-teal-950/20 p-5 mb-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>OPPORTUNITÉ VALUE DÉTECTÉE (EV+ POSITIF)</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-mono font-bold">
                +{expectedValuePct.toFixed(1)}% EV
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Mise Recommandée
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {recommendedStakeEuros.toFixed(2)} €
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  ({recommendedPct.toFixed(2)}% du capital)
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Gain Mathématique Espéré
                </span>
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  +{expectedProfitEuro.toFixed(2)} €
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  Par pari joué
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Cote Breakeven Seuil
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  @{breakevenOdds.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  Cote minimale pour être rentable
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-rose-500/40 bg-rose-950/20 p-5 mb-5 text-center">
            <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-sm mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span>PAS DE VALUE DETECTÉE (EV NÉGATIF)</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              La cote proposée par le bookmaker (@{odds.toFixed(2)}) est inférieure à la cote minimale équitable (@{breakevenOdds.toFixed(2)}). Le critère de Kelly préconise de <strong>NE PAS MISER (Mise 0 €)</strong> pour préserver votre capital.
            </p>
          </div>
        )}

        {/* Tip Box */}
        <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block mb-0.5">
              Règle d&apos;or de rentabilité professionnelle :
            </span>
            <span>
              Ne pariez jamais au feeling. En appliquant systématiquement le Demi-Kelly sur des opportunités à espérance mathématique positive (EV+), vous transformez le pari sportif en un investissement quantitatif maîtrisé.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
