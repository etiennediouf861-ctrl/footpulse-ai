import React, { useState, useEffect, useRef } from 'react';
import { FootballMatch } from '../types/football';
import {
  calculateDynamicLiveOdds,
  DynamicOddsState,
  LiveOddSelection,
  LiveBettingMarket,
} from '../utils/liveOddsEngine';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Calculator,
  ShieldCheck,
  Flame,
  Clock,
  Target,
  Sparkles,
  Info,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Eye
} from 'lucide-react';

interface LiveBettingOddsPanelProps {
  match: FootballMatch;
  onOpenKellyWithSelection?: (odds: number, probability: number, name: string) => void;
  compact?: boolean;
}

interface SimulatedBet {
  id: string;
  selectionName: string;
  marketTitle: string;
  oddsAtBet: number;
  stake: number;
  minutePlaced: number;
  scoreAtBet: string;
  currentOdds: number;
  status: 'PENDING' | 'WON' | 'LOST';
}

export const LiveBettingOddsPanel: React.FC<LiveBettingOddsPanelProps> = ({
  match,
  onOpenKellyWithSelection,
  compact = false,
}) => {
  const previousOddsRef = useRef<Record<string, number>>({});
  const [oddsState, setOddsState] = useState<DynamicOddsState>(() =>
    calculateDynamicLiveOdds(match)
  );

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showFairOdds, setShowFairOdds] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [placedBets, setPlacedBets] = useState<SimulatedBet[]>([]);
  const [betSuccessToast, setBetSuccessToast] = useState<string | null>(null);

  // Recalculate dynamic odds on match state change (minute, score, stats, momentum)
  useEffect(() => {
    const newState = calculateDynamicLiveOdds(match, previousOddsRef.current);
    setOddsState(newState);

    // Save snapshot of current odds for delta / trend calculation
    const newSnapshot: Record<string, number> = {};
    newState.markets.forEach((m) => {
      m.selections.forEach((s) => {
        newSnapshot[s.id] = s.odds;
      });
    });
    previousOddsRef.current = newSnapshot;
  }, [
    match.minute,
    match.score.home,
    match.score.away,
    match.momentum.homeDominance,
    match.momentum.awayDominance,
    match.stats.xg.home,
    match.stats.xg.away,
  ]);

  // Place quick simulated test bet
  const handlePlaceSimulatedBet = (sel: LiveOddSelection, marketTitle: string, stake = 20) => {
    const newBet: SimulatedBet = {
      id: `sim-bet-${Date.now()}`,
      selectionName: sel.name,
      marketTitle,
      oddsAtBet: sel.odds,
      stake,
      minutePlaced: match.minute,
      scoreAtBet: `${match.score.home} - ${match.score.away}`,
      currentOdds: sel.odds,
      status: 'PENDING',
    };

    setPlacedBets((prev) => [newBet, ...prev]);
    setBetSuccessToast(
      `Pari fictif placé : ${stake} € sur "${sel.name}" à cote ${sel.odds.toFixed(2)} !`
    );
    setTimeout(() => {
      setBetSuccessToast(null);
    }, 3500);
  };

  const filteredMarkets =
    activeCategory === 'ALL'
      ? oddsState.markets
      : oddsState.markets.filter((m) => m.category === activeCategory);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {betSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold px-4 py-3 shadow-2xl shadow-emerald-500/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-5 w-5 text-slate-950 shrink-0" />
          <span className="text-xs">{betSuccessToast}</span>
        </div>
      )}

      {/* Main Panel Header & Live Driver Indicators */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#0e172a] via-[#0b1220] to-[#080d18] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-emerald-950">
              <Zap className="h-6 w-6 text-slate-950 fill-current" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  Live Betting Odds
                </h2>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  TEMPS RÉEL DYNAMIQUE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cotes et probabilités recalculées en direct selon le momentum, le rythme xG et le temps écoulé ({match.minute}&apos;).
              </p>
            </div>
          </div>

          {/* Quick Stats Summary Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setShowFairOdds(!showFairOdds)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                showFairOdds
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{showFairOdds ? 'Cote Juste IA Visible' : 'Afficher Cote Juste'}</span>
            </button>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition"
            >
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              <span>Explication Modèle IA</span>
            </button>
          </div>
        </div>

        {/* Real-time Dynamic Drivers Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-1">
          {/* Driver 1: Momentum */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold">
              <Flame className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Momentum Actif</span>
                <span className="font-mono font-bold text-slate-200">
                  {match.momentum.homeDominance}% - {match.momentum.awayDominance}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mt-1.5 flex">
                <div
                  className="bg-emerald-400 transition-all duration-500"
                  style={{ width: `${match.momentum.homeDominance}%` }}
                />
                <div
                  className="bg-cyan-400 transition-all duration-500"
                  style={{ width: `${match.momentum.awayDominance}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Multiplicateur : {oddsState.momentumMultiplierHome}x ({match.homeTeam.shortName}) vs{' '}
                {oddsState.momentumMultiplierAway}x ({match.awayTeam.shortName})
              </span>
            </div>
          </div>

          {/* Driver 2: xG Velocity */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              <Target className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Production xG Direct</span>
                <span className="font-mono font-bold text-emerald-400">
                  {match.stats.xg.home.toFixed(2)} - {match.stats.xg.away.toFixed(2)}
                </span>
              </div>
              <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-between">
                <span>xG restants projetés :</span>
                <span className="font-mono text-emerald-300">
                  +{oddsState.expectedGoalsRemainingHome} / +{oddsState.expectedGoalsRemainingAway}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {(match.stats.xg.home - match.stats.xg.away) > 0
                  ? `Avantage net ${match.homeTeam.shortName} (+${(match.stats.xg.home - match.stats.xg.away).toFixed(2)})`
                  : `Avantage net ${match.awayTeam.shortName} (+${(match.stats.xg.away - match.stats.xg.home).toFixed(2)})`}
              </span>
            </div>
          </div>

          {/* Driver 3: Time Decay */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
              <Clock className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Temps & Décroissance</span>
                <span className="font-mono font-bold text-cyan-300">{match.minute}&apos; / 90&apos;</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300"
                  style={{ width: `${(match.minute / 90) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {Math.max(0, 90 - match.minute)} min restantes (Facteur temps :{' '}
                {(oddsState.timeDecayFactor * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Explainability Dropdown */}
        {showExplanation && (
          <div className="mt-4 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-xs text-slate-300 space-y-2 animate-in fade-in duration-200">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              <span>Comment fonctionne le moteur de cotes dynamiques FootPulse AI ?</span>
            </div>
            <p>
              Contrairement aux bookmakers qui appliquent une marge statique, notre algorithme croise en temps réel la distribution de Poisson bivariée avec deux hyper-paramètres en direct :
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>
                <strong className="text-slate-200">Pression & Momentum :</strong> Si une équipe subit ou domine (ex. 75% de possession territoriale), ses espérances de but restantes ($\lambda$) sont modulées instantanément de 0.65x à 1.60x.
              </li>
              <li>
                <strong className="text-slate-200">Vélocité xG :</strong> Chaque tir dangereux généré dans la simulation recalcule la valeur attendue sans attendre la confirmation d&apos;un but.
              </li>
              <li>
                <strong className="text-slate-200">Cote Juste vs Bookmaker :</strong> Lorsque l&apos;indicateur <span className="text-emerald-400 font-bold">+EV%</span> est affiché, le bookmaker tarde à réagir à la domination actuelle, offrant une valeur mathématique positive.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Top Value Bet Live Alert Banner */}
      {oddsState.topValueBet && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-500/50 p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-emerald-950/30 animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">
              <Flame className="h-5 w-5 text-emerald-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  ⚡ Opportunité Live Détectée (+{oddsState.topValueBet.evPercentage}% EV)
                </span>
                <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 font-bold">
                  Value Bet Actif
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Sélection : <strong className="text-white">{oddsState.topValueBet.name}</strong> •
                Cote Bookmaker <strong className="font-mono text-emerald-300">{oddsState.topValueBet.odds.toFixed(2)}</strong> vs Cote Juste IA{' '}
                <strong className="font-mono text-cyan-300">{oddsState.topValueBet.fairOdds.toFixed(2)}</strong> ({oddsState.topValueBet.probability}% probabilité).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenKellyWithSelection && (
              <button
                onClick={() =>
                  onOpenKellyWithSelection(
                    oddsState.topValueBet!.odds,
                    oddsState.topValueBet!.probability,
                    oddsState.topValueBet!.name
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition shadow-md"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Calculer Mise Kelly</span>
              </button>
            )}
            <button
              onClick={() => handlePlaceSimulatedBet(oddsState.topValueBet!, 'Value Bet Live', 20)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition"
            >
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              <span>Miser 20 € (Fictif)</span>
            </button>
          </div>
        </div>
      )}

      {/* Market Category Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
        {[
          { id: 'ALL', label: 'Tous les Marchés', icon: Activity },
          { id: '1X2', label: 'Résultat 1X2', icon: Target },
          { id: 'NEXT_GOAL', label: 'Prochain But', icon: Zap },
          { id: 'OVER_UNDER', label: 'Plus / Moins Buts', icon: TrendingUp },
          { id: 'BTTS', label: 'Les 2 Marquent', icon: ShieldCheck },
          { id: 'DOUBLE_CHANCE', label: 'Double Chance', icon: Sparkles },
        ].map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Markets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMarkets.map((market) => (
          <div
            key={market.id}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between"
          >
            {/* Market Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>{market.title}</span>
                  {market.isSuspended && (
                    <span className="rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-1.5 py-0.2 uppercase font-bold">
                      Suspendu
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{market.description}</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {market.selections.length} choix
              </span>
            </div>

            {/* Selections list */}
            <div className="space-y-2.5 flex-1">
              {market.selections.map((sel) => {
                const isTrendingUp = sel.trend === 'UP';
                const isTrendingDown = sel.trend === 'DOWN';

                return (
                  <div
                    key={sel.id}
                    className={`rounded-2xl border p-3 transition duration-300 ${
                      sel.isValue
                        ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/70'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Selection Name & Subtitle */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate">{sel.name}</span>
                          {sel.isValue && (
                            <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-1.5 py-0.2 shrink-0">
                              +{sel.evPercentage}% EV
                            </span>
                          )}
                        </div>
                        {sel.subTitle && (
                          <span className="text-[11px] text-slate-400 block">{sel.subTitle}</span>
                        )}

                        {/* Implied Probability bar */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                              style={{ width: `${sel.probability}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {sel.probability}% IA
                          </span>
                        </div>
                      </div>

                      {/* Right: Odds box with live flash trend */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Fair Odds pill if enabled */}
                        {showFairOdds && (
                          <div
                            className="hidden sm:flex flex-col items-end text-right"
                            title="Cote Juste calculée par l'IA sans marge bookmaker"
                          >
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                              Cote Juste IA
                            </span>
                            <span className="font-mono text-xs font-bold text-cyan-400">
                              {sel.fairOdds.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* Live Odds Button / Trigger */}
                        <button
                          onClick={() => handlePlaceSimulatedBet(sel, market.title, 20)}
                          className={`relative flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[76px] font-mono font-black text-sm border transition shadow-sm ${
                            isTrendingUp
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/50'
                              : isTrendingDown
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-950/50'
                              : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                          }`}
                          title="Cliquer pour placer un pari test en direct"
                        >
                          <div className="flex items-center gap-1">
                            <span>{sel.odds.toFixed(2)}</span>
                            {isTrendingUp && <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />}
                            {isTrendingDown && <TrendingDown className="h-3 w-3 text-rose-400 shrink-0" />}
                          </div>

                          {sel.delta !== 0 && (
                            <span
                              className={`text-[9px] font-bold ${
                                isTrendingUp ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {sel.delta > 0 ? `+${sel.delta}` : sel.delta}
                            </span>
                          )}
                        </button>

                        {/* Kelly Button */}
                        {onOpenKellyWithSelection && (
                          <button
                            onClick={() =>
                              onOpenKellyWithSelection(sel.odds, sel.probability, sel.name)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/50 transition"
                            title="Calculer la mise Kelly exacte pour cette cote"
                          >
                            <Calculator className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Live Bets Tracker (if bets were placed) */}
      {placedBets.length > 0 && (
        <div className="rounded-3xl border border-slate-800 bg-[#0b1322] p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">
                Mes Paris Simulés en Direct sur ce Match ({placedBets.length})
              </h3>
            </div>
            <button
              onClick={() => setPlacedBets([])}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition"
            >
              Effacer historique
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {placedBets.map((bet) => {
              const potentialReturn = (bet.stake * bet.oddsAtBet).toFixed(2);
              const potentialProfit = (bet.stake * bet.oddsAtBet - bet.stake).toFixed(2);

              return (
                <div
                  key={bet.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-white block">{bet.selectionName}</span>
                      <span className="text-[10px] text-slate-400">
                        {bet.marketTitle} • Placé à la {bet.minutePlaced}&apos; ({bet.scoreAtBet})
                      </span>
                    </div>
                    <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-1.5 py-0.5">
                      Cote {bet.oddsAtBet.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                    <span className="text-slate-400 text-[11px]">Mise : {bet.stake} €</span>
                    <span className="font-mono font-bold text-emerald-400">
                      Gain pot. : {potentialReturn} € (+{potentialProfit} €)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
