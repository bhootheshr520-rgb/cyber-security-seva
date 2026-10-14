import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  ShieldAlert,
  Lock,
  Clock,
  ExternalLink,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
  WifiOff,
  HardDrive,
  Shield,
  HeartPulse,
  Phone,
  UserCheck,
  Building2,
  Radio,
  HelpCircle,
  Mic,
  MapPin,
  Navigation
} from 'lucide-react';
import { BANK_HOTLINES, BankHotline } from '../data/bankHotlinesData';
import { OneTouchVoiceRecorder, DistressVoiceRecord, GpsCoordinates } from './OneTouchVoiceRecorder';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEvidenceLocker: () => void;
  onGoToPostFraud: () => void;
  onOpenOfflineHub?: () => void;
}

interface HelplineItem {
  id: string;
  number: string;
  telUri: string;
  name: string;
  agency: string;
  description: string;
  badge: string;
  badgeColor: string;
  category: 'cyber' | 'police' | 'women' | 'trauma' | 'banking';
  themeColor: {
    bg: string;
    border: string;
    btn: string;
    text: string;
  };
}

const EMERGENCY_HELPLINES: HelplineItem[] = [
  {
    id: 'cyber-1930',
    number: '1930',
    telUri: 'tel:1930',
    name: 'National Cyber Crime Helpline',
    agency: 'Ministry of Home Affairs & Indian Cyber Crime Coordination Centre (I4C)',
    description: 'Golden Hour immediate freeze of stolen money across 350+ commercial banks, UPI switches, and payment gateways.',
    badge: 'Primary 24x7',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    category: 'cyber',
    themeColor: {
      bg: 'bg-rose-50/80',
      border: 'border-rose-200',
      btn: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-rose-200',
      text: 'text-rose-950'
    }
  },
  {
    id: 'police-112',
    number: '112',
    telUri: 'tel:112',
    name: 'National Emergency Response (Police ERSS)',
    agency: 'Emergency Response Support System (ERSS / All State Police Control Rooms)',
    description: 'Immediate local police dispatch if scammers are threatening physical raids, home visits, arrest warrants, or extortion.',
    badge: 'Police 24x7',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    category: 'police',
    themeColor: {
      bg: 'bg-blue-50/80',
      border: 'border-blue-200',
      btn: 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white shadow-blue-200',
      text: 'text-blue-950'
    }
  },
  {
    id: 'women-1091',
    number: '1091',
    telUri: 'tel:1091',
    name: 'Women Cyber Harassment & Safety',
    agency: 'Women Police Helpline & Special Cyber Cell Desk',
    description: 'Confidential reporting and emergency protection against sextortion, morphed video blackmail, and online stalking.',
    badge: 'Confidential 24x7',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    category: 'women',
    themeColor: {
      bg: 'bg-purple-50/80',
      border: 'border-purple-200',
      btn: 'bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white shadow-purple-200',
      text: 'text-purple-950'
    }
  },
  {
    id: 'trauma-14416',
    number: '14416',
    telUri: 'tel:14416',
    name: 'Tele-MANAS Psychological First-Aid',
    agency: 'National Tele Mental Health Programme of India (NIMHANS & MoHFW)',
    description: 'Toll-free 24/7 counseling for acute panic, suicidal thoughts, extreme fear, or trauma following fraud intimidation.',
    badge: 'Mental Health 24x7',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    category: 'trauma',
    themeColor: {
      bg: 'bg-teal-50/80',
      border: 'border-teal-200',
      btn: 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white shadow-teal-200',
      text: 'text-teal-950'
    }
  },
  {
    id: 'rbi-14440',
    number: '14440',
    telUri: 'tel:14440',
    name: 'RBI Financial Fraud & Awareness',
    agency: 'Reserve Bank of India (Banking Ombudsman & CMS)',
    description: 'Guidance on customer zero-liability rights for unauthorized electronic transactions under RBI statutory guidelines.',
    badge: 'Mon-Fri Toll-Free',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    category: 'banking',
    themeColor: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
      btn: 'bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white shadow-amber-200',
      text: 'text-amber-950'
    }
  },
  {
    id: 'elder-14567',
    number: '14567',
    telUri: 'tel:14567',
    name: 'Elderline (Senior Citizens Helpline)',
    agency: 'Ministry of Social Justice & Empowerment (Govt of India)',
    description: 'Specialized assistance for senior citizens facing pension fraud, digital arrest coercion, or life certificate impersonation.',
    badge: 'Elder Care',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    category: 'police',
    themeColor: {
      bg: 'bg-sky-50/80',
      border: 'border-sky-200',
      btn: 'bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white shadow-sky-200',
      text: 'text-sky-950'
    }
  }
];

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  onOpenEvidenceLocker,
  onGoToPostFraud,
  onOpenOfflineHub
}) => {
  const [selectedBank, setSelectedBank] = useState<BankHotline | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'cyber' | 'police' | 'women' | 'trauma' | 'banking'>('all');
  const [lastDialed, setLastDialed] = useState<string | null>(null);
  const [activeGps, setActiveGps] = useState<GpsCoordinates | null>(null);
  const [isPanicModeActive, setIsPanicModeActive] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleDirectDialClick = (item: HelplineItem) => {
    setLastDialed(item.number);
  };

  const handleSaveVoiceToEvidence = (record: DistressVoiceRecord) => {
    try {
      const existingJson = localStorage.getItem('cyber_seva_evidence_records');
      const existing = existingJson ? JSON.parse(existingJson) : [];
      const gpsInfo = record.gpsCoordinates
        ? `\n📍 Attached GPS Coordinates: ${record.gpsCoordinates.latitude.toFixed(6)}° N, ${record.gpsCoordinates.longitude.toFixed(6)}° E (Accuracy: ±${record.gpsCoordinates.accuracy}m).\n🗺️ Live GPS Map Pin: ${record.gpsCoordinates.mapsUrl}`
        : '';
      const newEvidence = {
        id: 'ev-voice-' + Date.now(),
        incidentDateTime: new Date().toISOString().slice(0, 16),
        amountLost: '',
        paymentMethod: 'Urgent Voice Statement',
        debitedBank: '',
        debitedAccountNumber: '',
        transactionRefId: '',
        suspectPhone: '',
        suspectUpiOrAccount: '',
        suspectPlatform: 'SOS Distress Voice Recording',
        incidentDescription: `Urgent 30-Second Voice Distress Statement recorded via SOS Modal for Police & Cyber Crime Authorities. Duration: ${record.durationSeconds}s. Recorded: ${record.createdAt}.${gpsInfo}`,
        hasScreenshots: false,
        hasBankStatement: false,
        hasCallLogs: true,
        gpsCoordinates: record.gpsCoordinates,
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };
      localStorage.setItem('cyber_seva_evidence_records', JSON.stringify([newEvidence, ...existing]));
    } catch (e) {
      console.warn('Could not auto-add evidence record for voice statement', e);
    }
  };

  const filteredHelplines = EMERGENCY_HELPLINES.filter(
    h => activeCategory === 'all' || h.category === activeCategory
  );

  if (isPanicModeActive) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="text-white text-6xl mb-8 animate-pulse">!</div>
        <h1 className="text-white text-2xl font-bold mb-2">I am in danger</h1>
        <p className="text-slate-500 text-sm">Emergency signal active</p>
        <button onClick={() => setIsPanicModeActive(false)} className="mt-8 text-slate-700 text-xs cursor-pointer">Exit Panic Mode</button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header with High-Impact Emergency Theme */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 p-4 sm:p-5 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPanicModeActive(true)}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 cursor-pointer"
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </button>
              <div>
                <h2 id="sos-title" className="text-base sm:text-lg font-bold tracking-tight">
                  24/7 National Cyber Emergency SOS
                </h2>
                <p className="text-xs text-rose-100 font-medium flex items-center gap-2 flex-wrap">
                  <span>Immediate Financial Freeze</span>
                  <span>·</span>
                  <span>Direct-Dial Helplines</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-200">
                    <Mic className="w-3 h-3 text-amber-300" /> One-Touch Voice
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-300">
                    <MapPin className="w-3 h-3 text-emerald-300" /> GPS Auto-Attached
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close Emergency Window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Golden Hour Countdown Banner */}
          <div className="mt-3 p-2.5 bg-black/25 rounded-xl border border-white/10 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-[11px] sm:text-xs leading-snug">
              <span className="font-bold text-amber-200">GOLDEN HOUR RULE: </span>
              <span>
                Call <strong>1930</strong> within <strong>2 hours</strong> of fraud to trigger an instant inter-bank lien freeze before funds leave the banking system!
              </span>
            </div>
          </div>

          {/* Live GPS Distress Beacon Pill */}
          {activeGps && (
            <div className="mt-2.5 p-2 bg-black/30 rounded-xl border border-emerald-400/30 flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-200 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="font-bold text-white">Live GPS Beacon:</span>
                <span className="font-mono text-emerald-300 truncate">
                  {activeGps.latitude.toFixed(4)}° N, {activeGps.longitude.toFixed(4)}° E (±{activeGps.accuracy}m)
                </span>
              </div>
              <a
                href={`sms:112?body=${encodeURIComponent(`🚨 EMERGENCY CYBER CRIME SOS - Location: ${activeGps.latitude}, ${activeGps.longitude} Map: https://maps.google.com/?q=${activeGps.latitude},${activeGps.longitude}`)}`}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shrink-0 cursor-pointer shadow-xs transition-colors"
                title="Send rapid distress SMS to Police 112 with GPS coordinates"
              >
                SOS SMS 112
              </a>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Offline Availability Alert Banner */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-medium">
              <HardDrive className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Offline Ready — Cellular phone calls (tel:) and USSD bank codes work with zero internet data.</span>
            </div>
            {onOpenOfflineHub && (
              <button
                onClick={() => {
                  onClose();
                  onOpenOfflineHub();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shrink-0 cursor-pointer shadow-sm"
              >
                Offline Hub
              </button>
            )}
          </div>

          {/* Last Dialed Notification if User Clicked a Dial Button */}
          {lastDialed && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Opening phone dialer for <strong>{lastDialed}</strong>... Keep your incident notes handy.</span>
              </div>
              <button
                onClick={() => setLastDialed(null)}
                className="text-amber-700 hover:underline font-bold text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* One-Touch Voice 30-Second Distress Statement Recorder for Local Authorities */}
          <OneTouchVoiceRecorder
            onSaveToEvidenceLocker={handleSaveVoiceToEvidence}
            onGpsCoordinatesCaptured={setActiveGps}
          />

          {/* Section: One-Tap Direct Dial Helplines */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900">One-Tap Emergency Direct Calls</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Tap any button below to immediately open your phone dialer via the direct <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">tel:</code> protocol.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-[11px]">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'cyber', label: 'Cyber 1930' },
                    { id: 'police', label: 'Police 112' },
                    { id: 'women', label: 'Women 1091' },
                    { id: 'trauma', label: 'Trauma 14416' }
                  ] as const
                ).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      activeCategory === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Helpline Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredHelplines.map(helpline => (
                <div
                  key={helpline.id}
                  className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between transition-all hover:shadow-md ${helpline.themeColor.bg} ${helpline.themeColor.border}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${helpline.badgeColor}`}>
                        {helpline.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                        {helpline.agency.split('(')[0]}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-2xl font-black font-mono tracking-tight ${helpline.themeColor.text}`}>
                        {helpline.number}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        {helpline.name}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                      {helpline.description}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                    {/* Primary One-Tap tel: URI Trigger Button */}
                    <a
                      href={helpline.telUri}
                      onClick={() => handleDirectDialClick(helpline)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 min-h-[42px] transition-all cursor-pointer shadow-sm ${helpline.themeColor.btn}`}
                      title={`Tap to dial ${helpline.number}`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {helpline.number} Now</span>
                    </a>

                    {/* Quick Copy Number Option */}
                    <button
                      onClick={() => handleCopy(helpline.number, helpline.id)}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer transition-colors"
                      title="Copy phone number"
                      aria-label={`Copy ${helpline.number}`}
                    >
                      {copiedText === helpline.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official National e-FIR Portal Link Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 tracking-wider">OFFICIAL ONLINE COMPLAINT PORTAL</span>
                <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">24x7 e-FIR</span>
              </div>
              <h4 className="text-base font-bold text-white font-mono">cybercrime.gov.in</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Formal MHA digital crime filing system. Upload transaction receipts, screenshot proof, and suspect phone logs.
              </p>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer min-h-[42px]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open National Portal</span>
            </a>
          </div>

          {/* Immediate Bank Freeze Directory */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <h4 className="text-sm font-bold text-slate-900">Instant Bank Account & Card Freeze Shortcuts</h4>
              </div>
              <span className="text-xs text-slate-500">Select your bank</span>
            </div>

            {/* Bank Pills */}
            <div className="flex flex-wrap gap-1.5">
              {BANK_HOTLINES.slice(1).map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => setSelectedBank(selectedBank?.name === bank.name ? null : bank)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    selectedBank?.name === bank.name
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {bank.name}
                </button>
              ))}
            </div>

            {/* Selected Bank Details Panel */}
            {selectedBank && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-sm">{selectedBank.name}</h5>
                  <span className="text-xs font-mono text-slate-500">{selectedBank.tollFree}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Emergency Procedure: </strong> {selectedBank.procedure}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${selectedBank.tollFree.split('/')[0].replace(/\s+/g, '')}`}
                    className="py-2 px-3 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-800 cursor-pointer min-h-[40px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call {selectedBank.name} Hotline</span>
                  </a>
                  {selectedBank.smsFreezeSyntax && selectedBank.smsNumber && (
                    <button
                      onClick={() =>
                        handleCopy(
                          `Send SMS "${selectedBank.smsFreezeSyntax}" to ${selectedBank.smsNumber}`,
                          'sms'
                        )
                      }
                      className="py-2 px-3 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-200 border border-slate-200 cursor-pointer min-h-[40px]"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      {copiedText === 'sms' ? 'SMS Copied!' : `Copy SMS: ${selectedBank.smsFreezeSyntax}`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Guidance & Next Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                onClose();
                onGoToPostFraud();
              }}
              className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-left transition-colors flex items-start gap-3 cursor-pointer"
            >
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">Post-Fraud Triage & Action Plan</span>
                <span className="text-[11px] text-amber-800 leading-snug">
                  Specific dos and don'ts for UPI debit, digital arrest, and extortion.
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEvidenceLocker();
              }}
              className="p-3.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100/80 text-left transition-colors flex items-start gap-3 cursor-pointer"
            >
              <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-blue-900 block">Evidence Locker (Log UTR / IDs)</span>
                <span className="text-[11px] text-blue-800 leading-snug">
                  Securely lock transaction hashes, call times, and chats before they are wiped.
                </span>
              </div>
            </button>

            {onOpenOfflineHub && (
              <button
                onClick={() => {
                  onClose();
                  onOpenOfflineHub();
                }}
                className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-left transition-colors flex items-start gap-3 sm:col-span-2 cursor-pointer"
              >
                <WifiOff className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Offline Emergency SOS & USSD Freezing Codes</span>
                  <span className="text-[11px] text-emerald-800 leading-snug">
                    Access bank freeze SMS formats, NUUP USSD *99#, and offline statutory FIR drafts without data connection.
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer with One-Tap Emergency Links */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">One-Tap Dial:</span>

            {/* Quick 1-Tap Pill Links for 1930, 112, 1091 */}
            <a
              href="tel:1930"
              className="inline-flex items-center gap-1 font-bold text-rose-700 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-md border border-rose-300 text-[11px] transition-colors cursor-pointer"
              title="Call National Cyber Crime 1930"
            >
              <PhoneCall className="w-3 h-3" /> Cyber 1930
            </a>

            <a
              href="tel:112"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-md border border-blue-300 text-[11px] transition-colors cursor-pointer"
              title="Call Police ERSS 112"
            >
              <PhoneCall className="w-3 h-3" /> Police 112
            </a>

            <a
              href="tel:1091"
              className="inline-flex items-center gap-1 font-bold text-purple-700 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-2.5 py-1 rounded-md border border-purple-300 text-[11px] transition-colors cursor-pointer"
              title="Call Women Cyber Helpline 1091"
            >
              <PhoneCall className="w-3 h-3" /> Women 1091
            </a>

            <a
              href="tel:14416"
              className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-2.5 py-1 rounded-md border border-teal-300 text-[11px] transition-colors cursor-pointer"
              title="Call Tele-MANAS 14416"
            >
              <HeartPulse className="w-3 h-3" /> Trauma 14416
            </a>

            <span aria-hidden="true" className="text-slate-300">|</span>

            <a
              href="https://sancharsaathi.gov.in/sfc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1 text-[11px]"
            >
              Chakshu Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
          >
            Close Emergency Window
          </button>
        </div>
      </div>
    </div>
  );
};
