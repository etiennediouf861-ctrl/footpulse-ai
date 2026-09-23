import React, { useState, useEffect } from 'react';
import { BankrollSummary } from '../types/football';
import { MOCK_BANKROLL_SUMMARY } from '../data/proData';
import {
  TrendingUp,
  Award,
  Wallet,
  Calculator,
  Flame,
  CheckCircle2,
  Users,
  Percent,
  Sparkles,
  ArrowUpRight,
  Plus,
  Trash2,
  Check,
  X,
  Clock
} from 'lucide-react';

interface PersonalBet {
  id: string;
  match: string;
  pick: string;
  odds: number;
  stake: number;
  status: 'WON' | 'LOST' | 'PENDING';
  date: string;
}

const INITIAL_USER_BETS: PersonalBet[] = [
  {
    id: 'ub-1',
    match: 'Real Madrid vs Manchester City',
    pick: 'Plus de 2.5 Buts',
    odds: 1.72,
    stake: 50,
    status: 'WON',
    date: 'Aujourd’hui 21h',
  },
  {
    id: 'ub-2',
    match: 'Arsenal vs PSG',
    pick: 'Victoire Arsenal (1X2)',
    odds: 2.15,
    stake: 40,
    status: 'WON',
    date: 'Hier',
  },
  {
    id: 'ub-3',
    match: 'Inter Milan vs AC Milan',
    pick: 'Inter Milan ou Nul & Moins de 3.5 buts',
    odds: 1.88,
    stake: 35,
    status: 'WON',
    date: '21/09',
  },
  {
    id: 'ub-4',
    match: 'Barcelone vs Bayern Munich',
    pick: 'Les 2 Équipes Marquent',
    odds: 1.62,
    stake: 45,
    status: 'PENDING',
    date: 'Demain 21h',
  },
];

export const PerformanceTrackerView: React.FC = () => {
  const data: BankrollSummary = MOCK_BANKROLL_SUMMARY;

  // Interactive Bankroll Simulator
  const [unitValue, setUnitValue] = useState<number>(50); // 50€ par unité
  const simulatedEuroProfit = (data.netProfitUnits * unitValue).toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  });

  // Personal Bets Tracker with LocalStorage
  const [userBets, setUserBets] = useState<PersonalBet[]>(() => {
    try {
      const saved = localStorage.getItem('footpulse_user_bets');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER_BETS;
  });

  const [isAddingBet, setIsAddingBet] = useState(false);
  const [newMatch, setNewMatch] = useState('');
  const [newPick, setNewPick] = useState('');
  const [newOdds, setNewOdds] = useState('1.90');
  const [newStake, setNewStake] = useState('30');
  const [newStatus, setNewStatus] = useState<'WON' | 'LOST' | 'PENDING'>('PENDING');

  useEffect(() => {
    try {
      localStorage.setItem('footpulse_user_bets', JSON.stringify(userBets));
    } catch {
      // ignore
    }
  }, [userBets]);

  const handleAddBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch || !newPick) return;

    const bet: PersonalBet = {
      id: `ub-${Date.now()}`,
      match: newMatch,
      pick: newPick,
      odds: Number(parseFloat(newOdds) || 1.8),
      stake: Number(parseFloat(newStake) || 20),
      status: newStatus,
      date: 'Aujourd’hui',
    };

    setUserBets([bet, ...userBets]);
    setNewMatch('');
    setNewPick('');
    setIsAddingBet(false);
  };

  const handleToggleStatus = (id: string, current: 'WON' | 'LOST' | 'PENDING') => {
    const next: Record<'WON' | 'LOST' | 'PENDING', 'WON' | 'LOST' | 'PENDING'> = {
      PENDING: 'WON',
      WON: 'LOST',
      LOST: 'PENDING',
    };
    setUserBets(userBets.map((b) => (b.id === id ? { ...b, status: next[current] } : b)));
  };

  const handleDeleteBet = (id: string) => {
    setUserBets(userBets.filter((b) => b.id !== id));
  };

  // Compute Personal Stats
  const resolvedBets = userBets.filter((b) => b.status !== 'PENDING');
  const totalStaked = userBets.reduce((acc, b) => acc + b.stake, 0);
  const totalWon = resolvedBets
    .filter((b) => b.status === 'WON')
    .reduce((acc, b) => acc + b.stake * b.odds, 0);
  const totalLost = resolvedBets
    .filter((b) => b.status === 'LOST')
    .reduce((acc, b) => acc + b.stake, 0);
  const personalProfit = totalWon - (totalLost + resolvedBets.filter((b) => b.status === 'WON').reduce((acc, b) => acc + b.stake, 0)) + (totalWon > 0 ? 0 : 0);
  
  // Real Net Profit
  let realNetProfit = 0;
  let totalResolvedStakes = 0;
  resolvedBets.forEach((b) => {
    totalResolvedStakes += b.stake;
    if (b.status === 'WON') {
      realNetProfit += b.stake * (b.odds - 1);
    } else if (b.status === 'LOST') {
      realNetProfit -= b.stake;
    }
  });

  const personalRoi = totalResolvedStakes > 0 ? (realNetProfit / totalResolvedStakes) * 100 : 0;
  const personalWinRate =
    resolvedBets.length > 0
      ? (resolvedBets.filter((b) => b.status === 'WON').length / resolvedBets.length) * 100
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner - 100% Free Access */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0a1e19] via-[#091a26] to-[#071318] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white shadow-lg shadow-emerald-950/60">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Performance Odds Insights
                </span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1">
                  100% Gratuit & Illimité
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Suivez vos performances, votre bankroll et vos paris
              </h2>
              <p className="text-xs text-slate-400">
                Analysez votre ROI réel, enregistrez vos tickets et comparez-vous aux statistiques de la communauté.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#0d221c] p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Bilan Net Certifié</span>
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              +{data.netProfitUnits.toFixed(2)} u
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Sur {data.totalPicksVerified} pronostics modélisés
            </div>
          </div>

          <div className="rounded-2xl bg-[#0d221c] p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Retour s/ Investissement</span>
              <Percent className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {data.roiPercentage.toFixed(2)} %
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Rentabilité nette moyenne (ROI)
            </div>
          </div>

          <div className="rounded-2xl bg-[#0d221c] p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Cote Moyenne Jouée</span>
              <Calculator className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {data.averageOdds.toFixed(3)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Optimisée sur les cotes de valeur (EV+)
            </div>
          </div>

          <div className="rounded-2xl bg-[#0d221c] p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Série de Victoires en Cours</span>
              <Flame className="h-4 w-4 text-orange-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
              {data.currentWinStreak} consécutives
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Record historique : {data.bestWinStreak} victoires d&apos;affilée
            </div>
          </div>
        </div>
      </div>

      {/* NEW TOOL: MON JOURNAL DE PARIS PERSONNEL (BET TRACKER RENTABILITÉ) */}
      <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📓 Mon Journal de Paris Personnel (Tracker de Rentabilité)</span>
              </h3>
              <span className="rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-mono font-bold">
                SAUVEGARDÉ EN LOCAL
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Enregistrez vos mises réelles pour analyser votre ROI exact et votre progression financière.
            </p>
          </div>

          <button
            onClick={() => setIsAddingBet(!isAddingBet)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-3.5 py-2 text-xs hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-950/60"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter un Pari</span>
          </button>
        </div>

        {/* Quick User Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Paris Enregistrés</span>
            <span className="text-xl font-black text-white font-mono">{userBets.length}</span>
            <span className="text-[10px] text-slate-500 block">Total misé : {totalStaked} €</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bénéfice Net Réel</span>
            <span className={`text-xl font-black font-mono ${realNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {realNetProfit >= 0 ? `+${realNetProfit.toFixed(2)} €` : `${realNetProfit.toFixed(2)} €`}
            </span>
            <span className="text-[10px] text-slate-500 block">Gains nets encaissés</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Votre ROI Personnel</span>
            <span className={`text-xl font-black font-mono ${personalRoi >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              {personalRoi >= 0 ? `+${personalRoi.toFixed(1)} %` : `${personalRoi.toFixed(1)} %`}
            </span>
            <span className="text-[10px] text-slate-500 block">Rendement du capital</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Taux de Victoire</span>
            <span className="text-xl font-black text-amber-400 font-mono">{personalWinRate.toFixed(1)} %</span>
            <span className="text-[10px] text-slate-500 block">{resolvedBets.filter((b) => b.status === 'WON').length} sur {resolvedBets.length} résolus</span>
          </div>
        </div>

        {/* Add Bet Form if Open */}
        {isAddingBet && (
          <form onSubmit={handleAddBet} className="mb-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 p-4 space-y-3 animate-in fade-in duration-200">
            <div className="text-xs font-bold text-emerald-400">Nouveau Pari dans votre Journal</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Match (ex: Real Madrid vs Man City)"
                value={newMatch}
                onChange={(e) => setNewMatch(e.target.value)}
                required
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Pronostic (ex: Plus de 2.5 Buts)"
                value={newPick}
                onChange={(e) => setNewPick(e.target.value)}
                required
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Cote (ex: 1.85)"
                value={newOdds}
                onChange={(e) => setNewOdds(e.target.value)}
                required
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                step="1"
                placeholder="Mise (€) (ex: 50)"
                value={newStake}
                onChange={(e) => setNewStake(e.target.value)}
                required
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="PENDING">⏳ En attente</option>
                <option value="WON">✅ Gagné</option>
                <option value="LOST">❌ Perdu</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingBet(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
              >
                Valider l&apos;enregistrement
              </button>
            </div>
          </form>
        )}

        {/* List of User Bets */}
        <div className="space-y-2.5">
          {userBets.map((bet) => {
            return (
              <div
                key={bet.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 text-xs transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">{bet.date}</span>
                    <span className="font-bold text-white">{bet.match}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">{bet.pick}</span>
                    <span className="rounded bg-slate-950 border border-slate-800 px-1.5 py-0.2 font-mono text-[10px] text-amber-400">
                      @{bet.odds.toFixed(2)}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Mise : {bet.stake} €</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(bet.id, bet.status)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      bet.status === 'WON'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : bet.status === 'LOST'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                    title="Cliquer pour basculer le résultat (Gagné / Perdu / En attente)"
                  >
                    {bet.status === 'WON' && <Check className="h-3 w-3" />}
                    {bet.status === 'LOST' && <X className="h-3 w-3" />}
                    {bet.status === 'PENDING' && <Clock className="h-3 w-3" />}
                    <span>{bet.status === 'WON' ? `+${(bet.stake * (bet.odds - 1)).toFixed(2)} €` : bet.status === 'LOST' ? `-${bet.stake} €` : 'En attente'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBet(bet.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Supprimer ce pari"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator: Net Profit Multiplier in Euros */}
      <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Calculator className="h-4 w-4 text-amber-400" />
              <span>Simulateur de Gains Réels selon votre Mise Unitaire</span>
            </h4>
            <p className="text-xs text-slate-400">
              Ajustez la valeur de votre unité (1u) pour voir les gains générés sur le modèle.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Gain Total Projeté</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              +{simulatedEuroProfit} €
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Valeur de votre unité :</span>
            <span className="text-base font-bold text-amber-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
              {unitValue} € par unité (1u)
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={unitValue}
            onChange={(e) => setUnitValue(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>

      {/* Foresportia Community Leaderboard - As in screenshot */}
      <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-indigo-400" />
            <div>
              <h4 className="font-bold text-sm text-white">
                Classement Public Communautaire FootPulse
              </h4>
              <p className="text-xs text-slate-400">
                Performance certifiée sur le grand livre public.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-mono font-bold">
            Votre rang : #{data.communityRank} sur 12 450
          </span>
        </div>

        <div className="space-y-2.5">
          {[
            { rank: 1, name: 'Alexandre_DataPro', profit: '+214.30u', roi: '71.2%', streak: '24W', badge: '🥇 Top 1' },
            { rank: 2, name: 'NicoBetting_AI', profit: '+198.40u', roi: '68.5%', streak: '21W', badge: '🥈 Top 2' },
            { rank: 3, name: 'Karim_QuantFoot', profit: '+182.10u', roi: '65.9%', streak: '19W', badge: '🥉 Top 3' },
            { rank: 4, name: 'Vous (Compte FootPulse)', profit: `+${data.netProfitUnits}u`, roi: `${data.roiPercentage}%`, streak: `${data.currentWinStreak}W`, badge: '⭐ Accès Libre', isUser: true },
            { rank: 5, name: 'Matthieu_OptaTipster', profit: '+154.20u', roi: '61.0%', streak: '15W', badge: 'Top 5' },
          ].map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs transition ${
                entry.isUser
                  ? 'border-emerald-500/50 bg-emerald-500/10 font-bold'
                  : 'border-slate-800/80 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono font-black">
                  #{entry.rank}
                </span>
                <span className="text-white font-bold">{entry.name}</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  {entry.badge}
                </span>
              </div>

              <div className="flex items-center gap-5 font-mono">
                <span className="text-emerald-400 font-black">{entry.profit}</span>
                <span className="text-cyan-400 hidden sm:inline">{entry.roi} ROI</span>
                <span className="text-amber-400">{entry.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
