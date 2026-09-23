import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Cpu,
  Calculator,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Check,
  Zap,
  Target
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppStoreModal: () => void;
  onOpenCombiner: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onOpenAppStoreModal,
  onOpenCombiner,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'Démarrage Immédiat',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: <Sparkles className="h-6 w-6 text-emerald-400" />,
      title: 'Bienvenue sur FootPulse AI',
      subtitle: 'La plateforme de pronostics et d’analyse prédictive nouvelle génération',
      description:
        'L’application est prête à l’emploi dès la première seconde. Aucun abonnement ni configuration requise pour démarrer. Vous disposez d’une bankroll de démonstration de 1 000 € pour tester toutes les stratégies en conditions réelles sans risque.',
      highlights: [
        'Matchs en direct avec statistiques xG et Momentum offensif',
        'Pool complet de value bets certifiés avec espérance positive',
        'Chat Analyste IA tactique disponible 24/7'
      ],
      actionBtn: 'Découvrir le Modèle EV+'
    },
    {
      badge: 'Mathématiques & Value',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
      title: 'Comprendre l’Espérance Mathématique (EV+)',
      subtitle: 'Battez les bookmakers grâce à la rigueur probabiliste',
      description:
        'Un pari EV+ (Expected Value positive) est une opportunité où la probabilité réelle estimée par nos algorithmes est supérieure à celle implicite de la cote du bookmaker. Sur le long terme, parier uniquement en EV+ est la seule méthode mathématiquement prouvée pour générer du profit.',
      highlights: [
        'Cote Juste vs Cote Bookmaker calculée automatiquement',
        'Pourcentage d’avantage chiffré (ex : +14.5% EV+)',
        'Aucun pronostic à l’instinct ou au hasard'
      ],
      actionBtn: 'Voir la Recherche Approfondie'
    },
    {
      badge: 'Audit Systématique',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      title: 'Recherche & Analyse Approfondie Pré-Combiné',
      subtitle: 'Un dossier d’investigation complet avant chaque pronostic',
      description:
        'Avant de donner ou de jouer un combiné, le moteur inspecte la modélisation xG (Expected Goals), l’historique des face-à-face (H2H), les dynamiques récentes et les compositions d’équipe pour certifier la solidité du pari.',
      highlights: [
        'Scan automatique en 5 phases probabilistes',
        'Barres de comparaison des xG projetés et différentiel',
        'Matrice de corrélation pour éviter les sélections contradictoires'
      ],
      actionBtn: 'Comprendre la Gestion de Bankroll'
    },
    {
      badge: 'Protection du Capital',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: <Calculator className="h-6 w-6 text-purple-400" />,
      title: 'Gestion de Bankroll & Critère de Kelly',
      subtitle: 'La formule mathématique pour optimiser chaque mise',
      description:
        'Le calculateur Kelly intégré détermine la fraction exacte de votre capital à engager sur chaque pari pour maximiser la croissance de votre capital tout en éliminant mathématiquement le risque de ruine.',
      highlights: [
        'Calcul de mise ajusté à votre capital total',
        'Mode Kelly Conservateur (recommandé pour débuter)',
        'Simulateur de gains potentiels et bénéfice net'
      ],
      actionBtn: 'Installer sur iPhone / App Store'
    },
    {
      badge: 'Application Mobile',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: <Smartphone className="h-6 w-6 text-cyan-400" />,
      title: 'Installer l’App sur iPhone & Smartphone',
      subtitle: 'Accessible en plein écran sans passer par un store tiers',
      description:
        'Vous pouvez installer FootPulse AI sur votre iPhone ou iPad en quelques secondes via Safari (« Sur l’écran d’accueil ») ou déployer le package Capacitor officiel sur l’Apple App Store.',
      highlights: [
        'Icône officielle Retina sur votre écran d’accueil',
        'Lancement instantané en plein écran sans barre Safari',
        'Alertes en direct et notifications de match'
      ],
      actionBtn: 'Commencer à Explorer FootPulse'
    }
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('footpulse_onboarded', 'true');
      onClose();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('footpulse_onboarded', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-700/80 bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase font-mono ${current.badgeColor}`}>
              {current.badge}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Étape {currentStep + 1} sur {steps.length}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-bold flex items-center gap-1"
          >
            <span>Passer</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-inner shrink-0">
              {current.icon}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{current.title}</h3>
              <p className="text-xs text-slate-400">{current.subtitle}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Highlights checklist */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Points essentiels :
            </span>
            {current.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 p-2.5 text-xs text-slate-200"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Special shortcuts on final step */}
          {currentStep === 4 && (
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAppStoreModal();
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition py-2 text-xs font-bold"
              >
                <Smartphone className="h-4 w-4 text-cyan-400" />
                <span>Guide Déploiement App Store</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCombiner();
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition py-2 text-xs font-bold"
              >
                <Target className="h-4 w-4 text-emerald-400" />
                <span>Explorer les Combinés EV+</span>
              </button>
            </div>
          )}
        </div>

        {/* Step dots & navigation footer */}
        <div className="border-t border-slate-800 pt-4 mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Aller à l'étape ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold px-3 py-2 text-xs transition"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Précédent</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-4 py-2 text-xs shadow-lg shadow-emerald-950 transition"
            >
              <span>{current.actionBtn}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
