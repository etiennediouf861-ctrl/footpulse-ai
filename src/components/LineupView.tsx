import React, { useState } from 'react';
import { FootballMatch } from '../types/football';
import { Users, Star } from 'lucide-react';

interface LineupViewProps {
  match: FootballMatch;
}

export const LineupView: React.FC<LineupViewProps> = ({ match }) => {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  const team = selectedTeam === 'home' ? match.homeTeam : match.awayTeam;
  const isHome = selectedTeam === 'home';

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
      {/* Header with Team Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Compositions & Notes des Joueurs</h3>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setSelectedTeam('home')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTeam === 'home'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{match.homeTeam.logo}</span>
            <span>{match.homeTeam.name}</span>
            <span className="text-[10px] font-mono text-slate-400">({match.homeTeam.formation})</span>
          </button>

          <button
            onClick={() => setSelectedTeam('away')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTeam === 'away'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{match.awayTeam.logo}</span>
            <span>{match.awayTeam.name}</span>
            <span className="text-[10px] font-mono text-slate-400">({match.awayTeam.formation})</span>
          </button>
        </div>
      </div>

      {/* Coach badge */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800 text-xs">
        <span className="text-slate-400">
          Entraîneur principal : <span className="text-white font-bold">{team.manager}</span>
        </span>
        <span className="font-mono text-slate-400">Schéma tactique : {team.formation}</span>
      </div>

      {/* Starting XI Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <span>Titulaires ({team.startingXI.length})</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {team.startingXI.map((player) => {
            const isTopRated = player.rating >= 8.0;

            return (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-xl bg-slate-900/80 p-3 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 font-mono text-xs font-black text-white border border-slate-700">
                    {player.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate max-w-[130px]">
                        {player.name}
                      </span>
                      {player.goals > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-black">
                          ⚽ {player.goals > 1 ? `x${player.goals}` : ''}
                        </span>
                      )}
                      {player.yellowCards > 0 && (
                        <span className="h-3 w-2 rounded-xs bg-amber-400 inline-block" title="Carton Jaune" />
                      )}
                      {player.redCards > 0 && (
                        <span className="h-3 w-2 rounded-xs bg-red-500 inline-block" title="Carton Rouge" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {player.position}
                    </span>
                  </div>
                </div>

                {/* Rating badge */}
                <div
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-mono font-black ${
                    isTopRated
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
                      : isHome
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-cyan-500/15 text-cyan-400'
                  }`}
                  title="Note de performance en direct"
                >
                  {isTopRated && <Star className="h-3 w-3 fill-current" />}
                  <span>{player.rating.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bench */}
        {team.bench.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Remplaçants disponibles
            </h4>
            <div className="flex flex-wrap gap-2">
              {team.bench.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-2 rounded-lg bg-slate-900/60 px-2.5 py-1.5 border border-slate-800 text-xs text-slate-300"
                >
                  <span className="font-mono text-[10px] text-slate-400">{b.number}</span>
                  <span className="font-medium">{b.name}</span>
                  <span className="text-[10px] text-slate-500">({b.position})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
