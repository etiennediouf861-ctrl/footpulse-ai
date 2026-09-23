import React, { useState } from 'react';
import { MatchEvent } from '../types/football';
import { MessageSquare, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';

interface LiveCommentaryProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export const LiveCommentary: React.FC<LiveCommentaryProps> = ({
  events,
  homeTeamName,
  awayTeamName,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'GOALS' | 'CARDS' | 'CHANCES'>('ALL');

  // Sort latest first
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  const filteredEvents = sortedEvents.filter((ev) => {
    if (filter === 'GOALS') return ev.type === 'GOAL';
    if (filter === 'CARDS') return ev.type === 'YELLOW_CARD' || ev.type === 'RED_CARD';
    if (filter === 'CHANCES') return ev.type === 'BIG_CHANCE' || ev.type === 'DANGEROUS_ATTACK';
    return true;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Fil des Commentaires en Direct</h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'ALL'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous ({events.length})
          </button>
          <button
            onClick={() => setFilter('GOALS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'GOALS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚽ Buts
          </button>
          <button
            onClick={() => setFilter('CARDS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'CARDS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🟨 Cartons
          </button>
          <button
            onClick={() => setFilter('CHANCES')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'CHANCES'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔥 Occasions
          </button>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Aucun événement pour ce filtre.
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isGoal = ev.type === 'GOAL';
            const isYellow = ev.type === 'YELLOW_CARD';
            const isRed = ev.type === 'RED_CARD';
            const isChance = ev.type === 'BIG_CHANCE' || ev.type === 'DANGEROUS_ATTACK';

            let icon = <Zap className="h-4 w-4 text-emerald-400" />;
            let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';

            if (isGoal) {
              icon = <span className="text-sm">⚽</span>;
              badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30';
            } else if (isYellow) {
              icon = <span className="h-3 w-2 rounded-xs bg-amber-400 inline-block" />;
              badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
            } else if (isRed) {
              icon = <span className="h-3 w-2 rounded-xs bg-red-500 inline-block" />;
              badgeBg = 'bg-red-500/20 text-red-300 border-red-500/40';
            } else if (isChance) {
              icon = <AlertTriangle className="h-4 w-4 text-amber-400" />;
              badgeBg = 'bg-slate-800/90 text-slate-200 border-slate-700';
            }

            return (
              <div
                key={ev.id}
                className={`relative flex items-start gap-3 rounded-xl p-3 border transition ${
                  isGoal
                    ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/40 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {/* Minute */}
                <div className="flex flex-col items-center">
                  <span className="font-mono text-xs font-black text-slate-300">
                    {ev.minute}&apos;
                  </span>
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                    {icon}
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      {ev.title}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badgeBg}`}>
                      {ev.team === 'home' ? homeTeamName : awayTeamName}
                    </span>
                    {ev.xgValue && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 rounded border border-amber-500/20">
                        {ev.xgValue.toFixed(2)} xG
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
