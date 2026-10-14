import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  MessageSquare,
  ArrowRight,
  Filter,
  Camera,
  PlusCircle,
  Radio,
  Layers,
  Globe,
  Smartphone,
  Copy,
  Check,
  Phone,
  IndianRupee,
  MapPin,
  Clock,
  Shield,
  Eye,
  X,
  Users,
  Video,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { SCAM_PATTERNS, ScamPattern } from '../data/scamsData';
import { ReportedScam, INITIAL_USER_REPORTS } from '../data/reportedScamsData';
import { VIDEO_MODULES, VideoModule } from '../data/educationalVideosData';
import { AudioTranscriber } from './AudioTranscriber';
import { ReportScam } from './ReportScam';

interface ScamDatabaseProps {
  onOpenSos: () => void;
  onGoToPostFraud: () => void;
  onGoToLegal?: () => void;
  onOpenMitigationPlan?: (scam?: ScamPattern) => void;
}

const STORAGE_KEY = 'cyber_reported_scams_v1';

export const ScamDatabase: React.FC<ScamDatabaseProps> = ({ 
  onOpenSos, 
  onGoToPostFraud, 
  onGoToLegal,
  onOpenMitigationPlan 
}) => {
  const [activeView, setActiveView] = useState<'catalog' | 'community' | 'report'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedThreat, setSelectedThreat] = useState<string>('All');
  const [activeScam, setActiveScam] = useState<ScamPattern | null>(null);

  // Recommended Video Explainer Modal State
  const [activeVideoModal, setActiveVideoModal] = useState<VideoModule | null>(null);
  const [videoModalStepIndex, setVideoModalStepIndex] = useState(0);

  // Community Database State
  const [communityReports, setCommunityReports] = useState<ReportedScam[]>([]);
  const [communityEncounterFilter, setCommunityEncounterFilter] = useState<'all' | 'url' | 'message' | 'app'>('all');
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');
  const [activeCommunityReport, setActiveCommunityReport] = useState<ReportedScam | null>(null);
  const [inspectingScreenshot, setInspectingScreenshot] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [justReportedId, setJustReportedId] = useState<string | null>(null);
  const [reportingEncounterType, setReportingEncounterType] = useState<'url' | 'message' | 'app' | 'other'>('url');

  // Scam Message Inspector State
  const [inspectorText, setInspectorText] = useState('');
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiDeepAnalysis, setAiDeepAnalysis] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    riskLevel: 'Dangerous / Likely Scam' | 'Suspicious' | 'Safe / Inconclusive';
    detectedFlags: string[];
    matchingPatterns: string[];
    advice: string;
  } | null>(null);

  const categories = ['All', 'Banking & UPI', 'Impersonation & Threat', 'Job & Task', 'Investment', 'Extortion & Blackmail', 'Malware & Tech'];

  const getRecommendedVideosForScam = (scam: ScamPattern | null): VideoModule[] => {
    if (!scam) return VIDEO_MODULES.slice(0, 2);
    const lower = (scam.title + ' ' + scam.category + ' ' + scam.summary).toLowerCase();
    if (lower.includes('digital arrest') || lower.includes('police') || lower.includes('cbi') || lower.includes('skype')) {
      return VIDEO_MODULES.filter((v) => v.id === 'vid-digital-arrest' || v.id === 'vid-ai-voice-cloning');
    }
    if (lower.includes('upi') || lower.includes('bank') || lower.includes('qr') || lower.includes('debit') || lower.includes('kyc')) {
      return VIDEO_MODULES.filter((v) => v.id === 'vid-upi-rules' || v.id === 'vid-phishing-fake-sites');
    }
    if (lower.includes('apk') || lower.includes('remote') || lower.includes('anydesk') || lower.includes('electricity') || lower.includes('trojan')) {
      return VIDEO_MODULES.filter((v) => v.id === 'vid-remote-screen-share' || v.id === 'vid-electricity-bill-fraud');
    }
    if (lower.includes('job') || lower.includes('telegram') || lower.includes('task') || lower.includes('trading') || lower.includes('investment') || lower.includes('part-time')) {
      return VIDEO_MODULES.filter((v) => v.id === 'vid-task-telegram-scam' || v.id === 'vid-investment-trading-scam');
    }
    if (lower.includes('sextortion') || lower.includes('video call') || lower.includes('blackmail') || lower.includes('intimate')) {
      return VIDEO_MODULES.filter((v) => v.id === 'vid-sextortion-defense' || v.id === 'vid-ai-voice-cloning');
    }
    return VIDEO_MODULES.slice(0, 2);
  };

  // Load Community Reports from LocalStorage & Listen for Live Reports
  const loadCommunityReports = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCommunityReports(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USER_REPORTS));
        setCommunityReports(INITIAL_USER_REPORTS);
      }
    } catch {
      setCommunityReports(INITIAL_USER_REPORTS);
    }
  };

  useEffect(() => {
    loadCommunityReports();

    const handleScamReported = (e: any) => {
      loadCommunityReports();
      if (e.detail?.id) {
        setJustReportedId(e.detail.id);
      }
    };

    window.addEventListener('cyber_scam_reported', handleScamReported);
    return () => {
      window.removeEventListener('cyber_scam_reported', handleScamReported);
    };
  }, []);

  const triggerAiDeepScan = async () => {
    if (!inspectorText.trim()) return;
    setIsAiScanning(true);
    try {
      const res = await fetch('/api/scams/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: inspectorText }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAiDeepAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to run AI deep scan:', err);
    } finally {
      setIsAiScanning(false);
    }
  };

  const filteredScams = useMemo(() => {
    return SCAM_PATTERNS.filter((scam) => {
      const matchesCategory = selectedCategory === 'All' || scam.category === selectedCategory;
      const matchesThreat = selectedThreat === 'All' || scam.threatLevel === selectedThreat;
      const query = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !query ||
        scam.title.toLowerCase().includes(query) ||
        scam.summary.toLowerCase().includes(query) ||
        scam.modusOperandi.some((step) => step.toLowerCase().includes(query)) ||
        scam.redFlags.some((flag) => flag.toLowerCase().includes(query)) ||
        scam.sampleMessages.some((msg) => msg.toLowerCase().includes(query));

      return matchesCategory && matchesThreat && matchesQuery;
    });
  }, [searchQuery, selectedCategory, selectedThreat]);

  // Filtered Community Reports
  const filteredCommunityReports = useMemo(() => {
    return communityReports.filter((report) => {
      const matchesFilter =
        communityEncounterFilter === 'all' ||
        report.encounterType === communityEncounterFilter ||
        (communityEncounterFilter === 'url' && Boolean(report.fraudUrl)) ||
        (communityEncounterFilter === 'message' && Boolean(report.messageText || report.senderId)) ||
        (communityEncounterFilter === 'app' && Boolean(report.appName || report.appPackage));

      const query = communitySearchQuery.toLowerCase().trim();
      if (!query) return matchesFilter;

      const matchesQuery =
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        (report.fraudUrl && report.fraudUrl.toLowerCase().includes(query)) ||
        (report.messageText && report.messageText.toLowerCase().includes(query)) ||
        (report.senderId && report.senderId.toLowerCase().includes(query)) ||
        (report.appName && report.appName.toLowerCase().includes(query)) ||
        (report.appPackage && report.appPackage.toLowerCase().includes(query)) ||
        (report.scammerContact && report.scammerContact.toLowerCase().includes(query)) ||
        report.city.toLowerCase().includes(query) ||
        report.detectedThreatFlags.some((f) => f.toLowerCase().includes(query));

      return matchesFilter && matchesQuery;
    });
  }, [communityReports, communityEncounterFilter, communitySearchQuery]);

  // Counts for Community Database tabs
  const urlReportsCount = useMemo(
    () => communityReports.filter((r) => r.encounterType === 'url' || Boolean(r.fraudUrl)).length,
    [communityReports]
  );
  const messageReportsCount = useMemo(
    () => communityReports.filter((r) => r.encounterType === 'message' || Boolean(r.messageText || r.senderId)).length,
    [communityReports]
  );
  const appReportsCount = useMemo(
    () => communityReports.filter((r) => r.encounterType === 'app' || Boolean(r.appName || r.appPackage)).length,
    [communityReports]
  );

  // Run Rule-based Heuristic Analyzer on Pasted Text
  const analyzeMessage = () => {
    if (!inspectorText.trim()) return;

    const lower = inspectorText.toLowerCase();
    const flags: string[] = [];
    const matched: string[] = [];

    // Check 1: Digital arrest / authority threats
    if (
      lower.includes('cbi') ||
      lower.includes('police') ||
      lower.includes('customs') ||
      lower.includes('narcotics') ||
      lower.includes('parcel') ||
      lower.includes('arrest warrant') ||
      lower.includes('supreme court') ||
      lower.includes('skype') ||
      lower.includes('mumbai police')
    ) {
      flags.push('Law Enforcement / CBI Impersonation');
      matched.push('Digital Arrest & Fake Police Notice');
    }

    // Check 2: Banking / UPI / KYC Suspension
    if (
      lower.includes('kyc') ||
      lower.includes('pan card') ||
      lower.includes('yono') ||
      lower.includes('account suspended') ||
      lower.includes('debit card block') ||
      lower.includes('sbi') ||
      lower.includes('otp') ||
      lower.includes('qr code')
    ) {
      flags.push('Banking KYC & Fake Suspension Trap');
      matched.push('SBI YONO & Bank Account KYC Suspension SMS');
    }

    // Check 3: Part-Time Job / Telegram Tasks
    if (
      lower.includes('telegram') ||
      lower.includes('part-time job') ||
      lower.includes('youtube like') ||
      lower.includes('daily earn') ||
      lower.includes('rating task') ||
      lower.includes('hotel review')
    ) {
      flags.push('High-Return Daily Task / Ponzi Hook');
      matched.push('Telegram Part-Time Job & YouTube Review Fraud');
    }

    // Check 4: Remote App Installation
    if (
      lower.includes('apk') ||
      lower.includes('anydesk') ||
      lower.includes('teamviewer') ||
      lower.includes('rustdesk') ||
      lower.includes('quicksupport') ||
      lower.includes('electricity') ||
      lower.includes('disconnected')
    ) {
      flags.push('Malicious APK / Remote Screen Access Hook');
      matched.push('Fake APK & Electricity Bill Disconnection Fraud');
    }

    // Check 5: Extortion & Blackmail
    if (
      lower.includes('video call') ||
      lower.includes('morphed') ||
      lower.includes('viral') ||
      lower.includes('facebook friend') ||
      lower.includes('leak') ||
      lower.includes('loan app')
    ) {
      flags.push('Extortion / Social Media Shaming Coercion');
      matched.push('Sextortion & WhatsApp Video Call Blackmail');
    }

    // Check 6: Urgency & Panic Triggers
    if (
      lower.includes('urgent') ||
      lower.includes('within 2 hours') ||
      lower.includes('tonight') ||
      lower.includes('immediately') ||
      lower.includes('blocked') ||
      lower.includes('expire')
    ) {
      flags.push('Engineered Panic & Artificial Time Pressure');
    }

    let riskLevel: 'Dangerous / Likely Scam' | 'Suspicious' | 'Safe / Inconclusive' = 'Safe / Inconclusive';
    let advice = 'No major automated red flags detected, but exercise vigilance. Never share passwords or OTPs.';

    if (flags.length >= 2 || matched.length >= 1) {
      riskLevel = 'Dangerous / Likely Scam';
      advice =
        'DO NOT CLICK ANY LINKS OR RESPOND! This message exhibits classic high-threat fraud patterns. Disconnect communication and block the sender.';
    } else if (flags.length === 1) {
      riskLevel = 'Suspicious';
      advice =
        'Be extremely cautious. Verify independently with official customer service before clicking any links or sending money.';
    }

    setAnalysisResult({
      riskLevel,
      detectedFlags: flags,
      matchingPatterns: Array.from(new Set(matched)),
      advice
    });
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openReportWithEncounter = (type: 'url' | 'message' | 'app') => {
    setReportingEncounterType(type);
    setActiveView('report');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Mode Switcher: Catalog vs Community vs Report */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap sm:flex-nowrap items-center gap-1.5 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveView('catalog')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeView === 'catalog'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Catalog &amp; AI Inspector</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('community')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
            activeView === 'community'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Community Database</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black tracking-wider ${
              activeView === 'community' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {communityReports.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setReportingEncounterType('url');
            setActiveView('report');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
            activeView === 'report'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Report New Scam</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        </button>
      </div>

      {/* VIEW 1: REPORT SCAM FORM (SUBMIT SUSPICIOUS URL / MESSAGE / APP) */}
      {activeView === 'report' ? (
        <ReportScam
          onOpenSos={onOpenSos}
          onGoToLegal={onGoToLegal}
          onViewCommunityDatabase={() => setActiveView('community')}
          onOpenMitigationPlan={(scenario) => {
            const matched = SCAM_PATTERNS.find(
              (p) =>
                p.category.toLowerCase().includes(scenario?.toLowerCase() || '') ||
                p.title.toLowerCase().includes(scenario?.toLowerCase() || '')
            );
            onOpenMitigationPlan?.(matched || SCAM_PATTERNS[0]);
          }}
          initialEncounterType={reportingEncounterType}
          onClose={() => setActiveView('catalog')}
        />
      ) : activeView === 'community' ? (
        /* VIEW 2: CITIZEN COMMUNITY DATABASE OF REPORTED SCAMS */
        <div className="space-y-6">
          {/* Header Banner & Live Intelligence Metrics */}
          <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-800/40 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Citizen Defense Network · Live Intelligence Feed</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Citizen-Reported Scam Database
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Real-time crowdsourced repository of suspicious URLs, deceptive messages, and fraudulent app encounters reported by citizens across India to protect the community.
                </p>
              </div>

              {/* Primary Report Trigger */}
              <button
                type="button"
                onClick={() => openReportWithEncounter('url')}
                className="shrink-0 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-rose-950/40 group self-start"
              >
                <PlusCircle className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
                <span>Submit Scam to Database</span>
              </button>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-slate-400 text-[11px]">Total Community Reports</div>
                <div className="text-lg font-black text-white mt-0.5">{communityReports.length}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-indigo-300 text-[11px] flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-400" />
                  <span>Suspicious URLs</span>
                </div>
                <div className="text-lg font-black text-indigo-200 mt-0.5">{urlReportsCount}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-purple-300 text-[11px] flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-purple-400" />
                  <span>Deceptive Messages</span>
                </div>
                <div className="text-lg font-black text-purple-200 mt-0.5">{messageReportsCount}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-rose-300 text-[11px] flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-rose-400" />
                  <span>Malicious Apps &amp; APKs</span>
                </div>
                <div className="text-lg font-black text-rose-200 mt-0.5">{appReportsCount}</div>
              </div>
            </div>
          </section>

          {/* Quick Encounter Report Shortcut Bar */}
          <section className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Have you encountered a threat? Submit details:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => openReportWithEncounter('url')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Report Suspicious URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => openReportWithEncounter('message')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                  <span>Report Deceptive Message</span>
                </button>
                <button
                  type="button"
                  onClick={() => openReportWithEncounter('app')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Report Fraudulent App</span>
                </button>
              </div>
            </div>
          </section>

          {/* Search Bar & Encounter Filters */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search community reports by URL, message text, APK name, phone number, city, or threat flags..."
                value={communitySearchQuery}
                onChange={(e) => setCommunitySearchQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
              {communitySearchQuery && (
                <button
                  type="button"
                  onClick={() => setCommunitySearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
              <button
                type="button"
                onClick={() => setCommunityEncounterFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  communityEncounterFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Community Encounters ({communityReports.length})
              </button>

              <button
                type="button"
                onClick={() => setCommunityEncounterFilter('url')}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  communityEncounterFilter === 'url'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Suspicious URLs ({urlReportsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setCommunityEncounterFilter('message')}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  communityEncounterFilter === 'message'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Deceptive Messages ({messageReportsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setCommunityEncounterFilter('app')}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  communityEncounterFilter === 'app'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Fraudulent Apps &amp; APKs ({appReportsCount})</span>
              </button>
            </div>
          </section>

          {/* Community Reports Feed Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing {filteredCommunityReports.length} citizen threat reports</span>
              <span>Click any card to examine forensic details &amp; evidence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunityReports.map((report) => {
                const isJustReported = report.id === justReportedId;
                const encounterBadge =
                  report.encounterType === 'url' || report.fraudUrl
                    ? { label: 'Suspicious URL', icon: Globe, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' }
                    : report.encounterType === 'message' || report.messageText || report.senderId
                    ? { label: 'Deceptive Message', icon: MessageSquare, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
                    : report.encounterType === 'app' || report.appName || report.appPackage
                    ? { label: 'Fraudulent App / APK', icon: Smartphone, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
                    : { label: 'Cyber Threat', icon: ShieldAlert, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };

                const EncounterIcon = encounterBadge.icon;

                return (
                  <div
                    key={report.id}
                    onClick={() => setActiveCommunityReport(report)}
                    className={`p-5 bg-white rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                      isJustReported
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Top Metadata Row */}
                      <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] border ${encounterBadge.bg} ${encounterBadge.text} ${encounterBadge.border}`}>
                            <EncounterIcon className="w-3 h-3" />
                            <span>{encounterBadge.label}</span>
                          </span>
                          {isJustReported && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                              Just Reported
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{report.city}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold text-rose-600">{report.riskScore}/100</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {report.title}
                      </h3>

                      {/* Narrative */}
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {report.description}
                      </p>

                      {/* Encounter-Specific Forensics Showcase */}
                      {report.fraudUrl && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="font-mono text-slate-800 truncate text-[11px]">{report.fraudUrl}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(report.fraudUrl!, `url-${report.id}`);
                            }}
                            className="shrink-0 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy malicious URL"
                          >
                            {copiedId === `url-${report.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {report.messageText && (
                        <div className="mt-3 p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/80 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-bold text-purple-900 mb-1">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-purple-600" />
                              <span>Sender: {report.senderId || 'Unknown Header'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyText(report.messageText!, `msg-${report.id}`);
                              }}
                              className="text-purple-700 hover:text-purple-950 p-0.5 cursor-pointer"
                              title="Copy message snippet"
                            >
                              {copiedId === `msg-${report.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="font-mono text-[11px] text-slate-800 line-clamp-2 italic">
                            "{report.messageText}"
                          </p>
                        </div>
                      )}

                      {report.appName && (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/80 text-xs space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-rose-900">
                            <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                            <span>Malicious App: {report.appName}</span>
                          </div>
                          {report.appPermissions && report.appPermissions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {report.appPermissions.slice(0, 3).map((perm, idx) => (
                                <span key={idx} className="px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded text-[10px] font-medium">
                                  {perm}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Scammer identifiers & loss */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {report.scammerContact && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{report.scammerContact}</span>
                          </span>
                        )}
                        {report.amountLost && (
                          <span className="flex items-center gap-1 text-[11px] text-rose-700 font-semibold">
                            <IndianRupee className="w-3 h-3" />
                            <span>{report.amountLost}</span>
                          </span>
                        )}
                      </div>

                      {/* Detected Threat Flags */}
                      {report.detectedThreatFlags && report.detectedThreatFlags.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1 text-xs">
                          {report.detectedThreatFlags.slice(0, 3).map((flag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium border border-slate-200">
                              ✓ {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{report.id}</span>
                      <div className="flex items-center gap-2">
                        {onOpenMitigationPlan && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const matched = SCAM_PATTERNS.find(
                                (p) =>
                                  p.category.toLowerCase().includes(report.category.toLowerCase()) ||
                                  p.title.toLowerCase().includes(report.title.toLowerCase())
                              );
                              onOpenMitigationPlan(matched || SCAM_PATTERNS[0]);
                            }}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Launch mitigation plan for this scam"
                          >
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Mitigate</span>
                          </button>
                        )}
                        <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                          Inspect Evidence <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCommunityReports.length === 0 && (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <p className="text-xs text-slate-500">
                  No citizen scam reports found matching "{communitySearchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => openReportWithEncounter('url')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Be the First to Report This Threat</span>
                </button>
              </div>
            )}
          </section>

          {/* Modal for Inspecting Community Report Details */}
          {activeCommunityReport && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
                <div className="p-5 bg-slate-900 text-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono font-bold text-amber-300">{activeCommunityReport.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeCommunityReport.city}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-rose-400 font-bold">{activeCommunityReport.riskScore}/100 Risk</span>
                    </div>
                    <button
                      onClick={() => setActiveCommunityReport(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1.5">{activeCommunityReport.title}</h2>
                  <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/10 rounded font-semibold">{activeCommunityReport.category}</span>
                    <span>Status: {activeCommunityReport.status}</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                      Incident Summary &amp; Modus Operandi
                    </h4>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {activeCommunityReport.description}
                    </p>
                  </div>

                  {/* Indicators of Compromise (IOCs) */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Technical Indicators of Compromise (IOCs)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeCommunityReport.fraudUrl && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px] mb-0.5">Suspicious Target URL</span>
                          <span className="font-mono text-indigo-700 font-bold break-all">{activeCommunityReport.fraudUrl}</span>
                        </div>
                      )}
                      {activeCommunityReport.scammerContact && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px] mb-0.5">Scammer Contact / Account</span>
                          <span className="font-mono text-slate-800 font-bold">{activeCommunityReport.scammerContact}</span>
                        </div>
                      )}
                      {activeCommunityReport.appName && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px] mb-0.5">Malicious App / Package</span>
                          <span className="font-mono text-rose-700 font-bold">{activeCommunityReport.appName}</span>
                        </div>
                      )}
                      {activeCommunityReport.amountLost && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px] mb-0.5">Financial Loss / Extortion Demand</span>
                          <span className="text-rose-700 font-bold">{activeCommunityReport.amountLost}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Screenshot Preview */}
                  {activeCommunityReport.screenshotUrl && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                        Attached Digital Evidence Screenshot
                      </h4>
                      <div
                        onClick={() => setInspectingScreenshot(activeCommunityReport.screenshotUrl)}
                        className="rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-slate-950 flex items-center justify-center cursor-pointer group relative"
                      >
                        <img
                          src={activeCommunityReport.screenshotUrl}
                          alt="Screenshot evidence"
                          className="max-h-56 w-auto object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>Click to Inspect Full-Size Evidence</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Threat Flags */}
                  {activeCommunityReport.detectedThreatFlags && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                        Identified Cyber Crime Red Flags
                      </h4>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {activeCommunityReport.detectedThreatFlags.map((flag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-semibold">
                            ✓ {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const text = `Citizen Scam Dossier ${activeCommunityReport.id}\nCategory: ${activeCommunityReport.category}\nURL: ${activeCommunityReport.fraudUrl || 'N/A'}\nContact: ${activeCommunityReport.scammerContact || 'N/A'}\nDetails: ${activeCommunityReport.description}`;
                      handleCopyText(text, activeCommunityReport.id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === activeCommunityReport.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === activeCommunityReport.id ? 'Copied Dossier!' : 'Copy Dossier'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {onOpenMitigationPlan && (
                      <button
                        onClick={() => {
                          const matched = SCAM_PATTERNS.find(
                            (p) =>
                              p.category.toLowerCase().includes(activeCommunityReport.category.toLowerCase()) ||
                              p.title.toLowerCase().includes(activeCommunityReport.title.toLowerCase())
                          );
                          setActiveCommunityReport(null);
                          onOpenMitigationPlan(matched || SCAM_PATTERNS[0]);
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                        <span>Launch Mitigation Plan</span>
                      </button>
                    )}
                    <button
                      onClick={onOpenSos}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Dial 1930 Helpline
                    </button>
                    <button
                      onClick={() => setActiveCommunityReport(null)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 3: POLICE MODUS OPERANDI CATALOG & AI INSPECTOR */
        <>
          {/* Search Header */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                  <span>Citizen Knowledge Base</span>
                  <span aria-hidden="true">·</span>
                  <span>Verified Police Modus Operandi Catalog</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Searchable Database of Scam Patterns
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Unmask how cyber syndicates script their attacks. Explore detailed breakdowns of tactics, red flags to look out for, authentic deceptive scripts, and legal countermeasures.
                </p>
              </div>

              {/* Quick Trigger to Report Scam */}
              <button
                type="button"
                onClick={() => openReportWithEncounter('url')}
                className="shrink-0 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
              >
                <Camera className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Report New Scam</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </button>
            </div>

            {/* Search Bar & Threat Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by keyword, e.g., 'CBI', 'Electricity bill', 'QR Code', 'Telegram job', 'AnyDesk'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                <select
                  value={selectedThreat}
                  onChange={(e) => setSelectedThreat(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="All">All Threat Levels</option>
                  <option value="Critical">Critical Threat</option>
                  <option value="High">High Threat</option>
                  <option value="Medium">Medium Threat</option>
                </select>
              </div>
            </div>

            {/* Category Pills (Interactive Filter Tabs) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-100 mt-4 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Recommended Threat Defense Video Walkthroughs */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Video className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-bold">
                    <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span>Essential Crime Prevention Storyboards</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Recommended Scam Deconstruction Videos
                  </h3>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Tap to watch step-by-step interactive screen simulations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {[
                VIDEO_MODULES.find((v) => v.id === 'vid-digital-arrest')!,
                VIDEO_MODULES.find((v) => v.id === 'vid-upi-rules')!,
                VIDEO_MODULES.find((v) => v.id === 'vid-remote-screen-share')!,
                VIDEO_MODULES.find((v) => v.id === 'vid-electricity-bill-fraud')!,
              ]
                .filter(Boolean)
                .map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => {
                      setActiveVideoModal(mod);
                      setVideoModalStepIndex(0);
                    }}
                    className="p-3.5 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                        <span className="font-semibold text-indigo-600">{mod.category}</span>
                        <span className="font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-[9px]">
                          {mod.duration}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">
                        {mod.videoStoryboard.length} Scenes
                      </span>
                      <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                        <Play className="w-3 h-3 fill-indigo-600" />
                        <span>Watch Simulation</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Scam Message Inspector / Red Flag Checker */}
          <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-900/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Instant Scam Pattern Inspector</span>
                </div>
                <h2 className="text-lg font-bold text-white">Received a Suspicious SMS, WhatsApp Message, or Email?</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Paste the exact text below to test it against known cyber fraud scripts and detect covert extortion hooks or deceptive payment requests.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <textarea
                rows={3}
                placeholder="Paste suspicious SMS, Telegram job offer, or courier warning here..."
                value={inspectorText}
                onChange={(e) => setInspectorText(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AudioTranscriber
                    buttonLabel="Dictate / Record Suspicious Call"
                    onTranscribeComplete={(transcribed) => {
                      setInspectorText((prev) => (prev ? `${prev}\n${transcribed}` : transcribed));
                    }}
                  />
                  <button
                    type="button"
                    onClick={analyzeMessage}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Run Red Flag Check</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={triggerAiDeepScan}
                    disabled={isAiScanning || !inspectorText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiScanning ? 'Gemini Analyzing...' : 'Deep AI Threat Intelligence'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inspector Output */}
            {(analysisResult || aiDeepAnalysis) && (
              <div className="mt-4 p-4 rounded-xl bg-white text-slate-900 space-y-3 text-xs border border-slate-200 animate-in fade-in duration-200">
                {analysisResult && (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Pattern Verdict:</span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            analysisResult.riskLevel.includes('Dangerous')
                              ? 'bg-rose-100 text-rose-800'
                              : analysisResult.riskLevel.includes('Suspicious')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {analysisResult.riskLevel}
                        </span>
                      </div>
                    </div>

                    <p className="font-semibold text-slate-800">{analysisResult.advice}</p>

                    {analysisResult.detectedFlags.length > 0 && (
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Detected Red Flags:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                          {analysisResult.detectedFlags.map((flag, idx) => (
                            <li key={idx}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.matchingPatterns.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <span className="text-slate-500">Matches Known Pattern:</span>
                        <span className="font-bold text-indigo-700">
                          {analysisResult.matchingPatterns.join(', ')}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {aiDeepAnalysis && (
                  <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50 p-3.5 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Gemini Threat Intelligence Briefing</span>
                    </div>
                    <div className="text-slate-800 leading-relaxed whitespace-pre-line font-mono text-[11px]">
                      {aiDeepAnalysis}
                    </div>
                  </div>
                )}

                {onOpenMitigationPlan && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        const matched = analysisResult?.matchingPatterns?.[0]
                          ? SCAM_PATTERNS.find((s) =>
                              s.title.toLowerCase().includes(analysisResult.matchingPatterns[0].toLowerCase())
                            )
                          : null;
                        onOpenMitigationPlan(matched || undefined);
                      }}
                      className="w-full py-2 px-3 bg-gradient-to-r from-rose-600 via-indigo-600 to-slate-900 hover:from-rose-500 hover:via-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-300" />
                      <span>Identified This Scam? Launch Step-by-Step Mitigation Plan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/80" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Scam Patterns Cards Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing {filteredScams.length} documented scam patterns</span>
              <span>Click any card to read full anatomy &amp; script</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScams.map((scam) => (
                <div
                  key={scam.id}
                  onClick={() => setActiveScam(scam)}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span>{scam.category}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          scam.threatLevel === 'Critical'
                            ? 'text-rose-600 font-bold'
                            : scam.threatLevel === 'High'
                            ? 'text-amber-600 font-semibold'
                            : 'text-slate-600'
                        }
                      >
                        {scam.threatLevel} Threat
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {scam.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {scam.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                    <span className="text-slate-400 truncate max-w-[140px]">Target: {scam.victimProfile}</span>
                    <div className="flex items-center gap-2">
                      {onOpenMitigationPlan && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMitigationPlan(scam);
                          }}
                          className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Launch step-by-step mitigation plan for this threat"
                        >
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          <span>Mitigate</span>
                        </button>
                      )}
                      <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        View Anatomy <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredScams.length === 0 && (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No scam patterns match your search query "{searchQuery}". Try searching for broader terms like "Bank", "Police", or "SMS".
              </div>
            )}
          </section>

          {/* Detailed Scam Modal */}
          {activeScam && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
              <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="p-5 bg-slate-900 text-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{activeScam.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-rose-400 font-bold">{activeScam.threatLevel} Threat</span>
                    </div>
                    <button
                      onClick={() => setActiveScam(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">{activeScam.title}</h2>
                  <p className="text-xs text-slate-300 mt-1">Target Audience: {activeScam.victimProfile}</p>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
                  {/* Summary */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Overview</h4>
                    <p className="text-slate-700 leading-relaxed">{activeScam.summary}</p>
                  </div>

                  {/* Modus Operandi */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Anatomy of the Scam (Step-by-Step Script)
                    </h4>
                    <div className="space-y-2">
                      {activeScam.modusOperandi.map((step, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800 leading-relaxed text-xs">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Red Flags */}
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Crucial Red Flags</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-950">
                      {activeScam.redFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold mt-0.5">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Authentic Messages */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                      <span>Real Message / Script Examples</span>
                    </h4>
                    <div className="space-y-2">
                      {activeScam.sampleMessages.map((msg, idx) => (
                        <div key={idx} className="p-3 bg-slate-100 rounded-lg font-mono text-xs text-slate-800 border-l-2 border-indigo-500">
                          {msg}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Video Walkthrough & Storyboard Simulation */}
                  {(() => {
                    const recVideos = getRecommendedVideosForScam(activeScam);
                    if (recVideos.length === 0) return null;
                    const primaryVideo = recVideos[0];
                    return (
                      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl border border-indigo-800/60 text-white space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-indigo-400" />
                            <span className="font-bold text-indigo-300 uppercase tracking-wider text-[11px]">
                              Recommended Video Explainer &amp; Simulation
                            </span>
                          </div>
                          <span className="font-mono text-[10px] bg-black/50 px-2 py-0.5 rounded text-slate-300">
                            {primaryVideo.duration}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {primaryVideo.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                            {primaryVideo.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                          <span className="text-[11px] text-amber-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate max-w-[280px]">{primaryVideo.keyTakeaways[0]}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveVideoModal(primaryVideo);
                              setVideoModalStepIndex(0);
                            }}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Watch Video Simulation</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Immediate Steps */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Immediate Defensive Countermeasures</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-950">
                      {activeScam.immediateSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal Sections */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span>Applicable Indian Legal Sections</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {activeScam.legalSections.map((sec, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveScam(null);
                      onGoToPostFraud();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    Go to Post-Fraud Action
                  </button>
                  <div className="flex items-center gap-2">
                    {onOpenMitigationPlan && (
                      <button
                        onClick={() => {
                          const scamToMitigate = activeScam;
                          setActiveScam(null);
                          onOpenMitigationPlan(scamToMitigate);
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                        <span>Launch Mitigation Plan</span>
                      </button>
                    )}
                    <button
                      onClick={onOpenSos}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Dial 1930 Helpline
                    </button>
                    <button
                      onClick={() => setActiveScam(null)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Forensic Evidence Full-Size Inspector Modal (Shared across views) */}
      {inspectingScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-4 border border-slate-700 relative flex flex-col items-center">
            <button
              onClick={() => setInspectingScreenshot(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full text-left mb-3">
              <div className="text-xs font-mono text-rose-400 font-bold">
                INCIDENT EVIDENCE FORENSICS
              </div>
              <div className="text-sm font-bold text-white">
                Citizen Uploaded Evidence Snapshot
              </div>
            </div>

            <div className="w-full max-h-[70vh] overflow-auto rounded-xl bg-black border border-slate-800 flex items-center justify-center p-2">
              <img
                src={inspectingScreenshot}
                alt="Full Screenshot Evidence"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>Timestamp: {new Date().toLocaleDateString('en-IN')}</span>
              <button
                onClick={() => setInspectingScreenshot(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Video Storyboard Modal in ScamDatabase */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col my-auto max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {videoModalStepIndex + 1}/{activeVideoModal.videoStoryboard.length}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold">
                      {activeVideoModal.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeVideoModal.duration}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                    {activeVideoModal.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scene Player */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {(() => {
                const currentScene =
                  activeVideoModal.videoStoryboard[videoModalStepIndex] || activeVideoModal.videoStoryboard[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Left Narrative */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-xs font-semibold mb-2">
                          <span>Scene {currentScene.stepNumber}: {currentScene.title}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">
                          {currentScene.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                          {currentScene.description}
                        </p>
                      </div>

                      {currentScene.warningCallout && (
                        <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-100 block mb-0.5">Critical Warning</span>
                            <span>{currentScene.warningCallout}</span>
                          </div>
                        </div>
                      )}

                      {/* Stepper Dots & Player Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <div className="flex items-center gap-1.5">
                          {activeVideoModal.videoStoryboard.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setVideoModalStepIndex(i)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                videoModalStepIndex === i ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setVideoModalStepIndex(0)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                            title="Restart"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={videoModalStepIndex === 0}
                            onClick={() => setVideoModalStepIndex((prev) => Math.max(0, prev - 1))}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (videoModalStepIndex < activeVideoModal.videoStoryboard.length - 1) {
                                setVideoModalStepIndex((prev) => prev + 1);
                              } else {
                                setVideoModalStepIndex(0);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>{videoModalStepIndex === activeVideoModal.videoStoryboard.length - 1 ? 'Replay' : 'Next Scene'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Screen Simulation */}
                    <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center">
                      <div className="w-full max-w-[240px] bg-slate-900 rounded-[24px] border-[4px] border-slate-800 p-3 shadow-xl space-y-2">
                        <div className="w-12 h-2.5 bg-black rounded-full mx-auto" />
                        <div className="bg-slate-950 rounded-lg p-2.5 text-xs space-y-2 border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] text-slate-400 border-b border-slate-800 pb-1">
                            <span className="font-mono uppercase">{currentScene.screenSimulation.type} SIMULATION</span>
                            <span className="text-rose-400 font-bold">UNVERIFIED</span>
                          </div>
                          <div className="text-slate-200 font-bold text-[11px] truncate">
                            {currentScene.screenSimulation.senderOrTitle}
                          </div>
                          <p className="text-slate-300 font-mono text-[10px] leading-relaxed bg-slate-900/90 p-2 rounded border border-slate-800">
                            {currentScene.screenSimulation.body}
                          </p>
                          <div className="p-1.5 bg-rose-950/80 border border-rose-800/80 rounded text-center text-[9px] font-bold text-rose-300">
                            {currentScene.screenSimulation.actionText}
                          </div>
                        </div>
                        <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Key Takeaways */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Essential Takeaways &amp; Golden Rules</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {activeVideoModal.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Watching this walkthrough establishes psychological immunity.
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done Watching
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
