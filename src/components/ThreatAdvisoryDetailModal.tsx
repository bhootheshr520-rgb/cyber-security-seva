import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  PhoneCall, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Clock,
  Radio
} from 'lucide-react';
import { PushAdvisory } from '../data/pushNotificationsData';

interface ThreatAdvisoryDetailModalProps {
  advisory: PushAdvisory | null;
  onClose: () => void;
  onOpenSos: () => void;
  onGoToLegal: () => void;
  onGoToEvidenceLocker: () => void;
  onOpenMitigationPlan?: (advisory?: PushAdvisory) => void;
}

export const ThreatAdvisoryDetailModal: React.FC<ThreatAdvisoryDetailModalProps> = ({
  advisory,
  onClose,
  onOpenSos,
  onGoToLegal,
  onGoToEvidenceLocker,
  onOpenMitigationPlan,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!advisory) return null;

  const isCritical = advisory.severity === 'Critical';

  const copyAdvisoryText = () => {
    const text = `🚨 CYBER THREAT ADVISORY [${advisory.advisoryCode}]\nAuthority: ${advisory.agency}\nSeverity: ${advisory.severity}\n\nTitle: ${advisory.title}\n\nDetails: ${advisory.fullDetails}\n\nIMMEDIATE ACTION: ${advisory.immediateAction}\n\nReport immediately to National Cyber Crime Helpline: 1930 or cybercrime.gov.in`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareAdvisory = () => {
    if (navigator.share) {
      navigator.share({
        title: advisory.title,
        text: `🚨 CYBER FRAUD ADVISORY: ${advisory.title}. ${advisory.immediateAction}. Call 1930 immediately.`,
      }).catch(() => copyAdvisoryText());
    } else {
      copyAdvisoryText();
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[800px] overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with severity badge */}
        <div className={`p-4 border-b shrink-0 flex items-center justify-between ${
          isCritical ? 'bg-rose-950/40 border-rose-900/60' : 'bg-amber-950/40 border-amber-900/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
              isCritical ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isCritical ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}>
                  {advisory.severity} Advisory
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {advisory.advisoryCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                {advisory.agency}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Main Title */}
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
              {advisory.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Broadcasted: {advisory.timestamp}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> Verified Intelligence
              </span>
            </div>
          </div>

          {/* Urgent Action Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 to-amber-950/80 border border-rose-500/50 shadow-md">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Immediate Countermeasure (Do This Right Now)
              </h4>
            </div>
            <p className="text-xs text-white font-medium leading-relaxed">
              {advisory.immediateAction}
            </p>
          </div>

          {/* Modus Operandi & How Attack Works */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Threat Intelligence & Modus Operandi</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {advisory.fullDetails}
            </p>
          </div>

          {/* Golden Rules Checklist */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <h4 className="text-xs font-bold text-slate-200">
              National Cyber Advisory Golden Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>No Indian law enforcement agency (CBI, Police, ED) arrests or interrogates via WhatsApp/Skype video calls.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>Banks never require entering UPI PIN or OTP to "receive" or "refund" money.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>Report financial transactions within the <strong>Golden Hour (1–2 hrs)</strong> on Helpline 1930 to freeze attacker accounts.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 space-y-2 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSos();
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS Helpline 1930</span>
            </button>

            <button
              onClick={shareAdvisory}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              {shared || copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{shared || copied ? 'Copied to Share!' : 'Share Warning'}</span>
            </button>
          </div>

          {onOpenMitigationPlan && (
            <button
              onClick={() => {
                const adv = advisory;
                onClose();
                onOpenMitigationPlan(adv);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-indigo-600 to-indigo-700 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>Launch Step-by-Step Threat Mitigation Checklist</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onClose();
                onGoToEvidenceLocker();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-300 font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evidence Locker</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onGoToLegal();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Draft FIR Complaint</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
