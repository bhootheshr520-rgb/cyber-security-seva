import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  BellRing, 
  PhoneCall, 
  Sparkles, 
  ExternalLink, 
  AlertTriangle, 
  Check, 
  Radio, 
  Play,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { PushAdvisory } from '../data/pushNotificationsData';

interface LockscreenSimulationProps {
  notifications: PushAdvisory[];
  onOpenAdvisory: (advisory: PushAdvisory) => void;
  onReturnToApp: () => void;
  onTriggerTestPush: () => void;
  onScheduleBackgroundPush: (seconds: number) => void;
  scheduledSecondsRemaining: number | null;
  onOpenSos: () => void;
}

export const LockscreenSimulation: React.FC<LockscreenSimulationProps> = ({
  notifications,
  onOpenAdvisory,
  onReturnToApp,
  onTriggerTestPush,
  onScheduleBackgroundPush,
  scheduledSecondsRemaining,
  onOpenSos,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');
  const [dateStr, setDateStr] = useState('Monday, October 13');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlerts = notifications.slice(0, 3);

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden p-4 select-none animate-in fade-in duration-300">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-black pointer-events-none" />
      <div className="absolute top-1/4 -right-16 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Lock status */}
      <div className="relative z-10 flex flex-col items-center pt-8">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-slate-300 mb-4 border border-white/10 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-slate-200" />
          <span>Device Locked • App in Background</span>
        </div>

        {/* Big Lockscreen Clock */}
        <h2 className="text-6xl font-extralight tracking-tighter text-white/95">
          {timeStr}
        </h2>
        <p className="text-xs font-medium text-slate-300 mt-1">
          {dateStr}
        </p>

        {/* Background Threat Surveillance Radar Badge */}
        <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold animate-pulse">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>I4C & CERT-In Threat Surveillance Active</span>
        </div>
      </div>

      {/* Push Notifications Stack on Lock Screen */}
      <div className="relative z-10 flex-1 my-4 flex flex-col justify-center space-y-2.5 max-h-[460px] overflow-y-auto px-1 no-scrollbar">
        {scheduledSecondsRemaining !== null && (
          <div className="p-3 rounded-2xl bg-indigo-900/80 border border-indigo-400/50 backdrop-blur-md text-center shadow-lg animate-pulse">
            <p className="text-xs font-bold text-indigo-200 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Incoming Urgent Threat Advisory in {scheduledSecondsRemaining}s...
            </p>
            <p className="text-[10px] text-indigo-300 mt-0.5">
              Simulating background delivery while phone is locked
            </p>
          </div>
        )}

        {unreadAlerts.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
            <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-medium text-slate-300">No urgent threat advisories in the last hour</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Tap "Trigger Urgent Advisory" below to test push delivery.
            </p>
          </div>
        ) : (
          unreadAlerts.map((advisory, idx) => {
            const isCritical = advisory.severity === 'Critical';
            return (
              <div
                key={advisory.id}
                onClick={() => onOpenAdvisory(advisory)}
                className={`p-3.5 rounded-2xl backdrop-blur-xl border shadow-xl cursor-pointer transition-all active:scale-[0.98] ${
                  idx === 0
                    ? isCritical
                      ? 'bg-slate-900/90 border-rose-500/80 shadow-rose-950/60 ring-1 ring-rose-500/50 animate-in slide-in-from-top-3 duration-300'
                      : 'bg-slate-900/90 border-amber-500/80 shadow-amber-950/60'
                    : 'bg-slate-900/70 border-slate-700/60 opacity-90'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isCritical ? 'bg-rose-600' : 'bg-amber-600'}`}>
                      <ShieldAlert className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-300">
                      Cyber Security Seva
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400 font-mono">{advisory.timestamp}</span>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {advisory.severity}
                  </span>
                </div>

                {/* Body */}
                <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5 leading-snug">
                  <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
                  <span>{advisory.title}</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {advisory.body}
                </p>

                {/* Action CTA */}
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">{advisory.agency}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold hover:underline flex items-center gap-1">
                      Tap to Open & Protect →
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Lockscreen Simulator Controls & Unlock Button */}
      <div className="relative z-10 pt-2 border-t border-white/10 space-y-2">
        {/* Quick Testing Bar */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            onClick={onTriggerTestPush}
            className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-rose-300 font-semibold border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <BellRing className="w-3.5 h-3.5 text-rose-400" />
            <span>⚡ Push Alert Now</span>
          </button>

          <button
            onClick={() => onScheduleBackgroundPush(5)}
            className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>⏱️ Alert in 5s</span>
          </button>
        </div>

        {/* Primary Return to App Button */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onOpenSos}
            className="p-3 rounded-2xl bg-rose-600/90 hover:bg-rose-500 active:scale-95 text-white transition-all cursor-pointer shadow-lg shadow-rose-950/40"
            title="Emergency SOS"
          >
            <PhoneCall className="w-4 h-4" />
          </button>

          <button
            onClick={onReturnToApp}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 cursor-pointer transition-all"
          >
            <Unlock className="w-4 h-4 text-indigo-200" />
            <span>Swipe / Tap to Return to App</span>
          </button>
        </div>

        {/* Home Bar Indicator */}
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2" />
      </div>
    </div>
  );
};
