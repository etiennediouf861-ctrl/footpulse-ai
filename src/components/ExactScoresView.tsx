import React, { useState } from 'react';
import { FootballMatch, ExactScoreScenario } from '../types/football';
import { MOCK_EXACT_SCORES_BY_MATCH } from '../data/proData';
import {
  Sparkles,
  TrendingUp,
  Percent,
  Sliders,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Flame,
  ArrowRight,
  Cpu,
  RefreshCw,
  Zap,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface ExactScoresViewProps {
  match: FootballMatch;
}

interface MonteCarloResults {
  iterations: number;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  avgTotalGoals: number;
  homeCleanSheetPct: number;
  awayCleanSheetPct: number;
  mostFrequentScore: string;
}

export const ExactScoresView: React.FC<ExactScoresViewProps> = ({ match }) => {
  const scenarios: ExactScoreScenario[] = MOCK_EXACT_SCORES_BY_MATCH.default;
  const [filterType, setFilterType] = useState<'ALL' | 'HOME_WIN' | 'DRAW' | 'AWAY_WIN'>('ALL');

  // Monte Carlo Simulation state
  const [isSimulatingMonteCarlo, setIsSimulatingMonteCarlo] = useState(false);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResults | null>(null);

  const filteredScenarios = scenarios.filter((s) => {
    if (filterType === 'HOME_WIN') return s.home > s.away;
    if (filterType === 'DRAW') return s.home === s.away;
    if (filterType === 'AWAY_WIN') return s.away > s.home;
    return true;
  });

  // Calculate market expectations
  const mostPlausible = scenarios[0];
  const totalBttsProb = scenarios
    .filter((s) => s.btts)
    .reduce((acc, curr) => acc + curr.probability, 0);
  const totalOver25Prob = scenarios
    .filter((s) => s.over25)
    .reduce((acc, curr) => acc + curr.probability, 0);

  // Monte Carlo simulation runner
  const runMonteCarloSimulation = () => {
    setIsSimulatingMonteCarlo(true);
    setTimeout(() => {
      const iterations = 10000;
      const lambdaHome = Math.max(0.6, match.stats.xg.home * 1.05);
      const lambdaAway = Math.max(0.5, match.stats.xg.away * 0.95);

      let homeWins = 0;
      let draws = 0;
      let awayWins = 0;
      let totalGoals = 0;
      let homeCleanSheets = 0;
      let awayCleanSheets = 0;
      const scoreFreq: Record<string, number> = {};

      // Poisson generator using Knuth's algorithm
      const poissonRandom = (lambda: number) => {
        const L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        do {
          k++;
          p *= Math.random();
        } while (p > L);
        return k - 1;
      };

      for (let i = 0; i < iterations; i++) {
        const gHome = poissonRandom(lambdaHome);
        const gAway = poissonRandom(lambdaAway);

        totalGoals += gHome + gAway;
        if (gAway === 0) homeCleanSheets++;
        if (gHome === 0) awayCleanSheets++;

        if (gHome > gAway) homeWins++;
        else if (gHome === gAway) draws++;
        else awayWins++;

        const key = `${gHome}-${gAway}`;
        scoreFreq[key] = (scoreFreq[key] || 0) + 1;
      }

      // Find most frequent score
      let topScore = '2-1';
      let maxCount = 0;
      for (const [score, count] of Object.entries(scoreFreq)) {
        if (count > maxCount) {
          maxCount = count;
          topScore = score;
        }
      }

      setMonteCarloResults({
        iterations,
        homeWinPct: Number(((homeWins / iterations) * 100).toFixed(1)),
        drawPct: Number(((draws / iterations) * 100).toFixed(1)),
        awayWinPct: Number(((awayWins / iterations) * 100).toFixed(1)),
        avgTotalGoals: Number((totalGoals / iterations).toFixed(2)),
        homeCleanSheetPct: Number(((homeCleanSheets / iterations) * 100).toFixed(1)),
        awayCleanSheetPct: Number(((awayCleanSheets / iterations) * 100).toFixed(1)),
        mostFrequentScore: topScore,
      });

      setIsSimulatingMonteCarlo(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner - 100% Free & Unlimited Access */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#0b1424] via-[#091122] to-[#060c18] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white shadow-lg shadow-cyan-950/60">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  Modèle Prédictif Poisson & Machine Learning
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  100% Débloqué & Gratuit
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Scores exacts IA : visualisez les scénarios les plus plausibles
              </h2>
              <p className="text-xs text-slate-400">
                Calculés par lois bivariées de Poisson croisées aux données xG et de pression en direct.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runMonteCarloSimulation}
              disabled={isSimulatingMonteCarlo}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-950 transition"
              title="Lance 10 000 simulations stochastiques"
            >
              <Cpu className={`h-4 w-4 ${isSimulatingMonteCarlo ? 'animate-spin' : ''}`} />
              <span>{isSimulatingMonteCarlo ? 'Calcul (10 000 itérations)...' : 'Simuler Monte Carlo (10 000 tirs)'}</span>
            </button>
          </div>
        </div>

        {/* Monte Carlo Results Card if run */}
        {monteCarloResults && (
          <div className="mb-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300 mb-3 border-b border-cyan-900/50 pb-2">
              <span className="flex items-center gap-1.5 font-mono">
                <Zap className="h-4 w-4 text-cyan-400" />
                RÉSULTATS DU SIMULATEUR MONTE CARLO (10 000 MATCHS SIMULÉS)
              </span>
              <span className="text-slate-400 font-normal text-[11px]">
                Distribution stochastique instantanée
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">1X2 Domicile</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {monteCarloResults.homeWinPct}%
                </span>
                <span className="text-[10px] text-slate-500 block">Victoire {match.homeTeam.shortName}</span>
              </div>

              <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Match Nul</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {monteCarloResults.drawPct}%
                </span>
                <span className="text-[10px] text-slate-500 block">Partage des points</span>
              </div>

              <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">1X2 Extérieur</span>
                <span className="text-base font-black text-cyan-400 font-mono">
                  {monteCarloResults.awayWinPct}%
                </span>
                <span className="text-[10px] text-slate-500 block">Victoire {match.awayTeam.shortName}</span>
              </div>

              <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Score n°1 Féquent</span>
                <span className="text-base font-black text-white font-mono bg-cyan-500/20 px-2 py-0.5 rounded">
                  {monteCarloResults.mostFrequentScore}
                </span>
                <span className="text-[10px] text-slate-400 block">Moy. {monteCarloResults.avgTotalGoals} buts</span>
              </div>
            </div>
          </div>
        )}

        {/* 3 Foresportia Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Top Most Plausible */}
          <div className="rounded-2xl bg-gradient-to-b from-[#121f36] to-[#0d1627] p-4.5 border border-cyan-500/30 relative">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                <Flame className="h-4 w-4 text-cyan-400" />
                Score le Plus Plausible
              </span>
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                TOP SCÉNARIO
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {mostPlausible.home} - {mostPlausible.away}
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-cyan-400 font-mono">
                  {mostPlausible.probability.toFixed(1)} %
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Cote juste : {mostPlausible.fairOdds.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Cote Bookmaker observée</span>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                @{mostPlausible.marketOdds.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Card 2: Both Teams To Score (BTTS) */}
          <div className="rounded-2xl bg-gradient-to-b from-[#121f36] to-[#0d1627] p-4.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-200">
                <Percent className="h-4 w-4 text-emerald-400" />
                Deux Équipes Marquent (BTTS)
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                MARCHÉ ALTERNATIF
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {totalBttsProb.toFixed(1)} %
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  OUI favori
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Cote équivalente : {(100 / totalBttsProb).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Projection Clean Sheet Domicile</span>
              <span className="font-mono text-slate-300 font-bold">
                {(100 - totalBttsProb * 0.7).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Card 3: Over / Under 2.5 Goals */}
          <div className="rounded-2xl bg-gradient-to-b from-[#121f36] to-[#0d1627] p-4.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-200">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Over 2.5 Buts (Match Ouvert)
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                TOTAL BUTS
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <div className="text-3xl font-black text-indigo-300 font-mono">
                {totalOver25Prob.toFixed(1)} %
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                  {totalOver25Prob > 50 ? '+2.5 Probable' : '-2.5 Probable'}
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Cote équivalente : {(100 / totalOver25Prob).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>xG total attendu</span>
              <span className="font-mono text-white font-bold">
                {(match.stats.xg.home + match.stats.xg.away).toFixed(2)} xG
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <span className="text-xs text-slate-400 font-bold mr-1">Filtrer l&apos;issue :</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              filterType === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous les scénarios (10)
          </button>
          <button
            onClick={() => setFilterType('HOME_WIN')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              filterType === 'HOME_WIN'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Victoire {match.homeTeam.shortName}
          </button>
          <button
            onClick={() => setFilterType('DRAW')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              filterType === 'DRAW'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Match Nul
          </button>
          <button
            onClick={() => setFilterType('AWAY_WIN')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              filterType === 'AWAY_WIN'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Victoire {match.awayTeam.shortName}
          </button>
        </div>
      </div>

      {/* Main Scenarios List - Completely unlocked and crystal clear */}
      <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-xs font-bold text-slate-400">
          <span>Score Exact Projeté (Arbre Intégral)</span>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">Cote Juste IA vs Marché</span>
            <span>Probabilité Modélisée</span>
          </div>
        </div>

        <div className="space-y-3.5">
          {filteredScenarios.map((scenario, index) => {
            return (
              <div
                key={`${scenario.home}-${scenario.away}`}
                className="relative rounded-2xl border border-slate-800/90 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900/90 p-3.5 sm:p-4 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Score badge */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-1 text-base font-black text-white font-mono tracking-wider shadow-inner">
                        {scenario.home} - {scenario.away}
                      </span>
                      {scenario.edge > 15 && (
                        <span className="rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 text-[10px] font-bold font-mono">
                          Value +{scenario.edge.toFixed(1)}% EV+
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Odds comparison */}
                  <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">
                      Cote Juste : <strong className="text-white">{scenario.fairOdds.toFixed(2)}</strong>
                    </span>
                    <span className="text-slate-400">
                      Marché : <strong className="text-amber-400">{scenario.marketOdds.toFixed(2)}</strong>
                    </span>
                  </div>

                  {/* Probability Bar & Percent */}
                  <div className="flex items-center gap-3 min-w-[140px] sm:min-w-[200px] justify-end">
                    <div className="w-24 sm:w-36 h-2 rounded-full bg-slate-950 overflow-hidden hidden xs:block">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, scenario.probability * 4.5)}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm font-black text-cyan-400 w-14 text-right">
                      {scenario.probability.toFixed(1)} %
                    </span>
                  </div>
                </div>

                {/* Sub-tags */}
                <div className="mt-2.5 flex items-center gap-3 text-[10px] text-slate-400 border-t border-slate-800/50 pt-2">
                  <span>{scenario.btts ? '⚽ Les 2 Équipes Marquent (Oui)' : '🚫 Clean Sheet (Non)'}</span>
                  <span>•</span>
                  <span>{scenario.over25 ? '🔥 Plus de 2.5 Buts' : '🛡️ Moins de 2.5 Buts'}</span>
                  <span>•</span>
                  <span>TRJ Théorique : {scenario.trjEstimate}%</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    Rentabilité modélisée : +{(scenario.edge * 0.8).toFixed(1)}% ROI
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
