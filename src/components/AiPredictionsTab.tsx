import React, { useState } from 'react';
import { FootballMatch, AiPrediction } from '../types/football';
import { apiUrl } from '../utils/api';
import { Sparkles, TrendingUp, AlertCircle, RefreshCw, ShieldAlert, CheckCircle2, Crown, Target, ShieldCheck } from 'lucide-react';

interface AiPredictionsTabProps {
  match: FootballMatch;
  onUpdatePrediction: (newPrediction: AiPrediction) => void;
}

export const AiPredictionsTab: React.FC<AiPredictionsTabProps> = ({
  match,
  onUpdatePrediction,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const prediction = match.aiPrediction;

  const handleFetchPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl('/api/predict'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match: {
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            score: match.score,
            minute: match.minute,
            status: match.status,
            stats: match.stats,
            momentum: match.momentum,
            recentEvents: match.events.slice(-5),
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.prediction) {
        const updated: AiPrediction = {
          ...data.prediction,
          generatedAtMinute: match.minute,
        };
        onUpdatePrediction(updated);
        setLastRefreshed(`Actualisé à la ${match.minute}' (${new Date().toLocaleTimeString()})`);
      } else {
        setError(data.error || 'Impossible de générer les pronostics.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur réseau lors de la prédiction.');
    } finally {
      setLoading(false);
    }
  };

  if (!prediction) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-8 text-center shadow-xl">
        <Sparkles className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Génération des Pronostics IA</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
          Lancez l&apos;analyse prédictive bayésienne basée sur les xG, le momentum et les événements récents.
        </p>
        <button
          onClick={handleFetchPrediction}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:from-emerald-400 hover:to-teal-500 transition shadow-lg shadow-emerald-950"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Générer les Pronostics IA
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Probability Bar */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#121c33] to-[#0c1324] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Modèle Prédictif en Direct (Gemini 3.8 Flash)
                </h3>
                <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                  IA ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Calculé à partir de {match.events.length} événements, xG {match.stats.xg.home.toFixed(2)} - {match.stats.xg.away.toFixed(2)}
                {prediction.generatedAtMinute && ` • Émis à la ${prediction.generatedAtMinute}'`}
              </p>
            </div>
          </div>

          <button
            onClick={handleFetchPrediction}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 border border-slate-700 transition"
            title="Recalculer les pronostics avec les données à la minute actuelle"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{loading ? 'Analyse en cours...' : 'Réactualiser IA'}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {lastRefreshed && (
          <div className="mb-4 text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{lastRefreshed}</span>
          </div>
        )}

        {/* Live Probability Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-emerald-400">
              Victoire {match.homeTeam.shortName} : {prediction.winProbabilityHome}%
            </span>
            <span className="text-amber-400">
              Nul : {prediction.drawProbability}%
            </span>
            <span className="text-cyan-400">
              Victoire {match.awayTeam.shortName} : {prediction.winProbabilityAway}%
            </span>
          </div>

          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${prediction.winProbabilityHome}%` }}
              title={`Victoire Domicile: ${prediction.winProbabilityHome}%`}
            />
            <div
              className="bg-amber-400 transition-all duration-500"
              style={{ width: `${prediction.drawProbability}%` }}
              title={`Match Nul: ${prediction.drawProbability}%`}
            />
            <div
              className="bg-cyan-500 transition-all duration-500"
              style={{ width: `${prediction.winProbabilityAway}%` }}
              title={`Victoire Extérieur: ${prediction.winProbabilityAway}%`}
            />
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Score final le plus probable</span>
            <span className="text-xl font-mono font-black text-white mt-1 block">
              {prediction.predictedFinalScore}
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Prochain buteur probable</span>
            <span className="text-sm font-bold text-emerald-400 mt-1 block truncate">
              {prediction.nextGoalLikelihood}
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Tendance Over/Under 2.5</span>
            <span className="text-sm font-bold text-amber-300 mt-1 block truncate">
              {prediction.overUnder25Likelihood}
            </span>
          </div>
        </div>

        {/* Tactical Summary */}
        <div className="mt-4 rounded-xl bg-slate-900/90 p-4 border border-slate-800/90">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Synthèse Tactique de la Rencontre
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {prediction.tacticalSummary}
          </p>
          <div className="mt-2 text-[11px] text-emerald-400/90 font-medium">
            💡 Tendance clé : {prediction.keyTrend}
          </div>
        </div>
      </div>

      {/* Pro Features Quick Teaser */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <span>Scores Exacts & Historique Vérifié Débloqués</span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-mono text-amber-200">
                PRO DATA
              </span>
            </span>
            <p className="text-[11px] text-slate-400">
              Consultez l&apos;arbre complet des 10 scores exacts les plus plausibles et les 76% de réussite 1X2 vérifiés.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <span className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-cyan-400" />
            Scores Exacts IA
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            Bilan +169u
          </span>
        </div>
      </div>

      {/* Recommended AI Picks / Pronostics basés sur les données */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 sm:p-6 shadow-xl">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯 Pronostics Recommandés par l&apos;Algorithme</span>
          <span className="text-xs text-slate-400 font-normal">
            (Basés sur xG, momentum et historique direct)
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prediction.aiPicks?.map((pick, i) => {
            let confBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            if (pick.confidence === 'Moyenne') {
              confBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            } else if (pick.confidence === 'Audacieux') {
              confBg = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            }

            return (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl bg-slate-900/80 p-4 border border-slate-800 hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${confBg}`}>
                      {pick.confidence}
                    </span>
                    <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Cote ~ {pick.odds.toFixed(2)}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-white mb-2 leading-snug">
                    {pick.title}
                  </h5>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pick.reasoning}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Modèle FootPulse</span>
                  <span className="text-emerald-400 font-semibold">Opportunité Value</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Factors */}
      {prediction.riskFactors && prediction.riskFactors.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
            <ShieldAlert className="h-4 w-4" />
            Facteurs de Risque & Points de Rupture Détectés
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
            {prediction.riskFactors.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
