import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Share2,
  PlusSquare,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AppStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppStoreModal: React.FC<AppStoreModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'IOS_INSTALL' | 'APPSTORE_DEV' | 'CAPACITOR_CONFIG'>('IOS_INSTALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const capacitorCommands = `npm install @capacitor/core @capacitor/ios
npx cap init "FootPulse AI" "com.footpulse.ai"
npm run build
npx cap add ios
npx cap sync
npx cap open ios`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-700/80 bg-gradient-to-b from-[#0e1628] to-[#090d18] p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-lg">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 uppercase">
                  iOS & App Store Ready
                </span>
                <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  PWA Compliant
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                Publication App Store & Installation Mobile
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800/80 mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('IOS_INSTALL')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'IOS_INSTALL'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🍏 Sur iPhone (Direct)</span>
          </button>

          <button
            onClick={() => setActiveTab('APPSTORE_DEV')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'APPSTORE_DEV'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🚀 Soumission App Store</span>
          </button>

          <button
            onClick={() => setActiveTab('CAPACITOR_CONFIG')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'CAPACITOR_CONFIG'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚙️ Config Capacitor</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs scrollbar-thin">
          {/* TAB 1: Direct iPhone installation (Instant & Free) */}
          {activeTab === 'IOS_INSTALL' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <h4 className="font-black text-sm text-cyan-200 mb-1 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-cyan-400" />
                  <span>Installation Directe sur iPhone & iPad (Mode Plein Écran)</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  FootPulse AI est configuré selon les standards Apple PWA. Les utilisateurs peuvent l&apos;installer en 5 secondes sans attendre la validation de l&apos;App Store, avec l&apos;icône officielle sur leur écran d&apos;accueil et un lancement instantané sans barre de navigation Safari.
                </p>
              </div>

              {/* Step by step cards */}
              <div className="space-y-2.5">
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold shrink-0 border border-cyan-500/30">
                    1
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Ouvrez le lien dans Safari sur votre iPhone</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Naviguez sur l&apos;URL de FootPulse AI avec le navigateur Safari officiel d&apos;Apple.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold shrink-0 border border-cyan-500/30">
                    2
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>Appuyez sur le bouton Partager</span>
                      <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                    </h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Situé au centre de la barre d&apos;outils inférieure de Safari (le rectangle avec la flèche vers le haut).
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold shrink-0 border border-cyan-500/30">
                    3
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>Sélectionnez « Sur l&apos;écran d&apos;accueil »</span>
                      <PlusSquare className="h-3.5 w-3.5 text-emerald-400" />
                    </h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Faites défiler le menu d&apos;actions Safari et validez « Ajouter ».
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold shrink-0 border border-emerald-500/30">
                    4
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Profitez de l&apos;expérience native</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      L&apos;application s&apos;ouvre en plein écran comme une application native Apple avec fluidité 60 fps et alertes en direct.
                    </p>
                  </div>
                </div>
              </div>

              {/* Native Android / Chromium prompt fallback */}
              {isInstallable && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-slate-300 text-xs">Navigateur compatible avec l&apos;installation 1-clic détecté :</span>
                  <button
                    onClick={install}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 hover:bg-emerald-400 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Installer Maintenant</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Official Apple App Store Packaging */}
          {activeTab === 'APPSTORE_DEV' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <h4 className="font-black text-sm text-emerald-300 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Procédure de Publication sur l&apos;Apple App Store (Xcode / TestFlight)</span>
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Votre application est 100% compatible pour être empaquetée via <strong>Capacitor</strong> et soumise directement sur App Store Connect avec votre compte Apple Developer.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-300 text-[11px] font-bold">
                      1. Commandes Terminal pour générer le projet Xcode iOS :
                    </span>
                    <button
                      onClick={() => copyToClipboard(capacitorCommands, 'cap-commands')}
                      className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[10px] text-slate-300 transition"
                    >
                      {copiedCode === 'cap-commands' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedCode === 'cap-commands' ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#070b14] p-3 text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800/80 leading-relaxed">
                    {capacitorCommands}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-1">
                    <span className="font-bold text-white text-xs block">2. Signature dans Xcode</span>
                    <p className="text-slate-400 text-[11px]">
                      Dans Xcode, ouvrez l&apos;onglet <em>Signing & Capabilities</em> et sélectionnez votre <em>Team Apple Developer</em>.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-1">
                    <span className="font-bold text-white text-xs block">3. Archive & TestFlight</span>
                    <p className="text-slate-400 text-[11px]">
                      Menu <em>Product &gt; Archive</em>, puis cliquez sur <em>Distribute App</em> vers App Store Connect pour lancer les tests bêta.
                    </p>
                  </div>
                </div>

                {/* App Store Guidelines Checklist */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-2">
                  <span className="font-bold text-white text-xs block flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Conformité Guidelines App Store Vérifiée</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5">✓ Responsive iPhone & iPad</span>
                    <span className="flex items-center gap-1.5">✓ Aucun pop-up bloquant</span>
                    <span className="flex items-center gap-1.5">✓ Données statiques & live sécurisées</span>
                    <span className="flex items-center gap-1.5">✓ Thème sombre adapté OLED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: capacitor.config.json details */}
          {activeTab === 'CAPACITOR_CONFIG' && (
            <div className="space-y-3">
              <p className="text-slate-300 text-[11px]">
                Le fichier de configuration officiel <code className="text-cyan-400 font-mono">capacitor.config.json</code> est déjà créé à la racine du projet avec l&apos;identifiant de bundle iOS officiel :
              </p>

              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-mono text-cyan-300">capacitor.config.json</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Prêt pour iOS 17 / 18</span>
                </div>
                <pre className="text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`{
  "appId": "com.footpulse.ai",
  "appName": "FootPulse AI",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "ios": {
    "contentInset": "automatic",
    "allowsLinkPreview": false,
    "scheme": "FootPulse AI"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1500,
      "backgroundColor": "#0a0e1a",
      "showSpinner": false
    }
  }
}`}
                </pre>
              </div>

              <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-white block">📦 Assets d&apos;icônes disponibles :</span>
                <div>• <code className="text-emerald-400">/apple-touch-icon.png</code> (180x180 px Retina)</div>
                <div>• <code className="text-emerald-400">/icon-192.png</code> &amp; <code className="text-emerald-400">/icon-512.png</code> (PWA &amp; App Store Launchpad)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 mt-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">FootPulse AI iOS Distribution Ready</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 text-xs transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
