export interface CyberDefenderBadge {
  id: string;
  title: string;
  codeName: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Master';
  icon: string;
  badgeColor: string;
  borderAccent: string;
  bgGradient: string;
  glowColor: string;
  requirementType: 'module' | 'streak' | 'master';
  moduleId?: string;
  requiredStreakDays?: number;
  description: string;
  threatCategory: string;
  digitalReward: {
    rewardTitle: string;
    rewardType: 'Protocol Cheat-Sheet' | 'Official Legal Guide' | 'Kill-Switch Toolkit' | 'Confidential FIR Kit' | 'URL Header Checklist' | 'Accredited Digital Certificate' | 'Master Distinction Medal';
    summary: string;
    downloadableFileName: string;
    perkBenefit: string;
  };
}

export const CYBER_DEFENDER_BADGES: CyberDefenderBadge[] = [
  {
    id: 'badge-upi-fortress',
    title: 'UPI Fortress Defender',
    codeName: 'DEF-UPI-01',
    tier: 'Bronze',
    icon: '🛡️',
    badgeColor: 'text-amber-500',
    borderAccent: 'border-amber-400',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-slate-900',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    requirementType: 'module',
    moduleId: 'vid-upi-rules',
    description: 'Mastered the golden rule of UPI protocols: PIN entry is strictly for debiting, never for receiving.',
    threatCategory: 'UPI & Banking Fraud',
    digitalReward: {
      rewardTitle: 'NPCI UPI Golden Protocol Pocket Sheet',
      rewardType: 'Protocol Cheat-Sheet',
      summary: 'Official NPCI & RBI guidelines for instant payment dispute filing, bank chargeback forms, and UPI freeze hotline scripts.',
      downloadableFileName: 'UPI_Golden_Rules_Defender_Card.pdf',
      perkBenefit: 'Permanent +50 Shield XP & Verified UPI Defender Seal'
    }
  },
  {
    id: 'badge-anti-digital-arrest',
    title: 'Anti-Digital Arrest Sentinel',
    codeName: 'DEF-CBI-02',
    tier: 'Silver',
    icon: '⚖️',
    badgeColor: 'text-blue-400',
    borderAccent: 'border-blue-400',
    bgGradient: 'from-blue-500/10 via-blue-500/5 to-slate-900',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    requirementType: 'module',
    moduleId: 'vid-digital-arrest',
    description: 'Immune to fake Skype/WhatsApp video arrest extortion. Knows that police summons require signed BNSS physical notices.',
    threatCategory: 'Digital Arrest & Video Intimidation',
    digitalReward: {
      rewardTitle: 'Citizen Rights & BNSS 35 Summons Legal Dossier',
      rewardType: 'Official Legal Guide',
      summary: 'Step-by-step rights handbook citing CrPC 41A / BNSS 35, highlighting why video arrests are illegal and how to file immediate Chakshu portal reports.',
      downloadableFileName: 'Anti_Digital_Arrest_Citizen_Rights.pdf',
      perkBenefit: 'Priority Legal Guide Access & Zero-Panic Emergency Checklist'
    }
  },
  {
    id: 'badge-endpoint-guardian',
    title: 'Endpoint & APK Guardian',
    codeName: 'DEF-APK-03',
    tier: 'Silver',
    icon: '📱',
    badgeColor: 'text-emerald-400',
    borderAccent: 'border-emerald-400',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-slate-900',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    requirementType: 'module',
    moduleId: 'vid-remote-screen-share',
    description: 'Trained in detecting rogue sideloaded APKs and remote screen-sharing tools (AnyDesk/RustDesk) designed to hijack OTPs.',
    threatCategory: 'Malware & Screen Takeover',
    digitalReward: {
      rewardTitle: 'Mobile Screen Hijack & APK Kill-Switch Toolkit',
      rewardType: 'Kill-Switch Toolkit',
      summary: 'Emergency airplane-mode procedure, accessibility permission audit guide, and rogue profile removal checklists for Android & iOS.',
      downloadableFileName: 'Mobile_Remote_KillSwitch_Toolkit.pdf',
      perkBenefit: 'One-Tap Malware Isolation Protocol Card'
    }
  },
  {
    id: 'badge-confidential-shield',
    title: 'Confidentiality & Anti-Extortion Shield',
    codeName: 'DEF-EXT-04',
    tier: 'Gold',
    icon: '🔒',
    badgeColor: 'text-purple-400',
    borderAccent: 'border-purple-400',
    bgGradient: 'from-purple-500/10 via-purple-500/5 to-slate-900',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    requirementType: 'module',
    moduleId: 'vid-sextortion-defense',
    description: 'Understands extortionist psychology, IT Act Section 66E/67 protections, StopNCII evidence locking, and why paying never solves blackmail.',
    threatCategory: 'Blackmail & Photo Morphin Protection',
    digitalReward: {
      rewardTitle: 'StopNCII & Cyber Cell Confidential Evidence Kit',
      rewardType: 'Confidential FIR Kit',
      summary: 'Complete confidential evidence vault walkthrough, hash registration guide on StopNCII, and formal cyber crime reporting template.',
      downloadableFileName: 'Anti_Blackmail_Confidential_Evidence_Kit.pdf',
      perkBenefit: 'Confidential 1090/1930 Helpline Quick-Connect'
    }
  },
  {
    id: 'badge-phishing-interceptor',
    title: 'Phishing & Fake Domain Interceptor',
    codeName: 'DEF-PHISH-05',
    tier: 'Gold',
    icon: '🔍',
    badgeColor: 'text-amber-300',
    borderAccent: 'border-amber-300',
    bgGradient: 'from-amber-400/10 via-amber-400/5 to-slate-900',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    requirementType: 'module',
    moduleId: 'vid-phishing-fake-sites',
    description: 'Expert at identifying typosquatting, spoofed banking domains, shortened URLs (bit.ly/tinyurl), and fake search ads.',
    threatCategory: 'Phishing & Fake Banking Sites',
    digitalReward: {
      rewardTitle: 'Domain Legitimate Header & SSL Verification Checklist',
      rewardType: 'URL Header Checklist',
      summary: 'Quick-reference guide to authenticate Indian banking sender headers (BP-SBIIN, VM-HDFCBK) and detect counterfeit payment gateways.',
      downloadableFileName: 'Phishing_Header_Verification_Checklist.pdf',
      perkBenefit: 'Certified URL Auditor Badge'
    }
  },
  {
    id: 'badge-7day-streak-champion',
    title: '7-Day Suraksha Veteran',
    codeName: 'DEF-STRK-07',
    tier: 'Diamond',
    icon: '🔥',
    badgeColor: 'text-orange-400',
    borderAccent: 'border-orange-400',
    bgGradient: 'from-orange-500/15 via-red-500/10 to-slate-900',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    requirementType: 'streak',
    requiredStreakDays: 7,
    description: 'Demonstrated relentless cyber hygiene by maintaining an unbroken 7+ day safety streak of daily threat drills.',
    threatCategory: 'Consistent Habit & Vigilance',
    digitalReward: {
      rewardTitle: 'Accredited 7-Day Cyber Defender Digital Certificate',
      rewardType: 'Accredited Digital Certificate',
      summary: 'Official verifiable citizen digital certificate recognized under Cyber Security Seva, complete with unique cryptographic Certificate ID and Gold Seal.',
      downloadableFileName: 'Cyber_Defender_7Day_Accredited_Certificate.pdf',
      perkBenefit: 'Exclusive 7-Day Citizen Medal & Verifiable Digital Certificate'
    }
  },
  {
    id: 'badge-grand-master-defender',
    title: 'Bharat Grand Cyber Defender',
    codeName: 'DEF-MST-00',
    tier: 'Master',
    icon: '🇮🇳',
    badgeColor: 'text-indigo-400',
    borderAccent: 'border-indigo-400',
    bgGradient: 'from-indigo-600/20 via-purple-600/10 to-slate-900',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    requirementType: 'master',
    description: 'The pinnacle of citizen defense: Complete all 5 core threat-awareness modules AND achieve a 7+ day safety streak.',
    threatCategory: 'Comprehensive Cyber Mastery',
    digitalReward: {
      rewardTitle: 'National Master Cyber Defender Distinction & Citation',
      rewardType: 'Master Distinction Medal',
      summary: 'Highest citizen accreditation acknowledging flawless defense capability across all attack vectors, signed by the Cyber Seva Academy Director.',
      downloadableFileName: 'Master_Cyber_Defender_National_Citation.pdf',
      perkBenefit: 'Golden Hall-of-Fame Seal + Permanent +500 Defense XP'
    }
  }
];

export const CERTIFICATE_AUTHORITY_INFO = {
  issuerName: 'National Cyber Security Seva Academy',
  collaboratingBodies: ['Indian Cyber Crime Coordination Centre (I4C)', 'Citizen Financial Cyber Fraud Reporting System (CFCFRMS)'],
  portal: 'cybercrime.gov.in / National Helpline 1930',
  accreditationLevel: 'Citizen Cyber Defense Level III'
};
