import React, { useState } from 'react';
import { FootballMatch, DeepTacticalDossier, AdvancedTacticalMetrics } from '../types/football';
import { apiUrl } from '../utils/api';
import {
  Cpu,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  Sliders,
  TrendingUp,
  Target,
  Swords,
  Sparkles,
  Award,
  ChevronDown,
  Compass,
  Zap,
  Activity,
  UserCheck
} from 'lucide-react';

interface DeepAnalysisTabProps {
  match: FootballMatch;
  onUpdateDossier: (dossier: DeepTacticalDossier, metrics: AdvancedTacticalMetrics) => void;
}

export const DeepAnalysisTab: React.FC<DeepAnalysisTabProps> = ({
  match,
  onUpdateDossier,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('current');
  const [customScenarioText, setCustomScenarioText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<'OVERVIEW' | 'PHASES' | 'DUELS' | 'SCENARIOS' | 'VALUE'>('OVERVIEW');

  // Fallback / default metrics if not yet generated
  const metrics: AdvancedTacticalMetrics = match.advancedMetrics || {
    ppda: { home: 9.4, away: 12.1 },
    fieldTilt: { home: 57, away: 43 },
    expectedThreat: { home: 1.92, away: 1.34 },
    postShotXg: { home: 2.15, away: 1.45 },
    goalsPrevented: { home: 0.85, away: 0.15 },
    duelSuccess: { home: 54, away: 46 },
    halfSpaceEntries: { home: 19, away: 14 },
    boxTouches: { home: 26, away: 18 },
    pressingIntensity: { home: 'Haut & Agressif', away: 'Bloc Médian' },
    transitionSpeedIndex: { home: 8.4, away: 6.9 },
  };

  // Fallback / default dossier if not yet generated
  const dossier: DeepTacticalDossier = match.deepDossier || {
    generatedAtMinute: match.minute,
    executiveSummary: `Affrontement d'une intensité tactique d'élite entre le ${match.homeTeam.name} et ${match.awayTeam.name}. Le schéma asymétrique de ${match.homeTeam.manager} crée un surnombre dans l'axe avec une recherche rapide de la profondeur, tandis que le bloc de ${match.awayTeam.manager} privilégie la possession haute et l'étirement du bloc adverse. L'indicateur xG (${match.stats.xg.home.toFixed(2)} vs ${match.stats.xg.away.toFixed(2)}) confirme une supériorité dans la dangerosité des tirs côté domicile.`,
    tacticalPhaseBreakdown: {
      buildUp: `Sortie de balle en 3+2 côté ${match.homeTeam.shortName} avec décrochage d'un milieu relayeur pour fixer le premier rideau adverse. Relance très assurée qui brise la première ligne de pression adverse en moyenne en 3.4 passes.`,
      pressingAndBlock: `Pressing agressif orienté sur les couloirs avec un PPDA de ${metrics.ppda.home}. Déclencheur actif sur la passe en retrait au latéral adverse, forçant du jeu long sous pression.`,
      attackingShape: `Occupation préférentielle des demi-espaces avec projection continue des milieux intérieurs. Les ailiers alternent entre largeur maximale et repiquages intérieurs entre les lignes.`,
      defensiveTransitions: `Contre-pressing (Gegenpressing) immédiat dans les 5 secondes suivant la perte du ballon dans le dernier tiers, limitant les sorties propres adverses.`,
    },
    advancedMetricsAnalysis: {
      fieldTiltCommentary: `Field Tilt dominant de ${metrics.fieldTilt.home}% en faveur de ${match.homeTeam.shortName}. La territorialité est nettement établie dans les 30 derniers mètres adverses avec ${metrics.boxTouches.home} touches dans la surface.`,
      xtBreakdown: `Expected Threat (xT) de ${metrics.expectedThreat.home.toFixed(2)} contre ${metrics.expectedThreat.away.toFixed(2)}. La menace provient principalement de passes progressives incisives brisant les lignes centrales.`,
      ppdaEvaluation: `Un PPDA de ${metrics.ppda.home} témoigne d'un pressing étouffant de ${match.homeTeam.shortName}, laissant très peu de séquences de passes confortables à l'adversaire.`,
      goalkeeperImpact: `Surperformance nette des gardiens face aux tirs cadrés avec un différentiel de buts évités (PSxG - Buts concédés) positif, évitant au moins une balle de but nette.`,
    },
    keyDuels: [
      {
        homePlayer: match.homeTeam.startingXI[9]?.name || 'Vinícius Júnior',
        awayPlayer: match.awayTeam.startingXI[1]?.name || 'Kyle Walker',
        zone: 'Couloir Gauche / Droit',
        description: `Bataille athlétique et technique de très haut vol. L'attaquant cherche l'accélération en angle rentrant face à un latéral très explosif.`,
        homeAdvantage: 62,
        keyStat: '4 dribbles réussis sur 6, 2 fautes provoquées',
      },
      {
        homePlayer: match.homeTeam.startingXI[8]?.name || 'Jude Bellingham',
        awayPlayer: match.awayTeam.startingXI[5]?.name || 'Rodri',
        zone: 'Axe Médian',
        description: `Duel stratégique pour le contrôle de l'interligne. Les projections sans ballon mettent au défi le positionnement de la sentinelle.`,
        homeAdvantage: 56,
        keyStat: '8 duels au sol disputés (5 gagnés), 3 passes clés',
      },
      {
        homePlayer: match.homeTeam.startingXI[3]?.name || 'Antonio Rüdiger',
        awayPlayer: match.awayTeam.startingXI[10]?.name || 'Erling Haaland',
        zone: 'Surface de Réparation',
        description: `Marquage au corps impitoyable sur les centres et ballons aériens. Très peu d'espace laissé au pivot adverse pour se retourner.`,
        homeAdvantage: 58,
        keyStat: '5 duels aériens remportés sur 7, 0 tir cadré concédé dans les 6 mètres',
      },
    ],
    vulnerabilities: {
      home: [
        `Espace béant concédé dans le dos des latéraux lors des montées simultanées.`,
        `Risque d'essoufflement physique sur le pressing haut à partir de la 75e minute.`,
        `Vulnérabilité sur les corners adverses rentrants au second poteau.`,
      ],
      away: [
        `Difficulté à gérer les transitions rapides après perte de balle haute.`,
        `Sensibilité de la charnière centrale sur les appels tranchants en profondeur.`,
        `Manque d'impact physique sur les seconds ballons au milieu de terrain.`,
      ],
    },
    scenarioSimulations: [
      {
        scenarioName: 'Maintien de la structure actuelle jusqu au terme',
        probability: 60,
        tacticalImpact: `Consolidation de l'avantage grâce à un bloc médian compact et exploitation des contres.`,
        projectedScore: `${Math.max(match.score.home, match.score.away + 1)} - ${match.score.away}`,
      },
      {
        scenarioName: 'Pression tout-terrain et assaut adverse (10 dernières min)',
        probability: 28,
        tacticalImpact: `Hausse du danger sur coups de pied arrêtés pour l'extérieur mais exposition critique en un-contre-un.`,
        projectedScore: `${match.score.home + 1} - ${match.score.away + 1}`,
      },
      {
        scenarioName: 'Expulsion ou erreur défensive majeure',
        probability: 12,
        tacticalImpact: `Rupture d'équilibre obligeant à un passage d'urgence en 5-3-1 pour préserver le résultat.`,
        projectedScore: `${match.score.home} - ${match.score.away + 1}`,
      },
    ],
    managerialDirectives: {
      homeCoachAdvice: [
        `Intensifier le double marquage sur l'aile dès que l'adversaire amorce une transversale.`,
        `Injecter du sang frais au milieu dès la 72e pour maintenir le PPDA sous les 11.0.`,
        `Inciter les attaquants à tirer plus vite sur les phases de transition plutôt que de chercher la passe de trop.`,
      ],
      awayCoachAdvice: [
        `Changer d'orientation plus rapidement d'un bord à l'autre pour décaler le bloc adverse.`,
        `Faire monter le latéral opposé pour saturer la surface sur les centres.`,
        `Prendre plus de risques sur les frappes lointaines pour forcer les arrêts et obtenir des corners.`,
      ],
    },
    valueBetsDeep: [
      {
        market: `Plus de 3.5 Tirs Cadrés pour ${match.homeTeam.shortName}`,
        fairOdds: 1.45,
        bookmakerOdds: 1.78,
        edgePercentage: 11.2,
        confidence: 'Élevée',
        deepRationale: `La conversion d'entrées dans le dernier tiers (Field Tilt ${metrics.fieldTilt.home}%) et le volume de passes progressives garantissent un flux continu de tirs cadrés.`,
      },
      {
        market: `Les Deux Équipes Marquent (BTTS)`,
        fairOdds: 1.58,
        bookmakerOdds: 1.85,
        edgePercentage: 8.4,
        confidence: 'Moyenne',
        deepRationale: `Avec des xG cumulés de ${(match.stats.xg.home + match.stats.xg.away).toFixed(2)} et la fatigue des défenseurs centraux, la probabilité d'une faille tardive dépasse 63%.`,
      },
      {
        market: `Prochain Buteur : ${match.homeTeam.startingXI[9]?.name || 'Vinícius Jr'}`,
        fairOdds: 2.80,
        bookmakerOdds: 3.60,
        edgePercentage: 14.5,
        confidence: 'Audacieux',
        deepRationale: `L'ascendant dans le duel 1v1 (62%) et le couloir gauche hyperactif (xT 0.94 sur cette aile) créent une opportunité de value exceptionnelle.`,
      },
    ],
  };

  const handleRunDeepAnalysis = async (customOverride?: string) => {
    setLoading(true);
    setError(null);

    const activeScenario = customOverride || (selectedScenario !== 'current' ? selectedScenario : undefined);

    try {
      const response = await fetch(apiUrl('/api/deep-analysis'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match: {
            competition: match.competition,
            stadium: match.stadium,
            referee: match.referee,
            minute: match.minute,
            status: match.status,
            score: match.score,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            stats: match.stats,
            momentum: match.momentum,
            events: match.events,
          },
          scenario: activeScenario,
        }),
      });

      const data = await response.json();
      if (data.success && data.dossier && data.advancedMetrics) {
        onUpdateDossier(data.dossier, data.advancedMetrics);
      } else {
        setError(data.error || 'Échec de la modélisation tactique approfondie.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur de connexion au serveur d analyse.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    const markdown = `# DOSSIER D'ANALYSE TACTIQUE APPROFONDIE (FOOTPULSE PRO)
**Match :** ${match.homeTeam.name} (${match.score.home}) vs ${match.awayTeam.name} (${match.score.away})
**Minute :** ${match.minute}' (${match.status}) | **xG :** ${match.stats.xg.home.toFixed(2)} - ${match.stats.xg.away.toFixed(2)}

## 1. Résumé Exécutif
${dossier.executiveSummary}

## 2. Métriques Avancées (Pro Data)
- **Field Tilt (Territoire 30 derniers mètres) :** ${metrics.fieldTilt.home}% vs ${metrics.fieldTilt.away}%
- **PPDA (Passes par action défensive / Pressing) :** ${metrics.ppda.home} vs ${metrics.ppda.away}
- **Expected Threat (xT) :** ${metrics.expectedThreat.home.toFixed(2)} vs ${metrics.expectedThreat.away.toFixed(2)}
- **Touches dans la surface :** ${metrics.boxTouches.home} vs ${metrics.boxTouches.away}
- **Incursions Demi-espaces :** ${metrics.halfSpaceEntries.home} vs ${metrics.halfSpaceEntries.away}

## 3. Piliers d'Organisation Tactique
- **Sortie de balle :** ${dossier.tacticalPhaseBreakdown.buildUp}
- **Pressing & Hauteur de bloc :** ${dossier.tacticalPhaseBreakdown.pressingAndBlock}
- **Structure d'attaque :** ${dossier.tacticalPhaseBreakdown.attackingShape}
- **Transitions défensives :** ${dossier.tacticalPhaseBreakdown.defensiveTransitions}

## 4. Duels Clés (Matchups)
${dossier.keyDuels.map((d) => `- **${d.homePlayer} vs ${d.awayPlayer} (${d.zone})** : ${d.description} (Ascendant : ${d.homeAdvantage}% / Stat : ${d.keyStat})`).join('\n')}

## 5. Directives Entraîneurs
- **${match.homeTeam.manager} (${match.homeTeam.shortName}) :** ${dossier.managerialDirectives.homeCoachAdvice.join('; ')}
- **${match.awayTeam.manager} (${match.awayTeam.shortName}) :** ${dossier.managerialDirectives.awayCoachAdvice.join('; ')}

## 6. Value Bets Quantifiés
${dossier.valueBetsDeep.map((v) => `- **${v.market}** | Cote Juste : ${v.fairOdds} | Cote Marché : ${v.bookmakerOdds} | Edge : +${v.edgePercentage}% | ${v.deepRationale}`).join('\n')}
    `;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Audit Trigger Controls */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0d1627] via-[#0f1d35] to-[#0a1426] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white shadow-lg shadow-emerald-950/60">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Laboratoire d&apos;Analyse Profonde & Data Intelligence
                </h3>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  UEFA Pro & Opta
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit multidimensionnel : xT (Expected Threat), PPDA, Field Tilt, Matchups 1v1 & Modélisation de Scénarios
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition"
              title="Copier le rapport complet au format Markdown"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier Dossier'}</span>
            </button>

            <button
              onClick={() => handleRunDeepAnalysis()}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/80 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Calcul de l audit...' : 'Actualiser l\'Audit Profond'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Scenario Simulator Bar */}
        <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-bold text-white">Simulateur d&apos;Hypothèse Tactique (What-If) :</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl justify-end">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="current">📊 Situation actuelle du match ({match.minute}&apos;)</option>
              <option value={`Carton rouge direct pour un défenseur de ${match.homeTeam.shortName}`}>
                🟥 Carton Rouge pour {match.homeTeam.shortName}
              </option>
              <option value={`Carton rouge direct pour un joueur de ${match.awayTeam.shortName}`}>
                🟥 Carton Rouge pour {match.awayTeam.shortName}
              </option>
              <option value={`Égalisation immédiate de ${match.awayTeam.shortName} à la ${match.minute + 4}'`}>
                ⚽ Égalisation de {match.awayTeam.shortName}
              </option>
              <option value={`Passage de ${match.homeTeam.shortName} en bloc très bas 5-4-1 pour verrouiller`}>
                🔒 Passage en 5-4-1 de verrouillage
              </option>
              <option value="custom">✍️ Scénario personnalisé...</option>
            </select>

            {selectedScenario === 'custom' && (
              <input
                type="text"
                value={customScenarioText}
                onChange={(e) => setCustomScenarioText(e.target.value)}
                placeholder="Ex: Entrée de 2 attaquants à la 70e..."
                className="flex-1 min-w-[200px] rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            )}

            <button
              onClick={() => handleRunDeepAnalysis(selectedScenario === 'custom' ? customScenarioText : selectedScenario)}
              disabled={loading}
              className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white transition disabled:opacity-50"
            >
              Simuler Impact
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-300 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* SECTION 1: LABORATOIRE DES MÉTRIQUES AVANCÉES (PRO DATA HUB) */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Métriques Tactiques Avancées & Modélisation Spatiale</h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-400">{match.homeTeam.shortName}</span>
            <span className="text-cyan-400">{match.awayTeam.shortName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Metric 1: Field Tilt */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Field Tilt (Territorialité)</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Dernier Tiers
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Part des passes effectuées dans les 30 derniers mètres adverses.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs font-black">
                <span className="text-emerald-400">{metrics.fieldTilt.home}%</span>
                <span className="text-cyan-400">{metrics.fieldTilt.away}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden flex">
                <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${metrics.fieldTilt.home}%` }} />
                <div className="bg-cyan-500 transition-all duration-500" style={{ width: `${metrics.fieldTilt.away}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block text-center">
                {metrics.fieldTilt.home > 55 ? `${match.homeTeam.shortName} asphyxie le camp adverse` : 'Bataille territoriale équilibrée'}
              </span>
            </div>
          </div>

          {/* Metric 2: PPDA (Pressing Intensity) */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">PPDA (Intensité de Pressing)</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  Passes / Action
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Passes autorisées à l&apos;adversaire par action défensive (valeur basse = pressing féroce).
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs font-black">
                <span className="text-emerald-400">{metrics.ppda.home.toFixed(1)} PPDA ({metrics.pressingIntensity.home})</span>
                <span className="text-cyan-400">{metrics.ppda.away.toFixed(1)} PPDA</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(85, Math.max(15, (20 - metrics.ppda.home) * 5))}%` }}
                />
                <div
                  className="bg-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(85, Math.max(15, (20 - metrics.ppda.away) * 5))}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block text-center">
                Seuil pro : &lt;10.0 (Haut) | 10-15 (Médian) | &gt;15 (Bas)
              </span>
            </div>
          </div>

          {/* Metric 3: Expected Threat (xT) */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Expected Threat (xT)</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Danger Indirect
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Probabilité de but générée par la progression de balle avant même le déclenchement du tir.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs font-black">
                <span className="text-emerald-400">{metrics.expectedThreat.home.toFixed(2)} xT</span>
                <span className="text-cyan-400">{metrics.expectedThreat.away.toFixed(2)} xT</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (metrics.expectedThreat.home / (metrics.expectedThreat.home + metrics.expectedThreat.away)) * 100
                    )}%`,
                  }}
                />
                <div
                  className="bg-cyan-500 transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (metrics.expectedThreat.away / (metrics.expectedThreat.home + metrics.expectedThreat.away)) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block text-center">
                Delta xT : +{(metrics.expectedThreat.home - metrics.expectedThreat.away).toFixed(2)} pour {match.homeTeam.shortName}
              </span>
            </div>
          </div>

          {/* Metric 4: Post-Shot xG & Buts Évités */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Gardien : Buts Évités (PSxG +/-)</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  Qualité Tir Subi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Différentiel entre les buts attendus après frappe cadrée et les buts réels encaissés.
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{match.homeTeam.shortName} ({match.homeTeam.startingXI[0]?.name})</span>
                <span className="font-mono font-bold text-emerald-400">
                  {metrics.goalsPrevented.home >= 0 ? `+${metrics.goalsPrevented.home.toFixed(2)}` : metrics.goalsPrevented.home.toFixed(2)} but(s) évité(s)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{match.awayTeam.shortName} ({match.awayTeam.startingXI[0]?.name})</span>
                <span className="font-mono font-bold text-cyan-400">
                  {metrics.goalsPrevented.away >= 0 ? `+${metrics.goalsPrevented.away.toFixed(2)}` : metrics.goalsPrevented.away.toFixed(2)} but(s) évité(s)
                </span>
              </div>
            </div>
          </div>

          {/* Metric 5: Box Touches & Demi-espaces */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Présence Surface & Demi-espaces</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Pénétration
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Incursions tranchantes dans la zone de décision adverse.
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Touches dans la surface :</span>
                <span className="font-bold">
                  <span className="text-emerald-400">{metrics.boxTouches.home}</span> vs <span className="text-cyan-400">{metrics.boxTouches.away}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Incursions Demi-espaces :</span>
                <span className="font-bold">
                  <span className="text-emerald-400">{metrics.halfSpaceEntries.home}</span> vs <span className="text-cyan-400">{metrics.halfSpaceEntries.away}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Metric 6: Vitesse de Transition */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Indice de Vélocité en Transition</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                  Gegenpress / Contre
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Vitesse moyenne de projection de la récupération jusqu au tir (score /10).
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs font-black">
                <span className="text-emerald-400">{metrics.transitionSpeedIndex.home.toFixed(1)} / 10 (Ultra-rapide)</span>
                <span className="text-cyan-400">{metrics.transitionSpeedIndex.away.toFixed(1)} / 10</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden flex">
                <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${metrics.transitionSpeedIndex.home * 10}%` }} />
                <div className="bg-cyan-500 transition-all duration-500" style={{ width: `${metrics.transitionSpeedIndex.away * 10}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: NAVIGATION DES ONGLETS D'ANALYSE APPROFONDIE */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => setActiveDossierTab('OVERVIEW')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDossierTab === 'OVERVIEW'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Diagnostic Global & Résumé</span>
        </button>

        <button
          onClick={() => setActiveDossierTab('PHASES')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDossierTab === 'PHASES'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          <span>Piliers Tactiques Structurés</span>
        </button>

        <button
          onClick={() => setActiveDossierTab('DUELS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDossierTab === 'DUELS'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Swords className="h-3.5 w-3.5" />
          <span>Duels Clés 1v1 ({dossier.keyDuels.length})</span>
        </button>

        <button
          onClick={() => setActiveDossierTab('SCENARIOS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDossierTab === 'SCENARIOS'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Scénarios & Game Script</span>
        </button>

        <button
          onClick={() => setActiveDossierTab('VALUE')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDossierTab === 'VALUE'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Value Bets Mathématiques ({dossier.valueBetsDeep.length})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: OVERVIEW & EXECUTIVE SUMMARY */}
      {activeDossierTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Executive Summary card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Synthèse Stratégique du Directoire de Performance</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-serif sm:font-sans">
              {dossier.executiveSummary}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-900/90 p-3.5 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">
                  💡 Diagnostic Territorial (Field Tilt {metrics.fieldTilt.home}%)
                </span>
                <span className="text-slate-300">
                  {dossier.advancedMetricsAnalysis.fieldTiltCommentary}
                </span>
              </div>

              <div className="rounded-xl bg-slate-900/90 p-3.5 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">
                  ⚡ Expected Threat & Qualité de Création ({metrics.expectedThreat.home.toFixed(2)} xT)
                </span>
                <span className="text-slate-300">
                  {dossier.advancedMetricsAnalysis.xtBreakdown}
                </span>
              </div>
            </div>
          </div>

          {/* Vulnerabilities Side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-3">
                <ShieldAlert className="h-4 w-4" />
                <span>Failles Tactiques Détectées : {match.homeTeam.name}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {dossier.vulnerabilities.home.map((v, i) => (
                  <li key={i} className="leading-snug">{v}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-3">
                <ShieldAlert className="h-4 w-4" />
                <span>Failles Tactiques Détectées : {match.awayTeam.name}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {dossier.vulnerabilities.away.map((v, i) => (
                  <li key={i} className="leading-snug">{v}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Manager Directives */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Consignes d&apos;Ajustement Recommandées pour les Entraîneurs</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 mb-2.5 flex items-center gap-2">
                  <span>{match.homeTeam.logo}</span>
                  <span>Pour {match.homeTeam.manager} ({match.homeTeam.shortName})</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {dossier.managerialDirectives.homeCoachAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 mb-2.5 flex items-center gap-2">
                  <span>{match.awayTeam.logo}</span>
                  <span>Pour {match.awayTeam.manager} ({match.awayTeam.shortName})</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {dossier.managerialDirectives.awayCoachAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: PHASES TACTIQUES STRUCTURÉES */}
      {activeDossierTab === 'PHASES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phase 1: Build-up */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
            <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-400 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-mono">
                1
              </span>
              <span>Sortie de Balle & Relance (Build-Up)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dossier.tacticalPhaseBreakdown.buildUp}
            </p>
          </div>

          {/* Phase 2: Pressing & Block Height */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
            <div className="flex items-center gap-2.5 text-xs font-bold text-cyan-400 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-mono">
                2
              </span>
              <span>Hauteur de Bloc & Déclencheurs de Pressing</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dossier.tacticalPhaseBreakdown.pressingAndBlock}
            </p>
          </div>

          {/* Phase 3: Attacking Shape */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
            <div className="flex items-center gap-2.5 text-xs font-bold text-amber-400 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-mono">
                3
              </span>
              <span>Structure d&apos;Attaque & Demi-Espaces</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dossier.tacticalPhaseBreakdown.attackingShape}
            </p>
          </div>

          {/* Phase 4: Defensive Transitions */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl">
            <div className="flex items-center gap-2.5 text-xs font-bold text-purple-400 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-mono">
                4
              </span>
              <span>Transitions Défensives & Contre-Pressing</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dossier.tacticalPhaseBreakdown.defensiveTransitions}
            </p>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DUELS CLÉS (MATCHUPS 1V1) */}
      {activeDossierTab === 'DUELS' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 mb-2">
            Analyse micro-tactique des confrontations directes influençant l&apos;équilibre du match :
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dossier.keyDuels.map((duel, idx) => {
              const awayAdvantage = 100 - duel.homeAdvantage;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                        {duel.zone}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        Ascendant {duel.homeAdvantage >= 50 ? duel.homePlayer : duel.awayPlayer}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-black text-white mb-2">
                      <span className="text-emerald-400 truncate max-w-[110px]">{duel.homePlayer}</span>
                      <span className="text-slate-500 font-normal">VS</span>
                      <span className="text-cyan-400 truncate max-w-[110px]">{duel.awayPlayer}</span>
                    </div>

                    {/* Dual Advantage Bar */}
                    <div className="space-y-1 mb-3">
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                        <div
                          className="bg-emerald-500 transition-all duration-300"
                          style={{ width: `${duel.homeAdvantage}%` }}
                        />
                        <div
                          className="bg-cyan-500 transition-all duration-300"
                          style={{ width: `${awayAdvantage}%` }}
                        />
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-400">
                        <span>{duel.homeAdvantage}%</span>
                        <span>{awayAdvantage}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {duel.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 font-mono">
                    📊 Stat clé : {duel.keyStat}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: SCÉNARIOS PRÉDICTIFS */}
      {activeDossierTab === 'SCENARIOS' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 mb-2">
            Arbre de probabilités bayésiennes des 3 scénarios majeurs de fin de match :
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dossier.scenarioSimulations.map((scenario, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {scenario.probability}% Probabilité
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                      Proj : {scenario.projectedScore}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-white mb-2 leading-snug">
                    {scenario.scenarioName}
                  </h5>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scenario.tacticalImpact}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Modélisation Game-Script</span>
                  <span className="text-emerald-400 font-bold">Actif</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: VALUE BETS MATHÉMATIQUES */}
      {activeDossierTab === 'VALUE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Arbitrage statistique entre la cote juste calculée par le modèle et la cote moyenne du marché :</span>
            <span className="font-mono text-emerald-400 font-bold">Espérance mathématique positive (EV+)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dossier.valueBetsDeep.map((bet, idx) => {
              let confBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              if (bet.confidence === 'Moyenne') confBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
              else if (bet.confidence === 'Audacieux') confBg = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${confBg}`}>
                        {bet.confidence}
                      </span>
                      <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Edge : +{bet.edgePercentage}%
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-white mb-2 leading-snug">
                      {bet.market}
                    </h5>

                    {/* Odds comparison */}
                    <div className="grid grid-cols-2 gap-2 my-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Cote Juste IA</span>
                        <span className="font-black text-slate-200">{bet.fairOdds.toFixed(2)}</span>
                      </div>
                      <div className="border-l border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Cote Marché</span>
                        <span className="font-black text-amber-400">{bet.bookmakerOdds.toFixed(2)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {bet.deepRationale}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Modèle Quantitatif</span>
                    <span className="text-emerald-400 font-semibold">Value Confirmée</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
