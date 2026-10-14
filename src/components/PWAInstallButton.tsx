import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Shield } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'compact') {
      return (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all"
          title="Install Offline Emergency App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <>
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:shadow transition-all group"
          title="Install Cyber Security Seva for instant 1-tap offline emergency access"
        >
          <Download className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
          <span>Install App (Offline SOS)</span>
        </button>

        {installSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <Check className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold">App Installed Successfully!</p>
              <p className="text-[11px] text-emerald-200">Emergency SOS and legal guides are available 100% offline.</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition shadow-xs"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-600" />
          <span>Install on iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h3 className="text-sm font-bold">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="my-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[11px] flex items-center justify-center shrink-0">1</span>
                  <p>Tap the <strong>Share</strong> button (square with arrow pointing up) in Safari's bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[11px] flex items-center justify-center shrink-0">2</span>
                  <p>Scroll down and select <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono text-[11px] flex items-center justify-center shrink-0">3</span>
                  <p>Access Emergency SOS & FIR Legal Guidelines instantly without internet connectivity anytime!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers that don't trigger beforeinstallprompt yet
  return (
    <button
      onClick={() => {
        // Dispatch install notice
        alert('To install this app on your device:\n\n• On Chrome: Click the Install icon in the address bar or menu (⋮) -> "Install App"\n• On Edge: Click menu (...) -> Apps -> "Install this site as an app"\n• On Android/iOS: Tap browser menu -> "Add to Home screen"\n\nAll Emergency SOS procedures and FIR legal guidelines will be available completely offline!');
      }}
      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all"
      title="Install Cyber Security Seva PWA for offline access"
    >
      <Download className="w-3.5 h-3.5 text-slate-500" />
      <span>Install App</span>
    </button>
  );
};
