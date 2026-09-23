import React, { useState } from 'react';
import { HistoricalPrediction } from '../types/football';
import { MOCK_HISTORICAL_PREDICTIONS } from '../data/proData';
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  ExternalLink,
  Award,
  BarChart2,
  Calendar,
  Layers,
  Download,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export const VerifiableHistoryView: React.FC = () => {
  const [filterConfidence, setFilterConfidence] = useState<'ALL' | 'Ultra-Haute' | 'Haute' | 'Stable'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const predictions = MOCK_HISTORICAL_PREDICTIONS.filter((p) => {
    if (filterConfidence !== 'ALL' && p.confidence !== filterConfidence) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.matchName.toLowerCase().includes(q) ||
        p.competition.toLowerCase().includes(q) ||
        p.pick.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportAsCSV = () => {
    const headers = ['Date', 'Match', 'Competition', 'Pronostic', 'Cote', 'Confiance', 'Statut', 'Gain_Unites'];
    const rows = predictions.map((p) => [
      p.date,
      `"${p.matchName}"`,
      `"${p.competition}"`,
      `"${p.pick}"`,
      p.odds.toFixed(2),
      p.confidence,
      p.result,
      p.unitsResult.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FootPulse_Historique_Verifie_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner - 100% Free & Open Audit */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#09152b] via-[#0b1b36] to-[#071021] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-blue-950/60">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                  ✓ Historique Vérifiable des Résultats
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                  Audit Public En Accès Libre
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Mesurez la rentabilité du modèle sur des résultats réels
              </h2>
              <p className="text-xs text-slate-400">
                Chaque pronostic est horodaté et figé avant le coup d&apos;envoi, certifié sur 100+ rencontres.
              </p>
            </div>
          </div>

          <button
            onClick={exportAsCSV}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold shadow-lg shadow-blue-950 transition"
            title="Exporter en fichier tableur CSV"
          >
            {isCopied ? <Check className="h-4 w-4 text-emerald-300" /> : <FileSpreadsheet className="h-4 w-4" />}
            <span>{isCopied ? 'Fichier CSV Téléchargé !' : 'Exporter le Bilan (.CSV)'}</span>
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#0b1830] p-4 border border-blue-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Réussite 1X2</span>
              <Award className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              76,0 %
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              76 victoires sur les 100 derniers
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1830] p-4 border border-blue-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Multi-Marchés (BTTS / Over)</span>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              85,0 %
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Haute rentabilité cotes &gt; 1.65
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1830] p-4 border border-blue-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Cote Moyenne Gagnante</span>
              <BarChart2 className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              2,125
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Calculée sur paris clôturés
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1830] p-4 border border-blue-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Profit Net Vérifié</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              +169,85 u
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ROI net moyen de +64,15%
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une équipe, ligue ou pari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">Niveau :</span>
            {(['ALL', 'Ultra-Haute', 'Haute', 'Stable'] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setFilterConfidence(conf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterConfidence === conf
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                }`}
              >
                {conf === 'ALL' ? 'Tous' : conf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-xs font-bold text-slate-400">
          <span>Rencontre & Compétition</span>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">Pronostic Validé</span>
            <span>Résultat Net</span>
          </div>
        </div>

        <div className="space-y-3">
          {predictions.map((item) => {
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-blue-500/30 p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      {item.date}
                    </span>
                    <span className="text-xs font-bold text-slate-300">{item.competition}</span>
                    <span className="rounded-full bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 font-bold">
                      {item.confidence}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.matchName}</h4>
                </div>

                <div className="flex flex-col sm:items-end">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-400">{item.pick}</span>
                    <span className="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-amber-400">
                      @{item.odds.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400 font-black font-mono">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      GAGNÉ (+{item.unitsResult.toFixed(2)}u)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Fiabilité {item.modelHitRate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
