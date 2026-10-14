import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  Upload,
  Link as LinkIcon,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  X,
  Sparkles,
  FileText,
  Phone,
  IndianRupee,
  MapPin,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Trash2,
  Download,
  Copy,
  Check,
  Eye,
  Sliders,
  Share2,
  Volume2,
  Globe,
  Smartphone,
  MessageSquare,
  Layers,
  Shield
} from 'lucide-react';
import { AudioTranscriber } from './AudioTranscriber';
import { 
  ReportedScam, 
  PRESET_SCREENSHOTS, 
  INITIAL_USER_REPORTS 
} from '../data/reportedScamsData';
import { 
  playCameraShutterSound, 
  playStreakCelebrationChime,
  playMilestoneUnlockFanfare 
} from '../services/soundEffects';

interface ReportScamProps {
  onOpenSos?: () => void;
  onGoToLegal?: () => void;
  onClose?: () => void;
  onViewCommunityDatabase?: () => void;
  onOpenMitigationPlan?: (scenarioOrTitle?: string) => void;
  initialEncounterType?: 'url' | 'message' | 'app' | 'other';
}

const STORAGE_KEY = 'cyber_reported_scams_v1';

export const ReportScam: React.FC<ReportScamProps> = ({
  onOpenSos,
  onGoToLegal,
  onClose,
  onViewCommunityDatabase,
  onOpenMitigationPlan,
  initialEncounterType
}) => {
  // Navigation / View Tabs inside Report Scam
  const [activeSubTab, setActiveSubTab] = useState<'new-report' | 'my-reports'>('new-report');

  // Encounter Archetype: URL vs Message vs App vs Other
  const [encounterType, setEncounterType] = useState<'url' | 'message' | 'app' | 'other'>(
    initialEncounterType || 'url'
  );

  // Form State
  const [category, setCategory] = useState<ReportedScam['category']>('Digital Arrest / Fake Police');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fraudUrl, setFraudUrl] = useState('');
  const [messageText, setMessageText] = useState('');
  const [senderId, setSenderId] = useState('');
  const [appName, setAppName] = useState('');
  const [appPackage, setAppPackage] = useState('');
  const [appPermissions, setAppPermissions] = useState<string[]>([
    'Read & Intercept SMS',
    'Accessibility Service Control'
  ]);
  const [scammerContact, setScammerContact] = useState('');
  const [amountLost, setAmountLost] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [detectedGps, setDetectedGps] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [screenshotCaption, setScreenshotCaption] = useState('');
  const [screenshotType, setScreenshotType] = useState<ReportedScam['screenshotType']>('camera_simulated');

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState<'live' | 'simulated'>('simulated');
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Success / Modal State
  const [submittedReport, setSubmittedReport] = useState<ReportedScam | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isInspectingScreenshot, setIsInspectingScreenshot] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Stored Reports
  const [savedReports, setSavedReports] = useState<ReportedScam[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Indian Cyber Fraud Hub Cities
  const CITIES = [
    'Delhi NCR',
    'Bengaluru',
    'Mumbai',
    'Hyderabad',
    'Kolkata',
    'Jaipur',
    'Mewat / Bharatpur',
    'Pune',
    'Ahmedabad',
    'Chennai',
    'Lucknow',
    'Chandigarh',
    'Indore',
    'Patna'
  ];

  const CATEGORIES: ReportedScam['category'][] = [
    'Digital Arrest / Fake Police',
    'UPI Phishing & QR Deception',
    'Phishing Portal / Fake Bank',
    'Telegram / Part-Time Job',
    'Electricity / Utility Bill',
    'Malware / APK Trojan',
    'Other Cyber Fraud'
  ];

  // Load Reports from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedReports(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USER_REPORTS));
        setSavedReports(INITIAL_USER_REPORTS);
      }
    } catch {
      setSavedReports(INITIAL_USER_REPORTS);
    }
  }, []);

  // Cleanup Camera Stream on Unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCameraStream = async (facing: 'environment' | 'user') => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported by your browser environment. Using simulated camera mode.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
      setCameraMode('live');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to access camera';
      setCameraError(message);
      // Fallback gracefully to simulated camera view
      setCameraMode('simulated');
      setIsCameraActive(false);
    }
  };

  // Switch to Simulated Camera
  const openSimulatedCamera = () => {
    stopCameraStream();
    setCameraMode('simulated');
    setCameraError(null);
    setIsCameraActive(true);
  };

  // Flip Facing Mode for Live Camera
  const toggleFacingMode = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextFacing);
    if (cameraMode === 'live') {
      startCameraStream(nextFacing);
    }
  };

  // Auto-Detect GPS Coordinates for Incident Location
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          setDetectedGps({ lat, lng });
          setIsDetectingGps(false);
        },
        () => {
          setDetectedGps({ lat: 28.6139, lng: 77.2090 });
          setIsDetectingGps(false);
        },
        { timeout: 6000 }
      );
    } else {
      setDetectedGps({ lat: 28.6139, lng: 77.2090 });
      setIsDetectingGps(false);
    }
  };

  // Shutter Snapshot Trigger
  const captureScreenshot = () => {
    setIsCapturing(true);
    playCameraShutterSound();
    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 150);

    if (cameraMode === 'live' && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add Watermark overlay
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(10, canvas.height - 40, canvas.width - 20, 30);
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('CRIME EVIDENCE SNAPSHOT', 20, canvas.height - 20);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText(new Date().toLocaleString('en-IN'), canvas.width - 190, canvas.height - 20);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setScreenshotUrl(dataUrl);
        setScreenshotType('camera_live');
        setScreenshotCaption(`Camera Snapshot captured on ${new Date().toLocaleTimeString('en-IN')}`);
        stopCameraStream();
      }
    } else {
      // Simulated camera mode: capture the active preset SVG
      const preset = PRESET_SCREENSHOTS[selectedPresetIndex];
      setScreenshotUrl(preset.svgDataUrl);
      setScreenshotType('camera_simulated');
      setScreenshotCaption(`${preset.title} (Simulated Camera Evidence)`);

      // Optionally auto-populate fields if empty
      if (!description.trim()) {
        setDescription(preset.defaultDesc);
      }
      if (!fraudUrl.trim()) {
        setFraudUrl(preset.defaultUrl);
      }
      if (!scammerContact.trim() && preset.defaultContact) {
        setScammerContact(preset.defaultContact);
      }
      if (!amountLost.trim() && preset.defaultAmount) {
        setAmountLost(preset.defaultAmount);
      }
      if (preset.category) {
        setCategory(preset.category as ReportedScam['category']);
      }
      setIsCameraActive(false);
    }

    setIsCapturing(false);
  };

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setScreenshotUrl(result);
        setScreenshotType('uploaded');
        setScreenshotCaption(`Uploaded evidence: ${file.name}`);
        playCameraShutterSound();
      }
    };
    reader.readAsDataURL(file);
  };

  // Real-time URL Threat Heuristic Analyzer
  const analyzeUrl = (url: string) => {
    if (!url.trim()) return null;
    const clean = url.trim().toLowerCase();
    const flags: string[] = [];
    let severity: 'Critical' | 'High' | 'Warning' | 'Validating' = 'Validating';

    // Check Suspicious TLDs
    const suspiciousTlds = ['.xyz', '.top', '.online', '.club', '.buzz', '.click', '.site', '.work', '.live', '.cc', '.fun', '.space'];
    for (const tld of suspiciousTlds) {
      if (clean.includes(tld)) {
        flags.push(`Suspicious top-level domain (${tld}) frequently used by cyber syndicates`);
        severity = 'Critical';
      }
    }

    // Check Typosquatting / Fake Banks
    const bankKeywords = ['sbi', 'yono', 'hdfc', 'icici', 'pnb', 'paytm', 'phonepe', 'gpay', 'rbi', 'income-tax', 'aadhaar', 'kyc'];
    for (const kw of bankKeywords) {
      if (clean.includes(kw) && !clean.includes('.gov.in') && !clean.includes('.sbi') && !clean.includes('hdfcbank.com') && !clean.includes('icicibank.com')) {
        flags.push(`Potentially impersonating trusted entity "${kw.toUpperCase()}" on unauthorized domain`);
        severity = 'Critical';
      }
    }

    // Check APK downloads
    if (clean.endsWith('.apk') || clean.includes('.apk?') || clean.includes('download-apk')) {
      flags.push('Direct Android APK download link (High risk of Trojan / RAT)');
      severity = 'Critical';
    }

    // Check Telegram / WhatsApp invite
    if (clean.includes('t.me/') || clean.includes('chat.whatsapp.com')) {
      flags.push('Direct private group invite link (Common in Task & Investment frauds)');
      if (severity !== 'Critical') severity = 'High';
    }

    // Check insecure HTTP
    if (clean.startsWith('http://')) {
      flags.push('Unencrypted HTTP protocol (Missing SSL security)');
      if (severity === 'Validating') severity = 'Warning';
    }

    // Check IP address based URL
    if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(clean)) {
      flags.push('Raw numeric IP address URL (Bypasses standard DNS registration)');
      severity = 'Critical';
    }

    return {
      severity,
      flags: flags.length > 0 ? flags : ['No known blacklist pattern detected; inspect manual credentials']
    };
  };

  const urlAnalysis = analyzeUrl(fraudUrl);

  // Auto-Detect Flags from Description
  const detectedFlags = (() => {
    const lower = description.toLowerCase();
    const list: string[] = [];

    if (lower.includes('cbi') || lower.includes('police') || lower.includes('arrest') || lower.includes('customs') || lower.includes('narcotics')) {
      list.push('Police / Law Enforcement Impersonation');
    }
    if (lower.includes('qr code') || lower.includes('upi pin') || lower.includes('receive money') || lower.includes('cashback')) {
      list.push('UPI PIN / QR Deception Hook');
    }
    if (lower.includes('electricity') || lower.includes('disconnect') || lower.includes('bill') || lower.includes('substation')) {
      list.push('Urgent Utility Disconnection Extortion');
    }
    if (lower.includes('task') || lower.includes('telegram') || lower.includes('rating') || lower.includes('part-time') || lower.includes('daily earn')) {
      list.push('Telegram Part-Time Task Syndicate');
    }
    if (lower.includes('apk') || lower.includes('anydesk') || lower.includes('teamviewer') || lower.includes('rustdesk')) {
      list.push('Remote Device Access / Trojan Siphon');
    }
    if (lower.includes('kyc') || lower.includes('yono') || lower.includes('pan card') || lower.includes('aadhaar')) {
      list.push('Aadhaar / Banking KYC Harvest');
    }
    return list;
  })();

  // Form Validation
  const isFormValid = description.trim().length >= 10;

  // Handle Submission
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const referenceId = `SCAM-2026-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveTitle = title.trim() || `${encounterType === 'url' ? 'Suspicious URL' : encounterType === 'message' ? 'Deceptive Message' : encounterType === 'app' ? 'Fraudulent App' : category} Incident in ${city}`;

    // Calculate dynamic risk score
    let score = 70;
    if (detectedFlags.length >= 2) score += 15;
    if (fraudUrl) score += 10;
    if (screenshotUrl) score += 5;
    if (appName) score += 5;
    score = Math.min(99, score);

    const newReport: ReportedScam = {
      id: referenceId,
      timestamp: new Date().toISOString(),
      encounterType,
      category,
      title: effectiveTitle,
      description: description.trim(),
      fraudUrl: fraudUrl.trim() || undefined,
      messageText: messageText.trim() || undefined,
      senderId: senderId.trim() || undefined,
      appName: appName.trim() || undefined,
      appPackage: appPackage.trim() || undefined,
      appPermissions: encounterType === 'app' ? appPermissions : undefined,
      scammerContact: scammerContact.trim() || undefined,
      amountLost: amountLost.trim() || undefined,
      city,
      screenshotUrl: screenshotUrl || PRESET_SCREENSHOTS[selectedPresetIndex]?.svgDataUrl || '',
      screenshotCaption: screenshotCaption || `Incident Evidence (${category})`,
      screenshotType,
      status: 'Dispatched to 1930',
      riskScore: score,
      detectedThreatFlags: detectedFlags.length > 0 ? detectedFlags : ['Suspected Fraudulent Incident']
    };

    // Save to LocalStorage
    const updated = [newReport, ...savedReports];
    setSavedReports(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Storage quota exceeded, keeping in memory', err);
    }

    // Dispatch custom event for real-time app update
    window.dispatchEvent(new CustomEvent('cyber_scam_reported', { detail: newReport }));

    // Celebration sounds
    playStreakCelebrationChime();
    setTimeout(() => playMilestoneUnlockFanfare(), 300);

    setSubmittedReport(newReport);
    setIsSuccessModalOpen(true);
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setFraudUrl('');
    setMessageText('');
    setSenderId('');
    setAppName('');
    setAppPackage('');
    setScammerContact('');
    setAmountLost('');
    setScreenshotUrl('');
    setScreenshotCaption('');
    stopCameraStream();
    setIsCameraActive(false);
  };

  const handleDeleteReport = (id: string) => {
    const updated = savedReports.filter((r) => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick Preset Loader for testing
  const loadPreset = (preset: typeof PRESET_SCREENSHOTS[0]) => {
    setTitle(preset.title);
    setDescription(preset.defaultDesc);
    setFraudUrl(preset.defaultUrl);
    setScammerContact(preset.defaultContact || '');
    setAmountLost(preset.defaultAmount || '');
    setScreenshotUrl(preset.svgDataUrl);
    setScreenshotCaption(`${preset.title} Screenshot Evidence`);
    setScreenshotType('camera_simulated');
    setCategory(preset.category as ReportedScam['category']);

    if (preset.encounterType) {
      setEncounterType(preset.encounterType);
    }

    if (preset.id === 'fake-apk-trojan') {
      setAppName('PM_Kisan_Yojana_v3.apk');
      setAppPackage('com.pmkisan.updater.apk');
      setAppPermissions(['Read & Intercept SMS', 'Accessibility Service Control', 'Screen Overlay']);
    } else if (preset.id === 'fake-bijli-sms') {
      setSenderId('VM-POWEROFC');
      setMessageText('Dear Consumer, Your Electricity power supply will be disconnected tonight at 9:30 PM from electric office...');
    } else if (preset.id === 'fake-sbi-phishing') {
      setSenderId('VK-SBIBNK');
      setMessageText('Dear SBI User, your YONO NetBanking will be suspended within 24 hrs due to pending Aadhaar PAN KYC.');
    }

    stopCameraStream();
    setIsCameraActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Hidden Canvas for Live Video Screenshot Grab */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-indigo-900/40 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Citizen Incident Response</span>
            </div>

            {/* Sub-Tab Navigation Switcher */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs font-medium border border-white/10">
              <button
                type="button"
                onClick={() => setActiveSubTab('new-report')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'new-report'
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Report New Incident
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('my-reports')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'my-reports'
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Report Log</span>
                <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px] font-bold">
                  {savedReports.length}
                </span>
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Report Fraudulent Incident
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Submit critical details about cyber extortion, phishing portals, or deceptive payment requests. Capture screenshots with simulated camera access to preserve immutable digital evidence for cyber police.
          </p>

          {/* Quick Stats Pill */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Link to 1930 Cyber Cell</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-sky-400" />
              <span>Camera Snapshot Verification</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-amber-400" />
              <span>Real-Time Phishing URL Triage</span>
            </div>
          </div>
        </div>
      </section>

      {/* TAB 1: NEW REPORT FORM */}
      {activeSubTab === 'new-report' && (
        <form onSubmit={handleSubmitReport} className="space-y-6">
          {/* Quick Scenario Preset Selector Bar */}
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Auto-Fill Common Scenario Samples (Demo &amp; Testing)</span>
              </div>
              <span className="text-[11px] text-slate-500">Click to preview</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {PRESET_SCREENSHOTS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="p-2 text-left rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600">
                    {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {preset.category}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Archetype Selector: Suspicious URL vs Message vs App */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Select Scam Encounter Type <span className="text-rose-500">*</span></span>
              </h3>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Citizen Threat Triage
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Identify the primary channel through which you or the victim were targeted:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEncounterType('url');
                  if (category === 'Malware / APK Trojan') setCategory('Phishing Portal / Fake Bank');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  encounterType === 'url'
                    ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  {encounterType === 'url' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Suspicious URL / Link</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Phishing portal, fake netbanking, clone domain (.top, .xyz), payment spoof
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEncounterType('message');
                  if (category === 'Malware / APK Trojan') setCategory('Electricity / Utility Bill');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  encounterType === 'message'
                    ? 'bg-purple-50/90 border-purple-500 text-purple-950 shadow-xs ring-2 ring-purple-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  {encounterType === 'message' && <Check className="w-4 h-4 text-purple-600" />}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Deceptive Message / SMS</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Power cut SMS, WhatsApp digital arrest threat, Telegram part-time job pitch
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEncounterType('app');
                  setCategory('Malware / APK Trojan');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  encounterType === 'app'
                    ? 'bg-rose-50/90 border-rose-500 text-rose-950 shadow-xs ring-2 ring-rose-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  {encounterType === 'app' && <Check className="w-4 h-4 text-rose-600" />}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Fraudulent App / APK</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Malicious Android .apk, remote screen hijack (AnyDesk), fake loan app
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Section B: Category, City & Title */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
              <span>Incident Classification &amp; Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fraud Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportedScam['category'])}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    City / Threat Hub <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Capture live GPS coordinates for incident location"
                  >
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    <span>{detectedGps ? `${detectedGps.lat}°, ${detectedGps.lng}° (Locked)` : isDetectingGps ? 'Locking GPS...' : 'Auto-Detect GPS'}</span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Incident Headline / Brief Summary (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Fake Mumbai Police Skype call demanding money for seized FedEx package"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </section>

          {/* Section B: Incident Description with Voice Dictation */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                <span>Incident Description &amp; Modus Operandi <span className="text-rose-500">*</span></span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {description.length} chars
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Explain clearly: What did the fraudster claim? What numbers or platforms did they use? What actions did they urge you to take immediately?
            </p>

            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Received a WhatsApp call from +91-9871234567. A person wearing a police uniform stated my Aadhaar number was linked to an illegal shipment with 15 fake passports and narcotic drugs at Mumbai customs. They sent a Skype link and ordered me not to disconnect or inform anyone..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed font-sans"
            />

            {/* Voice Dictation & Quick Template Helpers */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <AudioTranscriber
                  buttonLabel="Dictate Incident Details"
                  onTranscribeComplete={(transcribed) => {
                    setDescription((prev) => (prev ? `${prev} ${transcribed}` : transcribed));
                  }}
                />
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Speak in Hindi or English
                </span>
              </div>

              {/* Quick Template Fillers */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Insert sample:</span>
                <button
                  type="button"
                  onClick={() => setDescription('Received WhatsApp call claiming an illegal courier package with contraband was registered under my Aadhaar. Demanded immediate transfer to an RBI clearance account.')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium"
                >
                  Digital Arrest
                </button>
                <button
                  type="button"
                  onClick={() => setDescription('Received an SMS claiming electricity bill was unpaid and power will be cut tonight at 9:30 PM. Asked to call a 10-digit mobile number and install an app.')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium"
                >
                  Power Bill SMS
                </button>
              </div>
            </div>

            {/* Real-Time Detected Flags Pills */}
            {detectedFlags.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pattern Analyzer Detected Cyber Red Flags:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {detectedFlags.map((flag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-semibold text-[11px] border border-amber-200">
                      ✓ {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Section 3: Encounter-Specific Forensics (URL / Message / App) */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
              <span>
                {encounterType === 'url' && 'Suspicious URL & Domain Forensics'}
                {encounterType === 'message' && 'Deceptive Message & Sender Forensics'}
                {encounterType === 'app' && 'Fraudulent App / Malicious APK Details'}
                {encounterType === 'other' && 'Fraudulent Identifiers & Contact'}
              </span>
            </h3>

            {/* Encounter Type: URL */}
            {encounterType === 'url' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Suspicious / Phishing URL or Link <span className="text-rose-500">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFraudUrl('https://sbi-yono-kyc-verify-portal.top/login.php')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Load Sample Phishing Link
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://sbi-yono-kyc-update.xyz/login or https://bill-pay.online..."
                    value={fraudUrl}
                    onChange={(e) => setFraudUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  {fraudUrl && (
                    <button
                      type="button"
                      onClick={() => setFraudUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* URL Heuristic Safety Feedback */}
                {urlAnalysis && (
                  <div className={`p-3 rounded-xl border text-xs ${
                    urlAnalysis.severity === 'Critical'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : urlAnalysis.severity === 'High'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Domain Threat Assessment: {urlAnalysis.severity} Risk</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {urlAnalysis.flags.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Encounter Type: Message / SMS */}
            {encounterType === 'message' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sender ID / SMS Header or Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VM-POWEROFC, VK-SBIBNK, or +91 98712 34567"
                      value={senderId}
                      onChange={(e) => setSenderId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Included URL / Payment Link (If Any)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://bijli-bill-support-desk.online or bit.ly/..."
                      value={fraudUrl}
                      onChange={(e) => setFraudUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Exact Suspicious Message Text
                    </label>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 text-[11px]">Insert sample:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSenderId('VM-POWEROFC');
                          setMessageText('Dear Consumer, Your Electricity power supply will be disconnected tonight at 9:30 PM from electric office because your previous bill was not updated. Please immediately contact our officer 9711054321.');
                          setCategory('Electricity / Utility Bill');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Power Cut SMS
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSenderId('+91 98712 34567');
                          setMessageText('Immediate Digital Arrest Warrant issued by Cyber Crime Enforcement Wing. Strict order: do not disconnect Skype video call or alert family.');
                          setCategory('Digital Arrest / Fake Police');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Digital Arrest Script
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Paste the exact SMS, WhatsApp message, or Telegram job script here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Encounter Type: Fraudulent App / APK */}
            {encounterType === 'app' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fraudulent App / APK Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PM_Kisan_Yojana_v3.apk or SBI_Rewards_2026.apk"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      APK Package / Source Link
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. com.pmkisan.updater.apk or s3 download link..."
                      value={appPackage || fraudUrl}
                      onChange={(e) => {
                        setAppPackage(e.target.value);
                        setFraudUrl(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Malicious Permissions Checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Dangerous Device Permissions Demanded by App:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Read & Intercept SMS',
                      'Accessibility Service Control',
                      'Screen Overlay / Remote View (AnyDesk/TeamViewer)',
                      'Access Device Contacts & Gallery',
                      'Bypass Google Play Protect Warning'
                    ].map((perm) => {
                      const isChecked = appPermissions.includes(perm);
                      return (
                        <label
                          key={perm}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setAppPermissions(appPermissions.filter((p) => p !== perm));
                              } else {
                                setAppPermissions([...appPermissions, perm]);
                              }
                            }}
                            className="w-3.5 h-3.5 accent-rose-600 rounded"
                          />
                          <span className="text-[11px]">{perm}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Scammer Contact & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Scammer Mobile / WhatsApp / UPI ID</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 98712 34567 or scammer@ybl"
                  value={scammerContact}
                  onChange={(e) => setScammerContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                  <span>Amount Lost or Demanded (₹ INR)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹50,000 or Demanded ₹2,00,000"
                  value={amountLost}
                  onChange={(e) => setAmountLost(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </section>

          {/* Section D: Screenshot via Camera Access (Simulated & Live) */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">4</span>
                <span>Incident Screenshot Evidence (Camera Access) <span className="text-rose-500">*</span></span>
              </h3>
              {screenshotUrl && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Evidence Attached</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Attach visual evidence of the WhatsApp message, video call screen, phishing site, or payment QR code. You can use your device camera or test with realistic simulated camera capture.
            </p>

            {/* Camera Viewfinder Interface */}
            {isCameraActive ? (
              <div className="rounded-2xl border-2 border-indigo-600 bg-slate-950 p-4 text-white space-y-4 relative overflow-hidden shadow-xl animate-in fade-in">
                {/* Flash effect overlay */}
                {isShutterFlashing && (
                  <div className="absolute inset-0 bg-white z-50 transition-opacity" />
                )}

                {/* Viewfinder Top Bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-400 font-bold">LIVE CAMERA VIEWFINDER</span>
                    <span className="text-slate-400">({cameraMode === 'live' ? 'Hardware Camera' : 'Simulated View'})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cameraMode === 'live' && (
                      <button
                        type="button"
                        onClick={toggleFacingMode}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                        title="Flip Camera"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        stopCameraStream();
                        setIsCameraActive(false);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                      title="Close Camera"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Viewfinder Screen */}
                <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  {cameraMode === 'live' ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* Simulated Viewfinder with Preset Selection */
                    <div className="w-full h-full relative flex items-center justify-center p-2 bg-slate-900">
                      <img
                        src={PRESET_SCREENSHOTS[selectedPresetIndex].svgDataUrl}
                        alt="Simulated Evidence Screen"
                        className="max-h-full max-w-full object-contain rounded-lg shadow-lg border border-slate-700"
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/75 rounded text-[10px] text-amber-300 font-mono">
                        SIMULATED SCENARIO #{selectedPresetIndex + 1}: {PRESET_SCREENSHOTS[selectedPresetIndex].title}
                      </div>
                    </div>
                  )}

                  {/* Camera Reticle / Target Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-3/4 h-3/4 border-2 border-white/20 border-dashed rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 border-t-2 border-l-2 border-rose-500 absolute top-2 left-2" />
                      <div className="w-8 h-8 border-t-2 border-r-2 border-rose-500 absolute top-2 right-2" />
                      <div className="w-8 h-8 border-b-2 border-l-2 border-rose-500 absolute bottom-2 left-2" />
                      <div className="w-8 h-8 border-b-2 border-r-2 border-rose-500 absolute bottom-2 right-2" />
                      <div className="text-[11px] font-mono text-white/50 bg-black/40 px-2 py-0.5 rounded">
                        ALIGN EVIDENCE WITHIN FRAME
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Preset Cycle Selector (if simulated mode) */}
                {cameraMode === 'simulated' && (
                  <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded-xl text-xs">
                    <span className="text-[11px] text-slate-400">Switch Evidence Preset:</span>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {PRESET_SCREENSHOTS.map((ps, idx) => (
                        <button
                          key={ps.id}
                          type="button"
                          onClick={() => setSelectedPresetIndex(idx)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                            selectedPresetIndex === idx
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ps.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shutter Capture Button */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={captureScreenshot}
                    disabled={isCapturing}
                    className="w-16 h-16 rounded-full bg-white hover:bg-slate-200 active:scale-95 border-4 border-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-rose-950/50"
                    title="Snap Screenshot Evidence"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </button>
                </div>
                <div className="text-center text-[11px] text-slate-400 font-mono">
                  Tap circular shutter button to capture screenshot evidence
                </div>
              </div>
            ) : (
              /* Camera Inactive State: Action Buttons & Attached Preview */
              <div className="space-y-3">
                {/* Captured Screenshot Preview (if already taken) */}
                {screenshotUrl ? (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={screenshotUrl}
                        alt="Captured Evidence"
                        className="w-32 h-32 object-cover rounded-xl border border-slate-300 shadow-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setIsInspectingScreenshot(screenshotUrl)}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity cursor-pointer text-xs font-semibold"
                      >
                        <Maximize2 className="w-4 h-4 mr-1" /> Inspect
                      </button>
                    </div>

                    <div className="flex-1 space-y-1.5 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {screenshotCaption || 'Captured Screenshot Evidence'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {screenshotType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Evidence securely captured. Timestamped and encrypted for 1930 Cyber Cell &amp; Police FIR dossier.
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsInspectingScreenshot(screenshotUrl)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Full View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotUrl('');
                            setScreenshotCaption('');
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Retake / Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Capture Trigger Buttons */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Trigger 1: Live Hardware Camera */}
                    <button
                      type="button"
                      onClick={() => startCameraStream(cameraFacingMode)}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-indigo-600 mb-2">
                        <Camera className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 px-1.5 py-0.5 rounded">
                          Device
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Open Device Camera
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          Use live viewfinder to snap a phone screen or printed letter
                        </div>
                      </div>
                    </button>

                    {/* Trigger 2: Simulated Camera Access */}
                    <button
                      type="button"
                      onClick={openSimulatedCamera}
                      className="p-4 rounded-xl border-2 border-rose-500/40 bg-rose-50/50 hover:bg-rose-50 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-rose-600 mb-2">
                        <Sparkles className="w-6 h-6 text-rose-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded">
                          Simulated
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-rose-950">
                          Simulate Camera Access
                        </div>
                        <div className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                          Capture realistic scam presets (CBI Warrant, SBI YONO, QR Code)
                        </div>
                      </div>
                    </button>

                    {/* Trigger 3: Upload Local File */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-slate-700 mb-2">
                        <Upload className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 px-1.5 py-0.5 rounded">
                          Gallery
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Upload Screenshot File
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          Select PNG/JPEG screenshot saved in gallery or desktop
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Error Banner if Camera was Blocked */}
                {cameraError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Hardware camera notice:</span> {cameraError}
                      <button
                        type="button"
                        onClick={openSimulatedCamera}
                        className="ml-2 font-bold underline text-amber-800 hover:text-amber-950 cursor-pointer"
                      >
                        Switch to Simulated Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Section E: Submit Action Bar */}
          <section className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ready to Submit Incident Dossier</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged to your secure local incident dossier and verified against national threat syndicates.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer w-1/3 sm:w-auto"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-950/50 cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Submit Incident Report</span>
              </button>
            </div>
          </section>
        </form>
      )}

      {/* TAB 2: MY REPORTED INCIDENTS LOG */}
      {activeSubTab === 'my-reports' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Citizen Scam Reports Log ({savedReports.length})
            </h3>
            <button
              onClick={() => setActiveSubTab('new-report')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              + File Another Report
            </button>
          </div>

          {savedReports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No Incidents Reported Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                When you encounter cyber extortion, suspicious URLs, or fake calls, submit them here to protect fellow citizens.
              </p>
              <button
                onClick={() => setActiveSubTab('new-report')}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Submit First Report
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {report.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {report.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {report.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {report.title}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] font-medium text-slate-400">
                        {new Date(report.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs font-bold text-rose-600">
                        Risk Score: {report.riskScore}/100
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Badges & Flags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {report.city && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3" /> {report.city}
                      </span>
                    )}
                    {report.fraudUrl && (
                      <span className="flex items-center gap-1 text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono truncate max-w-xs">
                        <LinkIcon className="w-3 h-3" /> {report.fraudUrl}
                      </span>
                    )}
                    {report.amountLost && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold">
                        {report.amountLost}
                      </span>
                    )}
                  </div>

                  {/* Attached Screenshot Thumbnail & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {report.screenshotUrl && (
                        <button
                          type="button"
                          onClick={() => setIsInspectingScreenshot(report.screenshotUrl)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Evidence Screenshot</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`Incident ID: ${report.id}\nCategory: ${report.category}\nURL: ${report.fraudUrl}\nDescription: ${report.description}`, report.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Copy Summary"
                      >
                        {copiedId === report.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* MODAL 1: SUBMISSION CELEBRATION & ACTIONS */}
      {isSuccessModalOpen && submittedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Incident Report Submitted!
              </h3>
              <p className="text-xs text-slate-600">
                Your scam report has been logged with digital evidence and dispatched to the citizen defense registry.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Incident Dossier ID</span>
                <span className="font-mono font-bold text-slate-900">{submittedReport.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Category</span>
                <span className="font-semibold text-slate-900">{submittedReport.category}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Risk Score</span>
                <span className="font-bold text-rose-600">{submittedReport.riskScore}/100 Critical</span>
              </div>
              {submittedReport.fraudUrl && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Target URL</span>
                  <span className="font-mono text-indigo-600 truncate max-w-[200px]">{submittedReport.fraudUrl}</span>
                </div>
              )}
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2">
              {onViewCommunityDatabase && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    onViewCommunityDatabase();
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Layers className="w-4 h-4 text-indigo-200" />
                  <span>View in Citizen Community Database</span>
                </button>
              )}

              {onOpenMitigationPlan && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    onOpenMitigationPlan(submittedReport.title);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-300" />
                  <span>Launch Threat Mitigation Plan</span>
                </button>
              )}

              {onOpenSos && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    onOpenSos();
                  }}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 1930 Cyber Helpline Now</span>
                </button>
              )}

              {onGoToLegal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    onGoToLegal();
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Proceed to File Police FIR Complaint</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setActiveSubTab('my-reports');
                }}
                className="w-full py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold cursor-pointer"
              >
                View in My Report Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL-SIZE SCREENSHOT INSPECTOR */}
      {isInspectingScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-4 border border-slate-700 relative flex flex-col items-center">
            <button
              onClick={() => setIsInspectingScreenshot(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full text-left mb-3">
              <div className="text-xs font-mono text-rose-400 font-bold">
                INCIDENT EVIDENCE FORENSICS
              </div>
              <div className="text-sm font-bold text-white">
                Captured Screenshot Evidence
              </div>
            </div>

            <div className="w-full max-h-[70vh] overflow-auto rounded-xl bg-black border border-slate-800 flex items-center justify-center p-2">
              <img
                src={isInspectingScreenshot}
                alt="Full Screenshot Evidence"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>Timestamp: {new Date().toLocaleDateString('en-IN')}</span>
              <button
                onClick={() => setIsInspectingScreenshot(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
