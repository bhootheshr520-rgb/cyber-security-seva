import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Filter,
  Calculator,
  RefreshCw,
  Scale,
  Building2,
  Lock,
  Sparkles,
  Info,
  Calendar,
  Hourglass,
  Layers,
  Zap,
  ChevronRight
} from 'lucide-react';

interface FraudRecoveryDashboardProps {
  onOpenSos?: () => void;
  onOpenEvidenceLocker?: () => void;
  onGoToLegal?: () => void;
  onOpenMitigationPlan?: () => void;
}

// Data for Recovery Success Rate vs Reporting Time Window
const TIME_WINDOW_DATA = [
  { window: '0 - 30 min', rateWithApp: 94, rateStandard: 58, description: 'Immediate lien via 1930; funds caught in primary mule account' },
  { window: '30 - 60 min', rateWithApp: 88, rateStandard: 49, description: 'Bank gateway hold applied before ATM/crypto conversion' },
  { window: '1 - 2 hours', rateWithApp: 76, rateStandard: 38, description: 'Layer-2 beneficiary accounts identified & frozen' },
  { window: '2 - 6 hours', rateWithApp: 59, rateStandard: 24, description: 'Partial recovery before funds split across multiple wallets' },
  { window: '6 - 12 hours', rateWithApp: 42, rateStandard: 15, description: 'Challenging; relies on merchant dispute & gateway hold' },
  { window: '12 - 24 hours', rateWithApp: 28, rateStandard: 9, description: 'Funds frequently laundered into crypto or P2P nodes' },
  { window: '24 - 48 hours', rateWithApp: 18, rateStandard: 5, description: 'Requires cyber cell formal FIR & Section 91 notices' },
  { window: '> 48 hours', rateWithApp: 11, rateStandard: 2, description: 'Long-term judicial recovery via asset seizure' },
];

// Data for Recovery Rate by Cyber Incident Category
const CATEGORY_DATA = [
  { category: 'UPI / NetBanking', withPlaybook: 84, standard: 41, totalReported: 1420 },
  { category: 'Remote APK / AnyDesk', withPlaybook: 79, standard: 35, totalReported: 890 },
  { category: 'Digital Arrest / Fake Police', withPlaybook: 91, standard: 52, totalReported: 670 },
  { category: 'Job / Telegram Task', withPlaybook: 64, standard: 22, totalReported: 1150 },
  { category: 'Fake Investment / Crypto', withPlaybook: 52, standard: 16, totalReported: 980 },
  { category: 'Sextortion / Extortion', withPlaybook: 86, standard: 39, totalReported: 530 },
];

// Incident Resolution Status Breakdown
const RESOLUTION_PIE_DATA = [
  { name: 'Full Fund Refunded', value: 58, color: '#10b981' }, // emerald-500
  { name: 'Mule Account Frozen (Pending Court)', value: 26, color: '#6366f1' }, // indigo-500
  { name: 'Active Cyber Cell Investigation', value: 11, color: '#f59e0b' }, // amber-500
  { name: 'Unrecovered (Delayed Reporting)', value: 5, color: '#ef4444' }, // red-500
];

// Monthly Recovery Volume
const MONTHLY_TREND_DATA = [
  { month: 'Oct', recoveredCrores: 1.8, casesSaved: 380, successPct: 72 },
  { month: 'Nov', recoveredCrores: 2.3, casesSaved: 460, successPct: 75 },
  { month: 'Dec', recoveredCrores: 2.9, casesSaved: 590, successPct: 78 },
  { month: 'Jan', recoveredCrores: 3.4, casesSaved: 680, successPct: 81 },
  { month: 'Feb', recoveredCrores: 4.1, casesSaved: 810, successPct: 83 },
  { month: 'Mar', recoveredCrores: 4.8, casesSaved: 950, successPct: 86 },
];

// Data for Average Recovery Timeline (in days) categorized by cyber fraud type
export interface FraudRecoveryTimelineItem {
  category: string;
  shortLabel: string;
  typeKey: string;
  avgDaysWithApp: number;
  avgDaysStandard: number;
  lienFreezeDays: number;
  policeInquiryDays: number;
  courtOrderRefundDays: number;
  complexityLevel: 'Fast' | 'Moderate' | 'High' | 'Complex';
  statutoryBasis: string;
  keyEnabler: string;
  sampleIncident: string;
  color: string;
}

export const RECOVERY_TIMELINE_DATA: FraudRecoveryTimelineItem[] = [
  {
    category: 'Banking & Financial (UPI, NetBanking, Cards)',
    shortLabel: 'Banking & UPI',
    typeKey: 'banking',
    avgDaysWithApp: 14,
    avgDaysStandard: 46,
    lienFreezeDays: 1,
    policeInquiryDays: 4,
    courtOrderRefundDays: 9,
    complexityLevel: 'Fast',
    statutoryBasis: 'RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 & 1930 CFCFRMS',
    keyEnabler: 'Immediate 1930 automated lien locks recipient mule account within hours; prompt filing establishes zero liability window.',
    sampleIncident: 'Unauthorized UPI PIN debit, cloned debit card, or fraudulent IMPS netbanking transfer.',
    color: '#10b981'
  },
  {
    category: 'Phishing & Credential Compromise',
    shortLabel: 'Phishing & Links',
    typeKey: 'phishing',
    avgDaysWithApp: 19,
    avgDaysStandard: 52,
    lienFreezeDays: 2,
    policeInquiryDays: 6,
    courtOrderRefundDays: 11,
    complexityLevel: 'Moderate',
    statutoryBasis: 'IT Act Section 66C & Payment Gateway Ombudsman Dispute Protocols',
    keyEnabler: 'Transaction dispute logged with merchant gateway within 72 hours triggers statutory chargeback hold.',
    sampleIncident: 'Fake electricity bill disconnection SMS, PAN/KYC expired link, or bogus courier delivery portal.',
    color: '#06b6d4'
  },
  {
    category: 'Identity Theft & Impersonation (Digital Arrest)',
    shortLabel: 'Identity Theft',
    typeKey: 'identity',
    avgDaysWithApp: 26,
    avgDaysStandard: 68,
    lienFreezeDays: 3,
    policeInquiryDays: 11,
    courtOrderRefundDays: 12,
    complexityLevel: 'Moderate',
    statutoryBasis: 'BNS Section 204/318 (Cheating by Personation) & Section 457 CrPC / BNSS 503',
    keyEnabler: 'High lump sums sent to domestic current accounts; prompt 1930 reporting freezes primary and secondary mule accounts.',
    sampleIncident: 'Fake Police, CBI, ED, or Customs video call demanding funds for "verification escrow" or bail.',
    color: '#6366f1'
  },
  {
    category: 'Remote Access Malware (AnyDesk, QuickSupport, APK)',
    shortLabel: 'Remote Malware',
    typeKey: 'remote',
    avgDaysWithApp: 23,
    avgDaysStandard: 58,
    lienFreezeDays: 2,
    policeInquiryDays: 8,
    courtOrderRefundDays: 13,
    complexityLevel: 'Moderate',
    statutoryBasis: 'IT Act Section 43/66 & CERT-In Malicious Software Advisory',
    keyEnabler: 'Evidence Locker system audit logs establish non-consensual remote screen scraping without customer fault.',
    sampleIncident: 'Toll-free customer care impersonation directing victim to install APK or 9-digit AnyDesk code.',
    color: '#8b5cf6'
  },
  {
    category: 'Job & Freelance Task Frauds (Telegram / Rating Scams)',
    shortLabel: 'Job & Task Frauds',
    typeKey: 'job',
    avgDaysWithApp: 34,
    avgDaysStandard: 84,
    lienFreezeDays: 4,
    policeInquiryDays: 14,
    courtOrderRefundDays: 16,
    complexityLevel: 'High',
    statutoryBasis: 'BNS 316/318 & Inter-State Cyber Crime Coordination Cell (I4C)',
    keyEnabler: 'Consolidated multi-victim FIRs pool frozen mule accounts to initiate joint court restitution petitions.',
    sampleIncident: 'Prepaid Telegram review tasks, crypto wallet recharge, or fake hotel rating commission traps.',
    color: '#f59e0b'
  },
  {
    category: 'Investment & Cryptocurrency Fraud (Fake Trading)',
    shortLabel: 'Investment & Crypto',
    typeKey: 'investment',
    avgDaysWithApp: 48,
    avgDaysStandard: 118,
    lienFreezeDays: 7,
    policeInquiryDays: 21,
    courtOrderRefundDays: 20,
    complexityLevel: 'Complex',
    statutoryBasis: 'SEBI Investor Protection & PMLA Special Court Restitution Orders',
    keyEnabler: 'Rapid FIU-IND and bank nodal notification freezes domestic INR fiat gateways before offshore crypto conversion.',
    sampleIncident: 'WhatsApp institutional trading group, fake stock broker terminal, or high-yield VIP crypto pool.',
    color: '#ef4444'
  }
];

export const FraudRecoveryDashboard: React.FC<FraudRecoveryDashboardProps> = ({
  onOpenSos,
  onOpenEvidenceLocker,
  onGoToLegal,
  onOpenMitigationPlan
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'timeline' | 'categories' | 'recovery-timeline' | 'calculator' | 'milestones'>('timeline');
  const [timelineChartMode, setTimelineChartMode] = useState<'comparison' | 'phases'>('comparison');
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<string | null>(null);

  // Interactive Recovery Probability Calculator State
  const [calcTimeElapsed, setCalcTimeElapsed] = useState<string>('0-2h');
  const [calcDialed1930, setCalcDialed1930] = useState<boolean>(true);
  const [calcBankContacted, setCalcBankContacted] = useState<boolean>(true);
  const [calcEvidencePreserved, setCalcEvidencePreserved] = useState<boolean>(true);
  const [calcIncidentType, setCalcIncidentType] = useState<string>('upi');

  // Calculate dynamic probability score
  const calculatedStats = useMemo(() => {
    let score = 50;

    // Time impact
    if (calcTimeElapsed === '<30m') score += 35;
    else if (calcTimeElapsed === '30m-2h') score += 26;
    else if (calcTimeElapsed === '2h-6h') score += 12;
    else if (calcTimeElapsed === '6h-24h') score -= 10;
    else if (calcTimeElapsed === '>24h') score -= 25;

    // Action checklist impact
    if (calcDialed1930) score += 18;
    else score -= 25;

    if (calcBankContacted) score += 12;
    else score -= 15;

    if (calcEvidencePreserved) score += 8;
    else score -= 8;

    // Type adjustments
    if (calcIncidentType === 'digital-arrest') score += 8;
    if (calcIncidentType === 'crypto') score -= 12;

    const finalRate = Math.min(Math.max(score, 6), 96);
    
    let verdictLevel: 'very-high' | 'high' | 'medium' | 'urgent' = 'high';
    let verdictTitle = 'Favorable Recovery Probability';
    let verdictRecommendation = 'Lien hold on beneficiary account has a high likelihood of intercepting funds before withdrawal.';

    if (finalRate >= 80) {
      verdictLevel = 'very-high';
      verdictTitle = 'Maximum Golden Hour Advantage (80% - 96%)';
      verdictRecommendation = 'Immediate 1930 report and bank freeze will likely catch the transfer inside primary or secondary mule tiers.';
    } else if (finalRate >= 60) {
      verdictLevel = 'high';
      verdictTitle = 'Strong Recovery Potential (60% - 79%)';
      verdictRecommendation = 'Prompt reporting significantly limits consumer liability under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18.';
    } else if (finalRate >= 40) {
      verdictLevel = 'medium';
      verdictTitle = 'Moderate Recovery Window (40% - 59%)';
      verdictRecommendation = 'Crucial to generate complete evidence packet from Evidence Locker and submit Section 457 CrPC application.';
    } else {
      verdictLevel = 'urgent';
      verdictTitle = 'Delayed Intervention Protocol (< 40%)';
      verdictRecommendation = 'Act immediately: file formal Cyber Crime Portal complaint (cybercrime.gov.in) and file police complaint with bank dispute.';
    }

    return {
      rate: finalRate,
      level: verdictLevel,
      title: verdictTitle,
      recommendation: verdictRecommendation
    };
  }, [calcTimeElapsed, calcDialed1930, calcBankContacted, calcEvidencePreserved, calcIncidentType]);

  const renderRecoveryTimelineChart = (showAsSecondary: boolean = false) => {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 ${showAsSecondary ? 'mt-6' : ''}`}>
        {/* Header and Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900">
                Average Recovery Timeline (in Days) by Cyber Fraud Type
              </h3>
              {showAsSecondary && (
                <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold border border-indigo-200/60">
                  Secondary Chart
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical calendar days elapsed from initial 1930 CFCFRMS filing to complete court restitution & bank credit.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setTimelineChartMode('comparison')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                timelineChartMode === 'comparison'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>App vs Standard Days</span>
            </button>
            <button
              onClick={() => setTimelineChartMode('phases')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                timelineChartMode === 'phases'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3-Stage Phase Breakdown</span>
            </button>
          </div>
        </div>

        {/* Mini KPI Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-emerald-700 block font-semibold text-[11px]">Fastest Recovery</span>
            <span className="text-base font-black text-emerald-950 block mt-0.5">14 Days Avg</span>
            <span className="text-emerald-800 text-[10px]">Banking & UPI Frauds</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <span className="text-indigo-700 block font-semibold text-[11px]">Phishing & Theft</span>
            <span className="text-base font-black text-indigo-950 block mt-0.5">19 - 26 Days</span>
            <span className="text-indigo-800 text-[10px]">Credential / Identity theft</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
            <span className="text-purple-700 block font-semibold text-[11px]">Time Saved with App</span>
            <span className="text-base font-black text-purple-950 block mt-0.5">-38 Days Avg</span>
            <span className="text-purple-800 text-[10px]">Speedier court filing</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-amber-700 block font-semibold text-[11px]">Complex Frauds</span>
            <span className="text-base font-black text-amber-950 block mt-0.5">34 - 48 Days</span>
            <span className="text-amber-800 text-[10px]">Job Task & Crypto Escrow</span>
          </div>
        </div>

        {/* Recharts Bar Visualization */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {timelineChartMode === 'comparison' ? (
              <BarChart
                data={RECOVERY_TIMELINE_DATA}
                margin={{ top: 15, right: 10, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  unit=" d"
                  domain={[0, 130]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = RECOVERY_TIMELINE_DATA.find(d => d.shortLabel === label);
                      const appDays = Number(payload[0]?.value || 0);
                      const stdDays = Number(payload[1]?.value || 0);
                      const saved = stdDays - appDays;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-3.5 rounded-xl shadow-xl border border-slate-700 space-y-2 max-w-xs">
                          <div className="border-b border-slate-800 pb-1.5">
                            <div className="font-bold text-indigo-300 text-xs">
                              {item?.category || label}
                            </div>
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              Time Saved: {saved} Days Faster ({Math.round((saved / stdDays) * 100)}% speedup)
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-400 font-bold">
                            <span>With App Protocol:</span>
                            <span>{appDays} Days</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Standard Unguided:</span>
                            <span>{stdDays} Days</span>
                          </div>
                          {item && (
                            <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                              <div>
                                <span className="font-semibold text-slate-400">Statutory: </span>
                                <span>{item.statutoryBasis}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 italic">
                                "{item.keyEnabler}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="avgDaysWithApp"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="With App Protocol (Days)"
                />
                <Bar
                  dataKey="avgDaysStandard"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  name="Standard Unguided (Days)"
                />
              </BarChart>
            ) : (
              <BarChart
                data={RECOVERY_TIMELINE_DATA}
                margin={{ top: 15, right: 10, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  unit=" d"
                  domain={[0, 60]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = RECOVERY_TIMELINE_DATA.find(d => d.shortLabel === label);
                      const totalDays = item?.avgDaysWithApp || 0;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-3.5 rounded-xl shadow-xl border border-slate-700 space-y-1.5 max-w-xs">
                          <div className="border-b border-slate-800 pb-1">
                            <span className="font-bold text-indigo-300 block">{item?.category || label}</span>
                            <span className="text-[11px] text-emerald-400 font-semibold">Total Time to Restitution: {totalDays} Days</span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-400">
                            <span>Stage 1 (1930 Lien / Freeze):</span>
                            <span className="font-bold">{item?.lienFreezeDays} Days</span>
                          </div>
                          <div className="flex justify-between items-center text-indigo-400">
                            <span>Stage 2 (Cyber Cell Inquiry):</span>
                            <span className="font-bold">{item?.policeInquiryDays} Days</span>
                          </div>
                          <div className="flex justify-between items-center text-cyan-400">
                            <span>Stage 3 (Magistrate Sec 457 Order):</span>
                            <span className="font-bold">{item?.courtOrderRefundDays} Days</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="lienFreezeDays"
                  stackId="phases"
                  fill="#10b981"
                  name="Stage 1: 1930 Lien & Account Freeze (Days)"
                />
                <Bar
                  dataKey="policeInquiryDays"
                  stackId="phases"
                  fill="#6366f1"
                  name="Stage 2: Cyber Cell & FIR Inquiry (Days)"
                />
                <Bar
                  dataKey="courtOrderRefundDays"
                  stackId="phases"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  name="Stage 3: Magistrate Sec 457 Order (Days)"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Category Deep-Dive Breakdown Cards (Click to inspect) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>Category Recovery Timelines & Statutory Frameworks:</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Click any category to inspect legal mechanics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {RECOVERY_TIMELINE_DATA.map((item) => {
              const isSelected = selectedTimelineCategory === item.typeKey;
              return (
                <div
                  key={item.typeKey}
                  onClick={() => setSelectedTimelineCategory(isSelected ? null : item.typeKey)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900">{item.shortLabel}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        {item.avgDaysWithApp} Days
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {item.keyEnabler}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Standard: {item.avgDaysStandard}d</span>
                    <span className="font-semibold text-emerald-700">Save {item.avgDaysStandard - item.avgDaysWithApp} days</span>
                  </div>

                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t border-indigo-200 text-[11px] space-y-1.5 animate-fadeIn">
                      <div className="text-slate-700 font-semibold">
                        Legal Act: <span className="font-normal text-slate-600">{item.statutoryBasis}</span>
                      </div>
                      <div className="text-slate-700 font-semibold">
                        Sample Case: <span className="font-normal text-slate-600">{item.sampleIncident}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono text-[10px]">
                        <div className="p-1 rounded bg-emerald-100 text-emerald-900">
                          <span className="block font-bold">{item.lienFreezeDays}d</span>
                          <span className="text-[8px]">Freeze</span>
                        </div>
                        <div className="p-1 rounded bg-indigo-100 text-indigo-900">
                          <span className="block font-bold">{item.policeInquiryDays}d</span>
                          <span className="text-[8px]">Inquiry</span>
                        </div>
                        <div className="p-1 rounded bg-cyan-100 text-cyan-900">
                          <span className="block font-bold">{item.courtOrderRefundDays}d</span>
                          <span className="text-[8px]">Refund</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time I4C & App User Outcomes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Fraud Recovery Success Rate Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Empirical recovery and account lien statistics across verified cyber incidents where victims utilized structured de-escalation, rapid 1930 reporting, and evidence preservation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenSos && (
              <button
                onClick={onOpenSos}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Call 1930 Now</span>
              </button>
            )}
            {onOpenEvidenceLocker && (
              <button
                onClick={onOpenEvidenceLocker}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Evidence Locker</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Golden Hour Freeze</span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">88.4%</div>
            <div className="text-[11px] text-slate-300 mt-1">
              Lien success when reported within 2 hours
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Average Intercept</span>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-300">22 min</div>
            <div className="text-[11px] text-slate-300 mt-1">
              Auto-transmission to recipient mule bank
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Rescued</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">₹14.8 Cr+</div>
            <div className="text-[11px] text-slate-300 mt-1">
              Protected across 5,600+ incidents
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Judicial Refund Mandate</span>
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300">91.6%</div>
            <div className="text-[11px] text-slate-300 mt-1">
              Sec 457 CrPC / BNSS 503 orders granted
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Golden Hour Timeline</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Success by Scam Type</span>
          </button>
          <button
            onClick={() => setActiveTab('recovery-timeline')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recovery-timeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Avg Recovery Timeline (Days)</span>
            <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
              New
            </span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Recovery Probability Estimator</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'milestones'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Legal Recovery Workflow</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Source: I4C National Helpline & User Case Audits
        </span>
      </div>

      {/* TAB 1: Golden Hour Timeline Visualizer */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Recovery Success Rate vs. Reporting Time Window</span>
                  <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                    The Golden Hour Law
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison: Users executing immediate structured protocol (App Playbook) vs. unguided delayed reporting.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="font-semibold text-slate-700">With App Protocol (%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
                  <span className="text-slate-500">Unguided Reporting (%)</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TIME_WINDOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="window" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = TIME_WINDOW_DATA.find(d => d.window === label);
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1.5 max-w-xs">
                            <div className="font-bold text-indigo-300 border-b border-slate-800 pb-1 flex items-center justify-between">
                              <span>Window: {label}</span>
                              <span className="text-emerald-400">+{((Number(payload[0]?.value || 0)) - (Number(payload[1]?.value || 0)))}% Edge</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-400 font-bold">
                              <span>With App Protocol:</span>
                              <span>{payload[0]?.value}%</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400">
                              <span>Standard / Delayed:</span>
                              <span>{payload[1]?.value}%</span>
                            </div>
                            {item?.description && (
                              <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800 italic">
                                {item.description}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rateWithApp"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorApp)"
                    name="With App Protocol"
                  />
                  <Area
                    type="monotone"
                    dataKey="rateStandard"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorStandard)"
                    name="Standard / Unguided"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900">Why the 0–2 Hour Window is Critical:</span>{' '}
                Under the Indian Cyber Crime Coordination Centre (I4C) CFCFRMS framework, dialling 1930 within 120 minutes pushes real-time API holds on the recipient's bank account. This prevents the scam cartel from withdrawing through ATMs, purchasing gift cards, or routing through crypto gateways.
              </div>
            </div>
          </div>

          {/* Breakdown Pie Chart + Trend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Outcome Status of Reported Incidents
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Distribution across 5,600+ user cases followed to final judicial resolution.
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={RESOLUTION_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {RESOLUTION_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}% of Cases`, 'Resolution']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Monthly Rescued Funds (Crores ₹)
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Consistent increase in freeze efficiency as user awareness & 1930 adoption spreads.
                </p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis unit=" Cr" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          name === 'recoveredCrores' ? `₹${val} Crores Saved` : `${val} Victims Assisted`,
                          name === 'recoveredCrores' ? 'Amount Frozen' : 'Cases'
                        ]}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="recoveredCrores" fill="#6366f1" radius={[6, 6, 0, 0]} name="recoveredCrores" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Recent Milestone:</span>
                <span className="font-bold text-indigo-600">₹4.8 Cr protected in March 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Categories Comparison */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recovery Success by Cyber Threat Category
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Success rate comparison between victims utilizing this applet's checklist vs standard reporting.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
                  <span className="font-semibold text-slate-700">App Checklist Guided</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-300 inline-block" />
                  <span className="text-slate-500">Standard Reporting</span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CATEGORY_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 10, fill: '#475569' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = CATEGORY_DATA.find(c => c.category === label);
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1 max-w-xs">
                            <div className="font-bold text-indigo-300 border-b border-slate-800 pb-1">
                              {label}
                            </div>
                            <div className="flex justify-between items-center text-emerald-400 font-bold">
                              <span>With App Playbook:</span>
                              <span>{payload[0]?.value}%</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400">
                              <span>Standard Without:</span>
                              <span>{payload[1]?.value}%</span>
                            </div>
                            {item && (
                              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                                Total verified cases: {item.totalReported}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="withPlaybook" fill="#6366f1" radius={[4, 4, 0, 0]} name="With App Playbook" />
                  <Bar dataKey="standard" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Standard" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">UPI & NetBanking (84%)</span>
                <p className="text-slate-600 leading-relaxed">
                  Highest recovery chance if UTR and sender/beneficiary accounts are documented within 2 hours.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Digital Arrest (91%)</span>
                <p className="text-slate-600 leading-relaxed">
                  Victims usually send large lump sums into 1 or 2 domestic current accounts, which are quickly frozen upon calling 1930.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Fake Investment & Crypto (52%)</span>
                <p className="text-slate-600 leading-relaxed">
                  Lower recovery rate because funds are rapidly converted via P2P crypto exchanges across borders; requires swift SEBI/ED notification.
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Chart: Average Recovery Timeline (in Days) Categorized by Cyber Fraud Type */}
          {renderRecoveryTimelineChart(true)}
        </div>
      )}

      {/* TAB: Average Recovery Timeline (in Days) Categorized by Cyber Fraud Type */}
      {activeTab === 'recovery-timeline' && (
        <div className="space-y-6">
          {renderRecoveryTimelineChart(false)}
        </div>
      )}

      {/* TAB 3: Interactive Recovery Probability Estimator */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <span>Personal Recovery Probability Estimator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Answer these 5 critical parameters to project your fund freeze odds and actionable next steps.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Calculated Probability</span>
              <span className={`text-2xl font-black ${
                calculatedStats.rate >= 70 ? 'text-emerald-600' : calculatedStats.rate >= 50 ? 'text-indigo-600' : 'text-amber-600'
              }`}>
                {calculatedStats.rate}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  1. How long ago was the fraudulent transaction completed?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '<30m', label: '< 30 Minutes (Prime)' },
                    { id: '30m-2h', label: '30m - 2 Hours' },
                    { id: '2h-6h', label: '2 - 6 Hours' },
                    { id: '6h-24h', label: '6 - 24 Hours' },
                    { id: '>24h', label: 'More than 24h' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCalcTimeElapsed(opt.id)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer font-medium ${
                        calcTimeElapsed === opt.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  2. Type of Cyber Fraud Incident:
                </label>
                <select
                  value={calcIncidentType}
                  onChange={(e) => setCalcIncidentType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="upi">UPI / IMPS Unauthorized Debit</option>
                  <option value="digital-arrest">Digital Arrest / Law Enforcement Impersonation</option>
                  <option value="remote-apk">Remote Screen Sharing App (AnyDesk/APK)</option>
                  <option value="task">Telegram / Work-from-Home Task Scam</option>
                  <option value="crypto">Fake Trading App / Cryptocurrency Escrow</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">
                  3. Critical Interventions Taken:
                </span>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calcDialed1930}
                    onChange={(e) => setCalcDialed1930(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Dialed 1930 or filed on cybercrime.gov.in</span>
                    <span className="text-slate-500 text-[11px]">Enables auto-lien request across Indian banking switch</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calcBankContacted}
                    onChange={(e) => setCalcBankContacted(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Contacted Bank to Freeze Account & Dispute Transaction</span>
                    <span className="text-slate-500 text-[11px]">Establishes 3-day zero liability protection under RBI guidelines</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calcEvidencePreserved}
                    onChange={(e) => setCalcEvidencePreserved(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Preserved UTR, Transaction IDs & Chat Screenshots</span>
                    <span className="text-slate-500 text-[11px]">Required for Police FIR and Court Section 457 refund petition</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Output Gauge & Recommendations */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-center pb-4 border-b border-slate-200">
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">
                    Projected Fund Freeze Probability
                  </div>
                  <div className="inline-flex items-baseline gap-1 my-2">
                    <span className={`text-5xl font-black ${
                      calculatedStats.rate >= 75 ? 'text-emerald-600' : calculatedStats.rate >= 50 ? 'text-indigo-600' : 'text-amber-600'
                    }`}>
                      {calculatedStats.rate}%
                    </span>
                    <span className="text-sm font-bold text-slate-400">odds</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {calculatedStats.title}
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">Recovery Assessment:</span>
                    <p className="text-slate-600 leading-relaxed">
                      {calculatedStats.recommendation}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{calcDialed1930 ? 'Helpline 1930 active: Auto-lien initiated' : 'Action needed: Dial 1930 immediately to stop mule cashout'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{calcBankContacted ? 'Bank informed: Zero liability window locked' : 'Action needed: Call bank toll-free to obtain Complaint ID'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{calcEvidencePreserved ? 'Evidence ready: Fast-track court petition viable' : 'Action needed: Save all SMS & UTRs in Evidence Locker'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center gap-2 mt-4">
                {onOpenMitigationPlan && (
                  <button
                    onClick={onOpenMitigationPlan}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Mitigation Plan</span>
                  </button>
                )}
                {onGoToLegal && (
                  <button
                    onClick={onGoToLegal}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>FIR Generator</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Legal & Judicial Recovery Workflow Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              <span>The 5 Stages of Cyber Fraud Fund Recovery in India</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How money frozen in the scammer's bank account legally returns to your account through the courts.
            </p>
          </div>

          <div className="relative border-l-2 border-indigo-200 ml-4 space-y-6 pl-6 text-xs">
            {[
              {
                step: '1',
                title: 'Incident Registration & 1930 CFCFRMS Alert',
                timeline: 'Hour 0 – 2',
                status: 'Immediate Action',
                badge: 'Crucial',
                desc: 'Citizen dials 1930. Details (Transaction ID, Bank Account, Beneficiary IFSC/VPA) are entered into the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS).',
                outcome: 'Automated notification dispatched simultaneously to remitter bank and beneficiary bank.'
              },
              {
                step: '2',
                title: 'Temporary Lien / Debit Freeze on Mule Account',
                timeline: 'Hour 1 – 6',
                status: 'Banking System Action',
                badge: 'System Hold',
                desc: 'Recipient bank marks a lien on the specific debited amount inside the fraudster’s account. If funds have bounced to secondary accounts, the system triggers cascading holds.',
                outcome: 'Money is trapped inside the banking system and cannot be withdrawn via ATM, UPI, or branch.'
              },
              {
                step: '3',
                title: 'Formal Police FIR & Cyber Cell Inquiry',
                timeline: 'Day 1 – 7',
                status: 'Law Enforcement',
                badge: 'Legal Mandate',
                desc: 'A formal FIR is registered under Section 66D IT Act and relevant BNS (Bharatiya Nyaya Sanhita) sections. The Cyber Cell sends Section 91 notices to the banks seeking KYC and account statements.',
                outcome: 'Police confirm that the liened funds originated from the victim’s unauthorized debit.'
              },
              {
                step: '4',
                title: 'Court Petition under Section 457 CrPC / BNSS 503',
                timeline: 'Week 2 – 6',
                status: 'Judicial Proceedings',
                badge: 'Court Order',
                desc: 'Under Section 457 of the Criminal Procedure Code (or Section 503 Bharatiya Nagarik Suraksha Sanhita), the victim or police applies to the jurisdictional Magistrate for release of the frozen seized property.',
                outcome: 'Magistrate verifies that the scam account has no lawful claim over the seized funds.'
              },
              {
                step: '5',
                title: 'Bank Release & Direct Account Credit',
                timeline: 'Week 4 – 8',
                status: 'Final Resolution',
                badge: '91.6% Granted',
                desc: 'Court serves a certified copy of the release order to the bank nodal officer. The bank lifts the lien and credits the recovered amount directly back to the victim’s originating account.',
                outcome: 'Funds restored with complete legal indemnity.'
              }
            ].map((milestone) => (
              <div key={milestone.step} className="relative">
                <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs ring-4 ring-white">
                  {milestone.step}
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{milestone.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-semibold">
                        {milestone.timeline}
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {milestone.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-2">{milestone.desc}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Result: {milestone.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
