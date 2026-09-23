import React, { useRef, useState, useEffect } from 'react';
import { FootballMatch } from '../types/football';
import { calculateDynamicLiveOdds, DynamicOddsState, LiveOddSelection } from '../utils/liveOddsEngine';
import { Zap, TrendingUp, TrendingDown, Calculator, ArrowRight, Flame } from 'lucide-react';

interface QuickLiveOddsBarProps {
  match: FootballMatch;
  onOpenFullMarkets: () => void;
  onOpenKelly: (odds: number, prob: number, name: string) => void;
}

export const QuickLiveOddsBar: React.FC<QuickLiveOddsBarProps> = ({
  match,
  onOpenFullMarkets,
  onOpenKelly,
}) => {
  const prevOdds = useRef<Record<string, number>>({});
  const [oddsState, setOddsState] = useState<DynamicOddsState>(() =>
    calculateDynamicLiveOdds(match)
  );

  useEffect(() => {
    const nextState = calculateDynamicLiveOdds(match, prevOdds.current);
    setOddsState(nextState);

    const snapshot: Record<string, number> = {};
    nextState.markets.forEach((m) => {
      m.selections.forEach((s) => {
        snapshot[s.id] = s.odds;
      });
    });
    prevOdds.current = snapshot;
  }, [
    match.minute,
    match.score.home,
    match.score.away,
    match.momentum.homeDominance,
    match.momentum.awayDominance,
    match.stats.xg.home,
    match.stats.xg.away,
  ]);

  const market1X2 = oddsState.markets.find((m) => m.id === '1X2');
  const marketNextGoal = oddsState.markets.find((m) => m.id === 'NEXT_GOAL');

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0d1627] via-[#0b1220] to-[#090e18] p-3.5 sm:p-4 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* Title & Pulse Indicator */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
          <Zap className="h-4 w-4 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white tracking-wide uppercase">
              Cotes Live en Direct
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-[10px] text-slate-400">
            Ajustées selon le momentum ({match.momentum.homeDominance}% - {match.momentum.awayDominance}%) & xG ({match.stats.xg.home.toFixed(2)} - {match.stats.xg.away.toFixed(2)})
          </span>
        </div>
      </div>

      {/* 1X2 Quick Selections */}
      {market1X2 && (
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            1X2 :
          </span>
          {market1X2.selections.map((sel) => {
            const isUp = sel.trend === 'UP';
            const isDown = sel.trend === 'DOWN';

            return (
              <button
                key={sel.id}
                onClick={() => onOpenKelly(sel.odds, sel.probability, sel.name)}
                className={`group flex items-center gap-2 rounded-xl px-3 py-1.5 border transition ${
                  sel.isValue
                    ? 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-200'
                }`}
                title={`Cliquer pour analyser avec Kelly Criterion (Probabilité IA : ${sel.probability}%)`}
              >
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block font-medium group-hover:text-slate-200">
                    {sel.name.includes('Victoire')
                      ? sel.name.replace('Victoire ', '')
                      : sel.name}
                  </span>
                  <div className="flex items-center gap-1 font-mono font-black text-xs">
                    <span>{sel.odds.toFixed(2)}</span>
                    {isUp && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                    {isDown && <TrendingDown className="h-3 w-3 text-rose-400" />}
                  </div>
                </div>

                {sel.isValue && (
                  <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black px-1 py-0.5 uppercase">
                    +{sel.evPercentage}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Button to open full markets */}
      <div className="flex items-center justify-end gap-2 shrink-0">
        <button
          onClick={onOpenFullMarkets}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition shadow-sm"
        >
          <span>Voir Tous les Marchés (5)</span>
          <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
