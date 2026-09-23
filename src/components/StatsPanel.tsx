import React from 'react';
import { FootballMatch } from '../types/football';
import { BarChart2, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  match: FootballMatch;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ match }) => {
  const { stats, xgTimeline } = match;

  const statRows = [
    {
      label: 'Possession de Balle',
      home: `${stats.possession.home}%`,
      away: `${stats.possession.away}%`,
      homeVal: stats.possession.home,
      awayVal: stats.possession.away,
    },
    {
      label: 'Expected Goals (xG)',
      home: stats.xg.home.toFixed(2),
      away: stats.xg.away.toFixed(2),
      homeVal: stats.xg.home,
      awayVal: stats.xg.away,
    },
    {
      label: 'Tirs Totaux',
      home: stats.shots.home,
      away: stats.shots.away,
      homeVal: stats.shots.home,
      awayVal: stats.shots.away,
    },
    {
      label: 'Tirs Cadrés',
      home: stats.shotsOnTarget.home,
      away: stats.shotsOnTarget.away,
      homeVal: stats.shotsOnTarget.home,
      awayVal: stats.shotsOnTarget.away,
    },
    {
      label: 'Grosses Occasions (Big Chances)',
      home: stats.bigChances.home,
      away: stats.bigChances.away,
      homeVal: stats.bigChances.home,
      awayVal: stats.bigChances.away,
    },
    {
      label: 'Attaques Dangereuses',
      home: stats.dangerousAttacks.home,
      away: stats.dangerousAttacks.away,
      homeVal: stats.dangerousAttacks.home,
      awayVal: stats.dangerousAttacks.away,
    },
    {
      label: 'Passes Réussies',
      home: `${stats.passesCompleted.home} (${stats.passAccuracy.home}%)`,
      away: `${stats.passesCompleted.away} (${stats.passAccuracy.away}%)`,
      homeVal: stats.passesCompleted.home,
      awayVal: stats.passesCompleted.away,
    },
    {
      label: 'Corners',
      home: stats.corners.home,
      away: stats.corners.away,
      homeVal: stats.corners.home,
      awayVal: stats.corners.away,
    },
    {
      label: 'Arrêts du Gardien',
      home: stats.saves.home,
      away: stats.saves.away,
      homeVal: stats.saves.home,
      awayVal: stats.saves.away,
    },
    {
      label: 'Fautes Commises',
      home: stats.fouls.home,
      away: stats.fouls.away,
      homeVal: stats.fouls.home,
      awayVal: stats.fouls.away,
      invertLeading: true, // fewer fouls is cleaner
    },
    {
      label: 'Cartons Jaunes / Rouges',
      home: `${stats.yellowCards.home}J / ${stats.redCards.home}R`,
      away: `${stats.yellowCards.away}J / ${stats.redCards.away}R`,
      homeVal: stats.yellowCards.home + stats.redCards.home * 2,
      awayVal: stats.yellowCards.away + stats.redCards.away * 2,
      invertLeading: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* xG Timeline Visualizer */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Progression Cumulative xG (Expected Goals)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              {match.homeTeam.shortName} ({stats.xg.home.toFixed(2)})
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              {match.awayTeam.shortName} ({stats.xg.away.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Timeline SVG Chart */}
        <div className="relative h-44 w-full bg-slate-950/70 rounded-xl p-3 border border-slate-800">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.5" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.5" />
            <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.5" />

            {/* Half time marker 45' */}
            <line x1="50" y1="0" x2="50" y2="50" stroke="#334155" strokeWidth="0.7" strokeDasharray="1 1" />

            {/* Home xG Path */}
            {xgTimeline.length > 1 && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={xgTimeline
                  .map((p) => {
                    const x = (p.minute / 90) * 100;
                    // scale xG max to 3.0
                    const y = 48 - (p.homeXg / 3.0) * 44;
                    return `${x},${Math.max(2, Math.min(48, y))}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Away xG Path */}
            {xgTimeline.length > 1 && (
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={xgTimeline
                  .map((p) => {
                    const x = (p.minute / 90) * 100;
                    const y = 48 - (p.awayXg / 3.0) * 44;
                    return `${x},${Math.max(2, Math.min(48, y))}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Goal dots on timeline */}
            {match.events
              .filter((e) => e.type === 'GOAL')
              .map((goal) => {
                const x = (goal.minute / 90) * 100;
                const isHome = goal.team === 'home';
                const pt = xgTimeline.find((p) => p.minute >= goal.minute) || xgTimeline[xgTimeline.length - 1];
                const val = isHome ? pt.homeXg : pt.awayXg;
                const y = 48 - (val / 3.0) * 44;
                return (
                  <circle
                    key={goal.id}
                    cx={x}
                    cy={Math.max(2, Math.min(48, y))}
                    r="2.5"
                    fill="#fbbf24"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                );
              })}
          </svg>

          {/* X Axis Minute Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0&apos;</span>
            <span>15&apos;</span>
            <span>30&apos;</span>
            <span className="text-slate-400 font-bold">45&apos; (MT)</span>
            <span>60&apos;</span>
            <span>75&apos;</span>
            <span>90&apos;</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Stats */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Statistiques Comparatives Détaillées</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-400">{match.homeTeam.shortName}</span>
            <span className="text-cyan-400">{match.awayTeam.shortName}</span>
          </div>
        </div>

        <div className="space-y-4">
          {statRows.map((row, idx) => {
            const total = (row.homeVal || 0) + (row.awayVal || 0);
            const homePercent = total === 0 ? 50 : Math.round(((row.homeVal || 0) / total) * 100);
            const awayPercent = 100 - homePercent;

            const isHomeLeading = row.invertLeading
              ? (row.homeVal || 0) < (row.awayVal || 0)
              : (row.homeVal || 0) > (row.awayVal || 0);
            const isAwayLeading = row.invertLeading
              ? (row.awayVal || 0) < (row.homeVal || 0)
              : (row.awayVal || 0) > (row.homeVal || 0);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-mono font-bold ${
                      isHomeLeading ? 'text-emerald-400 font-black' : 'text-slate-300'
                    }`}
                  >
                    {row.home}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 text-center">
                    {row.label}
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      isAwayLeading ? 'text-cyan-400 font-black' : 'text-slate-300'
                    }`}
                  >
                    {row.away}
                  </span>
                </div>

                {/* Progress Dual Bar */}
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
                  <div
                    className="bg-emerald-500 transition-all duration-300"
                    style={{ width: `${homePercent}%` }}
                  />
                  <div
                    className="bg-cyan-500 transition-all duration-300"
                    style={{ width: `${awayPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
