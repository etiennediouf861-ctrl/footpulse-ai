import React, { useMemo, useState } from 'react';
import { FootballMatch } from '../types/football';
import { Search, SlidersHorizontal } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('ALL');

  const competitions = useMemo(
    () => Array.from(new Set(matches.map((match) => match.competition))).sort(),
    [matches]
  );

  const filteredMatches = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return matches.filter((match) => {
      const matchesCompetition = selectedCompetition === 'ALL' || match.competition === selectedCompetition;
      const searchableText = `${match.homeTeam.name} ${match.awayTeam.name} ${match.homeTeam.shortName} ${match.awayTeam.shortName} ${match.competition}`.toLowerCase();
      return matchesCompetition && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [matches, searchQuery, selectedCompetition]);

  const groupedMatches = useMemo(
    () => filteredMatches.reduce<Record<string, FootballMatch[]>>((groups, match) => {
      (groups[match.competition] ||= []).push(match);
      return groups;
    }, {}),
    [filteredMatches]
  );

  return (
    <div className="border-b border-slate-800/60 bg-[#0a0e1a]/90 backdrop-blur py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher une équipe ou un championnat"
              aria-label="Rechercher une équipe ou un championnat"
              className="h-9 w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-emerald-500/60"
            />
          </label>
          <label className="relative flex items-center gap-2 sm:w-64">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-500" />
            <select
              value={selectedCompetition}
              onChange={(event) => setSelectedCompetition(event.target.value)}
              aria-label="Filtrer par championnat"
              className="h-9 min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/60"
            >
              <option value="ALL">Tous les championnats</option>
              {competitions.map((competition) => (
                <option key={competition} value={competition}>{competition}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Direct ({filteredMatches.length}/{matches.length})
        </span>

        {Object.entries(groupedMatches).map(([competition, competitionMatches]) => (
          <React.Fragment key={competition}>
            <span className="text-[10px] font-black uppercase tracking-wide text-emerald-400/80 whitespace-nowrap">
              {competition}
            </span>
            {competitionMatches.map((match) => {
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
          </React.Fragment>
        ))}
        {filteredMatches.length === 0 && (
          <span className="text-xs text-slate-500 whitespace-nowrap">Aucun match ne correspond à la recherche.</span>
        )}
      </div>
      </div>
    </div>
  );
};
