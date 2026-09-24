import React from 'react';
import { FootballMatch } from '../types/football';
import { Shield, Clock, PlusCircle } from 'lucide-react';

interface ScoreboardProps {
  match: FootballMatch;
  onSimulateGoal: (team: 'home' | 'away') => void;
  onSimulateEvent: (type: 'DANGEROUS_ATTACK' | 'YELLOW_CARD') => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  match,
  onSimulateGoal,
  onSimulateEvent,
}) => {
  // Extract goal scorers for home and away
  const homeGoals = match.events.filter((e) => e.type === 'GOAL' && e.team === 'home');
  const awayGoals = match.events.filter((e) => e.type === 'GOAL' && e.team === 'away');

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-[#131b2e] via-[#0e1526] to-[#0a0f1d] p-5 sm:p-7 shadow-2xl">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: match.homeTeam.primaryColor || '#38bdf8' }}
      />
      <div
        className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: match.awayTeam.primaryColor || '#ec4899' }}
      />

      {/* Top bar: Competition, Stadium, Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-200 tracking-wide">
            {match.competition}
          </span>
          <span>•</span>
          <span className="hidden sm:inline">{match.stadium}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-slate-400 text-[11px]">
            <Shield className="h-3 w-3 text-slate-400" />
            <span>{match.referee}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            {match.status === 'HT' ? 'Mi-Temps' : `${match.minute}' Direct`}
          </span>
        </div>
      </div>

      {/* Main Scoreboard Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 py-6">
        {/* Home Team */}
        <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-4 text-left md:text-right order-1">
          <div className="order-2 md:order-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {match.homeTeam.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-start md:justify-end mt-0.5">
              <span>{match.homeTeam.formation}</span>
              <span>•</span>
              <span className="text-slate-300">Coach : {match.homeTeam.manager}</span>
            </div>
            {/* Scorer list */}
            {homeGoals.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 justify-start md:justify-end">
                {homeGoals.map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
                  >
                    <span>⚽</span>
                    <span>{g.player || 'But'}</span>
                    <span className="text-slate-400 font-mono">{g.minute}&apos;</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="order-1 md:order-2 flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg text-3xl sm:text-4xl">
            {match.homeTeam.logo}
          </div>
        </div>

        {/* Center: Score & Clock */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center order-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {match.score.home}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-600">:</span>
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {match.score.away}
            </span>
          </div>

          {/* xG pill */}
          <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-800 px-3 py-1 text-xs">
            <span className="text-slate-400">Expected Goals (xG) :</span>
            <span className="font-mono font-bold text-emerald-400">
              {match.stats.xg.home.toFixed(2)}
            </span>
            <span className="text-slate-400">-</span>
            <span className="font-mono font-bold text-cyan-400">
              {match.stats.xg.away.toFixed(2)}
            </span>
          </div>

          {/* Simulation fast action triggers */}
          {!match.isLiveData && <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => onSimulateGoal('home')}
              className="flex items-center gap-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300 transition"
              title={`Simuler un but pour ${match.homeTeam.name}`}
            >
              <PlusCircle className="h-3 w-3" />
              <span>+1 But {match.homeTeam.shortName}</span>
            </button>
            <button
              onClick={() => onSimulateGoal('away')}
              className="flex items-center gap-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 px-2.5 py-1 text-[11px] font-bold text-cyan-300 transition"
              title={`Simuler un but pour ${match.awayTeam.name}`}
            >
              <PlusCircle className="h-3 w-3" />
              <span>+1 But {match.awayTeam.shortName}</span>
            </button>
            <button
              onClick={() => onSimulateEvent('DANGEROUS_ATTACK')}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] font-semibold text-slate-300 transition"
              title="Simuler une occasion dangereuse"
            >
              ⚡ Occasion
            </button>
          </div>}
        </div>

        {/* Away Team */}
        <div className="md:col-span-4 flex items-center justify-start gap-4 text-left order-3">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg text-3xl sm:text-4xl">
            {match.awayTeam.logo}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {match.awayTeam.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{match.awayTeam.formation}</span>
              <span>•</span>
              <span className="text-slate-300">Coach : {match.awayTeam.manager}</span>
            </div>
            {/* Scorer list */}
            {awayGoals.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {awayGoals.map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
                  >
                    <span>⚽</span>
                    <span>{g.player || 'But'}</span>
                    <span className="text-slate-400 font-mono">{g.minute}&apos;</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Momentum Barometer */}
      <div className="mt-2 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span>Pression {match.homeTeam.shortName}</span>
            <span className="font-mono font-bold">({match.momentum.homeDominance}%)</span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-400">
            Indice de Momentum (15 dernières min)
          </span>
          <span className="text-cyan-400 flex items-center gap-1.5">
            <span className="font-mono font-bold">({match.momentum.awayDominance}%)</span>
            <span>Pression {match.awayTeam.shortName}</span>
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${match.momentum.homeDominance}%` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${match.momentum.awayDominance}%` }}
          />
          {/* Middle mark */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white/40" />
        </div>
      </div>
    </div>
  );
};
