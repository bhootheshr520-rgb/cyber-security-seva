import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  Lock, 
  Smartphone, 
  FileText, 
  Clock, 
  ArrowRight,
  HelpCircle,
  Eye,
  RefreshCw,
  Info,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { FraudRecoveryDashboard } from './FraudRecoveryDashboard';
import { VictimSupportChat } from './VictimSupportChat';

interface PostFraudCareProps {


  onOpenSos: () => void;
  onOpenEvidenceLocker: () => void;
  onGoToLegal: () => void;
  onOpenGemini?: () => void;
  onOpenMitigationPlan?: (scenario?: FraudScenario) => void;
}

type FraudScenario = 
  | 'money-debited'
  | 'digital-arrest'
  | 'sextortion'
  | 'remote-apk'
  | 'task-crypto'
  | 'sim-swap';

export const PostFraudCare: React.FC<PostFraudCareProps> = ({
  onOpenSos,
  onOpenEvidenceLocker,
  onGoToLegal,
  onOpenGemini,
  onOpenMitigationPlan,
}) => {
  const [activeScenario, setActiveScenario] = useState<FraudScenario>('money-debited');
  const [deviceChecklist, setDeviceChecklist] = useState<{ [key: string]: boolean }>({});
  const [careViewMode, setCareViewMode] = useState<'relief-checklist' | 'recovery-dashboard'>('relief-checklist');

  const toggleCheck = (id: string) => {
    setDeviceChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scenariosData: Record<
    FraudScenario,
    {
      label: string;
      title: string;
      reassuranceNote: string;
      immediateSteps: string[];
      dos: string[];
      donts: string[];
      recoveryReality: string;
      primaryHelpline: string;
    }
  > = {
    'money-debited': {
      label: 'Money Debited from Account',
      title: 'Unauthorized UPI, Card, or Net Banking Debit',
      reassuranceNote:
        'Stay calm. When money is transferred through UPI or IMPS, it does not instantly convert to physical cash. It moves through intermediary payment gateways and recipient beneficiary accounts. If reported promptly to 1930, the Indian Cyber Crime Coordination Centre (I4C) sends an automated lien request to the recipient bank, locking the money inside that account before it can be withdrawn.',
      immediateSteps: [
        'Call 1930 immediately (or file on cybercrime.gov.in). Have your 12-digit UPI Reference / UTR Number and Bank Account number ready.',
        'Call your bank hotline to freeze the debited account, revoke net-banking access, and block debit/credit cards.',
        'File an in-app dispute on Google Pay / PhonePe / Paytm (History -> Select Transaction -> Dispute / Fraud).',
        'Take screenshots of the transaction receipt showing the Transaction ID, Timestamp, and Beneficiary VPA.'
      ],
      dos: [
        'DO dial 1930 immediately — every minute in the first 2 hours increases the fund recovery rate dramatically.',
        'DO request a formal Bank Complaint / Dispute Reference Number from your bank customer care.',
        'DO download your official bank statement in PDF highlighting the fraudulent debit entries.',
        'DO preserve all SMS alerts received from your bank regarding the transaction.'
      ],
      donts: [
        'DO NOT panic and delete the payment app or factory-reset your phone before taking screenshots.',
        'DO NOT trust anyone on Instagram, Telegram, or Twitter claiming to be a "Hacker who recovers lost money" — 100% of these are recovery scams asking for advance fees!',
        'DO NOT send "test amounts" or "cancellation fees" if the scammer promises to reverse the money.',
        'DO NOT feel ashamed or blame yourself — professional cyber cartels engineer these interfaces to mislead.'
      ],
      recoveryReality:
        'Under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18, if unauthorized electronic banking fraud is reported within 3 working days, customer liability is zero or strictly limited. Once the recipient account is frozen via 1930, courts routinely issue refund orders under Section 457 CrPC / BNSS 503.',
      primaryHelpline: '1930 (National Cyber Financial Helpline)'
    },
    'digital-arrest': {
      label: 'Digital Arrest / Fake Police Call',
      title: 'Threatened by Fake CBI, ED, Police, or Customs Officers',
      reassuranceNote:
        'Breathe easy: You are completely safe and NOT under any legal arrest. "Digital Arrest" is a complete fabrication that does NOT exist in Indian law or any court jurisdiction in the world. No genuine police officer, CBI director, or judge ever conducts trials, arrests, or bail hearings over Skype or WhatsApp video.',
      immediateSteps: [
        'Disconnect the video call or Skype call IMMEDIATELY. Block the caller.',
        'Remember: Police will NEVER come to arrest you for an imaginary courier parcel or phone number.',
        'If you transferred money to any "Government Verification Account", call 1930 within the hour to freeze that beneficiary account.',
        'Report the fraudulent caller phone number on the Department of Telecommunications Chakshu portal (sancharsaathi.gov.in).'
      ],
      dos: [
        'DO inform your trusted family members, friends, or a local lawyer right now. Silence and isolation are the scammers’ primary weapons.',
        'DO take screenshots of the Skype profile, fake arrest warrant PDF, or caller phone numbers before blocking.',
        'DO walk into your nearest local police station if you feel uneasy — the genuine police officers will confirm the fraud immediately.',
        'DO register a complaint on cybercrime.gov.in under "Impersonation of Government Official".'
      ],
      donts: [
        'DO NOT remain on video call with them for another second. Disconnecting immediately terminates their psychological grip.',
        'DO NOT transfer any "bail deposit", "RBI audit fee", or "tax clearance" under any circumstance.',
        'DO NOT share your Aadhaar, PAN card, or bank account statements with them.',
        'DO NOT keep this traumatic call secret from your loved ones out of embarrassment.'
      ],
      recoveryReality:
        'The Government of India and the Supreme Court have issued nationwide public warnings against this syndicate. Disconnecting immediately ends their access. If funds were transferred, 1930 can track the mule bank accounts across states.',
      primaryHelpline: '1930 / Local Police 112'
    },
    'sextortion': {
      label: 'Sextortion / Video Call Blackmail',
      title: 'Threats to Leak Private Images or Morphed Video Calls',
      reassuranceNote:
        'Please hear this with certainty: You will be okay. Your reputation and life will NOT be destroyed. Extortionists rely 100% on inducing sheer panic so you transfer money out of fear. In the overwhelming majority of cases, scammers never post the video because posting exposes their identity, deletes their accounts, and attracts non-bailable criminal prosecution. When you stop responding and block them, they abandon the target.',
      immediateSteps: [
        'DO NOT PAY A SINGLE RUPEE! Paying once will never satisfy them — they will immediately double the demand.',
        'Screenshot the chat messages, threats, phone numbers, and payment details as evidence.',
        'Block the scammer on WhatsApp and phone calls. Do not negotiate or plead with them.',
        'Set all your social media accounts (Facebook, Instagram, LinkedIn) to strictly PRIVATE, hide friend lists, and disable messaging from strangers.',
        'Submit a confidential report on StopNCII.org (Stop Non-Consensual Intimate Images) and cybercrime.gov.in.'
      ],
      dos: [
        'DO block and cut all communication immediately. Scammers operate on quick turnover; silence makes them move away.',
        'DO use StopNCII.org to create a cryptographic hash of images so Meta (Facebook & Instagram) automatically blocks them from ever being uploaded.',
        'DO call the National Women Cyber Helpline (1091 / 1090) or 1930 if you need immediate confidential support.',
        'DO seek emotional support from a trusted friend, family member, or professional counselor.'
      ],
      donts: [
        'DO NOT pay "just ₹5,000 to delete the video". They will save the video and ask for ₹20,000 the next day.',
        'DO NOT believe fake callers claiming to be "Delhi Police Inspector" or "YouTube Grievance Officer" demanding settlement money — these are partners of the same extortionist gang.',
        'DO NOT harm yourself or suffer in silence. This happens to thousands of innocent people daily.',
        'DO NOT plead or show extreme fear to the extortionist — emotional detachment makes them abandon the scam.'
      ],
      recoveryReality:
        'Indian law under IT Act Section 66E, 67, 67A, and BNS 308/351 treats you as the protected victim. Law enforcement treats blackmail complaints with high priority and total confidentiality.',
      primaryHelpline: '1930 / Women Helpline 1091'
    },
    'remote-apk': {
      label: 'Installed AnyDesk / Unknown APK',
      title: 'Remote Screen Share or Malicious APK on Your Phone',
      reassuranceNote:
        'If you installed AnyDesk, TeamViewer QuickSupport, or downloaded an APK file from WhatsApp or a link, do not panic. The malware relies on network connectivity to transmit your screen and OTPs. Severing the internet connection immediately cuts off the attacker’s control.',
      immediateSteps: [
        'Turn on Airplane Mode immediately or turn off Wi-Fi and Mobile Data on the compromised phone.',
        'Uninstall the suspicious application immediately from Android Settings -> Apps.',
        'Using a DIFFERENT device or phone, login to your bank accounts and change internet banking passwords and UPI MPIN.',
        'Call your bank hotline to temporarily block online banking and ATM cards.',
        'Check your bank statement for any unauthorized debits while the app was active.'
      ],
      dos: [
        'DO turn on Airplane mode immediately to disconnect the hacker’s remote session.',
        'DO review Android Settings -> Accessibility and disable any unknown service.',
        'DO run Google Play Protect scan (Play Store -> Profile -> Play Protect -> Scan).',
        'DO dial 1930 if any unauthorized transaction occurred while screen sharing was active.'
      ],
      donts: [
        'DO NOT open banking apps or type any passwords while connected to the internet until the rogue app is removed.',
        'DO NOT approve any 9-digit session code or "Allow Screen Broadcast" prompt.',
        'DO NOT download "antivirus tools" recommended by the same caller.',
        'DO NOT share your screen with any caller claiming to be "Bank Technical Support".'
      ],
      recoveryReality:
        'Once the APK or remote software is uninstalled and passwords changed from an uncompromised device, your device and accounts are fully secure again.',
      primaryHelpline: 'Bank Hotline / 1930'
    },
    'task-crypto': {
      label: 'Telegram Job / Crypto Task Scam',
      title: 'Prepaid Task, Video Liking, or Fake Investment Syndicate',
      reassuranceNote:
        'You are not alone. Thousands of smart students, professionals, and homemakers have been trapped by these elaborate psychological traps that initially pay small real bonuses (₹150-₹500) to manufacture trust. The platform balance you see on their website is fake numbers generated by a script, but the money you sent went to criminal mule bank accounts.',
      immediateSteps: [
        'STOP SENDING MONEY IMMEDIATELY! No matter what "unfreeze fee", "tax fee", or "credit score recovery fee" they demand, paying more will NEVER release your funds.',
        'Export and screenshot your entire Telegram/WhatsApp chat history before the admin deletes the group.',
        'Gather all bank transaction UTR numbers and recipient account details.',
        'Call 1930 immediately and file a financial fraud report on cybercrime.gov.in.',
        'Block the scammer agents once evidence is captured.'
      ],
      dos: [
        'DO accept that the scam has occurred and cut off further financial loss immediately.',
        'DO compile a neat spreadsheet or list of dates, amounts, and beneficiary bank accounts.',
        'DO report the Telegram channels and user handles to Telegram abuse.',
        'DO prepare a formal police complaint using our legal FIR guide.'
      ],
      donts: [
        'DO NOT pay "30% tax" or "penalty fee" to withdraw your principal — this is just their final squeeze.',
        'DO NOT trust anyone in the Telegram group who says "I paid the fee and got my money back!" — they are shill bots/colluders.',
        'DO NOT hire online "white-hat hackers" on Instagram or Telegram who claim they can hack the scammer server to retrieve funds.',
        'DO NOT take high-interest loans from relatives to pay scam clearance fees.'
      ],
      recoveryReality:
        'Law enforcement agencies (I4C, state cyber cells) routinely bust these call centers and freeze multi-crore mule accounts. Reporting every bank account and UPI ID helps freeze the network.',
      primaryHelpline: '1930 (Cyber Crime Helpline)'
    },
    'sim-swap': {
      label: 'SIM Card Inactive / SIM Swap',
      title: 'Sudden "No Service" or Unauthorized SIM Replacement',
      reassuranceNote:
        'If your mobile phone suddenly shows "No Service" or "Invalid SIM" without explanation while others have network, scammers may have executed a SIM Swap fraud to intercept your banking OTPs. Immediate notification to your telecom provider can deactivate the rogue SIM card.',
      immediateSteps: [
        'Borrow a phone and immediately call your telecom operator (Airtel: 121 / 198, Jio: 198, Vi: 198) to report an unauthorized SIM swap and block the number.',
        'Call your bank hotline to immediately suspend internet banking and UPI linked to that mobile number.',
        'Check your email notifications for any alerts regarding password resets or bank withdrawals.',
        'Visit the nearest physical telecom store with your original government ID to reclaim your SIM card.'
      ],
      dos: [
        'DO notify telecom customer support within minutes of sudden service outage.',
        'DO request banks to freeze net banking logins until your original SIM is restored.',
        'DO change passwords for your primary email accounts (Gmail, Outlook) and enable authenticator app 2FA.',
        'DO file a complaint on sancharsaathi.gov.in (TAFCOP portal).'
      ],
      donts: [
        'DO NOT assume "No Service" is just a harmless network glitch if it persists for over 15 minutes.',
        'DO NOT share any 20-digit SIM number or eSIM QR code sent via email or SMS with anyone.',
        'DO NOT reply to SMS prompts asking to forward text to 121 with unfamiliar alphanumeric codes.',
        'DO NOT delay contacting your bank while waiting for network to return.'
      ],
      recoveryReality:
        'Once the telecom operator disables the attacker’s cloned/swapped SIM card and your bank pauses net banking, the attacker cannot receive OTPs and is locked out completely.',
      primaryHelpline: 'Telecom Operator 198 / 1930'
    }
  };

  const current = scenariosData[activeScenario];

  return (
    <div className="space-y-8 relative">
      {/* Top Confidence & Psychological Grounding Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Post-Incident Citizen Reassurance & Emergency Care</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance">
            Take a deep breath. You are safe, and you are not alone.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Cyber fraud is industrial, organized psychological manipulation executed by syndicates targeting millions of honest citizens every single month. <strong className="text-white">You did not intentionally do anything wrong.</strong> Nothing is ruined beyond repair. By executing clear, systematic counter-steps right now, funds can be frozen, identity secured, and safety restored.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSos}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 1930 Helpline Now</span>
            </button>

            {onOpenGemini && (
              <button
                onClick={onOpenGemini}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 border border-indigo-400/40 shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Ask Gemini AI Advisor</span>
              </button>
            )}

            <button
              onClick={onOpenEvidenceLocker}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Open Evidence Locker</span>
            </button>

            <button
              onClick={onGoToLegal}
              className="px-4 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 font-semibold text-sm rounded-xl flex items-center gap-2 border border-indigo-500/30 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              <span>Draft Police FIR Draft</span>
            </button>

            <button
              onClick={() => setCareViewMode(careViewMode === 'recovery-dashboard' ? 'relief-checklist' : 'recovery-dashboard')}
              className="px-4 py-2.5 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 font-semibold text-sm rounded-xl flex items-center gap-2 border border-emerald-500/30 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{careViewMode === 'recovery-dashboard' ? 'Emergency Checklist' : 'Recovery Success Stats'}</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      </section>

      {/* Dynamic Gemini AI Quick Triage Card */}
      {onOpenGemini && (
        <section className="bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">Need Instant Dynamic Advice?</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Chat with Gemini Cyber Rakshak for live panic de-escalation, RBI customer rights, and step-by-step triage.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenGemini}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Start AI Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* View Switcher: Emergency First-Response Playbook vs Fraud Recovery Success Dashboard */}
      <div className="flex items-center justify-between p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setCareViewMode('relief-checklist')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            careViewMode === 'relief-checklist'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Emergency First-Response Playbook</span>
        </button>
        <button
          onClick={() => setCareViewMode('recovery-dashboard')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            careViewMode === 'recovery-dashboard'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>Fraud Recovery Success Rates</span>
          <span className="hidden sm:inline-block text-[10px] font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">
            Recharts
          </span>
        </button>
      </div>

      {careViewMode === 'recovery-dashboard' ? (
        <FraudRecoveryDashboard
          onOpenSos={onOpenSos}
          onOpenEvidenceLocker={onOpenEvidenceLocker}
          onGoToLegal={onGoToLegal}
          onOpenMitigationPlan={() => onOpenMitigationPlan && onOpenMitigationPlan(activeScenario)}
        />
      ) : (
        <>
          {/* Scenario Selector: What Just Happened? */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 1: Select Your Exact Fraud Scenario</h2>
            <p className="text-xs text-slate-500">
              Get customized, prioritized first-response instructions tailored to your specific incident.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Verified Citizen Protocol
          </span>
        </div>

        {/* Scenario Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(
            [
              { id: 'money-debited', label: 'Money Debited', icon: Lock },
              { id: 'digital-arrest', label: 'Digital Arrest Call', icon: AlertTriangle },
              { id: 'sextortion', label: 'Video Blackmail', icon: Eye },
              { id: 'remote-apk', label: 'AnyDesk / APK', icon: Smartphone },
              { id: 'task-crypto', label: 'Telegram / Crypto', icon: HelpCircle },
              { id: 'sim-swap', label: 'SIM Swap / Dead', icon: RefreshCw },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = activeScenario === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScenario(item.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Dynamic Card */}
        <div className="mt-6 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-6">
          {/* Header of Scenario */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                <span>ACTIVE PROTOCOL</span>
                <span aria-hidden="true">·</span>
                <span>{current.primaryHelpline}</span>
              </div>
              {onOpenMitigationPlan && (
                <button
                  type="button"
                  onClick={() => onOpenMitigationPlan(activeScenario)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch Interactive Checklist</span>
                </button>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{current.title}</h3>
            <div className="mt-3 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-950 block mb-0.5">Confidence & Reality Check:</span>
                <span>{current.reassuranceNote}</span>
              </div>
            </div>
          </div>

          {/* First 15 Minutes Action Checklist */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">Immediate First 15 Minutes: Do These Now</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {current.immediateSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 leading-relaxed font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side-by-Side: WHAT TO DO vs WHAT NOT TO DO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WHAT TO DO */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>WHAT TO DO (Crucial Actions)</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                {current.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WHAT NOT TO DO */}
            <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-rose-900 font-bold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>WHAT NOT TO DO (Avoid These Traps)</span>
              </div>
              <ul className="space-y-2 text-xs text-rose-950">
                {current.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Rights & Recovery Reality */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Your Legal Standing & Recovery Reality</span>
              <p className="text-slate-600">{current.recoveryReality}</p>
            </div>
            <button
              onClick={onGoToLegal}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Legal Rights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Device Sanitization & Security Checklist */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Device Sanitization & Hardening Checklist</h2>
            <p className="text-xs text-slate-500">
              Ensure your phone or computer is fully sanitized and free from remote access hooks.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
            {Object.values(deviceChecklist).filter(Boolean).length}/5 Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {[
            {
              id: 'c1',
              title: 'Revoke Screen-Sharing & Accessibility Permissions',
              description: 'Open Android Settings -> Accessibility. Ensure no unknown apps have permission to interact with your screen.'
            },
            {
              id: 'c2',
              title: 'Inspect Recently Downloaded Files & APKs',
              description: 'Check Downloads folder and Settings -> Apps. Uninstall any file named .apk, AnyDesk, QuickSupport, or RustDesk.'
            },
            {
              id: 'c3',
              title: 'Reset UPI PIN & Banking Passwords from a Clean Device',
              description: 'Login from another trusted phone or laptop to set a new Net Banking password, card PIN, and UPI MPIN.'
            },
            {
              id: 'c4',
              title: 'Run Google Play Protect / Apple Security Scan',
              description: 'Open Google Play Store -> Tap Profile Picture -> Play Protect -> Tap "Scan" to verify all installed apps.'
            },
            {
              id: 'c5',
              title: 'Enable Two-Factor Authentication (2FA) on Gmail & Primary Accounts',
              description: 'Use an Authenticator App (Google Authenticator) rather than SMS for maximum resilience against SIM swaps.'
            }
          ].map((item) => {
            const isChecked = !!deviceChecklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className={`font-bold block ${isChecked ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                    {item.title}
                  </span>
                  <span className="text-slate-500 leading-relaxed">{item.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
        </>
      )}

      {/* Quick Action Dock */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Need to document the incident while memory is fresh?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Record transaction IDs, scammer mobile numbers, and bank details in the browser Evidence Locker before chats are wiped.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenEvidenceLocker}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Launch Evidence Locker
          </button>
          <button
            onClick={onOpenSos}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Open 24/7 SOS
          </button>
        </div>
      </section>
      <VictimSupportChat />
    </div>
  );
};
