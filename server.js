// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === "capacitor://localhost" || origin === "http://localhost" || origin === "http://localhost:5173") {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.get("/api/live-matches", async (_req, res) => {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "API_FOOTBALL_KEY non configur\xE9e." });
  }
  try {
    const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: { "x-apisports-key": apiKey }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: "Le fournisseur de donn\xE9es football a refus\xE9 la requ\xEAte." });
    }
    const payload = await response.json();
    return res.json({
      source: "API-Football",
      matches: (payload.response || []).map((fixture) => ({
        id: `api-${fixture.fixture.id}`,
        competition: `${fixture.league.name} - ${fixture.league.country}`,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        score: { home: fixture.goals.home ?? 0, away: fixture.goals.away ?? 0 },
        minute: fixture.fixture.status.elapsed ?? 0,
        status: fixture.fixture.status.short
      }))
    });
  } catch (error) {
    console.error("Error fetching live football data:", error);
    return res.status(502).json({ error: "Impossible de joindre le fournisseur de donn\xE9es football." });
  }
});
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.post("/api/predict", async (req, res) => {
  try {
    const { match } = req.body;
    if (!match) {
      return res.status(400).json({ error: "Donn\xE9es de match requises." });
    }
    const prompt = `Tu es le Data Analyst en chef et Strat\xE8ge Tactique de niveau UEFA Champions League.
R\xE9alise une ANALYSE PROFONDE et des pr\xE9dictions hautement rigoureuses pour la rencontre en cours :

MATCH : ${match.homeTeam.name} (${match.score.home}) vs ${match.awayTeam.name} (${match.score.away})
TEMPS DE JEU : ${match.minute}' (${match.status})
STATISTIQUES TACTIQUES & SPATIALES :
- Possession : ${match.stats.possession.home}% - ${match.stats.possession.away}%
- Expected Goals (xG) : ${match.stats.xg.home.toFixed(2)} - ${match.stats.xg.away.toFixed(2)}
- Tirs (cadr\xE9s) : ${match.stats.shots.home} (${match.stats.shotsOnTarget.home}) - ${match.stats.shots.away} (${match.stats.shotsOnTarget.away})
- Grosses occasions nettes (Big chances) : ${match.stats.bigChances.home} - ${match.stats.bigChances.away}
- Fautes & Discipline : ${match.stats.yellowCards.home}J/${match.stats.redCards.home}R vs ${match.stats.yellowCards.away}J/${match.stats.redCards.away}R
- Corners & Pression : ${match.stats.corners.home} - ${match.stats.corners.away}
- Momentum dynamique 15 min : ${match.momentum.homeDominance}% vs ${match.momentum.awayDominance}%
- \xC9v\xE9nements r\xE9cents marquants : ${JSON.stringify(match.recentEvents || [])}

CONSIGNES POUR UNE ANALYSE PROFONDE :
1. Analyse causale : Ne te contente pas de relater les chiffres, explique POURQUOI l'une des \xE9quipes domine ou subit (d\xE9crochage des ailiers, faiblesses dans le dos des axiaux, efficacit\xE9 de conversion xG vs PSxG, \xE9touffement au milieu).
2. Justifications math\xE9matiques : Chaque pronostic (aiPicks) doit s'appuyer sur un faisceau d'indices (volume de tirs dans la bo\xEEte, baisse de r\xE9gime athl\xE9tique, asym\xE9trie de possession).
3. Risques invisibles : Identifie les facteurs de rupture latents (carton jaune sur un d\xE9fenseur pivot, d\xE9s\xE9quilibre caus\xE9 par les mont\xE9es d'un lat\xE9ral, baisse du taux de duel a\xE9rien).
4. Reste professionnel, chirurgical et sans complaisance.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winProbabilityHome: {
              type: Type.NUMBER,
              description: "Probabilit\xE9 de victoire \xE0 domicile en % (0-100)"
            },
            drawProbability: {
              type: Type.NUMBER,
              description: "Probabilit\xE9 de match nul en % (0-100)"
            },
            winProbabilityAway: {
              type: Type.NUMBER,
              description: "Probabilit\xE9 de victoire \xE0 l ext\xE9rieur en % (0-100)"
            },
            predictedFinalScore: {
              type: Type.STRING,
              description: 'Score final le plus probable, ex: "2 - 1"'
            },
            nextGoalLikelihood: {
              type: Type.STRING,
              description: '\xC9quipe la plus susceptible de marquer le prochain but ou "Aucun but suppl\xE9mentaire"'
            },
            overUnder25Likelihood: {
              type: Type.STRING,
              description: 'Ex: "Plus de 2.5 buts (72%)"'
            },
            tacticalSummary: {
              type: Type.STRING,
              description: "Synth\xE8se tactique percutante en 2-3 phrases sur les dynamiques du match"
            },
            keyTrend: {
              type: Type.STRING,
              description: "La statistique cl\xE9 d\xE9terminante du match (ex: Surperformance xG ou faille sur les ailes)"
            },
            aiPicks: {
              type: Type.ARRAY,
              description: "3 pronostics recommand\xE9s avec cote estim\xE9e, confiance (\xC9lev\xE9e, Moyenne, Risqu\xE9) et justification chiffr\xE9e",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Intitul\xE9 du pronostic" },
                  confidence: { type: Type.STRING, description: "\xC9lev\xE9e | Moyenne | Audacieux" },
                  odds: { type: Type.NUMBER, description: "Cote estim\xE9e (ex: 1.65)" },
                  reasoning: { type: Type.STRING, description: "Explication bas\xE9e sur les m\xE9triques" }
                },
                required: ["title", "confidence", "odds", "reasoning"]
              }
            },
            riskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Facteurs de bascule (ex: fatigue, risque de 2e jaune, banc)"
            }
          },
          required: [
            "winProbabilityHome",
            "drawProbability",
            "winProbabilityAway",
            "predictedFinalScore",
            "nextGoalLikelihood",
            "overUnder25Likelihood",
            "tacticalSummary",
            "keyTrend",
            "aiPicks",
            "riskFactors"
          ]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, prediction: parsed });
  } catch (error) {
    console.error("Error generating AI prediction:", error);
    return res.status(500).json({
      error: "Erreur lors de la g\xE9n\xE9ration des pronostics.",
      details: error?.message
    });
  }
});
app.post("/api/analyst-chat", async (req, res) => {
  try {
    const { question, match } = req.body;
    if (!question || !match) {
      return res.status(400).json({ error: "Question et match requis." });
    }
    const prompt = `Tu es "Coach Vision AI", l'analyste vid\xE9o et data analyste tactique de r\xE9f\xE9rence pour ce match.
R\xE9ponds de fa\xE7on pr\xE9cise, dynamique et argument\xE9e \xE0 la question de l'utilisateur.

CONTEXTE DU MATCH :
${match.homeTeam.name} (${match.score.home}) - (${match.score.away}) ${match.awayTeam.name}
Minute : ${match.minute}'
xG : ${match.stats.xg.home.toFixed(2)} - ${match.stats.xg.away.toFixed(2)}
Tirs : ${match.stats.shots.home} (${match.stats.shotsOnTarget.home} cadr\xE9s) vs ${match.stats.shots.away} (${match.stats.shotsOnTarget.away} cadr\xE9s)
Possession : ${match.stats.possession.home}% vs ${match.stats.possession.away}%
Corners : ${match.stats.corners.home} - ${match.stats.corners.away}
Cartons : ${match.stats.yellowCards.home}J/${match.stats.redCards.home}R vs ${match.stats.yellowCards.away}J/${match.stats.redCards.away}R
Derniers \xE9v\xE9nements : ${JSON.stringify(match.events?.slice(-5) || [])}

QUESTION : "${question}"

R\xE8gles :
- R\xE9ponds en fran\xE7ais avec un ton professionnel, passionn\xE9 et analytique (comme sur un plateau d'analyse de Ligue des Champions).
- Utilise les m\xE9triques chiffr\xE9es (xG, efficacit\xE9, pressing, zones d'attaque).
- Reste concis (maximum 3 paragraphes).`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });
    return res.json({ success: true, answer: response.text });
  } catch (error) {
    console.error("Error in analyst chat:", error);
    return res.status(500).json({
      error: "Erreur de l'analyste IA.",
      details: error?.message
    });
  }
});
app.post("/api/deep-analysis", async (req, res) => {
  try {
    const { match, scenario } = req.body;
    if (!match) {
      return res.status(400).json({ error: "Donn\xE9es de match requises." });
    }
    const scenarioText = scenario ? `
HYPOTH\xC8SE DE SC\xC9NARIO EN COURS D'\xC9VALUATION : "${scenario}". Int\xE8gre ce sc\xE9nario dans tes projections et mod\xE9lisations.` : "";
    const prompt = `Tu es le Directeur de la Performance Tactique et de la Data Intelligence de l'UEFA (niveau UEFA Pro & Analyste StatsBomb/Opta Pro).
Tu dois r\xE9aliser un AUDIT TACTIQUE APPROFONDI (ANALYSE PROFONDE) du match suivant :

MATCH : ${match.homeTeam.name} (${match.score.home}) vs ${match.awayTeam.name} (${match.score.away})
STADE : ${match.stadium} | COMP\xC9TITION : ${match.competition} | ARBITRE : ${match.referee}
MINUTE : ${match.minute}' (${match.status})
SCH\xC9MAS TACTIQUES : ${match.homeTeam.name} (${match.homeTeam.formation} - Coach ${match.homeTeam.manager}) vs ${match.awayTeam.name} (${match.awayTeam.formation} - Coach ${match.awayTeam.manager})

M\xC9TRIQUES DE BASE :
- Possession : ${match.stats.possession.home}% vs ${match.stats.possession.away}%
- Expected Goals (xG) : ${match.stats.xg.home.toFixed(2)} vs ${match.stats.xg.away.toFixed(2)}
- Tirs (cadr\xE9s / bloqu\xE9s) : ${match.stats.shots.home} (${match.stats.shotsOnTarget.home} cadr\xE9s) vs ${match.stats.shots.away} (${match.stats.shotsOnTarget.away} cadr\xE9s)
- Grosses Occasions cr\xE9\xE9es : ${match.stats.bigChances.home} vs ${match.stats.bigChances.away}
- Momentum 15 min : ${match.momentum.homeDominance}% vs ${match.momentum.awayDominance}%
- Fautes & Cartons : ${match.stats.fouls.home}F / ${match.stats.yellowCards.home}J / ${match.stats.redCards.home}R vs ${match.stats.fouls.away}F / ${match.stats.yellowCards.away}J / ${match.stats.redCards.away}R
- \xC9v\xE9nements marquants r\xE9cents : ${JSON.stringify(match.events?.slice(-6) || [])}
${scenarioText}

R\xC8GLES D'ANALYSE PROFONDE :
1. Sois extr\xEAmement pr\xE9cis, technique et pointu (utilise les notions de demi-espaces, hauteur de bloc, pressing triggers, PPDA, Expected Threat xT, Field Tilt, PSxG des gardiens, transitions offensives/d\xE9fensives).
2. Fournis des duels directs cl\xE9s r\xE9alistes entre joueurs titulaires (ex: Ailier contre Lat\xE9ral, Attaquant vs D\xE9fenseur central).
3. Mod\xE9lise les sc\xE9narios de fin de match avec probabilit\xE9s r\xE9elles.
4. G\xE9n\xE8re des directives concr\xE8tes et sp\xE9cifiques pour chaque entra\xEEneur (${match.homeTeam.manager} et ${match.awayTeam.manager}).
5. Calcule des Value Bets quantifi\xE9s avec cote juste th\xE9orique (Fair Odds), cote marchande et Edge % d'esp\xE9rance math\xE9matique.
6. Calcule \xE9galement les m\xE9triques avanc\xE9es (PPDA, Field Tilt %, Expected Threat xT, Post-Shot xG, etc.) adapt\xE9es \xE0 la r\xE9alit\xE9 du match.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dossier: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: {
                  type: Type.STRING,
                  description: "R\xE9sum\xE9 ex\xE9cutif analytique percutant de 3-4 phrases"
                },
                tacticalPhaseBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    buildUp: { type: Type.STRING, description: "Phase de relance et sortie de balle sous pression" },
                    pressingAndBlock: { type: Type.STRING, description: "Hauteur de bloc d\xE9fensif et d\xE9clencheurs de pressing" },
                    attackingShape: { type: Type.STRING, description: "Structure d attaque, largeur et occupation des demi-espaces" },
                    defensiveTransitions: { type: Type.STRING, description: "Comportement \xE0 la perte du ballon et contre-pressing" }
                  },
                  required: ["buildUp", "pressingAndBlock", "attackingShape", "defensiveTransitions"]
                },
                advancedMetricsAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    fieldTiltCommentary: { type: Type.STRING, description: "Analyse de la territorialit\xE9 et possession dans les 30 derniers m\xE8tres" },
                    xtBreakdown: { type: Type.STRING, description: "Expected Threat xT : qui cr\xE9e le plus de danger en amont du tir" },
                    ppdaEvaluation: { type: Type.STRING, description: "\xC9valuation du PPDA et de l intensit\xE9 du pressing d\xE9fensif" },
                    goalkeeperImpact: { type: Type.STRING, description: "Performance des gardiens face aux tirs subis (PSxG)" }
                  },
                  required: ["fieldTiltCommentary", "xtBreakdown", "ppdaEvaluation", "goalkeeperImpact"]
                },
                keyDuels: {
                  type: Type.ARRAY,
                  description: "3 duels individuels cl\xE9s sur le terrain",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      homePlayer: { type: Type.STRING },
                      awayPlayer: { type: Type.STRING },
                      zone: { type: Type.STRING, description: "Ex: Couloir Gauche vs Droit" },
                      description: { type: Type.STRING, description: "Analyse tactique de l opposition" },
                      homeAdvantage: { type: Type.NUMBER, description: "Pourcentage d avantage pour le joueur domicile (0-100)" },
                      keyStat: { type: Type.STRING, description: "Statistique cl\xE9 du duel" }
                    },
                    required: ["homePlayer", "awayPlayer", "zone", "description", "homeAdvantage", "keyStat"]
                  }
                },
                vulnerabilities: {
                  type: Type.OBJECT,
                  properties: {
                    home: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Failles identifi\xE9es c\xF4t\xE9 domicile" },
                    away: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Failles identifi\xE9es c\xF4t\xE9 ext\xE9rieur" }
                  },
                  required: ["home", "away"]
                },
                scenarioSimulations: {
                  type: Type.ARRAY,
                  description: "3 sc\xE9narios d \xE9volution du match",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      scenarioName: { type: Type.STRING },
                      probability: { type: Type.NUMBER, description: "Probabilit\xE9 en %" },
                      tacticalImpact: { type: Type.STRING },
                      projectedScore: { type: Type.STRING }
                    },
                    required: ["scenarioName", "probability", "tacticalImpact", "projectedScore"]
                  }
                },
                managerialDirectives: {
                  type: Type.OBJECT,
                  properties: {
                    homeCoachAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
                    awayCoachAdvice: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["homeCoachAdvice", "awayCoachAdvice"]
                },
                valueBetsDeep: {
                  type: Type.ARRAY,
                  description: "3 opportunit\xE9s de paris \xE0 esp\xE9rance math\xE9matique positive",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      market: { type: Type.STRING },
                      fairOdds: { type: Type.NUMBER, description: "Cote juste calcul\xE9e" },
                      bookmakerOdds: { type: Type.NUMBER, description: "Cote moyenne observ\xE9e" },
                      edgePercentage: { type: Type.NUMBER, description: "Valeur ajout\xE9e % (ex: 8.5)" },
                      confidence: { type: Type.STRING, description: "\xC9lev\xE9e | Moyenne | Audacieux" },
                      deepRationale: { type: Type.STRING, description: "D\xE9monstration math\xE9matique et tactique" }
                    },
                    required: ["market", "fairOdds", "bookmakerOdds", "edgePercentage", "confidence", "deepRationale"]
                  }
                }
              },
              required: [
                "executiveSummary",
                "tacticalPhaseBreakdown",
                "advancedMetricsAnalysis",
                "keyDuels",
                "vulnerabilities",
                "scenarioSimulations",
                "managerialDirectives",
                "valueBetsDeep"
              ]
            },
            advancedMetrics: {
              type: Type.OBJECT,
              properties: {
                ppda: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                fieldTilt: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                expectedThreat: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                postShotXg: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                goalsPrevented: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                duelSuccess: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                halfSpaceEntries: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                boxTouches: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                },
                pressingIntensity: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.STRING }, away: { type: Type.STRING } },
                  required: ["home", "away"]
                },
                transitionSpeedIndex: {
                  type: Type.OBJECT,
                  properties: { home: { type: Type.NUMBER }, away: { type: Type.NUMBER } },
                  required: ["home", "away"]
                }
              },
              required: [
                "ppda",
                "fieldTilt",
                "expectedThreat",
                "postShotXg",
                "goalsPrevented",
                "duelSuccess",
                "halfSpaceEntries",
                "boxTouches",
                "pressingIntensity",
                "transitionSpeedIndex"
              ]
            }
          },
          required: ["dossier", "advancedMetrics"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    if (parsed.dossier) {
      parsed.dossier.generatedAtMinute = match.minute;
    }
    return res.json({ success: true, ...parsed });
  } catch (error) {
    console.error("Error in deep analysis:", error);
    return res.status(500).json({
      error: "Erreur lors de la g\xE9n\xE9ration de l'analyse profonde.",
      details: error?.message
    });
  }
});
app.post("/api/tactical-report", async (req, res) => {
  try {
    const { match } = req.body;
    const prompt = `G\xE9n\xE8re un rapport tactique approfondi pour ${match.homeTeam.name} vs ${match.awayTeam.name} \xE0 la minute ${match.minute}'.
Score : ${match.score.home} - ${match.score.away}.
xG : ${match.stats.xg.home.toFixed(2)} vs ${match.stats.xg.away.toFixed(2)}.
Possession : ${match.stats.possession.home}% vs ${match.stats.possession.away}%.
Cartons rouges : ${match.stats.redCards.home} vs ${match.stats.redCards.away}.

R\xE9dige un bilan structur\xE9 en markdown avec :
1. **Physionomie de la rencontre** (qui impose son rythme et comment)
2. **Efficacit\xE9 xG & Conversion devant le but**
3. **Points de rupture & failles d\xE9fensives constat\xE9es**
4. **Consignes tactiques cl\xE9s pour la suite de la rencontre**`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });
    return res.json({ success: true, report: response.text });
  } catch (error) {
    console.error("Error in tactical report:", error);
    return res.status(500).json({ error: error?.message });
  }
});
async function setupFrontend() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u26BD FootPulse AI Server running on http://0.0.0.0:${PORT}`);
  });
}
setupFrontend().catch((err) => {
  console.error("Failed to start FootPulse server:", err);
});
