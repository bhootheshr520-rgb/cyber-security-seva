import React, { useState } from 'react';
import { Bell, ShieldAlert, AlertTriangle, ExternalLink, PlusCircle, Check, Send, Globe, Search, RefreshCw, Loader2, BellRing, Smartphone, Play } from 'lucide-react';
import { INITIAL_THREAT_ALERTS, ThreatAlert } from '../data/threatAlertsData';
import { RegionalThreatHeatmap } from './RegionalThreatHeatmap';

interface ThreatAlertsProps {
  onOpenSos: () => void;
  onOpenNotifications?: () => void;
  onSimulateBackground?: (seconds?: number) => void;
  onTriggerTestPush?: () => void;
  onOpenMitigationPlan?: (alert?: ThreatAlert) => void;
}

export const ThreatAlerts: React.FC<ThreatAlertsProps> = ({ 
  onOpenSos,
  onOpenNotifications,
  onSimulateBackground,
  onTriggerTestPush,
  onOpenMitigationPlan,
}) => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>(INITIAL_THREAT_ALERTS);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Live Threat Intelligence (Google Search Grounded) State
  const [liveSearchQuery, setLiveSearchQuery] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveIntelResult, setLiveIntelResult] = useState<{
    text: string;
    sources: { title: string; uri: string }[];
    queryUsed: string;
  } | null>(null);

  // New Alert Submission Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newAction, setNewAction] = useState('');

  const fetchLiveThreatIntel = async (customQuery?: string) => {
    setIsSearchingLive(true);
    const query = customQuery || liveSearchQuery || 'latest online cyber fraud scams India CERT-In alerts 2025 2026 digital arrest phishing';
    try {
      const res = await fetch('/api/threats/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) {
        setLiveIntelResult({
          text: data.text,
          sources: data.sources || [],
          queryUsed: query,
        });
      }
    } catch (err) {
      console.error('Failed to fetch live threat intel:', err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const created: ThreatAlert = {
      id: 'alert-user-' + Date.now().toString().slice(-4),
      title: newTitle,
      severity: 'High',
      agency: 'Citizen Community Verified Report',
      date: 'Just Now',
      description: newDesc,
      impactArea: newImpact || 'General Public',
      recommendedAction: newAction || 'Exercise caution. Do not click unverified links or transfer money.',
      advisoryCode: 'CITIZEN/ALERT/' + Math.floor(1000 + Math.random() * 9000)
    };

    setAlerts([created, ...alerts]);
    setNewTitle('');
    setNewDesc('');
    setNewImpact('');
    setNewAction('');
    setReportSuccess(true);
    setIsReporting(false);
    setTimeout(() => setReportSuccess(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-2">
              <Bell className="w-4 h-4" />
              <span>National Cyber Threat Advisory Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Threat Alerts & Cyber Advisories
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Curated intelligence bulletins from the Indian Cyber Crime Coordination Centre (I4C), CERT-In, and the Department of Telecommunications regarding actively circulating fraud waves.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsReporting(!isReporting)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{isReporting ? 'Close Report Form' : 'Report Emerging Scam'}</span>
            </button>
          </div>
        </div>

        {reportSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Thank you. Your scam report has been logged to the community alerts feed.</span>
          </div>
        )}
      </section>

      {/* Simulated Push Notification System Advisory Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-rose-950/70 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-rose-500/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center shrink-0 mt-0.5">
              <BellRing className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Real-Time Background Push Alerts
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">● LIVE SURVEILLANCE</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                Urgent Threat Push Advisory System
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                Receives high-severity cyber advisories (Digital Arrest, APK Trojans, Power Cutoff SMS) even when the app is minimized, locked, or running in the background.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onSimulateBackground && (
              <button
                onClick={() => onSimulateBackground(5)}
                className="px-3 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulate in Background (5s)</span>
              </button>
            )}

            {onTriggerTestPush && (
              <button
                onClick={onTriggerTestPush}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-rose-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 text-rose-400" />
                <span>Trigger Instant Push</span>
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-indigo-400" />
                <span>Notification Tray</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* D3.js Regional Cyber Threat Heatmap */}
      <RegionalThreatHeatmap onOpenSos={onOpenSos} />

      {/* Live Threat Intelligence Search Grounding Box */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Live Threat Intelligence (Google Search Grounded)</span>
            </div>
            <h2 className="text-lg font-bold text-white">Live Web Intelligence & Trending Threat Scanner</h2>
            <p className="text-xs text-slate-300">
              Query the open web for live government advisories, ongoing police busts, and brand new phishing campaigns reported in real-time.
            </p>
          </div>

          <button
            onClick={() => fetchLiveThreatIntel()}
            disabled={isSearchingLive}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-sm transition-all"
          >
            {isSearchingLive ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Web...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Fetch Current Threat Feed</span>
              </>
            )}
          </button>
        </div>

        {/* Custom Query Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search specific threat e.g. 'Electricity bill APK scam', 'Customs parcel arrest', 'TRAI IVR'..."
              value={liveSearchQuery}
              onChange={(e) => setLiveSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLiveThreatIntel(liveSearchQuery)}
              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            onClick={() => fetchLiveThreatIntel(liveSearchQuery)}
            disabled={isSearchingLive}
            className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors"
          >
            Search Live
          </button>
        </div>

        {/* Live Intel Results Display */}
        {liveIntelResult && (
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs text-slate-200 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-semibold text-emerald-400">
                Grounding Results for: "{liveIntelResult.queryUsed}"
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Live Google Search</span>
            </div>

            <p className="leading-relaxed whitespace-pre-line text-slate-100">
              {liveIntelResult.text}
            </p>

            {liveIntelResult.sources.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] text-slate-400 block mb-1 font-semibold">
                  Verified Intelligence Citations & Sources:
                </span>
                <div className="flex flex-wrap gap-2">
                  {liveIntelResult.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-black/40 hover:bg-black/60 border border-white/15 rounded-md text-[11px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{src.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Citizen Scam Report Submission Drawer */}
      {isReporting && (
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Submit an Active / Emerging Scam Pattern</h2>
              <p className="text-xs text-slate-500">
                Help other citizens spot newly circulating WhatsApp messages, spoofed portals, or phone scripts.
              </p>
            </div>
            <span className="text-xs text-slate-400">Anonymous & Publicly Helpful</span>
          </div>

          <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Scam Alert Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. New SMS claiming FASTag balance frozen with fake link"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target / Affected Group</label>
                <input
                  type="text"
                  placeholder="e.g. Vehicle owners, WhatsApp users"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recommended Countermeasure</label>
                <input
                  type="text"
                  placeholder="e.g. Check FASTag balance only in bank official app"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Detailed Modus Operandi & Message Script *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe how the scammer approached you, what fake website or phone number was used..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReporting(false)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                Publish Scam Alert
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Threat Alerts Bulletin List */}
      <section className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              {/* Unboxed metadata with typographic separators */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span
                  className={
                    alert.severity === 'Critical'
                      ? 'text-rose-600 font-bold'
                      : alert.severity === 'High'
                      ? 'text-amber-600 font-semibold'
                      : 'text-slate-600 font-medium'
                  }
                >
                  {alert.severity} Advisory
                </span>
                <span aria-hidden="true">·</span>
                <span>{alert.agency}</span>
                <span aria-hidden="true">·</span>
                <span>{alert.date}</span>
              </div>

              <span className="font-mono text-[11px] text-slate-400">
                Ref: {alert.advisoryCode}
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {alert.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {alert.description}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-700 shrink-0">Impacted Profile:</span>
                <span className="text-slate-600">{alert.impactArea}</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 shrink-0">Recommended Citizen Action:</span>
                <span className="text-slate-800 font-medium leading-relaxed">
                  {alert.recommendedAction}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 gap-2">
              <a
                href="https://sancharsaathi.gov.in/sfc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
              >
                Report Related Number on Chakshu Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {onOpenMitigationPlan && (
                  <button
                    type="button"
                    onClick={() => onOpenMitigationPlan(alert)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Mitigation Plan</span>
                  </button>
                )}
                <button
                  onClick={onOpenSos}
                  className="text-rose-600 hover:text-rose-700 font-semibold"
                >
                  SOS Helpline 1930
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

