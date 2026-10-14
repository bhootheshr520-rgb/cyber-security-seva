import React, { useState } from 'react';
import { WifiOff, ShieldAlert, BookOpen, HardDrive, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { offlineStorageService } from '../services/offlineStorageService';

interface OfflineIndicatorProps {
  onOpenOfflineHub: () => void;
  isSimulatedOffline?: boolean;
  onToggleSimulatedOffline?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onOpenOfflineHub,
  isSimulatedOffline = false,
  onToggleSimulatedOffline,
}) => {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [isVerifying, setIsVerifying] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const effectiveOffline = !isOnline || isSimulatedOffline;

  const handleQuickVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      offlineStorageService.ensureCacheInitialized();
      setIsVerifying(false);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 3000);
    }, 600);
  };

  if (!effectiveOffline) {
    if (wasOffline && justSynced) {
      return (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Back Online — Live threat intelligence & police station locator restored.</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40">
      <div className="rounded-2xl bg-slate-900/95 backdrop-blur-md border border-amber-500/40 text-white p-3.5 shadow-2xl flex flex-col gap-2.5 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">
                  {isSimulatedOffline ? 'Simulated Offline Mode Active' : 'No Internet Connection Detected'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                100% of Emergency SOS & Legal Guidelines are cached locally.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenOfflineHub}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Open Offline SOS</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <HardDrive className="w-3 h-3" />
              <span>Offline Cache Verified</span>
            </span>
            <span>•</span>
            <span>Dial 1930 / USSD active</span>
          </div>

          {onToggleSimulatedOffline && (
            <button
              onClick={onToggleSimulatedOffline}
              className="text-amber-400/90 hover:text-amber-300 underline font-medium"
            >
              {isSimulatedOffline ? 'Exit Offline Sim' : 'Simulate Offline'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
