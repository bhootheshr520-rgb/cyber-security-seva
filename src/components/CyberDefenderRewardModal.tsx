import React, { useState } from 'react';
import {
  X,
  Award,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  FileText,
  Lock,
  Printer
} from 'lucide-react';
import { CyberDefenderBadge, CERTIFICATE_AUTHORITY_INFO } from '../data/cyberDefenderData';

interface CyberDefenderRewardModalProps {
  badge: CyberDefenderBadge;
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  userName?: string;
}

export const CyberDefenderRewardModal: React.FC<CyberDefenderRewardModalProps> = ({
  badge,
  isOpen,
  onClose,
  streakDays,
  userName = 'Citizen Bhoothesh R'
}) => {
  const [recipientName, setRecipientName] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const certificateId = `DEF-IN-${badge.codeName}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(certificateId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleShare = () => {
    const text = `🎖️ I just earned the "${badge.title}" Cyber Defender digital reward on Cyber Security Seva! Certificate ID: ${certificateId}. Learned essential defense tactics against ${badge.threatCategory}. Verify on cybercrime.gov.in / 1930 Helpline. #CyberDefender #DigitalSuraksha`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    // Simulate printable PDF download
    const printableContent = `
=====================================================
${CERTIFICATE_AUTHORITY_INFO.issuerName.toUpperCase()}
ACCREDITED CYBER DEFENDER DIGITAL REWARD
=====================================================
Badge Awarded: ${badge.title} (${badge.codeName})
Recipient: ${recipientName}
Issue Date: ${issueDate}
Certificate ID: ${certificateId}
Threat Domain: ${badge.threatCategory}
Reward Type: ${badge.digitalReward.rewardType}

PERK UNLOCKED:
${badge.digitalReward.perkBenefit}

OFFICIAL CITATION:
${badge.description}

DIGITAL REWARD DOSSIER:
${badge.digitalReward.summary}

Issued under the National Cyber Security Framework
National Cyber Helpline: 1930 | Portal: cybercrime.gov.in
=====================================================
    `;

    const blob = new Blob([printableContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = badge.digitalReward.downloadableFileName.replace('.pdf', '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              {badge.icon}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300">
                {badge.tier} Tier • {badge.codeName}
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Digital Reward
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
              {badge.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Official Digital Certificate View */}
          <div className="relative rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-7 shadow-inner overflow-hidden">
            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

            {/* Certificate Header */}
            <div className="text-center space-y-1.5 pb-4 border-b border-amber-500/20">
              <div className="flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                <span>🛡️ Bharat Cyber Suraksha Academy 🛡️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase font-serif">
                Certificate of Cyber Defense Accreditation
              </h3>
              <p className="text-[11px] text-slate-400">
                Recognized under National Cyber Crime Reporting & Awareness Initiative
              </p>
            </div>

            {/* Recipient & Presentation */}
            <div className="my-5 text-center space-y-2">
              <span className="text-[11px] text-slate-400 italic">This digital credential is proudly conferred upon</span>
              <div className="flex items-center justify-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    autoFocus
                    className="bg-slate-800 border border-amber-400 rounded-lg px-3 py-1 text-base font-bold text-amber-300 text-center focus:outline-none"
                  />
                ) : (
                  <h4
                    onClick={() => setIsEditingName(true)}
                    className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight cursor-pointer hover:underline flex items-center justify-center gap-1.5"
                    title="Click to edit recipient name"
                  >
                    <span>{recipientName}</span>
                    <span className="text-[10px] text-slate-500 font-sans font-normal">(Edit)</span>
                  </h4>
                )}
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                For demonstrating verifiable mastery of <span className="text-white font-semibold">{badge.threatCategory}</span> countermeasures and consistent community defense vigilance.
              </p>
            </div>

            {/* Accreditation Badges & Verifiable Stamp */}
            <div className="pt-4 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Credential Code</span>
                <span className="font-mono text-xs text-amber-400 font-bold">{badge.codeName}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Issue Date</span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> {issueDate}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Verification ID</span>
                <button
                  onClick={handleCopyId}
                  className="font-mono text-[10px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition-colors"
                >
                  <span className="truncate max-w-[120px]">{certificateId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Gold Seal Watermark */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Verified Digital Asset
              </span>
              <span className="font-mono text-amber-400 font-semibold">
                SEAL: I4C-CFCFRMS-VALID
              </span>
            </div>
          </div>

          {/* Digital Reward Dossier & Perk Information */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Included Digital Reward: {badge.digitalReward.rewardTitle}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-[10px] font-bold">
                {badge.digitalReward.rewardType}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {badge.digitalReward.summary}
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Citizen Perk:</span>
                  <span className="text-xs font-bold text-emerald-300">{badge.digitalReward.perkBenefit}</span>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold rounded-lg shrink-0">
                Active
              </span>
            </div>
          </div>

          {/* Download & Share Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 fill-slate-950" />
              <span>{downloadSuccess ? 'Downloaded Official Dossier!' : `Download ${badge.digitalReward.downloadableFileName}`}</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>{copiedShare ? 'Copied WhatsApp Post!' : 'Share Credential'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
