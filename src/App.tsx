import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_MATCHES } from './data/mockMatches';
import {
  FootballMatch,
  GoalAlert,
  AiPrediction,
  Shot,
  MatchEvent,
  DeepTacticalDossier,
  AdvancedTacticalMetrics,
} from './types/football';
import { Header } from './components/Header';
import { MatchSelector } from './components/MatchSelector';
import { Scoreboard } from './components/Scoreboard';
import { PitchVisualizer } from './components/PitchVisualizer';
import { StatsPanel } from './components/StatsPanel';
import { LineupView } from './components/LineupView';
import { LiveCommentary } from './components/LiveCommentary';
import { AiPredictionsTab } from './components/AiPredictionsTab';
import { DeepAnalysisTab } from './components/DeepAnalysisTab';
import { ExactScoresView } from './components/ExactScoresView';
import { VerifiableHistoryView } from './components/VerifiableHistoryView';
import { PerformanceTrackerView } from './components/PerformanceTrackerView';
import { FormRadarView } from './components/FormRadarView';
import { SmartBetBuilderView } from './components/SmartBetBuilderView';
import { LiveBettingOddsPanel } from './components/LiveBettingOddsPanel';
import { QuickLiveOddsBar } from './components/QuickLiveOddsBar';
import { FloatingBetslip } from './components/FloatingBetslip';
import { KellyCalculatorModal } from './components/KellyCalculatorModal';
import { AiChatAnalyst } from './components/AiChatAnalyst';
import { GoalAlertModal } from './components/GoalAlertModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { sendGoalNotification, requestNotificationPermission } from './utils/notifications';
import { apiUrl } from './utils/api';
import {
  Sparkles,
  BarChart2,
  Activity,
  Users,
  MessageSquare,
  Bot,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Flame,
  Target,
  Layers,
  Calculator,
  Zap
} from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState<FootballMatch[]>(INITIAL_MATCHES);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('rm-mci');
  const [liveDataConnected, setLiveDataConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | 'LIVE_ODDS'
    | 'SMART_BUILDER'
    | 'EXACT_SCORES'
    | 'VERIFIABLE_HISTORY'
    | 'PERF_TRACKER'
    | 'FORM_RADAR'
    | 'DEEP_ANALYSIS'
    | 'PREDICTIONS'
    | 'STATS'
    | 'PITCH'
    | 'LINEUPS'
    | 'COMMENTARY'
    | 'CHAT'
  >('SMART_BUILDER');

  const [isKellyOpen, setIsKellyOpen] = useState(false);
  const [kellyParams, setKellyParams] = useState<{ odds: number; prob: number; name?: string }>({
    odds: 2.10,
    prob: 55,
  });

  const handleOpenKellyWithSelection = (odds: number, prob: number, name?: string) => {
    setKellyParams({ odds, prob, name });
    setIsKellyOpen(true);
  };
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeGoalAlert, setActiveGoalAlert] = useState<GoalAlert | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Selected match pointer
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  useEffect(() => {
    let cancelled = false;

    const loadLiveMatches = async () => {
      try {
        const response = await fetch(apiUrl('/api/live-matches'));
        if (!response.ok) throw new Error('Live data unavailable');

        const data = (await response.json()) as {
          matches?: Array<{
            id: string;
            competition: string;
            homeTeam: string;
            awayTeam: string;
            score: { home: number; away: number };
            minute: number;
            status: string;
          }>;
        };

        if (cancelled || !data.matches?.length) return;

        const liveMatches = data.matches.map((liveMatch, index) => {
          const template = INITIAL_MATCHES[index % INITIAL_MATCHES.length];
          return {
            ...template,
            id: liveMatch.id,
            competition: liveMatch.competition,
            minute: liveMatch.minute,
            status: liveMatch.status === 'HT' ? 'HT' : liveMatch.status === 'FT' ? 'FT' : '2H',
            isSimulating: false,
            score: liveMatch.score,
            homeTeam: { ...template.homeTeam, name: liveMatch.homeTeam, shortName: liveMatch.homeTeam.slice(0, 3).toUpperCase() },
            awayTeam: { ...template.awayTeam, name: liveMatch.awayTeam, shortName: liveMatch.awayTeam.slice(0, 3).toUpperCase() },
          } satisfies FootballMatch;
        });

        setMatches(liveMatches);
        setLiveDataConnected(true);
        setSelectedMatchId((currentId) => liveMatches.some((match) => match.id === currentId) ? currentId : liveMatches[0].id);
      } catch {
        if (!cancelled) setLiveDataConnected(false);
      }
    };

    loadLiveMatches();
    const interval = window.setInterval(loadLiveMatches, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  // Trigger Goal Function
  const triggerGoal = useCallback(
    (targetMatchId: string, team: 'home' | 'away', customScorer?: string) => {
      setMatches((prevMatches) => {
        return prevMatches.map((m) => {
          if (m.id !== targetMatchId) return m;

          const isHome = team === 'home';
          const targetTeam = isHome ? m.homeTeam : m.awayTeam;
          const otherTeam = isHome ? m.awayTeam : m.homeTeam;

          const newScore = {
            home: isHome ? m.score.home + 1 : m.score.home,
            away: !isHome ? m.score.away + 1 : m.score.away,
          };

          // Select random scorer from squad if not provided
          const outfieldPlayers = targetTeam.startingXI.filter((p) => p.position !== 'GK');
          const randomPlayer =
            outfieldPlayers[Math.floor(Math.random() * outfieldPlayers.length)] || targetTeam.startingXI[0];
          const scorerName = customScorer || randomPlayer.name;

          const assistCandidates = outfieldPlayers.filter((p) => p.name !== scorerName);
          const assistName =
            assistCandidates.length > 0
              ? assistCandidates[Math.floor(Math.random() * assistCandidates.length)].name
              : undefined;

          const xgValue = Number((0.35 + Math.random() * 0.45).toFixed(2));

          const newEvent: MatchEvent = {
            id: `goal-${Date.now()}`,
            minute: m.minute,
            type: 'GOAL',
            team,
            title: `BUUUUT ! ${scorerName} (${targetTeam.shortName})`,
            description: assistName
              ? `Action limpide : passe décisive de ${assistName}, conclusion parfaite de ${scorerName} !`
              : `Exploit individuel de ${scorerName} qui trouve la faille !`,
            player: scorerName,
            assistPlayer: assistName,
            xgValue,
          };

          const newShot: Shot = {
            id: `sh-${Date.now()}`,
            minute: m.minute,
            team,
            player: scorerName,
            x: isHome ? Math.floor(75 + Math.random() * 18) : Math.floor(7 + Math.random() * 18),
            y: Math.floor(35 + Math.random() * 30),
            xg: xgValue,
            outcome: 'GOAL',
          };

          const updatedXgHome = isHome ? m.stats.xg.home + xgValue : m.stats.xg.home;
          const updatedXgAway = !isHome ? m.stats.xg.away + xgValue : m.stats.xg.away;

          // Recalculate dynamic win probability based on new score
          const goalDiff = newScore.home - newScore.away;
          let winProbHome = 33;
          let drawProb = 33;
          let winProbAway = 34;

          if (goalDiff >= 2) {
            winProbHome = 84;
            drawProb = 12;
            winProbAway = 4;
          } else if (goalDiff === 1) {
            winProbHome = 65;
            drawProb = 24;
            winProbAway = 11;
          } else if (goalDiff === 0) {
            winProbHome = 34;
            drawProb = 38;
            winProbAway = 28;
          } else if (goalDiff === -1) {
            winProbHome = 14;
            drawProb = 25;
            winProbAway = 61;
          } else {
            winProbHome = 5;
            drawProb = 13;
            winProbAway = 82;
          }

          // Trigger active banner
          setActiveGoalAlert({
            id: `alert-${Date.now()}`,
            matchId: m.id,
            homeTeamName: m.homeTeam.name,
            awayTeamName: m.awayTeam.name,
            scoringTeamName: targetTeam.name,
            scoringTeamColor: targetTeam.primaryColor,
            scorer: scorerName,
            assist: assistName,
            minute: m.minute,
            newScore,
            xgValue,
            timestamp: Date.now(),
          });

          // Send system desktop notification
          sendGoalNotification(
            `⚽ BUUUUT pour ${targetTeam.name} ! (${m.minute}')`,
            `${scorerName} marque ! Nouveau score : ${m.homeTeam.shortName} ${newScore.home} - ${newScore.away} ${m.awayTeam.shortName}`
          );

          // Update match object
          return {
            ...m,
            score: newScore,
            events: [...m.events, newEvent],
            shots: [...m.shots, newShot],
            stats: {
              ...m.stats,
              xg: { home: updatedXgHome, away: updatedXgAway },
              shots: {
                home: isHome ? m.stats.shots.home + 1 : m.stats.shots.home,
                away: !isHome ? m.stats.shots.away + 1 : m.stats.shots.away,
              },
              shotsOnTarget: {
                home: isHome ? m.stats.shotsOnTarget.home + 1 : m.stats.shotsOnTarget.home,
                away: !isHome ? m.stats.shotsOnTarget.away + 1 : m.stats.shotsOnTarget.away,
              },
            },
            xgTimeline: [
              ...m.xgTimeline,
              { minute: m.minute, homeXg: updatedXgHome, awayXg: updatedXgAway },
            ],
            momentum: {
              ...m.momentum,
              homeDominance: isHome ? Math.min(85, m.momentum.homeDominance + 15) : Math.max(15, m.momentum.homeDominance - 15),
              awayDominance: !isHome ? Math.min(85, m.momentum.awayDominance + 15) : Math.max(15, m.momentum.awayDominance - 15),
            },
            aiPrediction: m.aiPrediction
              ? {
                  ...m.aiPrediction,
                  winProbabilityHome: winProbHome,
                  drawProbability: drawProb,
                  winProbabilityAway: winProbAway,
                  predictedFinalScore: `${newScore.home} - ${newScore.away}`,
                  tacticalSummary: `But décisif de ${scorerName} à la ${m.minute}' ! La dynamique bascule fortement en faveur de ${targetTeam.name}.`,
                }
              : undefined,
          };
        });
      });
    },
    []
  );

  // Trigger non-goal event
  const triggerSimulatedEvent = (type: 'DANGEROUS_ATTACK' | 'YELLOW_CARD') => {
    const isHome = Math.random() > 0.5;
    const team = isHome ? 'home' : 'away';
    const targetTeam = isHome ? selectedMatch.homeTeam : selectedMatch.awayTeam;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMatch.id) return m;

        if (type === 'YELLOW_CARD') {
          const newEvent: MatchEvent = {
            id: `card-${Date.now()}`,
            minute: m.minute,
            type: 'YELLOW_CARD',
            team,
            title: `Carton Jaune (${targetTeam.shortName})`,
            description: `Intervention illicite pour couper une transition rapide.`,
          };
          return {
            ...m,
            events: [...m.events, newEvent],
            stats: {
              ...m.stats,
              yellowCards: {
                home: isHome ? m.stats.yellowCards.home + 1 : m.stats.yellowCards.home,
                away: !isHome ? m.stats.yellowCards.away + 1 : m.stats.yellowCards.away,
              },
            },
          };
        } else {
          // Dangerous attack / shot on target
          const shotXg = Number((0.15 + Math.random() * 0.25).toFixed(2));
          const newShot: Shot = {
            id: `sh-${Date.now()}`,
            minute: m.minute,
            team,
            player: targetTeam.startingXI[9]?.name || targetTeam.startingXI[0].name,
            x: isHome ? 78 : 22,
            y: 50,
            xg: shotXg,
            outcome: Math.random() > 0.5 ? 'ON_TARGET' : 'BLOCKED',
          };
          const newEvent: MatchEvent = {
            id: `att-${Date.now()}`,
            minute: m.minute,
            type: 'BIG_CHANCE',
            team,
            title: `Alerte Occasion : ${targetTeam.shortName}`,
            description: `Frappe puissante repoussée par la défense !`,
            xgValue: shotXg,
          };

          return {
            ...m,
            shots: [...m.shots, newShot],
            events: [...m.events, newEvent],
            stats: {
              ...m.stats,
              shots: {
                home: isHome ? m.stats.shots.home + 1 : m.stats.shots.home,
                away: !isHome ? m.stats.shots.away + 1 : m.stats.shots.away,
              },
              shotsOnTarget: {
                home: isHome ? m.stats.shotsOnTarget.home + 1 : m.stats.shotsOnTarget.home,
                away: !isHome ? m.stats.shotsOnTarget.away + 1 : m.stats.shotsOnTarget.away,
              },
              xg: {
                home: isHome ? m.stats.xg.home + shotXg : m.stats.xg.home,
                away: !isHome ? m.stats.xg.away + shotXg : m.stats.xg.away,
              },
            },
          };
        }
      })
    );
  };

  // Main Simulation Loop
  const simRef = useRef({ isSimulating, simulationSpeed });
  simRef.current = { isSimulating, simulationSpeed };

  useEffect(() => {
    const intervalTime = Math.max(800, 3500 / simulationSpeed);

    const interval = setInterval(() => {
      if (!simRef.current.isSimulating) return;

      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (!m.isSimulating || m.minute >= 90) return m;

          const nextMinute = m.minute + 1;

          // Random tactical ball coordinates
          const attackingHome = Math.random() > 0.45;
          const ballX = attackingHome
            ? Math.floor(52 + Math.random() * 38)
            : Math.floor(10 + Math.random() * 38);
          const ballY = Math.floor(15 + Math.random() * 70);

          let zone: 'DEFENSIVE' | 'MIDDLE' | 'ATTACKING' | 'BOX' = 'MIDDLE';
          if (ballX > 80 || ballX < 20) zone = 'BOX';
          else if (ballX > 60 || ballX < 40) zone = 'ATTACKING';

          // Small random chance of event occurring spontaneously
          const roll = Math.random();
          let newEvents = [...m.events];
          let newShots = [...m.shots];
          let updatedStats = { ...m.stats };
          let updatedXg = { ...m.stats.xg };

          // 3% chance of a dangerous shot
          if (roll < 0.035) {
            const team = attackingHome ? 'home' : 'away';
            const shooter = attackingHome
              ? m.homeTeam.startingXI[Math.floor(Math.random() * m.homeTeam.startingXI.length)].name
              : m.awayTeam.startingXI[Math.floor(Math.random() * m.awayTeam.startingXI.length)].name;
            const shotXg = Number((0.08 + Math.random() * 0.2).toFixed(2));

            newShots.push({
              id: `sh-${Date.now()}-${Math.random()}`,
              minute: nextMinute,
              team,
              player: shooter,
              x: ballX,
              y: ballY,
              xg: shotXg,
              outcome: Math.random() > 0.5 ? 'ON_TARGET' : 'OFF_TARGET',
            });

            if (team === 'home') {
              updatedStats.shots.home += 1;
              updatedStats.shotsOnTarget.home += 1;
              updatedXg.home += shotXg;
            } else {
              updatedStats.shots.away += 1;
              updatedStats.shotsOnTarget.away += 1;
              updatedXg.away += shotXg;
            }
          }

          // Fluctuating momentum
          const delta = (Math.random() - 0.5) * 8;
          const newHomeDominance = Math.max(20, Math.min(80, Math.round(m.momentum.homeDominance + delta)));
          const newAwayDominance = 100 - newHomeDominance;

          return {
            ...m,
            minute: nextMinute,
            stats: {
              ...updatedStats,
              xg: updatedXg,
            },
            events: newEvents,
            shots: newShots,
            momentum: {
              ...m.momentum,
              homeDominance: newHomeDominance,
              awayDominance: newAwayDominance,
            },
            currentPlayPhase: {
              zone,
              attackingTeam: attackingHome ? 'home' : 'away',
              description: attackingHome
                ? `${m.homeTeam.shortName} progresse dans la moitié de terrain adverse.`
                : `${m.awayTeam.shortName} cherche une ouverture en phase de transition.`,
              ballPosition: { x: ballX, y: ballY },
            },
          };
        })
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [simulationSpeed]);

  const handleUpdatePrediction = (newPred: AiPrediction) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === selectedMatch.id ? { ...m, aiPrediction: newPred } : m))
    );
  };

  const handleUpdateDeepDossier = (dossier: DeepTacticalDossier, metrics: AdvancedTacticalMetrics) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === selectedMatch.id
          ? {
              ...m,
              deepDossier: dossier,
              advancedMetrics: metrics,
            }
          : m
      )
    );
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top App Bar */}
      <Header
        isSimulating={isSimulating}
        onToggleSimulating={() => setIsSimulating(!isSimulating)}
        simulationSpeed={simulationSpeed}
        onChangeSpeed={setSimulationSpeed}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onTriggerTestGoal={() => triggerGoal(selectedMatch.id, 'home')}
        onOpenKellyModal={() => setIsKellyOpen(true)}
        onOpenCombiner={() => setActiveTab('SMART_BUILDER')}
      />

      {/* Free & Open Access Status Banner */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-[#071914] via-[#09221d] to-[#0b1b2a] px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-black text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Plateforme 100% Gratuite & Sans Abonnement
            </span>
            <span className="text-slate-400 hidden md:inline">
              — Scores exacts IA, simulateur Monte Carlo, analyse tactique et historique vérifié débloqués pour tous.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsKellyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition shadow-sm"
            >
              <Calculator className="h-3 w-3 text-emerald-400" />
              <span>Calculateur Kelly (EV+)</span>
            </button>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Données en direct
            </span>
          </div>
        </div>
      </div>

      {/* Match Carousel / Horizontal Strip */}
      <MatchSelector
        matches={matches}
        selectedMatchId={selectedMatch.id}
        onSelectMatch={setSelectedMatchId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Scoreboard */}
        <Scoreboard
          match={selectedMatch}
          onSimulateGoal={(team) => triggerGoal(selectedMatch.id, team)}
          onSimulateEvent={triggerSimulatedEvent}
        />

        {/* Dynamic Real-time Live Betting Odds Bar */}
        <QuickLiveOddsBar
          match={selectedMatch}
          onOpenFullMarkets={() => setActiveTab('LIVE_ODDS')}
          onOpenKelly={handleOpenKellyWithSelection}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
          {/* LIVE BETTING ODDS (PANEL COMPLET) */}
          <button
            onClick={() => setActiveTab('LIVE_ODDS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'LIVE_ODDS'
                ? 'bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="h-4 w-4 text-amber-400 fill-current" />
            <span>Live Betting Odds</span>
            <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 font-black uppercase">
              TEMPS RÉEL
            </span>
          </button>

          {/* COMBINES INTELLIGENTS */}
          <button
            onClick={() => setActiveTab('SMART_BUILDER')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'SMART_BUILDER'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Combinés Intelligents</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 font-black uppercase">
              EV+ BOOST
            </span>
          </button>

          {/* SCORES EXACTS IA */}
          <button
            onClick={() => setActiveTab('EXACT_SCORES')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'EXACT_SCORES'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Target className="h-4 w-4 text-cyan-400" />
            <span>Scores Exacts IA</span>
            <span className="rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 font-black uppercase">
              MONTE CARLO
            </span>
          </button>

          {/* HISTORIQUE VÉRIFIABLE */}
          <button
            onClick={() => setActiveTab('VERIFIABLE_HISTORY')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'VERIFIABLE_HISTORY'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Historique Vérifié</span>
            <span className="rounded-full bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 font-black uppercase">
              76% HIT
            </span>
          </button>

          {/* PERFORMANCES & BANKROLL */}
          <button
            onClick={() => setActiveTab('PERF_TRACKER')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'PERF_TRACKER'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Performances & Journal</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 font-black uppercase">
              +169u
            </span>
          </button>

          {/* RADAR FORME & ELO */}
          <button
            onClick={() => setActiveTab('FORM_RADAR')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'FORM_RADAR'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Flame className="h-4 w-4 text-purple-400" />
            <span>Équipes en Forme</span>
            <span className="rounded-full bg-purple-500/20 text-purple-300 text-[10px] px-1.5 py-0.5 font-black uppercase">
              56 LIGUES
            </span>
          </button>

          {/* DEEP ANALYSIS */}
          <button
            onClick={() => setActiveTab('DEEP_ANALYSIS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'DEEP_ANALYSIS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span>Analyse Tactique IA</span>
          </button>

          <button
            onClick={() => setActiveTab('PREDICTIONS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'PREDICTIONS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Pronostics Match</span>
          </button>

          <button
            onClick={() => setActiveTab('STATS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'STATS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Statistiques & xG</span>
          </button>

          <button
            onClick={() => setActiveTab('PITCH')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'PITCH'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Terrain 2D & Tirs</span>
          </button>

          <button
            onClick={() => setActiveTab('LINEUPS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'LINEUPS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Compositions</span>
          </button>

          <button
            onClick={() => setActiveTab('COMMENTARY')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'COMMENTARY'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Commentaires ({selectedMatch.events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'CHAT'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Coach Vision AI</span>
          </button>
        </div>

        {/* Tab Views */}
        <div className="pt-2">
          {/* TAB: LIVE BETTING ODDS */}
          {activeTab === 'LIVE_ODDS' && (
            <LiveBettingOddsPanel
              match={selectedMatch}
              onOpenKellyWithSelection={handleOpenKellyWithSelection}
            />
          )}

          {/* TAB: COMBINES INTELLIGENTS */}
          {activeTab === 'SMART_BUILDER' && (
            <SmartBetBuilderView onOpenKelly={handleOpenKellyWithSelection} />
          )}

          {/* TAB 1: EXACT SCORES */}
          {activeTab === 'EXACT_SCORES' && (
            <ExactScoresView match={selectedMatch} />
          )}

          {/* TAB 2: VERIFIABLE HISTORY */}
          {activeTab === 'VERIFIABLE_HISTORY' && (
            <VerifiableHistoryView />
          )}

          {/* TAB 3: PERFORMANCE TRACKER */}
          {activeTab === 'PERF_TRACKER' && (
            <PerformanceTrackerView />
          )}

          {/* TAB 4: FORM RADAR & 56 LEAGUES */}
          {activeTab === 'FORM_RADAR' && (
            <FormRadarView />
          )}

          {activeTab === 'DEEP_ANALYSIS' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <DeepAnalysisTab
                  match={selectedMatch}
                  onUpdateDossier={handleUpdateDeepDossier}
                />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <PitchVisualizer match={selectedMatch} />
                <LiveCommentary
                  events={selectedMatch.events}
                  homeTeamName={selectedMatch.homeTeam.shortName}
                  awayTeamName={selectedMatch.awayTeam.shortName}
                />
              </div>
            </div>
          )}

          {activeTab === 'PREDICTIONS' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <AiPredictionsTab
                  match={selectedMatch}
                  onUpdatePrediction={handleUpdatePrediction}
                />
              </div>
              <div className="lg:col-span-4">
                <LiveCommentary
                  events={selectedMatch.events}
                  homeTeamName={selectedMatch.homeTeam.shortName}
                  awayTeamName={selectedMatch.awayTeam.shortName}
                />
              </div>
            </div>
          )}

          {activeTab === 'STATS' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <StatsPanel match={selectedMatch} />
              </div>
              <div className="lg:col-span-5">
                <PitchVisualizer match={selectedMatch} />
              </div>
            </div>
          )}

          {activeTab === 'PITCH' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <PitchVisualizer match={selectedMatch} />
              </div>
              <div className="lg:col-span-4">
                <StatsPanel match={selectedMatch} />
              </div>
            </div>
          )}

          {activeTab === 'LINEUPS' && (
            <LineupView match={selectedMatch} />
          )}

          {activeTab === 'COMMENTARY' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <LiveCommentary
                  events={selectedMatch.events}
                  homeTeamName={selectedMatch.homeTeam.shortName}
                  awayTeamName={selectedMatch.awayTeam.shortName}
                />
              </div>
              <div className="lg:col-span-5">
                <PitchVisualizer match={selectedMatch} />
              </div>
            </div>
          )}

          {activeTab === 'CHAT' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <AiChatAnalyst match={selectedMatch} />
              </div>
              <div className="lg:col-span-5">
                <AiPredictionsTab
                  match={selectedMatch}
                  onUpdatePrediction={handleUpdatePrediction}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Goal Alert Floating Banner / Modal */}
      <GoalAlertModal
        alert={activeGoalAlert}
        onClose={() => setActiveGoalAlert(null)}
        soundEnabled={soundEnabled}
      />

      {/* Alert Settings Modal */}
      <AlertSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        notificationsEnabled={notificationsEnabled}
        onRequestNotifications={handleRequestNotifications}
      />

      {/* Kelly Criterion & Money Management Modal */}
      <KellyCalculatorModal
        isOpen={isKellyOpen}
        onClose={() => setIsKellyOpen(false)}
        defaultOdds={kellyParams.odds}
        defaultProb={kellyParams.prob}
        selectionTitle={kellyParams.name}
      />

      {/* Global Floating Interactive Betslip (Combiner) */}
      <FloatingBetslip
        onOpenKelly={handleOpenKellyWithSelection}
        onNavigateToSmartBuilder={() => setActiveTab('SMART_BUILDER')}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0a0e19] py-5 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            FootPulse AI © 2026 • Plateforme d&apos;analyse footballistique en direct & modélisation xG
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Propulsé par Google Gemini 3.8 Flash
          </span>
        </div>
      </footer>
    </div>
  );
}
