import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  RefreshCw,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  PhoneCall,
  MessageSquare,
  X,
  ExternalLink,
  SignalLow,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  sosEmergencyDispatchService,
  SosDistressMessage
} from '../services/sosEmergencyDispatchService';
import { GpsCoordinates } from './OneTouchVoiceRecorder';

interface SosAutoRetryDispatchProps {
  gpsCoordinates: GpsCoordinates | null;
  voiceDurationSeconds?: number;
  voiceStatementId?: string;
  className?: string;
  onDispatchDelivered?: (msg: SosDistressMessage) => void;
}

export const SosAutoRetryDispatch: React.FC<SosAutoRetryDispatchProps> = ({
  gpsCoordinates,
  voiceDurationSeconds,
  voiceStatementId,
  className = '',
  onDispatchDelivered
}) => {
  const [dispatchState, setDispatchState] = useState<SosDistressMessage | null>(null);
  const [simulatePoorNetwork, setSimulatePoorNetwork] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    const unsubscribe = sosEmergencyDispatchService.subscribe((msg) => {
      setDispatchState(msg);
      if (msg && msg.status === 'delivered' && onDispatchDelivered) {
        onDispatchDelivered(msg);
      }
    });
    setSimulatePoorNetwork(sosEmergencyDispatchService.isPoorConnectivitySimulated());
    return unsubscribe;
  }, [onDispatchDelivered]);

  // Handle toggling simulated poor connectivity
  const handleToggleSimulatedNetwork = (enabled: boolean) => {
    setSimulatePoorNetwork(enabled);
    sosEmergencyDispatchService.setSimulatedPoorConnectivity(enabled);
  };

  // Trigger Primary SOS Distress Dispatch
  const handleTriggerSos = async () => {
    setIsTriggering(true);
    try {
      // Use live GPS or fallback emergency coordinates
      const coords: GpsCoordinates = gpsCoordinates || {
        latitude: 28.613932,
        longitude: 77.209021,
        accuracy: 25,
        timestamp: Date.now(),
        mapsUrl: 'https://www.google.com/maps?q=28.613932,77.209021',
        locality: 'Emergency Hub Grid Coordinates',
        isSimulated: true
      };

      await sosEmergencyDispatchService.triggerDistressDispatch({
        gpsCoordinates: coords,
        voiceDurationSeconds,
        voiceStatementId,
        emergencyType: 'Urgent Cyber Financial Distress & Physical Coercion'
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const handleRetryNow = () => {
    sosEmergencyDispatchService.retryNow();
  };

  const handleCancel = () => {
    sosEmergencyDispatchService.cancelOrClear();
  };

  const status = dispatchState?.status || 'idle';
  const effectiveGps = dispatchState?.gpsCoordinates || gpsCoordinates;

  return (
    <div className={`rounded-2xl border transition-all ${className} ${
      status === 'retrying'
        ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-rose-950/80 border-amber-500/70 shadow-lg shadow-amber-950/50'
        : status === 'transmitting'
        ? 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-indigo-950/80 border-rose-500/70 shadow-lg shadow-rose-950/50'
        : status === 'delivered'
        ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/70 shadow-lg shadow-emerald-950/40'
        : status === 'failed'
        ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-red-950 border-red-500 shadow-xl'
        : 'bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 border-rose-500/30'
    } p-4 sm:p-5 text-white`}>

      {/* TOP BAR: Header + Auto-Retry Status Pill */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            status === 'retrying'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
              : status === 'transmitting'
              ? 'bg-rose-600/30 border-rose-400 text-rose-300 animate-spin'
              : status === 'delivered'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-rose-600/30 border-rose-500/40 text-rose-400'
          }`}>
            {status === 'retrying' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : status === 'transmitting' ? (
              <Radio className="w-4 h-4 animate-pulse" />
            ) : status === 'delivered' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                SOS Distress Trigger with Attached GPS
              </h4>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                status === 'retrying'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : status === 'delivered'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : status === 'transmitting'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-rose-600/20 text-rose-300 border-rose-600/40'
              }`}>
                {status === 'retrying'
                  ? `Auto-Retrying (${dispatchState?.attempts}/${dispatchState?.maxAttempts})`
                  : status === 'delivered'
                  ? 'Beacon Delivered'
                  : status === 'transmitting'
                  ? 'Transmitting...'
                  : 'Auto-Retry Enabled'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">
              Automatically captures GPS coordinates and repeatedly retries transmission if cellular or Wi-Fi connectivity drops.
            </p>
          </div>
        </div>

        {/* Dismiss / Cancel if active */}
        {status !== 'idle' && (
          <button
            onClick={handleCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Reset SOS Trigger"
            aria-label="Reset SOS Trigger"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* GPS COORDINATES ATTACHMENT META LINE */}
      {effectiveGps && (
        <div className="mb-3.5 p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px] text-emerald-200 truncate">
              {effectiveGps.latitude.toFixed(6)}° N, {effectiveGps.longitude.toFixed(6)}° E
              <span className="text-slate-400 text-[10px] ml-1.5 font-sans">
                (Accuracy: ±{effectiveGps.accuracy}m · {effectiveGps.locality || 'Satellite Fix'})
              </span>
            </span>
          </div>

          {effectiveGps.mapsUrl && (
            <a
              href={effectiveGps.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-white text-[11px] font-medium flex items-center gap-1 shrink-0 ml-2"
              title="Open GPS pin in Google Maps"
            >
              <span>Map Pin</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* STATE 1: IDLE - READY TO TRIGGER SOS */}
      {status === 'idle' && (
        <div className="space-y-3">
          <button
            onClick={handleTriggerSos}
            disabled={isTriggering}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-rose-700 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-rose-950/60 border border-rose-400/40 transition-all cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute w-6 h-6 rounded-full bg-white/20 animate-ping" />
            </div>
            <span>🚨 Dispatch Emergency SOS Distress Beacon to Authorities</span>
          </button>

          {/* Network Simulator Option for Testing Auto-Retry */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <SignalLow className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Poor / Offline Connectivity:</span>
            </span>
            <button
              onClick={() => handleToggleSimulatedNetwork(!simulatePoorNetwork)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                simulatePoorNetwork
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {simulatePoorNetwork ? 'Weak Signal ON' : 'Normal Network'}
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: TRANSMITTING INITIAL ATTEMPT */}
      {status === 'transmitting' && (
        <div className="space-y-3 p-3.5 rounded-xl bg-black/40 border border-rose-500/40 animate-pulse">
          <div className="flex items-center justify-between text-xs font-bold text-rose-300">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Transmitting Distress Packet with GPS Coordinates...</span>
            </span>
            <span className="font-mono text-[11px] bg-rose-950 px-2 py-0.5 rounded border border-rose-600/50">
              Attempt {dispatchState?.attempts || 1} of {dispatchState?.maxAttempts || 5}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full animate-[shimmer_1.5s_infinite] w-3/4" />
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Contacting National Cyber Coordination Centre (1930) &amp; ERSS Emergency Gateway. If signal drops, auto-retry will engage automatically.
          </p>
        </div>
      )}

      {/* STATE 3: RETRYING AFTER NETWORK FAILURE (AUTO-RETRY MECHANISM ACTIVE) */}
      {status === 'retrying' && dispatchState && (
        <div className="space-y-3.5 p-4 rounded-xl bg-black/60 border border-amber-500/60 animate-in fade-in">
          {/* Failure Alert Banner */}
          <div className="flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="flex-1">
              <span className="font-bold text-amber-200 block">
                Network Request Failed Due to Poor Connectivity:
              </span>
              <p className="text-[11px] text-amber-300/90 mt-0.5 leading-snug">
                {dispatchState.lastError || 'Cellular data signal dropped or timed out.'}
              </p>
            </div>
          </div>

          {/* Active Auto-Retry Countdown Display */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
                {dispatchState.retryCountdownSeconds}s
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Auto-Retrying Resend in {dispatchState.retryCountdownSeconds} seconds...
                </span>
                <span className="text-[10px] text-amber-200/80 font-mono">
                  Exponential Backoff · Attempt {dispatchState.attempts} of {dispatchState.maxAttempts}
                </span>
              </div>
            </div>

            {/* Manual Retry Now Button */}
            <button
              onClick={handleRetryNow}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Now</span>
            </button>
          </div>

          {/* Background Network Reconnect Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-white/5 p-2 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              Listening for network recovery: Transmission will fire instantly if signal returns before countdown ends.
            </span>
          </div>

          {/* ZERO-DATA FAIL-SAFE FALLBACK OPTIONS */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span>Zero-Data Emergency Fallback (Immediate):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Fallback 1: SMS to Police 112 with GPS */}
              <a
                href={`sms:112?body=${encodeURIComponent(dispatchState.distressText)}`}
                className="py-2 px-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Send prefilled distress SMS to Police 112 with GPS"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send SMS 112 with GPS</span>
              </a>

              {/* Fallback 2: Direct Call 1930 */}
              <a
                href="tel:1930"
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                title="Direct call to National Cyber Crime 1930"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct Dial 1930</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* STATE 4: DELIVERED CONFIRMATION */}
      {status === 'delivered' && dispatchState && (
        <div className="space-y-3.5 p-4 rounded-xl bg-black/60 border border-emerald-500/60 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-emerald-300 text-sm">
                  Distress Beacon Successfully Delivered!
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                  {dispatchState.deliveredAt}
                </span>
              </div>

              <p className="text-xs text-slate-200 mt-1 leading-snug">
                Emergency distress message and attached GPS coordinates received and acknowledged by emergency cyber response relay.
              </p>

              <div className="mt-2.5 p-2 bg-emerald-950/60 rounded-lg border border-emerald-500/30 font-mono text-xs text-emerald-200 flex items-center justify-between">
                <span>Dispatch Ack Ref: <strong>#{dispatchState.ackId}</strong></span>
                <span className="text-[10px] text-slate-400">Total Attempts: {dispatchState.attempts}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Incident proof permanently saved to Evidence Locker.
            </span>
            <button
              onClick={handleCancel}
              className="text-xs text-emerald-300 hover:text-white font-bold underline cursor-pointer"
            >
              Send Another Distress Beacon
            </button>
          </div>
        </div>
      )}

      {/* STATE 5: FAILED AFTER ALL RETRIES EXHAUSTED */}
      {status === 'failed' && dispatchState && (
        <div className="space-y-3 p-4 rounded-xl bg-rose-950/90 border border-rose-500 text-xs">
          <div className="flex items-center gap-2 text-rose-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Exceeded {dispatchState.maxAttempts} Network Resend Attempts</span>
          </div>
          <p className="text-slate-200 text-[11px] leading-relaxed">
            Internet connectivity appears completely offline or blocked in your area. Use direct cellular channels immediately:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`sms:112?body=${encodeURIComponent(dispatchState.distressText)}`}
              className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-center flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS 112 with GPS</span>
            </a>
            <a
              href="tel:1930"
              className="py-2.5 px-3 bg-white text-slate-950 font-bold rounded-lg text-center flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Call 1930 Now</span>
            </a>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRetryNow}
              className="text-xs text-amber-300 hover:text-white underline font-semibold cursor-pointer"
            >
              Try Resending Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
