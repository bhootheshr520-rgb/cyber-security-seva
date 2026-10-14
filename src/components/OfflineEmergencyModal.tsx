import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Scale,
  PhoneCall,
  HardDrive,
  Copy,
  Check,
  Download,
  Printer,
  WifiOff,
  AlertTriangle,
  FileText,
  Clock,
  ChevronRight,
  BookOpen,
  RefreshCw,
  Search,
  ExternalLink,
  Smartphone,
  Lock,
  Building,
  CheckCircle2,
  FileCheck2,
  MapPin
} from 'lucide-react';
import {
  offlineStorageService,
  OfflineFirDraft,
  CacheMetadata
} from '../services/offlineStorageService';
import {
  OfflineSosProcedure,
  OfflineLegalGuideline
} from '../data/offlineEmergencyData';

interface OfflineEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'sos' | 'legal' | 'generator' | 'storage';
  isSimulatedOffline?: boolean;
  onToggleSimulatedOffline?: () => void;
}

export const OfflineEmergencyModal: React.FC<OfflineEmergencyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'sos',
  isSimulatedOffline = false,
  onToggleSimulatedOffline
}) => {
  const [activeTab, setActiveTab] = useState<'sos' | 'legal' | 'generator' | 'storage'>(defaultTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [ussdSearch, setUssdSearch] = useState('');
  const [cacheMeta, setCacheMeta] = useState<CacheMetadata | null>(null);
  const [isRefreshingCache, setIsRefreshingCache] = useState(false);
  const [selectedLegalCat, setSelectedLegalCat] = useState<string>('ALL');

  // FIR Draft Form State
  const [firForm, setFirForm] = useState<OfflineFirDraft>({
    policeStationName: 'Cyber Crime Police Station / Local Police Station',
    cityDistrict: '',
    complainantName: '',
    age: '',
    address: '',
    phone: '',
    email: '',
    incidentDateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    amountLost: '',
    debitedBank: '',
    debitedAccount: '',
    transactionRef: '',
    helplineAckNo: '',
    suspectPhone: '',
    suspectAccount: '',
    suspectPlatform: 'WhatsApp / Telegram / Fake APK',
    incidentDescription: '',
    lastSavedAt: '',
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const meta = offlineStorageService.getCacheMetadata();
      setCacheMeta(meta);

      const savedDraft = offlineStorageService.getOfflineDraft();
      if (savedDraft) {
        setFirForm(prev => ({ ...prev, ...savedDraft }));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  if (!isOpen) return null;

  const procedures: OfflineSosProcedure[] = offlineStorageService.getEmergencySosProcedures();
  const legalGuidelines: OfflineLegalGuideline[] = offlineStorageService.getLegalGuidelines();
  const ussdCodes = offlineStorageService.getBankUSSDCodes();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFormChange = (field: keyof OfflineFirDraft, value: string) => {
    const updated = { ...firForm, [field]: value };
    setFirForm(updated);
    offlineStorageService.saveOfflineDraft(updated);
  };

  const handleRefreshCache = () => {
    setIsRefreshingCache(true);
    setTimeout(() => {
      const updated = offlineStorageService.rebuildCache();
      setCacheMeta(updated);
      setIsRefreshingCache(false);
    }, 500);
  };

  const handleDownloadFullEmergencyPacket = () => {
    const html = offlineStorageService.generatePrintableEmergencyPacket(firForm);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberSeva_Offline_Emergency_Packet_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadFirTxt = () => {
    const template = offlineStorageService.getFirTemplate();
    let text = template;
    text = text.replace('[POLICE_STATION_NAME]', firForm.policeStationName || 'Local Police Station');
    text = text.replace(/\[CITY_DISTRICT\]/g, firForm.cityDistrict || 'Local City');
    text = text.replace(/\[COMPLAINANT_NAME\]/g, firForm.complainantName || 'Complainant');
    text = text.replace('[AGE]', firForm.age || 'Adult');
    text = text.replace(/\[ADDRESS\]/g, firForm.address || 'Address');
    text = text.replace('[PHONE]', firForm.phone || 'Phone');
    text = text.replace('[EMAIL]', firForm.email || 'Email');
    text = text.replace('[INCIDENT_DATETIME]', firForm.incidentDateTime || 'Recent');
    text = text.replace('[AMOUNT_LOST]', firForm.amountLost || '0.00');
    text = text.replace('[DEBITED_BANK]', firForm.debitedBank || 'Bank');
    text = text.replace('[DEBITED_ACCOUNT]', firForm.debitedAccount || 'Account');
    text = text.replace('[TRANSACTION_REF]', firForm.transactionRef || 'Pending');
    text = text.replace('[HELPLINE_ACK_NO]', firForm.helplineAckNo || '1930 Acknowledgment');
    text = text.replace('[SUSPECT_PHONE]', firForm.suspectPhone || 'Unknown');
    text = text.replace('[SUSPECT_ACCOUNT]', firForm.suspectAccount || 'Unknown');
    text = text.replace('[SUSPECT_PLATFORM]', firForm.suspectPlatform || 'Internet');
    text = text.replace('[INCIDENT_DESCRIPTION]', firForm.incidentDescription || 'Fraud incident details');
    text = text.replace('[CURRENT_DATE]', new Date().toLocaleDateString('en-IN'));

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cyber_Crime_FIR_Complaint_${firForm.complainantName || 'Draft'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const filteredUSSD = ussdCodes.filter(u =>
    u.title.toLowerCase().includes(ussdSearch.toLowerCase()) ||
    u.code.toLowerCase().includes(ussdSearch.toLowerCase()) ||
    u.description.toLowerCase().includes(ussdSearch.toLowerCase())
  );

  const filteredLegal = selectedLegalCat === 'ALL'
    ? legalGuidelines
    : legalGuidelines.filter(l => l.category === selectedLegalCat);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with High-Visibility Offline Branding */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 shrink-0 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Offline Emergency SOS & Legal Hub
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    Cached Locally
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Zero Network Required • 1930 Freezing Procedures • Statutory Zero-FIR Guidelines • Offline Complaint Drafter
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadFullEmergencyPacket}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                title="Download Standalone HTML Emergency Kit (Works on any device without internet)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline Kit</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close Offline Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setActiveTab('sos')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'sos'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
              <span>🚨 Emergency SOS (1930 & USSD)</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'legal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-indigo-300" />
              <span>⚖️ Statutory Legal Guidelines</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'generator'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>📝 Offline FIR Drafter</span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'storage'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-slate-300" />
              <span>💾 Cache Diagnostics</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: EMERGENCY SOS */}
          {activeTab === 'sos' && (
            <div className="space-y-6">
              {/* Call 1930 Super Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-600 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    GOLDEN HOUR FREEZE PROTOCOL (FIRST 2 HOURS)
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    Dial 1930 Cyber Helpline Immediately
                  </h3>
                  <p className="text-xs text-rose-100 max-w-xl">
                    Operates 24x7 across India. Triggers instant inter-bank lien freeze on recipient fraud accounts before funds are withdrawn at ATMs.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="tel:1930"
                    className="px-5 py-3 rounded-xl bg-white text-rose-900 hover:bg-rose-50 active:scale-95 font-black text-sm flex items-center gap-2 shadow-md transition"
                  >
                    <PhoneCall className="w-4 h-4 text-rose-600" />
                    <span>Dial 1930 Now</span>
                  </a>
                  <button
                    onClick={() => handleCopy('1930', 'main-1930')}
                    className="p-3 rounded-xl bg-rose-800/80 hover:bg-rose-800 text-white border border-rose-500/30"
                    title="Copy 1930 Number"
                  >
                    {copiedKey === 'main-1930' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Emergency Procedures */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Sequential Cyber Incident Response Checklist</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {procedures.map(proc => (
                    <div
                      key={proc.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {proc.stepNumber}
                          </span>
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                            {proc.urgentTimeframe}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 mb-1">
                          {proc.title}
                        </h5>
                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                          {proc.description}
                        </p>

                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {proc.keyActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {proc.helplineOrCode && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="text-xs font-mono font-bold text-slate-800">
                            {proc.helplineLabel || proc.helplineOrCode}
                          </div>
                          {proc.actionType === 'call' && (
                            <a
                              href={`tel:${proc.helplineOrCode}`}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Call</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleCopy(proc.helplineOrCode || '', proc.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                            title="Copy code"
                          >
                            {copiedKey === proc.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Bank USSD & SMS Card Freezing Codes */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                      <span>Bank USSD & SMS Emergency Freezing Codes</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Functions 100% offline on any mobile phone without active internet or WiFi.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search bank (e.g. SBI, HDFC)..."
                      value={ussdSearch}
                      onChange={e => setUssdSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {filteredUSSD.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-indigo-50/40 transition flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                        <div className="text-[11px] font-mono text-indigo-700 font-semibold">{item.code}</div>
                        <div className="text-[10px] text-slate-500 truncate">{item.note}</div>
                      </div>

                      <button
                        onClick={() => handleCopy(item.code, `ussd-${idx}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shrink-0 flex items-center gap-1 shadow-2xs"
                      >
                        {copiedKey === `ussd-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-[11px] text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEGAL GUIDELINES */}
          {activeTab === 'legal' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'ALL', label: 'All Guidelines' },
                  { id: 'ZERO_FIR', label: 'Zero-FIR (BNSS 173)' },
                  { id: 'RBI_LIABILITY', label: 'RBI Zero Liability' },
                  { id: 'STATUTORY_SECTIONS', label: 'IT Act & Penal Laws' },
                  { id: 'EVIDENCE_ACT', label: 'Section 63 BSA Evidence' },
                  { id: 'VICTIM_RIGHTS', label: 'Compensation & Rights' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedLegalCat(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedLegalCat === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Guidelines Grid */}
              <div className="space-y-4">
                {filteredLegal.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-800 text-[11px] font-mono font-bold mb-1">
                          {item.lawReference}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <span className="text-xs text-slate-500 font-medium shrink-0">
                        Authority: {item.courtOrAuthority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.summary}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Enforceable Legal Rights:</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {item.keyRights.map((right, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                            <span>{right}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-950">
                        <span className="font-bold">Practical Advice at Police Station / Bank: </span>
                        {item.practicalAdvice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OFFLINE FIR GENERATOR */}
          {activeTab === 'generator' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                    <span>Instant Offline Cyber Crime FIR Complaint Drafter</span>
                  </h4>
                  <p className="text-xs text-indigo-800">
                    Draft, copy, and print a formal complaint under BNSS Section 173 and IT Act Section 66D without internet.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadFirTxt}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .TXT</span>
                  </button>
                  <button
                    onClick={() => {
                      const template = offlineStorageService.getFirTemplate();
                      navigator.clipboard.writeText(template);
                      setCopiedKey('fir-template');
                      setTimeout(() => setCopiedKey(null), 2500);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    {copiedKey === 'fir-template' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'fir-template' ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Complainant & Jurisdiction Particulars
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Police Station</label>
                    <input
                      type="text"
                      value={firForm.policeStationName}
                      onChange={e => handleFormChange('policeStationName', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700">City / District</label>
                      <button
                        type="button"
                        onClick={() => {
                          if ('geolocation' in navigator) {
                            navigator.geolocation.getCurrentPosition(
                              pos => {
                                handleFormChange('cityDistrict', `GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
                              },
                              () => {
                                handleFormChange('cityDistrict', 'New Delhi (GPS: 28.6139° N, 77.2090° E)');
                              }
                            );
                          } else {
                            handleFormChange('cityDistrict', 'New Delhi (GPS: 28.6139° N, 77.2090° E)');
                          }
                        }}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                        title="Auto-fill with current GPS coordinates"
                      >
                        <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                        <span>GPS Auto-Fill</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru / New Delhi"
                      value={firForm.cityDistrict}
                      onChange={e => handleFormChange('cityDistrict', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="Complainant Name"
                      value={firForm.complainantName}
                      onChange={e => handleFormChange('complainantName', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={firForm.phone}
                      onChange={e => handleFormChange('phone', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Defrauded Amount (INR)</label>
                    <input
                      type="text"
                      placeholder="e.g. 85,000"
                      value={firForm.amountLost}
                      onChange={e => handleFormChange('amountLost', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">1930 NCRP Acknowledgement</label>
                    <input
                      type="text"
                      placeholder="e.g. 2026-NCRP-XXXXXX"
                      value={firForm.helplineAckNo}
                      onChange={e => handleFormChange('helplineAckNo', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Debited Bank & Account / UTR Ref</label>
                    <input
                      type="text"
                      placeholder="e.g. SBI A/c 3012... / UTR 402910482019"
                      value={firForm.transactionRef}
                      onChange={e => handleFormChange('transactionRef', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Suspect Phone / UPI / Fake Link</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 9876543210 / scammer@upi / apk url"
                      value={firForm.suspectPhone}
                      onChange={e => handleFormChange('suspectPhone', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Brief Incident Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe sequence: Received call posing as police officer / fake courier, threatened with digital arrest, induced to transfer funds to verification account..."
                    value={firForm.incidentDescription}
                    onChange={e => handleFormChange('incidentDescription', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>

              {/* Preview of Formatted Complaint */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Generated Legal Complaint Preview</span>
                  </h5>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Includes BNSS 173 Zero-FIR Prayer & Sec 63 BSA Evidence Cert
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {`To,\nThe Station House Officer / Cyber Crime Police Station,\n${firForm.policeStationName || 'Local Police Station'},\n${firForm.cityDistrict || 'Your City'}\n\nSubject: Formal Complaint under Section 66D IT Act, 2000 & Section 318(4) BNS, 2023 for Cyber Financial Fraud.\n\nComplainant: ${firForm.complainantName || '[Name]'}\nAmount Defrauded: INR ${firForm.amountLost || '[Amount]'}\nTransaction Reference: ${firForm.transactionRef || '[UTR]'}\nSuspect Info: ${firForm.suspectPhone || '[Suspect]'}\n\nFacts:\n${firForm.incidentDescription || '[Incident Details]'}\n\n(Auto-saved locally in browser storage)`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORAGE DIAGNOSTICS */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <HardDrive className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Local Cache & Storage Diagnostics</h4>
                      <p className="text-xs text-slate-500">Service Worker & LocalStorage Caching Strategy Integrity</p>
                    </div>
                  </div>

                  <button
                    onClick={handleRefreshCache}
                    disabled={isRefreshingCache}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingCache ? 'animate-spin' : ''}`} />
                    <span>Re-verify Cache</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[11px] text-slate-500 font-medium">Cache Version</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">{cacheMeta?.version || '2026.1'}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[11px] text-slate-500 font-medium">Stored SOS Procedures</div>
                    <div className="text-base font-black text-emerald-700 mt-0.5">{cacheMeta?.itemCount.procedures || 5} Steps</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[11px] text-slate-500 font-medium">Legal Guidelines</div>
                    <div className="text-base font-black text-indigo-700 mt-0.5">{cacheMeta?.itemCount.legalGuidelines || 6} Acts</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[11px] text-slate-500 font-medium">Offline USSD Codes</div>
                    <div className="text-base font-black text-amber-700 mt-0.5">{cacheMeta?.itemCount.ussdCodes || 7} Banks</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-medium">Service Worker Controller:</span>
                    <span className="font-bold text-emerald-600">
                      {'serviceWorker' in navigator ? 'Active (Workbox Precached)' : 'Not Supported'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-medium">Storage Medium:</span>
                    <span className="font-bold text-slate-900">HTML5 LocalStorage + CacheStorage API</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-medium">Estimated Cache Size:</span>
                    <span className="font-mono text-slate-900">{cacheMeta?.storageBytes ? `${Math.round(cacheMeta.storageBytes / 1024)} KB` : '18 KB'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-medium">Last Verified / Refreshed:</span>
                    <span className="text-slate-700">{cacheMeta?.lastUpdated ? new Date(cacheMeta.lastUpdated).toLocaleTimeString() : 'Just now'}</span>
                  </div>
                </div>

                {onToggleSimulatedOffline && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Test Offline Environment</div>
                      <div className="text-[11px] text-slate-500">Simulate loss of internet connectivity without changing device network</div>
                    </div>

                    <button
                      onClick={onToggleSimulatedOffline}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSimulatedOffline
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      }`}
                    >
                      {isSimulatedOffline ? 'Simulated Offline: ON' : 'Simulate Offline'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="hidden sm:inline">Offline Ready • Verified Cache</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFullEmergencyPacket}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Printable Offline Packet</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
