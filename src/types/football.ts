export type MatchStatus = '1H' | 'HT' | '2H' | 'ET' | 'FT' | 'UPCOMING';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'ATT';
  rating: number; // e.g. 7.4
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  isSubstituted?: boolean;
  subMinute?: number;
  gridX?: number; // 0 to 100 for pitch positioning
  gridY?: number; // 0 to 100
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  formation: string; // e.g. '4-3-3', '4-2-3-1'
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  manager: string;
  startingXI: Player[];
  bench: Player[];
}

export interface MatchEvent {
  id: string;
  minute: number;
  extraTimeMinute?: number;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'BIG_CHANCE' | 'VAR' | 'PENALTY' | 'DANGEROUS_ATTACK';
  team: 'home' | 'away';
  title: string;
  description: string;
  player?: string;
  assistPlayer?: string;
  subIn?: string;
  subOut?: string;
  xgValue?: number;
}

export interface Shot {
  id: string;
  minute: number;
  team: 'home' | 'away';
  player: string;
  x: number; // 0 - 100 on pitch
  y: number; // 0 - 100 on pitch
  xg: number;
  outcome: 'GOAL' | 'ON_TARGET' | 'OFF_TARGET' | 'BLOCKED';
}

export interface MatchStats {
  possession: { home: number; away: number };
  xg: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  shotsOffTarget: { home: number; away: number };
  blockedShots: { home: number; away: number };
  bigChances: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
  passesCompleted: { home: number; away: number };
  totalPasses: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  tacklesWon: { home: number; away: number };
  saves: { home: number; away: number };
  dangerousAttacks: { home: number; away: number };
}

export interface MomentumDataPoint {
  minute: number;
  homeDominance: number; // 0-100 (50 is neutral)
  awayDominance: number;
  eventSnippet?: string;
}

export interface XgHistoryPoint {
  minute: number;
  homeXg: number;
  awayXg: number;
}

export interface AiPick {
  title: string;
  confidence: 'Élevée' | 'Moyenne' | 'Audacieux';
  odds: number;
  reasoning: string;
}

export interface AdvancedTacticalMetrics {
  ppda: { home: number; away: number }; // Passes per defensive action (lower = more aggressive pressing)
  fieldTilt: { home: number; away: number }; // % of final third passes (territorial dominance)
  expectedThreat: { home: number; away: number }; // xT generated
  postShotXg: { home: number; away: number }; // PSxG
  goalsPrevented: { home: number; away: number }; // PSxG - goals conceded
  duelSuccess: { home: number; away: number }; // % of duels won
  halfSpaceEntries: { home: number; away: number }; // Entries into half-spaces
  boxTouches: { home: number; away: number }; // Touches in opponent penalty box
  pressingIntensity: { home: 'Haut & Agressif' | 'Bloc Médian' | 'Bloc Bas'; away: 'Haut & Agressif' | 'Bloc Médian' | 'Bloc Bas' };
  transitionSpeedIndex: { home: number; away: number }; // Scale 1 to 10
}

export interface KeyDuel {
  homePlayer: string;
  awayPlayer: string;
  zone: string;
  description: string;
  homeAdvantage: number; // 0 to 100%
  keyStat: string;
}

export interface DeepTacticalDossier {
  generatedAtMinute: number;
  executiveSummary: string;
  tacticalPhaseBreakdown: {
    buildUp: string;
    pressingAndBlock: string;
    attackingShape: string;
    defensiveTransitions: string;
  };
  advancedMetricsAnalysis: {
    fieldTiltCommentary: string;
    xtBreakdown: string;
    ppdaEvaluation: string;
    goalkeeperImpact: string;
  };
  keyDuels: KeyDuel[];
  vulnerabilities: {
    home: string[];
    away: string[];
  };
  scenarioSimulations: {
    scenarioName: string;
    probability: number;
    tacticalImpact: string;
    projectedScore: string;
  }[];
  managerialDirectives: {
    homeCoachAdvice: string[];
    awayCoachAdvice: string[];
  };
  valueBetsDeep: {
    market: string;
    fairOdds: number;
    bookmakerOdds: number;
    edgePercentage: number;
    confidence: 'Élevée' | 'Moyenne' | 'Audacieux';
    deepRationale: string;
  }[];
}

export interface AiPrediction {
  winProbabilityHome: number;
  drawProbability: number;
  winProbabilityAway: number;
  predictedFinalScore: string;
  nextGoalLikelihood: string;
  overUnder25Likelihood: string;
  tacticalSummary: string;
  keyTrend: string;
  aiPicks: AiPick[];
  riskFactors: string[];
  generatedAtMinute?: number;
}

export interface FootballMatch {
  id: string;
  competition: string;
  stadium: string;
  referee: string;
  minute: number;
  status: MatchStatus;
  isSimulating: boolean;
  simulationSpeed: number; // 1, 2, 5
  score: { home: number; away: number };
  homeTeam: Team;
  awayTeam: Team;
  stats: MatchStats;
  momentum: {
    homeDominance: number;
    awayDominance: number;
    history: MomentumDataPoint[];
  };
  xgTimeline: XgHistoryPoint[];
  events: MatchEvent[];
  shots: Shot[];
  currentPlayPhase: {
    zone: 'DEFENSIVE' | 'MIDDLE' | 'ATTACKING' | 'BOX';
    attackingTeam: 'home' | 'away';
    description: string;
    ballPosition: { x: number; y: number }; // 0 to 100
  };
  attackCorridor: {
    home: { left: number; center: number; right: number };
    away: { left: number; center: number; right: number };
  };
  advancedMetrics?: AdvancedTacticalMetrics;
  deepDossier?: DeepTacticalDossier;
  aiPrediction?: AiPrediction;
}

export interface GoalAlert {
  id: string;
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
  scoringTeamName: string;
  scoringTeamColor: string;
  scorer: string;
  assist?: string;
  minute: number;
  newScore: { home: number; away: number };
  xgValue?: number;
  timestamp: number;
}

export type SubscriptionPlan = 'FREE' | 'PRO' | 'ELITE';

export interface ExactScoreScenario {
  home: number;
  away: number;
  probability: number; // e.g. 18.6%
  fairOdds: number; // e.g. 5.38
  marketOdds: number; // e.g. 6.50
  edge: number; // e.g. +20.8%
  isPlausibleRank: number; // 1 to 10
  btts: boolean;
  over25: boolean;
  trjEstimate: number; // e.g. 96.5%
}

export interface HistoricalPrediction {
  id: string;
  date: string;
  matchName: string;
  competition: string;
  pick: string;
  odds: number;
  result: 'WON' | 'LOST' | 'VOID';
  unitsResult: number; // +1.15 or -1.00
  confidence: 'Stable' | 'Haute' | 'Ultra-Haute';
  modelHitRate: number;
  scoreResult: string;
}

export interface FormTeamRadar {
  id: string;
  name: string;
  shortName: string;
  league: string;
  country: string;
  flag: string;
  eloRating: number;
  eloTrend: number;
  formStreak: ('W' | 'D' | 'L')[];
  streakDesc: string;
  xgPerMatch: number;
  xgConcededPerMatch: number;
  volatility: number;
  nextMatch: {
    opponent: string;
    date: string;
    modelConfidence: number;
    recommendedPick: string;
    odds: number;
  };
  modelCalibrationPct: number;
}

export interface BankrollSummary {
  netProfitUnits: number; // +169.85
  roiPercentage: number; // 64.15%
  winRatePercentage: number; // 76.0%
  averageOdds: number; // 2.125
  currentWinStreak: number; // 18
  bestWinStreak: number; // 22
  totalPicksVerified: number; // 1792
  communityRank: number; // 4e sur 12 450
}
