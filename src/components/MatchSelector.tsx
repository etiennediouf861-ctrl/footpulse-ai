import React from 'react';
import { FootballMatch } from '../types/football';

interface MatchSelectorProps {
  matches: FootballMatch[];
  selectedMatchId: string;
  onSelectMatch: (matchId: string) => void;
}

export const MatchSelector: React.FC<MatchSelectorProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
}) => {
  return (
    <div className="border-b border-slate-800/60 bg-[#0a0e1a]/80 backdrop-blur py-2 px-4 sm:px-6 overflow-x-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto flex items-center gap-3 min-w-max">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Direct ({matches.length})
        </span>

        {matches.map((match) => {
          const isSelected = match.id === selectedMatchId;
          return (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match.id)}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/50 border-slate-800/70 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* Minute badge */}
              <div className="flex flex-col items-center justify-center">
                <span className="font-mono text-xs font-black text-emerald-400">
                  {match.minute}&apos;
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  {match.status}
                </span>
              </div>

              {/* Score & Teams */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{match.homeTeam.logo}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {match.homeTeam.shortName}
                  </span>
                </div>

                <div className="rounded bg-slate-950/80 px-2 py-0.5 font-mono text-xs font-black text-white border border-slate-800">
                  {match.score.home} - {match.score.away}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {match.awayTeam.shortName}
                  </span>
                  <span className="text-base">{match.awayTeam.logo}</span>
                </div>
              </div>

              {/* xG snippet */}
              <div className="hidden md:flex flex-col text-[10px] text-slate-400 border-l border-slate-800/80 pl-2">
                <span>xG: {match.stats.xg.home.toFixed(1)} - {match.stats.xg.away.toFixed(1)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
