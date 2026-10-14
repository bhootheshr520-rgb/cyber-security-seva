import React, { useEffect } from 'react';
import { ShieldAlert, X, ChevronRight, AlertTriangle } from 'lucide-react';
import { PushAdvisory } from '../data/pushNotificationsData';

interface HeadsUpNotificationBannerProps {
  advisory: PushAdvisory | null;
  onOpenAdvisory: (advisory: PushAdvisory) => void;
  onDismiss: () => void;
}

export const HeadsUpNotificationBanner: React.FC<HeadsUpNotificationBannerProps> = ({
  advisory,
  onOpenAdvisory,
  onDismiss,
}) => {
  useEffect(() => {
    if (!advisory) return;
    // Auto-dismiss heads-up after 7 seconds if not interacted with
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => clearTimeout(timer);
  }, [advisory, onDismiss]);

  if (!advisory) return null;

  const isCritical = advisory.severity === 'Critical';

  return (
    <div className="absolute top-2 left-2 right-2 z-50 animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        onClick={() => onOpenAdvisory(advisory)}
        className={`rounded-2xl p-3 shadow-2xl cursor-pointer border backdrop-blur-xl transition-all active:scale-[0.98] ${
          isCritical
            ? 'bg-slate-900/95 border-rose-500/70 shadow-rose-950/50 text-white'
            : 'bg-slate-900/95 border-amber-500/70 shadow-amber-950/50 text-white'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isCritical ? 'bg-rose-600' : 'bg-amber-600'}`}>
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold tracking-wide uppercase text-[10px] text-slate-300">
              Cyber Security Seva
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] text-slate-400 font-mono">NOW</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                isCritical ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}
            >
              {advisory.severity} Alert
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content row */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white line-clamp-1 flex items-center gap-1">
            <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
            <span>{advisory.title}</span>
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
            {advisory.body}
          </p>
        </div>

        {/* Action hint */}
        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-mono">{advisory.agency}</span>
          <span className="text-indigo-400 font-bold flex items-center gap-0.5 hover:underline">
            Tap to Inspect Advisory
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
