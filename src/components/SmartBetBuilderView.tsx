import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Calculator,
  Flame,
  ArrowRight,
  Info,
  Filter,
  Search,
  Plus,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Cpu,
  FileText,
  BarChart3
} from 'lucide-react';
import { DeepCombinerAnalysis } from './DeepCombinerAnalysis';

export type SportType = 'ALL' | 'FOOTBALL' | 'BASKETBALL' | 'TENNIS' | 'RUGBY';

export interface Selection {
  id: string;
  sport: 'FOOTBALL' | 'BASKETBALL' | 'TENNIS' | 'RUGBY';
  sportLabel: string;
  sportIcon: string;
  match: string;
  league: string;
  pick: string;
  odds: number;
  fairOdds: number;
  probability: number;
  evPercentage: number;
  reason: string;
}

export interface TicketPreset {
  id: string;
  name: string;
  subtitle: string;
  sport: 'FOOTBALL' | 'BASKETBALL' | 'TENNIS' | 'RUGBY' | 'MULTI';
  sportLabel: string;
  sportIcon: string;
  league: string; // primary league or "Multi-Ligues"
  tag: string;
  tagColor: string;
  borderColor: string;
  totalOdds: number;
  cumulativeProb: number;
  evPercentage: number;
  selections: Selection[];
}

export const ALL_SELECTIONS_POOL: Selection[] = [
  // Football - Ligue des Champions
  {
    id: 'sel-1',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Real Madrid vs Manchester City',
    league: 'Ligue des Champions',
    pick: 'Les 2 Équipes Marquent (BTTS - Oui)',
    odds: 1.48,
    fairOdds: 1.27,
    probability: 78.5,
    evPercentage: 16.2,
    reason: 'xG moyen cumulé supérieur à 3.42 et attaques au complet en confrontation directe.',
  },
  {
    id: 'sel-2',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Arsenal vs Paris SG',
    league: 'Ligue des Champions',
    pick: 'Arsenal gagne par 1 but d’écart ou Nul',
    odds: 1.95,
    fairOdds: 1.61,
    probability: 62.0,
    evPercentage: 20.9,
    reason: 'Modèle IA identifie une surcote notable sur le marché asiatique à l’Emirates Stadium.',
  },
  {
    id: 'sel-3',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Real Madrid vs Manchester City',
    league: 'Ligue des Champions',
    pick: 'Plus de 2.5 Buts & Mbappé marque',
    odds: 2.20,
    fairOdds: 1.92,
    probability: 52.0,
    evPercentage: 14.4,
    reason: 'Mbappé convertit 0.78 xG/90min lors des grands rendez-vous européens.',
  },
  // Football - Premier League
  {
    id: 'sel-4',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Liverpool vs Chelsea',
    league: 'Premier League',
    pick: 'Liverpool gagne & Plus de 1.5 buts',
    odds: 1.82,
    fairOdds: 1.55,
    probability: 64.5,
    evPercentage: 17.4,
    reason: 'Anfield reste une forteresse avec 82% de victoires et 2.6 buts marqués par match cette saison.',
  },
  {
    id: 'sel-5',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Manchester City vs Tottenham',
    league: 'Premier League',
    pick: 'Man City gagne & Plus de 2.5 buts',
    odds: 1.75,
    fairOdds: 1.48,
    probability: 67.5,
    evPercentage: 18.2,
    reason: 'Domination territoriale moyenne de 68% face aux équipes du Top 6.',
  },
  {
    id: 'sel-6',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Arsenal vs Newcastle',
    league: 'Premier League',
    pick: 'Moins de 3.5 buts',
    odds: 1.52,
    fairOdds: 1.35,
    probability: 74.0,
    evPercentage: 12.5,
    reason: 'Deux meilleures défenses de Premier League concédant moins de 0.85 xG par rencontre.',
  },
  // Football - Serie A
  {
    id: 'sel-7',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Inter Milan vs AC Milan',
    league: 'Serie A',
    pick: 'Inter Milan ou Nul & Moins de 3.5 buts',
    odds: 1.47,
    fairOdds: 1.13,
    probability: 88.4,
    evPercentage: 15.1,
    reason: 'Inter invaincue à domicile et défense concédant seulement 0.65 xG/m.',
  },
  {
    id: 'sel-8',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Juventus vs AS Roma',
    league: 'Serie A',
    pick: 'Match Nul à la mi-temps ou fin de match',
    odds: 1.68,
    fairOdds: 1.47,
    probability: 68.0,
    evPercentage: 14.2,
    reason: 'Blocs bas historiques : 7 des 9 derniers duels étaient à égalité à la 45e minute.',
  },
  // Football - La Liga
  {
    id: 'sel-9',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Barcelone vs Atletico Madrid',
    league: 'La Liga',
    pick: 'Moins de 3.5 Buts',
    odds: 1.55,
    fairOdds: 1.38,
    probability: 72.0,
    evPercentage: 11.6,
    reason: 'Bloc bas tactique de Simeone neutralisant les phases de transition adverse.',
  },
  {
    id: 'sel-10',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Real Madrid vs Athletic Bilbao',
    league: 'La Liga',
    pick: 'Real Madrid gagne sans encaisser',
    odds: 2.15,
    fairOdds: 1.82,
    probability: 55.0,
    evPercentage: 18.2,
    reason: 'Clean sheet maintenu lors de 70% des réceptions au Santiago Bernabéu.',
  },
  // Football - Bundesliga
  {
    id: 'sel-11',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Bayern Munich vs Bayer Leverkusen',
    league: 'Bundesliga',
    pick: 'Plus de 2.5 Buts & Plus de 8.5 Corners',
    odds: 2.18,
    fairOdds: 1.71,
    probability: 58.5,
    evPercentage: 27.5,
    reason: 'Deux meilleures équipes offensives d’Europe avec un tempo de jeu ultra-rapide.',
  },
  {
    id: 'sel-12',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Borussia Dortmund vs RB Leipzig',
    league: 'Bundesliga',
    pick: 'Les 2 Équipes Marquent & Plus de 2.5 buts',
    odds: 1.78,
    fairOdds: 1.49,
    probability: 67.0,
    evPercentage: 19.3,
    reason: 'Historique de 8 matchs consécutifs avec plus de 3 buts et BTTS validé.',
  },
  // Football - Ligue 1
  {
    id: 'sel-13',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Paris SG vs Olympique de Marseille',
    league: 'Ligue 1',
    pick: 'PSG gagne & Les deux équipes marquent',
    odds: 2.05,
    fairOdds: 1.85,
    probability: 54.0,
    evPercentage: 10.8,
    reason: 'Classique prolifique : les 5 dernières confrontations ont vu des buts des 2 côtés.',
  },
  {
    id: 'sel-14',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    match: 'Monaco vs Lille',
    league: 'Ligue 1',
    pick: 'Plus de 2.5 Buts',
    odds: 1.72,
    fairOdds: 1.50,
    probability: 66.5,
    evPercentage: 14.4,
    reason: 'Monaco produit en moyenne 2.85 xG par match au Stade Louis-II.',
  },
  // Basketball - NBA
  {
    id: 'sel-15',
    sport: 'BASKETBALL',
    sportLabel: 'Basketball',
    sportIcon: '🏀',
    match: 'Boston Celtics vs Los Angeles Lakers',
    league: 'NBA',
    pick: 'Boston Celtics -5.5 & Plus de 219.5 points',
    odds: 2.25,
    fairOdds: 1.78,
    probability: 56.0,
    evPercentage: 26.0,
    reason: 'Offensive rating supérieur à 122.4 à domicile et rythme de possession rapide.',
  },
  {
    id: 'sel-16',
    sport: 'BASKETBALL',
    sportLabel: 'Basketball',
    sportIcon: '🏀',
    match: 'Denver Nuggets vs Golden State Warriors',
    league: 'NBA',
    pick: 'Nikola Jokic Triple-Double ou +24.5 Pts',
    odds: 1.85,
    fairOdds: 1.56,
    probability: 64.0,
    evPercentage: 18.4,
    reason: 'Mismatch défensif majeur dans la raquette des Warriors (concède 54 pts intérieurs).',
  },
  // Basketball - EuroLeague
  {
    id: 'sel-17',
    sport: 'BASKETBALL',
    sportLabel: 'Basketball',
    sportIcon: '🏀',
    match: 'Real Madrid Basket vs AS Monaco Basket',
    league: 'EuroLeague',
    pick: 'Real Madrid gagne par 4 points ou +',
    odds: 1.70,
    fairOdds: 1.45,
    probability: 69.0,
    evPercentage: 17.3,
    reason: 'Invaincu sur les 12 dernières réceptions européennes au WiZink Center.',
  },
  // Tennis - ATP Masters & Grand Chelem
  {
    id: 'sel-18',
    sport: 'TENNIS',
    sportLabel: 'Tennis',
    sportIcon: '🎾',
    match: 'Carlos Alcaraz vs Jannik Sinner',
    league: 'ATP Masters 1000',
    pick: 'Plus de 22.5 Jeux dans le match',
    odds: 1.90,
    fairOdds: 1.58,
    probability: 63.5,
    evPercentage: 20.6,
    reason: 'Rivalité au sommet : 85% de leurs duels sont allés au set décisif.',
  },
  {
    id: 'sel-19',
    sport: 'TENNIS',
    sportLabel: 'Tennis',
    sportIcon: '🎾',
    match: 'Novak Djokovic vs Daniil Medvedev',
    league: 'Grand Chelem',
    pick: 'Djokovic gagne & les deux joueurs gagnent un set',
    odds: 2.30,
    fairOdds: 1.88,
    probability: 53.0,
    evPercentage: 21.9,
    reason: 'Efficacité sur points décisifs et tie-breaks remportés (78% sur dur extérieur).',
  },
  // Rugby - Top 14 & 6 Nations
  {
    id: 'sel-20',
    sport: 'RUGBY',
    sportLabel: 'Rugby',
    sportIcon: '🏉',
    match: 'Stade Toulousain vs Stade Rochelais',
    league: 'Top 14',
    pick: 'Toulouse gagne de 6 points ou plus',
    odds: 1.80,
    fairOdds: 1.54,
    probability: 65.0,
    evPercentage: 17.0,
    reason: 'Ligne d’attaque complète avec Dupont & Ntamack, invaincue à Ernest-Wallon.',
  },
];

export const PRESET_TICKETS: TicketPreset[] = [
  // 1. Safe Multi-Leagues Football
  {
    id: 'ticket-safe',
    name: 'Ticket "Sécurité & Régularité"',
    subtitle: 'Idéal pour faire fructifier votre bankroll avec une variance minimale',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    league: 'Multi-Ligues Europe',
    tag: 'HAUTE PROBABILITÉ (69.4%)',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/30',
    totalOdds: 2.18,
    cumulativeProb: 69.4,
    evPercentage: 15.6,
    selections: [ALL_SELECTIONS_POOL[0], ALL_SELECTIONS_POOL[6]],
  },
  // 2. Champions League Choc Européen
  {
    id: 'ticket-ucl',
    name: 'Ticket "Choc Champions League"',
    subtitle: '100% Ligue des Champions focalisé sur les grands rendez-vous du mardi/mercredi',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    league: 'Ligue des Champions',
    tag: 'SPECIAL UCL (+22.4% EV)',
    tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    borderColor: 'border-indigo-500/30',
    totalOdds: 2.89,
    cumulativeProb: 48.7,
    evPercentage: 22.4,
    selections: [ALL_SELECTIONS_POOL[0], ALL_SELECTIONS_POOL[1]],
  },
  // 3. Premier League English Tempo
  {
    id: 'ticket-epl',
    name: 'Ticket "Premier League Master"',
    subtitle: 'Sélections calibrées sur le rythme intense et les transitions anglaises',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    league: 'Premier League',
    tag: 'ANGLETERRE (+24.1% EV)',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderColor: 'border-cyan-500/30',
    totalOdds: 3.32,
    cumulativeProb: 47.7,
    evPercentage: 24.1,
    selections: [ALL_SELECTIONS_POOL[3], ALL_SELECTIONS_POOL[4]],
  },
  // 4. Value Bet Bundesliga & Chocs
  {
    id: 'ticket-value',
    name: 'Ticket "Value Bet Optimisé"',
    subtitle: 'La plus haute espérance de gain mathématique (EV+) par rapport aux cotes',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    league: 'Bundesliga & Europe',
    tag: 'MAX VALUE (+26.8% EV)',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    borderColor: 'border-teal-500/30',
    totalOdds: 4.25,
    cumulativeProb: 44.2,
    evPercentage: 26.8,
    selections: [ALL_SELECTIONS_POOL[1], ALL_SELECTIONS_POOL[10]],
  },
  // 5. Basketball NBA & EuroLeague
  {
    id: 'ticket-nba',
    name: 'Ticket "Parquet NBA & EuroLeague"',
    subtitle: 'Combiné basket basé sur les possessions rapides et les écarts de points',
    sport: 'BASKETBALL',
    sportLabel: 'Basketball',
    sportIcon: '🏀',
    league: 'NBA & EuroLeague',
    tag: '100% BASKETBALL (+28.2% EV)',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500/30',
    totalOdds: 3.82,
    cumulativeProb: 38.6,
    evPercentage: 28.2,
    selections: [ALL_SELECTIONS_POOL[14], ALL_SELECTIONS_POOL[16]],
  },
  // 6. Tennis Masters & Grand Chelem
  {
    id: 'ticket-tennis',
    name: 'Ticket "Ace & Court Tennis"',
    subtitle: 'Duels au sommet ATP et Grand Chelem analysés sur les statistiques de service',
    sport: 'TENNIS',
    sportLabel: 'Tennis',
    sportIcon: '🎾',
    league: 'ATP & Grand Chelem',
    tag: '100% TENNIS (+22.8% EV)',
    tagColor: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    borderColor: 'border-lime-500/30',
    totalOdds: 4.37,
    cumulativeProb: 33.6,
    evPercentage: 22.8,
    selections: [ALL_SELECTIONS_POOL[17], ALL_SELECTIONS_POOL[18]],
  },
  // 7. Multi-Sports Cross EV+
  {
    id: 'ticket-multisport',
    name: 'Ticket "Cross-Sport EV+ Master"',
    subtitle: 'Le meilleur de l’IA combinant Foot, Basket et Tennis à forte corrélation positive',
    sport: 'MULTI',
    sportLabel: 'Multi-Sports',
    sportIcon: '🌟',
    league: 'Mix Multi-Sports',
    tag: 'TRI-SPORTS EV+ (+25.4%)',
    tagColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    borderColor: 'border-fuchsia-500/30',
    totalOdds: 4.76,
    cumulativeProb: 32.5,
    evPercentage: 25.4,
    selections: [ALL_SELECTIONS_POOL[0], ALL_SELECTIONS_POOL[15], ALL_SELECTIONS_POOL[17]],
  },
  // 8. Jackpot Mathématique 4 Chocs
  {
    id: 'ticket-jackpot',
    name: 'Ticket "Jackpot Mathématique"',
    subtitle: 'Multiplicateur explosif combinant 4 sélections à forte corrélation positive',
    sport: 'FOOTBALL',
    sportLabel: 'Football',
    sportIcon: '⚽',
    league: 'Multi-Ligues Europe',
    tag: 'COTE X12.80 (GROS GAIN)',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500/30',
    totalOdds: 12.85,
    cumulativeProb: 22.8,
    evPercentage: 35.4,
    selections: [
      ALL_SELECTIONS_POOL[2],
      ALL_SELECTIONS_POOL[3],
      ALL_SELECTIONS_POOL[8],
      ALL_SELECTIONS_POOL[12],
    ],
  },
];

interface SmartBetBuilderViewProps {
  onOpenKelly?: (odds: number, prob: number, name: string) => void;
}

export const SmartBetBuilderView: React.FC<SmartBetBuilderViewProps> = ({ onOpenKelly }) => {
  // Navigation mode
  const [viewMode, setViewMode] = useState<'PRESET_TICKETS' | 'CUSTOM_BUILDER'>('PRESET_TICKETS');

  // Filters state
  const [selectedSport, setSelectedSport] = useState<SportType>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'SAFE' | 'VALUE' | 'HIGH_ODDS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected preset ticket
  const [selectedTicketId, setSelectedTicketId] = useState<string>('ticket-safe');
  const [stake, setStake] = useState<number>(25);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ticketTab, setTicketTab] = useState<'ANALYSIS' | 'TICKET'>('ANALYSIS');
  const [showCustomAnalysis, setShowCustomAnalysis] = useState<boolean>(false);

  // Custom builder selected items
  const [customSelectedIds, setCustomSelectedIds] = useState<string[]>([
    'sel-1',
    'sel-4',
    'sel-15',
  ]);

  // Available sports definition
  const sportsList: { id: SportType; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Tous les Sports', icon: '🌟' },
    { id: 'FOOTBALL', label: 'Football', icon: '⚽' },
    { id: 'BASKETBALL', label: 'Basketball', icon: '🏀' },
    { id: 'TENNIS', label: 'Tennis', icon: '🎾' },
    { id: 'RUGBY', label: 'Rugby', icon: '🏉' },
  ];

  // Available leagues definition depending on sport
  const availableLeagues = useMemo(() => {
    const leaguesSet = new Set<string>();
    ALL_SELECTIONS_POOL.forEach((sel) => {
      if (selectedSport === 'ALL' || sel.sport === selectedSport) {
        leaguesSet.add(sel.league);
      }
    });
    return Array.from(leaguesSet);
  }, [selectedSport]);

  // Filter Preset Tickets
  const filteredTickets = useMemo(() => {
    return PRESET_TICKETS.filter((ticket) => {
      // 1. Sport filter
      if (selectedSport !== 'ALL') {
        if (ticket.sport !== selectedSport && ticket.sport !== 'MULTI') {
          return false;
        }
        if (ticket.sport === 'MULTI') {
          const hasSport = ticket.selections.some((s) => s.sport === selectedSport);
          if (!hasSport) return false;
        }
      }

      // 2. League filter
      if (selectedLeague !== 'ALL') {
        const hasLeague = ticket.selections.some(
          (s) => s.league.toLowerCase() === selectedLeague.toLowerCase()
        );
        if (!hasLeague) return false;
      }

      // 3. Risk / EV profile filter
      if (selectedRiskFilter === 'SAFE' && ticket.totalOdds > 3.0) return false;
      if (selectedRiskFilter === 'VALUE' && ticket.evPercentage < 20.0) return false;
      if (selectedRiskFilter === 'HIGH_ODDS' && ticket.totalOdds < 4.0) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = ticket.name.toLowerCase().includes(query);
        const matchesSubtitle = ticket.subtitle.toLowerCase().includes(query);
        const matchesMatch = ticket.selections.some(
          (s) =>
            s.match.toLowerCase().includes(query) ||
            s.league.toLowerCase().includes(query) ||
            s.pick.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSubtitle && !matchesMatch) return false;
      }

      return true;
    });
  }, [selectedSport, selectedLeague, selectedRiskFilter, searchQuery]);

  // Ensure selectedTicketId is valid
  const currentTicket =
    filteredTickets.find((t) => t.id === selectedTicketId) ||
    filteredTickets[0] ||
    PRESET_TICKETS[0];

  const potentialPayout = (stake * currentTicket.totalOdds).toFixed(2);
  const netProfit = (stake * (currentTicket.totalOdds - 1)).toFixed(2);

  // Custom Builder calculations
  const customSelections = useMemo(() => {
    return ALL_SELECTIONS_POOL.filter((s) => customSelectedIds.includes(s.id));
  }, [customSelectedIds]);

  const customTotalOdds = useMemo(() => {
    if (customSelections.length === 0) return 1.0;
    return Number(
      customSelections.reduce((acc, sel) => acc * sel.odds, 1).toFixed(2)
    );
  }, [customSelections]);

  const customJointProb = useMemo(() => {
    if (customSelections.length === 0) return 0;
    const rawJoint = customSelections.reduce((acc, sel) => acc * (sel.probability / 100), 1);
    return Number((rawJoint * 100).toFixed(1));
  }, [customSelections]);

  const customEv = useMemo(() => {
    if (customSelections.length === 0) return 0;
    const avgEv =
      customSelections.reduce((acc, sel) => acc + sel.evPercentage, 0) /
      customSelections.length;
    return Number(avgEv.toFixed(1));
  }, [customSelections]);

  const customPotentialPayout = (stake * customTotalOdds).toFixed(2);
  const customNetProfit = (stake * (customTotalOdds - 1)).toFixed(2);

  const customTicketObj: TicketPreset = useMemo(() => ({
    id: 'custom-ticket',
    name: 'Mon Combiné Sur-Mesure',
    subtitle: `Combiné calculé avec ${customSelections.length} sélection(s) choisie(s)`,
    sport: 'MULTI',
    sportLabel: 'Multi-Sports',
    sportIcon: '🎯',
    league: 'Sélections Sur-Mesure',
    tag: `COTE @${customTotalOdds.toFixed(2)} (+${customEv}% EV)`,
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/30',
    totalOdds: customTotalOdds,
    cumulativeProb: customJointProb,
    evPercentage: customEv,
    selections: customSelections,
  }), [customSelections, customTotalOdds, customJointProb, customEv]);

  const toggleCustomSelection = (id: string) => {
    setCustomSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyTicket = (ticket: TicketPreset) => {
    const text =
      `🎯 TICKET FOOTPULSE IA - ${ticket.name.toUpperCase()}\n` +
      `Sport : ${ticket.sportLabel} | Ligue(s) : ${ticket.league}\n` +
      `Cote Totale : @${ticket.totalOdds.toFixed(2)} | EV+ : +${ticket.evPercentage}%\n\n` +
      ticket.selections
        .map(
          (s, i) =>
            `${i + 1}. [${s.sportIcon} ${s.league}] ${s.match}\n   👉 Pari : ${s.pick} @${s.odds.toFixed(2)} (${s.probability}% proba IA)`
        )
        .join('\n\n') +
      `\n\n💰 Gain potentiel pour ${stake}€ : ${potentialPayout}€\nGénéré avec FootPulse AI`;

    navigator.clipboard.writeText(text);
    setCopiedId(ticket.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyCustomTicket = () => {
    const text =
      `🎯 TICKET COMBINÉ PERSONNALISÉ IA\n` +
      `Cote Totale : @${customTotalOdds.toFixed(2)} | EV+ Moyen : +${customEv}%\n\n` +
      customSelections
        .map(
          (s, i) =>
            `${i + 1}. [${s.sportIcon} ${s.league}] ${s.match}\n   👉 Pari : ${s.pick} @${s.odds.toFixed(2)}`
        )
        .join('\n\n') +
      `\n\n💰 Gain potentiel pour ${stake}€ : ${customPotentialPayout}€\nGénéré avec FootPulse AI`;

    navigator.clipboard.writeText(text);
    setCopiedId('custom-ticket');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0a1e19] via-[#091a26] to-[#071318] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-emerald-950/60">
              <Layers className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Combinés Intelligents Algorithmiques
                </span>
                <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                  100% Gratuit
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Générateur de Combinés Optimisés par IA
              </h2>
              <p className="text-xs text-slate-400">
                Filtrez par sport ou ligue européenne pour repérer les combinaisons à espérance positive (EV+) sans corrélation négative.
              </p>
            </div>
          </div>

          {/* Mode Switcher: Preset Tickets vs Custom Builder */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('PRESET_TICKETS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'PRESET_TICKETS'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Tickets Clé-en-Main ({filteredTickets.length})</span>
            </button>
            <button
              onClick={() => setViewMode('CUSTOM_BUILDER')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'CUSTOM_BUILDER'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Créateur Sur-Mesure ({customSelectedIds.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE FILTER BAR : SPORTS, LEAGUES & SEARCH */}
        {/* ========================================================================= */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          {/* 1. Sport Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-emerald-400" />
                Filtrer par Sport :
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {sportsList.map((sport) => {
                  const isActive = selectedSport === sport.id;
                  return (
                    <button
                      key={sport.id}
                      onClick={() => {
                        setSelectedSport(sport.id);
                        setSelectedLeague('ALL'); // reset league on sport change
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{sport.icon}</span>
                      <span>{sport.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher club, ligue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 2. League Selector & Risk Profiles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Leagues */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Ligue :
              </span>
              <button
                onClick={() => setSelectedLeague('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  selectedLeague === 'ALL'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/60'
                }`}
              >
                Toutes les Ligues
              </button>
              {availableLeagues.map((lg) => {
                const isActive = selectedLeague === lg;
                return (
                  <button
                    key={lg}
                    onClick={() => setSelectedLeague(lg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/60'
                    }`}
                  >
                    {lg}
                  </button>
                );
              })}
            </div>

            {/* Risk / EV Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Profil EV+ :
              </span>
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'SAFE', label: '🛡️ Safe (>60%)' },
                { id: 'VALUE', label: '⚡ Max EV+ (>20%)' },
                { id: 'HIGH_ODDS', label: '🚀 Cotes > 4.00' },
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setSelectedRiskFilter(rf.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedRiskFilter === rf.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/60'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: PRESET TICKETS LIST CARDS */}
        {/* ========================================================================= */}
        {viewMode === 'PRESET_TICKETS' && (
          <div className="mt-5">
            {filteredTickets.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center">
                <span className="text-3xl block mb-2">🔍</span>
                <h3 className="font-bold text-white text-base">Aucun combiné ne correspond à ces critères</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Essayez de réinitialiser le filtre de ligue ou de sport pour afficher tous les combinés disponibles.
                </p>
                <button
                  onClick={() => {
                    setSelectedSport('ALL');
                    setSelectedLeague('ALL');
                    setSelectedRiskFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTickets.map((ticket) => {
                  const isSelected = currentTicket.id === ticket.id;

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-slate-900/90 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-[#0c1424]/90 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div>
                        {/* Top tag and odds */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold border truncate max-w-[170px] ${ticket.tagColor}`}
                          >
                            {ticket.tag}
                          </span>
                          <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                            @{ticket.totalOdds.toFixed(2)}
                          </span>
                        </div>

                        {/* Sport & League badges */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                          <span>{ticket.sportIcon}</span>
                          <span className="font-semibold text-slate-300">{ticket.sportLabel}</span>
                          <span>•</span>
                          <span className="truncate">{ticket.league}</span>
                        </div>

                        <h3 className="text-sm font-bold text-white mb-1 leading-snug">{ticket.name}</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
                          {ticket.subtitle}
                        </p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{ticket.selections.length} Sélections</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          +{ticket.evPercentage}% EV
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DETAILED VIEW: SELECTED PRESET TICKET */}
      {/* ========================================================================= */}
      {viewMode === 'PRESET_TICKETS' && currentTicket && (
        <div className="space-y-4">
          {/* Sub Tab Switcher: Deep Analysis vs Quick Ticket */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setTicketTab('ANALYSIS')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  ticketTab === 'ANALYSIS'
                    ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-lg shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span>🔬 Recherche & Analyse Approfondie Pré-Pronostic</span>
                <span className="rounded-full bg-slate-950/20 text-slate-950 text-[10px] px-2 py-0.2 font-black uppercase">
                  Audit xG & H2H
                </span>
              </button>

              <button
                onClick={() => setTicketTab('TICKET')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  ticketTab === 'TICKET'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>📋 Vue Ticket & Simulateur de Mise</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pr-2">
              <span className="text-amber-400 font-bold">Cote @{currentTicket.totalOdds.toFixed(2)}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">+{currentTicket.evPercentage}% EV+</span>
            </div>
          </div>

          {ticketTab === 'ANALYSIS' ? (
            <DeepCombinerAnalysis
              ticket={currentTicket}
              onOpenKelly={onOpenKelly}
              onCopyTicket={() => handleCopyTicket(currentTicket)}
            />
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-6 shadow-2xl">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-cyan-200">
                  <Cpu className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Consulter l’audit approfondi complet (modélisation xG, face-à-face H2H, alertes compositions) avant de miser :</span>
                </div>
                <button
                  onClick={() => setTicketTab('ANALYSIS')}
                  className="rounded-xl bg-cyan-500 text-slate-950 font-black text-xs px-3.5 py-1.5 hover:bg-cyan-400 transition shrink-0"
                >
                  Voir l’Analyse Approfondie
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentTicket.sportIcon}</span>
                    <h3 className="text-lg font-black text-white">{currentTicket.name}</h3>
                    <span className="rounded bg-slate-800 text-slate-300 font-mono text-xs px-2 py-0.5 font-bold">
                      Cote Totale @{currentTicket.totalOdds.toFixed(2)}
                    </span>
                    <span className="rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs px-2 py-0.5 font-bold">
                      {currentTicket.league}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Probabilité combinée estimée :{' '}
                    <strong className="text-cyan-400">{currentTicket.cumulativeProb}%</strong> • Espérance
                    mathématique :{' '}
                    <strong className="text-emerald-400">+{currentTicket.evPercentage}% EV+</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenKelly && (
                    <button
                      onClick={() =>
                        onOpenKelly(
                          currentTicket.totalOdds,
                          currentTicket.cumulativeProb,
                          currentTicket.name
                        )
                      }
                      className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2.5 text-xs transition border border-slate-700"
                      title="Calculer la mise Kelly exacte pour ce combiné"
                    >
                      <Calculator className="h-4 w-4 text-emerald-400" />
                      <span>Calculer Kelly</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyTicket(currentTicket)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2.5 text-xs shadow-lg shadow-emerald-950 transition"
                  >
                    {copiedId === currentTicket.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>
                      {copiedId === currentTicket.id
                        ? 'Ticket Copié dans le Presse-papier !'
                        : 'Copier le Ticket'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Selections List */}
              <div className="space-y-3.5 mb-6">
                {currentTicket.selections.map((sel, idx) => {
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 hover:border-emerald-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <span>{sel.sportIcon}</span>
                            <span>{sel.league}</span>
                          </span>
                          <span className="text-[10px] rounded bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 font-mono">
                            {sel.probability}% proba IA
                          </span>
                          <span className="text-[10px] rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 font-mono font-bold">
                            +{sel.evPercentage}% EV
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white">{sel.match}</h4>
                        <p className="text-xs text-slate-400">{sel.reason}</p>
                      </div>

                      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1 shrink-0">
                        <span className="text-xs font-black text-emerald-400">{sel.pick}</span>
                        <span className="rounded bg-slate-950 border border-slate-800 px-2.5 py-1 font-mono text-xs font-black text-amber-400 shadow-inner">
                          @{sel.odds.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stake and Payout Simulator Bar */}
              <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-amber-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">
                      Simuler votre mise sur ce combiné :
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {[10, 20, 50, 100].map((val) => (
                        <button
                          key={val}
                          onClick={() => setStake(val)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                            stake === val
                              ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {val} €
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Mise Jouée
                    </span>
                    <span className="text-base font-bold text-white font-mono">{stake} €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Bénéfice Net
                    </span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      +{netProfit} €
                    </span>
                  </div>
                  <div className="border-l border-slate-800 pl-6">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Gain Total Potentiel
                    </span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {potentialPayout} €
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CUSTOM BET BUILDER (SÉLECTIONS SUR-MESURE) */}
      {/* ========================================================================= */}
      {viewMode === 'CUSTOM_BUILDER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Catalog of EV+ picks with Sport / League filters */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Pool des Opportunités EV+ Certifiées ({ALL_SELECTIONS_POOL.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cochez les sélections que vous souhaitez ajouter à votre combiné personnalisé.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                {customSelectedIds.length} sélectionnée(s)
              </span>
            </div>

            <div className="space-y-3">
              {ALL_SELECTIONS_POOL.filter((sel) => {
                if (selectedSport !== 'ALL' && sel.sport !== selectedSport) return false;
                if (selectedLeague !== 'ALL' && sel.league !== selectedLeague) return false;
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  return (
                    sel.match.toLowerCase().includes(q) ||
                    sel.league.toLowerCase().includes(q) ||
                    sel.pick.toLowerCase().includes(q)
                  );
                }
                return true;
              }).map((sel) => {
                const isChecked = customSelectedIds.includes(sel.id);

                return (
                  <div
                    key={sel.id}
                    onClick={() => toggleCustomSelection(sel.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition flex items-center justify-between gap-4 ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Custom Checkbox */}
                      <div
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <span>{sel.sportIcon}</span>
                            <span>{sel.league}</span>
                          </span>
                          <span className="text-[10px] rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 font-mono font-bold">
                            +{sel.evPercentage}% EV
                          </span>
                          <span className="text-[10px] rounded bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 font-mono">
                            {sel.probability}% proba IA
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white truncate">{sel.match}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400">{sel.pick}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-xs text-slate-400 truncate">{sel.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="rounded bg-slate-950 border border-slate-800 px-2.5 py-1 font-mono text-sm font-black text-amber-400 shadow-inner">
                        @{sel.odds.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Cote Juste : {sel.fairOdds.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Live Custom Ticket Assembly & Simulator */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-5 shadow-2xl sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-black text-base text-white">Mon Combiné Personnalisé</h3>
                </div>
                {customSelectedIds.length > 0 && (
                  <button
                    onClick={() => setCustomSelectedIds([])}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition"
                  >
                    Tout vider
                  </button>
                )}
              </div>

              {customSelections.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                  <span className="text-2xl block">📋</span>
                  <p>Aucune sélection choisie.</p>
                  <p className="text-[11px] text-slate-500">
                    Cochez des matchs dans la liste à gauche pour construire votre combiné.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selections brief list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {customSelections.map((sel) => (
                      <div
                        key={sel.id}
                        className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-2.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span>{sel.sportIcon}</span>
                            <span className="truncate">{sel.match}</span>
                          </div>
                          <span className="font-bold text-white truncate block">{sel.pick}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-amber-400">
                            @{sel.odds.toFixed(2)}
                          </span>
                          <button
                            onClick={() => toggleCustomSelection(sel.id)}
                            className="text-slate-500 hover:text-rose-400 transition p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary calculations */}
                  <div className="rounded-2xl bg-slate-950 border border-slate-800/80 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Nombre de sélections</span>
                      <span className="font-bold text-white">{customSelections.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Cote Totale Combinée</span>
                      <span className="font-mono font-black text-amber-400 text-sm">
                        @{customTotalOdds.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Probabilité estimée</span>
                      <span className="font-mono font-bold text-cyan-400">{customJointProb}%</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 border-t border-slate-800 pt-2">
                      <span>EV+ Moyen</span>
                      <span className="font-mono font-bold text-emerald-400">+{customEv}%</span>
                    </div>
                  </div>

                  {/* Stake Selector */}
                  <div>
                    <span className="text-xs font-bold text-slate-300 block mb-1.5">
                      Mise simulée :
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[10, 20, 50, 100].map((val) => (
                        <button
                          key={val}
                          onClick={() => setStake(val)}
                          className={`py-1 rounded-lg text-xs font-mono font-bold transition ${
                            stake === val
                              ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {val} €
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Potential Returns */}
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Gain Total Potentiel
                      </span>
                      <span className="text-xl font-black text-emerald-300 font-mono">
                        {customPotentialPayout} €
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      +{customNetProfit} € net
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    {/* Deep Analysis Trigger Button */}
                    <button
                      onClick={() => setShowCustomAnalysis(!showCustomAnalysis)}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition shadow-sm border ${
                        showCustomAnalysis
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                          : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                      }`}
                    >
                      <Cpu className="h-4 w-4" />
                      <span>
                        {showCustomAnalysis
                          ? 'Masquer l’Analyse Approfondie'
                          : '🔬 Lancer Recherche & Analyse Approfondie'}
                      </span>
                    </button>

                    <button
                      onClick={handleCopyCustomTicket}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 text-xs shadow-lg shadow-emerald-950 transition"
                    >
                      {copiedId === 'custom-ticket' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>
                        {copiedId === 'custom-ticket'
                          ? 'Ticket Copié !'
                          : 'Copier Mon Combiné Personnalisé'}
                      </span>
                    </button>

                    {onOpenKelly && (
                      <button
                        onClick={() =>
                          onOpenKelly(
                            customTotalOdds,
                            customJointProb,
                            `Combiné Personnalisé (${customSelections.length} sélections)`
                          )
                        }
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-2 text-xs font-bold transition"
                      >
                        <Calculator className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Calculer Mise Kelly Optimale</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Render Deep Analysis below if toggled */}
          {showCustomAnalysis && customSelections.length > 0 && (
            <div className="lg:col-span-3 mt-4">
              <DeepCombinerAnalysis
                ticket={customTicketObj}
                onOpenKelly={onOpenKelly}
                onCopyTicket={handleCopyCustomTicket}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
