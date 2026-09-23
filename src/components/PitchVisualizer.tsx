import React, { useState } from 'react';
import { FootballMatch } from '../types/football';
import { Target, Activity, Flame, Eye } from 'lucide-react';

interface PitchVisualizerProps {
  match: FootballMatch;
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ match }) => {
  const [activeView, setActiveView] = useState<'TACTICAL' | 'SHOTS' | 'CORRIDORS'>('TACTICAL');

  const { ballPosition, description, zone } = match.currentPlayPhase;

  // Filter shots
  const homeShots = match.shots.filter((s) => s.team === 'home');
  const awayShots = match.shots.filter((s) => s.team === 'away');

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-4 sm:p-5 shadow-xl">
      {/* Header & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Terrain Tactique 2D en Temps Réel
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Phase active : <span className="text-slate-200 font-medium">{description}</span>
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setActiveView('TACTICAL')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeView === 'TACTICAL'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Tactique
          </button>
          <button
            onClick={() => setActiveView('SHOTS')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeView === 'SHOTS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            Carte des Tirs ({match.shots.length})
          </button>
          <button
            onClick={() => setActiveView('CORRIDORS')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeView === 'CORRIDORS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            Couloirs d&apos;Attaque
          </button>
        </div>
      </div>

      {/* Football Pitch Graphic */}
      <div className="relative aspect-[16/9] w-full max-h-[360px] overflow-hidden rounded-xl border-2 border-emerald-800/80 bg-[#164e2d] shadow-inner select-none">
        {/* Grass stripes pattern */}
        <div className="absolute inset-0 grid grid-cols-10 opacity-30 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={i % 2 === 0 ? 'bg-[#1b5e36]' : 'bg-[#144426]'}
            />
          ))}
        </div>

        {/* Pitch Lines (SVG) */}
        <svg className="absolute inset-0 h-full w-full stroke-white/40" fill="none" strokeWidth="1.5">
          {/* Border */}
          <rect x="3%" y="4%" width="94%" height="92%" rx="4" />
          {/* Halfway line */}
          <line x1="50%" y1="4%" x2="50%" y2="96%" />
          {/* Center circle */}
          <circle cx="50%" cy="50%" r="14%" />
          <circle cx="50%" cy="50%" r="1%" fill="rgba(255,255,255,0.6)" />

          {/* Left Penalty Area (Home) */}
          <rect x="3%" y="22%" width="15%" height="56%" />
          <rect x="3%" y="35%" width="6%" height="30%" />
          <path d="M 18% 42% A 8% 8% 0 0 1 18% 58%" />
          <circle cx="12%" cy="50%" r="0.8%" fill="rgba(255,255,255,0.6)" />

          {/* Right Penalty Area (Away) */}
          <rect x="82%" y="22%" width="15%" height="56%" />
          <rect x="91%" y="35%" width="6%" height="30%" />
          <path d="M 82% 42% A 8% 8% 0 0 0 82% 58%" />
          <circle cx="88%" cy="50%" r="0.8%" fill="rgba(255,255,255,0.6)" />
        </svg>

        {/* VIEW 1: TACTICAL & LIVE BALL */}
        {activeView === 'TACTICAL' && (
          <>
            {/* Team side indicators */}
            <div className="absolute top-2 left-4 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              ◀ {match.homeTeam.name}
            </div>
            <div className="absolute top-2 right-4 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              {match.awayTeam.name} ▶
            </div>

            {/* Current Phase Zone Highlight */}
            {zone === 'ATTACKING' && (
              <div className="absolute top-0 bottom-0 right-[15%] left-[55%] bg-emerald-500/10 border-x border-emerald-500/20 pointer-events-none animate-pulse" />
            )}
            {zone === 'BOX' && (
              <div className="absolute top-[20%] bottom-[20%] right-[3%] w-[18%] bg-amber-500/15 border border-amber-500/30 pointer-events-none animate-pulse" />
            )}

            {/* Animated Ball */}
            <div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
              }}
            >
              {/* Pulsing glow ring around ball */}
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute h-8 w-8 rounded-full bg-yellow-400 opacity-60" />
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-lg shadow-black ring-2 ring-yellow-400">
                  ⚽
                </span>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: SHOT MAP */}
        {activeView === 'SHOTS' && (
          <div className="absolute inset-0">
            {match.shots.map((shot) => {
              // Size proportional to xG
              const radius = Math.max(10, Math.min(26, shot.xg * 30 + 10));
              const isHome = shot.team === 'home';

              let borderColor = 'border-white';
              let bgColor = 'bg-slate-400/80';
              if (shot.outcome === 'GOAL') {
                borderColor = 'border-amber-400 ring-2 ring-amber-300';
                bgColor = 'bg-amber-400';
              } else if (shot.outcome === 'ON_TARGET') {
                borderColor = isHome ? 'border-emerald-400' : 'border-cyan-400';
                bgColor = isHome ? 'bg-emerald-500' : 'bg-cyan-500';
              } else if (shot.outcome === 'BLOCKED') {
                bgColor = 'bg-slate-600';
              }

              return (
                <div
                  key={shot.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${shot.x}%`,
                    top: `${shot.y}%`,
                  }}
                >
                  <div
                    style={{ width: `${radius}px`, height: `${radius}px` }}
                    className={`flex items-center justify-center rounded-full ${bgColor} ${borderColor} border shadow-md transition-transform hover:scale-125`}
                  >
                    {shot.outcome === 'GOAL' && (
                      <span className="text-[10px]">⚽</span>
                    )}
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 whitespace-nowrap rounded-lg bg-slate-950/90 border border-slate-700 px-2 py-1 text-[10px] text-white shadow-xl backdrop-blur">
                    <div className="font-bold">{shot.player} ({shot.minute}&apos;)</div>
                    <div className="text-slate-300">
                      {shot.outcome === 'GOAL' ? 'BUT !' : shot.outcome === 'ON_TARGET' ? 'Cadré' : 'Non cadré'} • <span className="font-mono text-amber-300">{shot.xg.toFixed(2)} xG</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 3: CORRIDORS */}
        {activeView === 'CORRIDORS' && (
          <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
            {/* Top corridor (Left flank home / Right flank away) */}
            <div className="flex justify-between items-center bg-black/40 rounded px-3 py-1.5 backdrop-blur border border-white/10">
              <span className="text-xs font-bold text-emerald-400">
                Couloir Gauche {match.homeTeam.shortName} : {match.attackCorridor.home.left}%
              </span>
              <span className="text-xs font-bold text-cyan-400">
                Couloir Droit {match.awayTeam.shortName} : {match.attackCorridor.away.right}%
              </span>
            </div>

            {/* Middle corridor (Plein axe) */}
            <div className="flex justify-between items-center bg-black/40 rounded px-3 py-1.5 backdrop-blur border border-white/10">
              <span className="text-xs font-bold text-emerald-400">
                Axe Central : {match.attackCorridor.home.center}%
              </span>
              <span className="text-xs font-bold text-cyan-400">
                Axe Central : {match.attackCorridor.away.center}%
              </span>
            </div>

            {/* Bottom corridor (Right flank home / Left flank away) */}
            <div className="flex justify-between items-center bg-black/40 rounded px-3 py-1.5 backdrop-blur border border-white/10">
              <span className="text-xs font-bold text-emerald-400">
                Couloir Droit {match.homeTeam.shortName} : {match.attackCorridor.home.right}%
              </span>
              <span className="text-xs font-bold text-cyan-400">
                Couloir Gauche {match.awayTeam.shortName} : {match.attackCorridor.away.left}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend below pitch */}
      {activeView === 'SHOTS' && (
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-400 border border-amber-200" />
              <span>But marqué</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Tir Cadré</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-500" />
              <span>Contré / Hors-cadre</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            * Le rayon du cercle est proportionnel au danger attendu (xG)
          </span>
        </div>
      )}
    </div>
  );
};
