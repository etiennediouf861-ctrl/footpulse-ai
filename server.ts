import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'capacitor://localhost' || origin === 'http://localhost' || origin === 'http://localhost:5173') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Initialize Gemini API client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Match Prediction & Probability Forecast
app.post('/api/predict', async (req, res) => {
  try {
    const { match } = req.body;
    if (!match) {
      return res.status(400).json({ error: 'Données de match requises.' });
    }

    const prompt = `Tu es le Data Analyst en chef et Stratège Tactique de niveau UEFA Champions League.
Réalise une ANALYSE PROFONDE et des prédictions hautement rigoureuses pour la rencontre en cours :

MATCH : ${match.homeTeam.name} (${match.score.home}) vs ${match.awayTeam.name} (${match.score.away})
TEMPS DE JEU : ${match.minute}' (${match.status})
STATISTIQUES TACTIQUES & SPATIALES :
- Possession : ${match.stats.possession.home}% - ${match.stats.possession.away}%
- Expected Goals (xG) : ${match.stats.xg.home.toFixed(2)} - ${match.stats.xg.away.toFixed(2)}
- Tirs (cadrés) : ${match.stats.shots.home} (${match.stats.shotsOnTarget.home}) - ${match.stats.shots.away} (${match.stats.shotsOnTarget.away})
- Grosses occasions nettes (Big chances) : ${match.stats.bigChances.home} - ${match.stats.bigChances.away}
- Fautes & Discipline : ${match.stats.yellowCards.home}J/${match.stats.redCards.home}R vs ${match.stats.yellowCards.away}J/${match.stats.redCards.away}R
- Corners & Pression : ${match.stats.corners.home} - ${match.stats.corners.away}
- Momentum dynamique 15 min : ${match.momentum.homeDominance}% vs ${match.momentum.awayDominance}%
- Événements récents marquants : ${JSON.stringify(match.recentEvents || [])}

CONSIGNES POUR UNE ANALYSE PROFONDE :
1. Analyse causale : Ne te contente pas de relater les chiffres, explique POURQUOI l'une des équipes domine ou subit (décrochage des ailiers, faiblesses dans le dos des axiaux, efficacité de conversion xG vs PSxG, étouffement au milieu).
2. Justifications mathématiques : Chaque pronostic (aiPicks) doit s'appuyer sur un faisceau d'indices (volume de tirs dans la boîte, baisse de régime athlétique, asymétrie de possession).
3. Risques invisibles : Identifie les facteurs de rupture latents (carton jaune sur un défenseur pivot, déséquilibre causé par les montées d'un latéral, baisse du taux de duel aérien).
4. Reste professionnel, chirurgical et sans complaisance.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winProbabilityHome: {
              type: Type.NUMBER,
              description: 'Probabilité de victoire à domicile en % (0-100)',
            },
            drawProbability: {
              type: Type.NUMBER,
              description: 'Probabilité de match nul en % (0-100)',
            },
            winProbabilityAway: {
              type: Type.NUMBER,
              description: 'Probabilité de victoire à l extérieur en % (0-100)',
            },
            predictedFinalScore: {
              type: Type.STRING,
              description: 'Score final le plus probable, ex: "2 - 1"',
            },
            nextGoalLikelihood: {
              type: Type.STRING,
              description: 'Équipe la plus susceptible de marquer le prochain but ou "Aucun but supplémentaire"',
            },
            overUnder25Likelihood: {
              type: Type.STRING,
              description: 'Ex: "Plus de 2.5 buts (72%)"',
            },
            tacticalSummary: {
              type: Type.STRING,
              description: 'Synthèse tactique percutante en 2-3 phrases sur les dynamiques du match',
            },
            keyTrend: {
              type: Type.STRING,
              description: 'La statistique clé déterminante du match (ex: Surperformance xG ou faille sur les ailes)',
            },
            aiPicks: {
              type: Type.ARRAY,
              description: '3 pronostics recommandés avec cote estimée, confiance (Élevée, Moyenne, Risqué) et justification chiffrée',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Intitulé du pronostic' },
                  confidence: { type: Type.STRING, description: 'Élevée | Moyenne | Audacieux' },
                  odds: { type: Type.NUMBER, description: 'Cote estimée (ex: 1.65)' },
                  reasoning: { type: Type.STRING, description: 'Explication basée sur les métriques' },
                },
                required: ['title', 'confidence', 'odds', 'reasoning'],
              },
            },
            riskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Facteurs de bascule (ex: fatigue, risque de 2e jaune, banc)',
            },
          },
          required: [
            'winProbabilityHome',
            'drawProbability',
            'winProbabilityAway',
            'predictedFinalScore',
            'nextGoalLikelihood',
            'overUnder25Likelihood',
            'tacticalSummary',
            'keyTrend',
            'aiPicks',
            'riskFactors',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, prediction: parsed });
  } catch (error: any) {
    console.error('Error generating AI prediction:', error);
    return res.status(500).json({
      error: 'Erreur lors de la génération des pronostics.',
      details: error?.message,
    });
  }
});

// Endpoint: AI Match Analyst Assistant (Ask anything about the live match)
app.post('/api/analyst-chat', async (req, res) => {
  try {
    const { question, match } = req.body;
    if (!question || !match) {
      return res.status(400).json({ error: 'Question et match requis.' });
    }

    const prompt = `Tu es "Coach Vision AI", l'analyste vidéo et data analyste tactique de référence pour ce match.
Réponds de façon précise, dynamique et argumentée à la question de l'utilisateur.

CONTEXTE DU MATCH :
${match.homeTeam.name} (${match.score.home}) - (${match.score.away}) ${match.awayTeam.name}
Minute : ${match.minute}'
xG : ${match.stats.xg.home.toFixed(2)} - ${match.stats.xg.away.toFixed(2)}
Tirs : ${match.stats.shots.home} (${match.stats.shotsOnTarget.home} cadrés) vs ${match.stats.shots.away} (${match.stats.shotsOnTarget.away} cadrés)
Possession : ${match.stats.possession.home}% vs ${match.stats.possession.away}%
Corners : ${match.stats.corners.home} - ${match.stats.corners.away}
Cartons : ${match.stats.yellowCards.home}J/${match.stats.redCards.home}R vs ${match.stats.yellowCards.away}J/${match.stats.redCards.away}R
Derniers événements : ${JSON.stringify(match.events?.slice(-5) || [])}

QUESTION : "${question}"

Règles :
- Réponds en français avec un ton professionnel, passionné et analytique (comme sur un plateau d'analyse de Ligue des Champions).
- Utilise les métriques chiffrées (xG, efficacité, pressing, zones d'attaque).
- Reste concis (maximum 3 paragraphes).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error('Error in analyst chat:', error);
    return res.status(500).json({
      error: "Erreur de l'analyste IA.",
      details: error?.message,
    });
  }
});

// Endpoint: Deep Tactical Lab & Comprehensive Intelligence Dossier
app.post('/api/deep-analysis', async (req, res) => {
  try {
    const { match, scenario } = req.body;
    if (!match) {
      return res.status(400).json({ error: 'Données de match requises.' });
    }

    const scenarioText = scenario
      ? `\nHYPOTHÈSE DE SCÉNARIO EN COURS D'ÉVALUATION : "${scenario}". Intègre ce scénario dans tes projections et modélisations.`
      : '';

    const prompt = `Tu es le Directeur de la Performance Tactique et de la Data Intelligence de l'UEFA (niveau UEFA Pro & Analyste StatsBomb/Opta Pro).
Tu dois réaliser un AUDIT TACTIQUE APPROFONDI (ANALYSE PROFONDE) du match suivant :

MATCH : ${match.homeTeam.name} (${match.score.home}) vs ${match.awayTeam.name} (${match.score.away})
STADE : ${match.stadium} | COMPÉTITION : ${match.competition} | ARBITRE : ${match.referee}
MINUTE : ${match.minute}' (${match.status})
SCHÉMAS TACTIQUES : ${match.homeTeam.name} (${match.homeTeam.formation} - Coach ${match.homeTeam.manager}) vs ${match.awayTeam.name} (${match.awayTeam.formation} - Coach ${match.awayTeam.manager})

MÉTRIQUES DE BASE :
- Possession : ${match.stats.possession.home}% vs ${match.stats.possession.away}%
- Expected Goals (xG) : ${match.stats.xg.home.toFixed(2)} vs ${match.stats.xg.away.toFixed(2)}
- Tirs (cadrés / bloqués) : ${match.stats.shots.home} (${match.stats.shotsOnTarget.home} cadrés) vs ${match.stats.shots.away} (${match.stats.shotsOnTarget.away} cadrés)
- Grosses Occasions créées : ${match.stats.bigChances.home} vs ${match.stats.bigChances.away}
- Momentum 15 min : ${match.momentum.homeDominance}% vs ${match.momentum.awayDominance}%
- Fautes & Cartons : ${match.stats.fouls.home}F / ${match.stats.yellowCards.home}J / ${match.stats.redCards.home}R vs ${match.stats.fouls.away}F / ${match.stats.yellowCards.away}J / ${match.stats.redCards.away}R
- Événements marquants récents : ${JSON.stringify(match.events?.slice(-6) || [])}
${scenarioText}

RÈGLES D'ANALYSE PROFONDE :
1. Sois extrêmement précis, technique et pointu (utilise les notions de demi-espaces, hauteur de bloc, pressing triggers, PPDA, Expected Threat xT, Field Tilt, PSxG des gardiens, transitions offensives/défensives).
2. Fournis des duels directs clés réalistes entre joueurs titulaires (ex: Ailier contre Latéral, Attaquant vs Défenseur central).
3. Modélise les scénarios de fin de match avec probabilités réelles.
4. Génère des directives concrètes et spécifiques pour chaque entraîneur (${match.homeTeam.manager} et ${match.awayTeam.manager}).
5. Calcule des Value Bets quantifiés avec cote juste théorique (Fair Odds), cote marchande et Edge % d'espérance mathématique.
6. Calcule également les métriques avancées (PPDA, Field Tilt %, Expected Threat xT, Post-Shot xG, etc.) adaptées à la réalité du match.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dossier: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: {
                  type: Type.STRING,
                  description: 'Résumé exécutif analytique percutant de 3-4 phrases',
                },
                tacticalPhaseBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    buildUp: { type: Type.STRING, description: 'Phase de relance et sortie de balle sous pression' },
                    pressingAndBlock: { type: Type.STRING, description: 'Hauteur de bloc défensif et déclencheurs de pressing' },
                    attackingShape: { type: Type.STRING, description: 'Structure d attaque, largeur et occupation des demi-espaces' },
                    defensiveTransitions: { type: Type.STRING, description: 'Comportement à la perte du ballon et contre-pressing' },
                  },
                  required: ['buildUp', 'pressingAndBlock', 'attackingShape', 'defensiveTransitions'],
                },
                advancedMetricsAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    fieldTiltCommentary: { type: Type.STRING, description: 'Analyse de la territorialité et possession dans les 30 derniers mètres' },
                    xtBreakdown: { type: Type.STRING, description: 'Expected Threat xT : qui crée le plus de danger en amont du tir' },
                    ppdaEvaluation: { type: Type.STRING, description: 'Évaluation du PPDA et de l intensité du pressing défensif' },
                    goalkeeperImpact: { type: Type.STRING, description: 'Performance des gardiens face aux tirs subis (PSxG)' },
                  },
                  required: ['fieldTiltCommentary', 'xtBreakdown', 'ppdaEvaluation', 'goalkeeperImpact'],
                },
                keyDuels: {
                  type: Type.ARRAY,
                  description: '3 duels individuels clés sur le terrain',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      homePlayer: { type: Type.STRING },
                      awayPlayer: { type: Type.STRING },
                      zone: { type: Type.STRING, description: 'Ex: Couloir Gauche vs Droit' },
                      description: { type: Type.STRING, description: 'Analyse tactique de l opposition' },
                      homeAdvantage: { type: Type.NUMBER, description: 'Pourcentage d avantage pour le joueur domicile (0-100)' },
                      keyStat: { type: Type.STRING, description: 'Statistique clé du duel' },
                    },
                    required: ['homePlayer', 'awayPlayer', 'zone', 'description', 'homeAdvantage', 'keyStat'],
                  },
                },
                vulnerabilities: {
                  type: Type.OBJECT,
                  properties: {
                    home: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Failles identifiées côté domicile' },
                    away: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Failles identifiées côté extérieur' },
                  },
                  required: ['home', 'away'],
                },
                scenarioSimulations: {
                  type: Type.ARRAY,
                  description: '3 scénarios d évolution du match',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      scenarioName: { type: Type.STRING },
                      probability: { type: Type.NUMBER, description: 'Probabilité en %' },
                      tacticalImpact: { type: Type.STRING },
                      projectedScore: { type: Type.STRING },
                    },
                    required: ['scenarioName', 'probability', 'tacticalImpact', 'projectedScore'],
                  },
                },
                managerialDirectives: {
                  type: Type.OBJECT,
                  properties: {
                    homeCoachAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
                    awayCoachAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['homeCoachAdvice', 'awayCoachAdvice'],
                },
                valueBetsDeep: {
                  type: Type.ARRAY,
                  description: '3 opportunités de paris à espérance mathématique positive',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      market: { type: Type.STRING },
                      fairOdds: { type: Type.NUMBER, description: 'Cote juste calculée' },
                      bookmakerOdds: { type: Type.NUMBER, description: 'Cote moyenne observée' },
                      edgePercentage: { type: Type.NUMBER, description: 'Valeur ajoutée % (ex: 8.5)' },
                      confidence: { type: Type.STRING, description: 'Élevée | Moyenne | Audacieux' },
                      deepRationale: { type: Type.STRING, description: 'Démonstration mathématique et tactique' },
                    },
                    required: ['market', 'fairOdds', 'bookmakerOdds', 'edgePercentage', 'confidence', 'deepRationale'],
                  },
                },
              },
              required: [
                'executiveSummary',
                'tacticalPhaseBreakdown',
                'advancedMetricsAnalysis',
                'keyDuels',
                'vulnerabilities',
                'scenarioSimulations',
                'managerialDirectives',
                'valueBetsDeep',
              ],
            },
            advancedMetrics: {
              type: Type.OBJECT,
              properties: {
                ppda: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                fieldTilt: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                expectedThreat: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                postShotXg: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                goalsPrevented: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                duelSuccess: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                halfSpaceEntries: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                boxTouches: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
                pressingIntensity: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.STRING }, away: { type: Type.STRING } },
                  required: ['home', 'away'],
                },
                transitionSpeedIndex: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ['home', 'away'],
                },
              },
              required: [
                'ppda',
                'fieldTilt',
                'expectedThreat',
                'postShotXg',
                'goalsPrevented',
                'duelSuccess',
                'halfSpaceEntries',
                'boxTouches',
                'pressingIntensity',
                'transitionSpeedIndex',
              ],
            },
          },
          required: ['dossier', 'advancedMetrics'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.dossier) {
      parsed.dossier.generatedAtMinute = match.minute;
    }
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in deep analysis:', error);
    return res.status(500).json({
      error: "Erreur lors de la génération de l'analyse profonde.",
      details: error?.message,
    });
  }
});

// Endpoint: Deep Tactical Halftime / Post-match Report
app.post('/api/tactical-report', async (req, res) => {
  try {
    const { match } = req.body;
    const prompt = `Génère un rapport tactique approfondi pour ${match.homeTeam.name} vs ${match.awayTeam.name} à la minute ${match.minute}'.
Score : ${match.score.home} - ${match.score.away}.
xG : ${match.stats.xg.home.toFixed(2)} vs ${match.stats.xg.away.toFixed(2)}.
Possession : ${match.stats.possession.home}% vs ${match.stats.possession.away}%.
Cartons rouges : ${match.stats.redCards.home} vs ${match.stats.redCards.away}.

Rédige un bilan structuré en markdown avec :
1. **Physionomie de la rencontre** (qui impose son rythme et comment)
2. **Efficacité xG & Conversion devant le but**
3. **Points de rupture & failles défensives constatées**
4. **Consignes tactiques clés pour la suite de la rencontre**`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ success: true, report: response.text });
  } catch (error: any) {
    console.error('Error in tactical report:', error);
    return res.status(500).json({ error: error?.message });
  }
});

// Serve frontend: in dev mode via Vite middleware, in prod via static build
async function setupFrontend() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚽ FootPulse AI Server running on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error('Failed to start FootPulse server:', err);
});
