import React, { useState } from 'react';
import { FormTeamRadar } from '../types/football';
import { MOCK_RADAR_TEAMS, MOCK_COVERED_LEAGUES } from '../data/proData';
import {
  Flame,
  Globe2,
  TrendingUp,
  Shield,
  Activity,
  Star,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const FormRadarView: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [searchTeam, setSearchTeam] = useState<string>('');

  const teams = MOCK_RADAR_TEAMS.filter((t) => {
    if (selectedLeague !== 'ALL' && t.league !== selectedLeague) return false;
    if (searchTeam && !t.name.toLowerCase().includes(searchTeam.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner - 100% Free Access */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#180e2b] via-[#120a24] to-[#0a0614] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-400 text-white shadow-lg shadow-purple-950/60">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                  56 Compétitions Couvertes
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Accès Total Débloqué
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Trouve les équipes en forme & analyse leur Rang ELO
              </h2>
              <p className="text-xs text-slate-400">
                Repérez les dynamiques, séries de victoires, xG créés/subis et la volatilité des performances.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-purple-300 font-bold">
              ⚡ 600+ clubs analysés en continu
            </span>
          </div>
        </div>

        {/* 56 Covered Leagues Horizontal Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-purple-400" />
              Filtrer par Compétition (56 Ligues & Coupes) :
            </span>
            <span className="text-[11px] text-purple-300">{MOCK_COVERED_LEAGUES.length} compétitions majeures</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedLeague('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedLeague === 'ALL'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Toutes les ligues
            </button>
            {MOCK_COVERED_LEAGUES.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedLeague === league.name
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{league.flag}</span>
                <span>{league.name}</span>
                <span className="text-[10px] opacity-60">({league.matchesCount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Team search input */}
        <div className="mt-4 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un club (Real Madrid, Arsenal, Inter Milan...)..."
            value={searchTeam}
            onChange={(e) => setSearchTeam(e.target.value)}
            className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      {/* Teams Grid - Fully unlocked */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((team) => {
          return (
            <div
              key={team.id}
              className="rounded-3xl border border-slate-800 bg-[#0c1424] p-5 shadow-xl hover:border-purple-500/40 transition flex flex-col justify-between"
            >
              <div>
                {/* Team Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{team.flag}</span>
                    <div>
                      <h3 className="font-bold text-base text-white leading-tight">{team.name}</h3>
                      <span className="text-xs text-slate-400 font-medium">{team.league}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 text-xs font-mono font-bold">
                      {team.eloRating} ELO
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                      +{team.eloTrend} pts récents
                    </span>
                  </div>
                </div>

                {/* Form Dots */}
                <div className="flex items-center justify-between py-2.5 border-y border-slate-800/80 my-3">
                  <span className="text-xs text-slate-400 font-medium">5 Derniers Matchs :</span>
                  <div className="flex items-center gap-1.5">
                    {team.formStreak.map((res: 'W' | 'D' | 'L', i: number) => {
                      let color = 'bg-slate-700 text-slate-300';
                      if (res === 'W') color = 'bg-emerald-500 text-slate-950 font-black';
                      if (res === 'D') color = 'bg-amber-500 text-slate-950 font-black';
                      if (res === 'L') color = 'bg-rose-500 text-white font-black';

                      return (
                        <span
                          key={i}
                          className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-mono shadow-sm ${color}`}
                        >
                          {res}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Tactical Stats Matrix */}
                <div className="grid grid-cols-2 gap-2 text-center py-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      xG Moyen Créé
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {team.xgPerMatch.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Subi : {team.xgConcededPerMatch.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Volatilité Perfs
                    </span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {team.volatility.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-purple-400 font-bold block">
                      Calibration {team.modelCalibrationPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Match Projection Box */}
              <div className="rounded-2xl bg-slate-950/80 p-3.5 border border-slate-800/80 mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Prochain match vs {team.nextMatch.opponent}</span>
                  <span className="text-purple-300 font-mono font-bold">
                    {team.nextMatch.date}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400">
                    💡 {team.nextMatch.recommendedPick}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    @{team.nextMatch.odds.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
