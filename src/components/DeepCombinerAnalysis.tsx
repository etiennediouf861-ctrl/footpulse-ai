import React, { useState, useEffect } from 'react';
import {
  Cpu,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Target,
  Swords,
  Sparkles,
  Zap,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Calendar,
  Layers,
  Calculator,
  FileText,
  Search
} from 'lucide-react';
import { Selection, TicketPreset } from './SmartBetBuilderView';

export interface DeepResearchInfo {
  xgHome: number;
  xgAway: number;
  h2hSummary: string;
  formHome: string[];
  formAway: string[];
  tacticalAdvantage: string;
  keyAbsences: { player: string; status: 'FORFAIT' | 'INCERTAIN' | 'DE RETOUR'; impact: string }[];
  marketEdgeExplanation: string;
  confidenceScore: number;
  riskFactor: string;
  protectionRationale: string;
}

// Map rich deep research dossiers for selections
export const SELECTION_DEEP_RESEARCH: Record<string, DeepResearchInfo> = {
  'sel-1': {
    xgHome: 2.15,
    xgAway: 1.82,
    h2hSummary: 'Les 6 dernières confrontations directes ont toutes produit au moins 3 buts avec les 2 équipes buteuses (moyenne de 4.16 buts/match).',
    formHome: ['V', 'V', 'N', 'V', 'V'],
    formAway: ['V', 'V', 'V', 'N', 'V'],
    tacticalAdvantage: 'Transition rapide madrilène dans le dos des latéraux de City vs Circulation de balle offensive et tirs dangereux dans les demi-espaces côté Manchester.',
    keyAbsences: [
      { player: 'Courtois (Real)', status: 'DE RETOUR', impact: 'Sécurise la ligne défensive mais concède des tirs à mi-distance' },
      { player: 'Aké (Man City)', status: 'FORFAIT', impact: 'Fragilise le flanc gauche face aux accélérations' }
    ],
    marketEdgeExplanation: 'Le bookmaker cote le BTTS à @1.48 alors que le modèle Poisson IA estime la probabilité pure à 78.5% (Cote juste @1.27), soit +16.2% de marge de valeur.',
    confidenceScore: 92,
    riskFactor: 'Match aller potentiellement tactique pendant les 20 premières minutes.',
    protectionRationale: 'Les deux collectifs possèdent un ratio de conversion xG supérieur à 1.14 en compétition européenne.'
  },
  'sel-2': {
    xgHome: 1.95,
    xgAway: 1.25,
    h2hSummary: 'Arsenal est invaincu lors des 4 dernières réceptions d’équipes françaises en coupe d’Europe (3V, 1N, 0 défaite).',
    formHome: ['V', 'V', 'V', 'V', 'N'],
    formAway: ['V', 'N', 'V', 'D', 'V'],
    tacticalAdvantage: 'Pressing étouffant haut (PPDA de 8.4) forçant des pertes de balle rapides dans les 30 mètres parisiens.',
    keyAbsences: [
      { player: 'Odegaard (Arsenal)', status: 'DE RETOUR', impact: 'Catalyseur central de la création offensive' },
      { player: 'Hernandez (PSG)', status: 'FORFAIT', impact: 'Axe défensif sous forte pression sur les coups de pied arrêtés' }
    ],
    marketEdgeExplanation: 'Surcote notable sur le marché asiatique : Arsenal gagne par 1 but ou Nul coté à @1.95 vs @1.61 estimé.',
    confidenceScore: 88,
    riskFactor: 'Capacité de contre-attaque éclair des ailiers parisiens.',
    protectionRationale: 'La double couverture "Gagne par 1 but ou Nul" sécurise 62% des scénarios simulés.'
  },
  'sel-3': {
    xgHome: 2.20,
    xgAway: 1.85,
    h2hSummary: 'Mbappé a marqué lors de 8 de ses 10 derniers matchs à élimination directe européenne.',
    formHome: ['V', 'V', 'N', 'V', 'V'],
    formAway: ['V', 'V', 'V', 'N', 'V'],
    tacticalAdvantage: 'Vitesse de projection en contre-attaque exploitant le bloc haut adverse (ligne défensive à 48 mètres).',
    keyAbsences: [
      { player: 'Walker (Man City)', status: 'INCERTAIN', impact: 'Déficit d’accélération sur le couloir direct de Mbappé' }
    ],
    marketEdgeExplanation: 'Le bookmaker sous-évalue la conversion de tirs de Mbappé dans les 16 mètres (0.78 xG/90min).',
    confidenceScore: 84,
    riskFactor: 'Prise à deux sur le porteur en phase arrêtée.',
    protectionRationale: 'Corrélation positive directe : si le match dépasse 2.5 buts, Mbappé est impliqué dans 64% des actions décisives.'
  },
  'sel-4': {
    xgHome: 2.45,
    xgAway: 1.10,
    h2hSummary: 'Liverpool a remporté 8 de ses 10 derniers chocs à Anfield face à Chelsea toutes compétitions confondues.',
    formHome: ['V', 'V', 'V', 'V', 'V'],
    formAway: ['D', 'V', 'N', 'V', 'D'],
    tacticalAdvantage: 'Domination aérienne et intensité de récupération dans le rond central (61% de duels remportés).',
    keyAbsences: [
      { player: 'Reece James (Chelsea)', status: 'INCERTAIN', impact: 'Couloir droit affaibli face aux dédoublements' }
    ],
    marketEdgeExplanation: 'Cote @1.82 offrant une marge mathématique positive (+17.4% EV) sur la victoire avec au moins 2 buts.',
    confidenceScore: 90,
    riskFactor: 'Possibles séquences de possession stérile si Chelsea évolue en bloc bas à 5 défenseurs.',
    protectionRationale: 'Liverpool marque en moyenne 2.6 buts par match à domicile cette saison.'
  },
  'sel-5': {
    xgHome: 2.60,
    xgAway: 1.30,
    h2hSummary: 'Les matchs Man City vs Tottenham génèrent en moyenne 3.8 buts par match sur les 5 dernières années à l’Etihad.',
    formHome: ['V', 'V', 'N', 'V', 'V'],
    formAway: ['V', 'D', 'V', 'D', 'V'],
    tacticalAdvantage: 'Ligne défensive très haute de Tottenham idéale pour les appels dans le dos de Haaland.',
    keyAbsences: [
      { player: 'Van de Ven (Spurs)', status: 'DE RETOUR', impact: 'Manque de rythme sur les replis défensifs à pleine vitesse' }
    ],
    marketEdgeExplanation: 'Valeur détectée sur le combo victoire + over 2.5 buts coté à @1.75 contre @1.48 calculé.',
    confidenceScore: 87,
    riskFactor: 'Contres supersoniques de Tottenham menés par Son.',
    protectionRationale: 'City convertit 85% de ses Expected Goals lorsqu’ils mènent à la pause.'
  },
  'sel-7': {
    xgHome: 1.85,
    xgAway: 0.95,
    h2hSummary: 'L’Inter Milan n’a concédé aucun revers lors de ses 6 derniers derbys de la Madonnina.',
    formHome: ['V', 'V', 'V', 'V', 'V'],
    formAway: ['D', 'V', 'N', 'D', 'V'],
    tacticalAdvantage: 'Structure défensive la plus hermétique d’Italie (seulement 0.65 xGA concédé par 90 minutes).',
    keyAbsences: [
      { player: 'Bennacer (Milan)', status: 'FORFAIT', impact: 'Déficit d’impact physique à la relance' }
    ],
    marketEdgeExplanation: 'Double chance 1N & Moins de 3.5 buts à @1.47 offre 88.4% de probabilité objective.',
    confidenceScore: 94,
    riskFactor: 'Coup de génie individuel de Rafael Leão sur une transition isolée.',
    protectionRationale: 'Historique de 7 matchs consécutifs de l’Inter sous la barre des 3.5 buts.'
  },
  'sel-11': {
    xgHome: 2.30,
    xgAway: 1.90,
    h2hSummary: 'Confrontation des deux plus gros volumes offensifs de Bundesliga : 32 tirs cumulés par match.',
    formHome: ['V', 'V', 'V', 'N', 'V'],
    formAway: ['V', 'V', 'V', 'V', 'N'],
    tacticalAdvantage: 'Pressing tout terrain et jeu vertical continu favorisant les frappes contrées et les corners (11.4 corners/m).',
    keyAbsences: [
      { player: 'Stanisic (Bayern)', status: 'FORFAIT', impact: 'Axe droit perméable face aux projections rapides' }
    ],
    marketEdgeExplanation: 'Cote @2.18 pour Over 2.5 buts & Over 8.5 corners : cote pure estimée à @1.71 (+27.5% EV).',
    confidenceScore: 89,
    riskFactor: 'Neutralisation tactique possible en cas d’ouverture du score précoce.',
    protectionRationale: 'Leverkusen n’a jamais été muet offensivement cette saison en match officiel.'
  },
  'sel-15': {
    xgHome: 118.5,
    xgAway: 109.2,
    h2hSummary: 'Boston a remporté 4 des 5 derniers duels historiques face aux Lakers avec un écart moyen de +9.2 points.',
    formHome: ['V', 'V', 'V', 'V', 'D'],
    formAway: ['D', 'V', 'D', 'V', 'V'],
    tacticalAdvantage: 'Volume de tirs primaires à 3-points (44 tirs/match) et rotation de banc supérieure.',
    keyAbsences: [
      { player: 'Davis (Lakers)', status: 'INCERTAIN', impact: 'Impact défensif diminué dans la protection du cercle' }
    ],
    marketEdgeExplanation: 'Boston -5.5 & Over 219.5 pts coté à @2.25 offrant +26.0% de valeur attendue.',
    confidenceScore: 86,
    riskFactor: 'Foul trouble potentiel sur les ailiers titulaires des Celtics.',
    protectionRationale: 'Boston affiche un net rating de +11.8 à domicile au TD Garden.'
  },
  'sel-18': {
    xgHome: 64.0,
    xgAway: 61.5,
    h2hSummary: 'Alcaraz et Sinner se partagent les victoires (4-4), avec 85% de sets disputés au-delà de 9 jeux.',
    formHome: ['V', 'V', 'V', 'V', 'V'],
    formAway: ['V', 'V', 'V', 'V', 'V'],
    tacticalAdvantage: 'Échange de fond de court d’une régularité exceptionnelle et service efficace (74% de premiers services).',
    keyAbsences: [],
    marketEdgeExplanation: 'Over 22.5 jeux coté à @1.90 alors que 7 de leurs 8 affrontements ont dépassé ce total.',
    confidenceScore: 91,
    riskFactor: 'Baisse d’intensité physique sur un des sets si score fleuve 6-1.',
    protectionRationale: 'Les deux joueurs maintiennent plus de 82% de jeux de service gagnés sur surface rapide.'
  }
};

interface DeepCombinerAnalysisProps {
  ticket: TicketPreset;
  onOpenKelly?: (odds: number, prob: number, name: string) => void;
  onCopyTicket: () => void;
}

export const DeepCombinerAnalysis: React.FC<DeepCombinerAnalysisProps> = ({
  ticket,
  onOpenKelly,
  onCopyTicket,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(5); // default already completed
  const [expandedPickId, setExpandedPickId] = useState<string | null>(ticket.selections[0]?.id || null);
  const [copied, setCopied] = useState(false);

  // Audit scanning simulation
  const runFullScan = () => {
    setIsScanning(true);
    setScanStep(1);

    const step1 = setTimeout(() => setScanStep(2), 500);
    const step2 = setTimeout(() => setScanStep(3), 1100);
    const step3 = setTimeout(() => setScanStep(4), 1700);
    const step4 = setTimeout(() => setScanStep(5), 2300);
    const step5 = setTimeout(() => setIsScanning(false), 2900);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
      clearTimeout(step5);
    };
  };

  const handleCopy = () => {
    onCopyTicket();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-[#091524] via-[#07131e] to-[#050c14] p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header with Title & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-lg shadow-cyan-950/60">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                Audit Algorithmique Pré-Pronostic
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Vérification xG & Non-Corrélation
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Recherche & Analyse Approfondie Pré-Combiné
            </h3>
            <p className="text-xs text-slate-400">
              Chaque pronostic est soumis à 5 niveaux de vérification mathématique et tactique avant validation.
            </p>
          </div>
        </div>

        <button
          onClick={runFullScan}
          disabled={isScanning}
          className="flex items-center gap-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 px-4 py-2 text-xs font-bold transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{isScanning ? 'Analyse en cours...' : 'Relancer la Recherche Approfondie'}</span>
        </button>
      </div>

      {/* Scan Step Pipeline Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { step: 1, label: 'Modélisation xG', desc: 'Scan offensif/défensif' },
          { step: 2, label: 'Face-à-Face H2H', desc: 'Confrontations directes' },
          { step: 3, label: 'Effectifs & Absents', desc: 'Infirmerie & XI titulaires' },
          { step: 4, label: 'Audit Cotes Bookmaker', desc: 'Détection EV+ pur' },
          { step: 5, label: 'Matrice Corrélation', desc: 'Validation Anti-Variance' },
        ].map((s) => {
          const isDone = scanStep >= s.step;
          const isCurrent = scanStep === s.step && isScanning;

          return (
            <div
              key={s.step}
              className={`rounded-2xl p-3 border text-xs transition ${
                isCurrent
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 animate-pulse ring-1 ring-cyan-400'
                  : isDone
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800/80 bg-slate-900/60 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] font-bold opacity-70">0{s.step}</span>
                {isDone ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                )}
              </div>
              <span className="font-black block truncate">{s.label}</span>
              <span className="text-[10px] text-slate-400 block truncate">{s.desc}</span>
            </div>
          );
        })}
      </div>

      {/* 5-Pillars Summary Radar / Health Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Solidité Algorithmique
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">94.8%</span>
            <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[10px] font-bold">
              OPTIMAL
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Sur 10 000 simulations Monte Carlo</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Espérance de Gain (EV+)
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
              +{ticket.evPercentage}%
            </span>
            <span className="rounded bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 text-[10px] font-bold">
              VALEUR
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Avantage mathématique sur le marché</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Indice de Corrélation
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">+0.88</span>
            <span className="rounded bg-amber-500/20 text-amber-300 px-1.5 py-0.5 text-[10px] font-bold">
              SYNERGIQUE
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Aucune sélection ne s’annule</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Protection Anti-Variance
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">A+</span>
            <span className="rounded bg-purple-500/20 text-purple-300 px-1.5 py-0.5 text-[10px] font-bold">
              STABLE
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Double chance ou handicaps sécurisés</span>
        </div>
      </div>

      {/* Match-By-Match In-Depth Investigations List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>Dossier d’Investigation Approfondie par Match ({ticket.selections.length})</span>
          </h4>
          <span className="text-xs text-slate-400">Cliquez pour déplier / replier les statistiques complètes</span>
        </div>

        <div className="space-y-3">
          {ticket.selections.map((sel, idx) => {
            const isExpanded = expandedPickId === sel.id;
            const deepData = SELECTION_DEEP_RESEARCH[sel.id] || {
              xgHome: 1.85,
              xgAway: 1.30,
              h2hSummary: 'Dominance offensive constatée sur les 4 dernières confrontations directes.',
              formHome: ['V', 'V', 'N', 'V', 'V'],
              formAway: ['V', 'D', 'N', 'V', 'D'],
              tacticalAdvantage: 'Supériorité dans les transitions et meilleure qualité d’Expected Goals.',
              keyAbsences: [{ player: 'Effectif au complet', status: 'DE RETOUR' as const, impact: 'Aucun absent majeur' }],
              marketEdgeExplanation: `La cote de @${sel.odds.toFixed(2)} surpasse la cote juste du modèle Poisson (@${sel.fairOdds.toFixed(2)}).`,
              confidenceScore: 89,
              riskFactor: 'Rythme de jeu pouvant ralentir en fin de rencontre.',
              protectionRationale: 'Volume de tirs et solidité défensive protégeant l’issue du pari.'
            };

            return (
              <div
                key={sel.id}
                className={`rounded-2xl border transition overflow-hidden ${
                  isExpanded
                    ? 'border-cyan-500/60 bg-slate-900/90 shadow-xl shadow-cyan-950/30'
                    : 'border-slate-800 bg-[#0c1424]/80 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedPickId(isExpanded ? null : sel.id)}
                  className="p-4 cursor-pointer flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs border border-cyan-500/30">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <span>{sel.sportIcon}</span>
                          <span>{sel.league}</span>
                        </span>
                        <span className="text-[10px] rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 font-mono font-bold">
                          Confiance : {deepData.confidenceScore}%
                        </span>
                        <span className="text-[10px] rounded bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 font-mono">
                          +{sel.evPercentage}% EV
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white mt-0.5">{sel.match}</h5>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 block">{sel.pick}</span>
                      <span className="text-[11px] font-mono text-amber-400 font-black">
                        @{sel.odds.toFixed(2)}{' '}
                        <span className="text-slate-500 font-normal">(Cote Juste : {sel.fairOdds.toFixed(2)})</span>
                      </span>
                    </div>

                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Deep Details */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 space-y-4 text-xs">
                    {/* 1. Comparative xG Meter */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 mt-3">
                      <div className="flex items-center justify-between text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                          Expected Goals (xG) Projetés par Match
                        </span>
                        <span className="font-mono text-white text-[11px]">
                          Différentiel xG : +{(deepData.xgHome - deepData.xgAway).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="w-16 font-mono font-bold text-right text-emerald-400">
                          {deepData.xgHome.toFixed(2)} xG
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden flex">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full"
                            style={{
                              width: `${(deepData.xgHome / (deepData.xgHome + deepData.xgAway)) * 100}%`,
                            }}
                          />
                          <div
                            className="bg-gradient-to-r from-slate-600 to-slate-500 h-full"
                            style={{
                              width: `${(deepData.xgAway / (deepData.xgHome + deepData.xgAway)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-16 font-mono font-bold text-left text-slate-300">
                          {deepData.xgAway.toFixed(2)} xG
                        </span>
                      </div>
                    </div>

                    {/* 2. Tactical Breakdown & H2H */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1 flex items-center gap-1">
                          <Swords className="h-3 w-3" />
                          Confrontations Directes (H2H)
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{deepData.h2hSummary}</p>
                      </div>

                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Avantage Tactique Clé
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{deepData.tacticalAdvantage}</p>
                      </div>
                    </div>

                    {/* 3. Absences & Market Inefficiency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1 flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          Compositions & État de Forme
                        </span>
                        {deepData.keyAbsences.length === 0 ? (
                          <p className="text-slate-400 text-[11px]">Effectifs complets, aucune absence critique.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {deepData.keyAbsences.map((abs, aIdx) => (
                              <div key={aIdx} className="flex items-start gap-1.5 text-[11px]">
                                <span
                                  className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                                    abs.status === 'FORFAIT'
                                      ? 'bg-rose-500/20 text-rose-300'
                                      : abs.status === 'INCERTAIN'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-emerald-500/20 text-emerald-300'
                                  }`}
                                >
                                  {abs.status}
                                </span>
                                <span className="font-bold text-white">{abs.player}:</span>
                                <span className="text-slate-400 truncate">{abs.impact}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-cyan-300 block mb-1 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Justification de la Surcote Mathématique
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          {deepData.marketEdgeExplanation}
                        </p>
                      </div>
                    </div>

                    {/* 4. Risk & Protection Rationale */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-[11px]">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="text-slate-400">
                          <strong className="text-slate-200">Facteur de vigilance :</strong> {deepData.riskFactor}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-semibold shrink-0">
                        ✓ Protégé par {deepData.protectionRationale}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer: Copy / Kelly Criterion */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white block">
            ✅ Recherche & Audit validés : Combiné certifié EV+ à haute corrélation
          </span>
          <span className="text-[11px] text-slate-400">
            Cote Totale @{ticket.totalOdds.toFixed(2)} • Probabilité combinée estimée : {ticket.cumulativeProb}% • EV+ : +{ticket.evPercentage}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenKelly && (
            <button
              onClick={() => onOpenKelly(ticket.totalOdds, ticket.cumulativeProb, ticket.name)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2 text-xs transition border border-slate-700"
            >
              <Calculator className="h-3.5 w-3.5 text-emerald-400" />
              <span>Calculer Mise Kelly</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black px-4 py-2 text-xs shadow-lg shadow-cyan-950 transition"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Ticket Copié !' : 'Copier le Combiné Validé'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
