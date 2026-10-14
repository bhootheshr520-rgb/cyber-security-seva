export interface DailySafetyTip {
  id: string;
  dayNumber: number;
  category: 'UPI & Banking' | 'Identity & Aadhaar' | 'Social Engineering' | 'Device Security' | 'Digital Arrests' | 'Telecom & SIM';
  title: string;
  goldenRule: string;
  scenario: string;
  actionDrill: string;
  keyWarning: string;
  officialRef: string;
  readTime: string;
}

export interface MilestoneBadge {
  id: string;
  requiredDays: number;
  name: string;
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  perk: string;
  description: string;
}

export interface SafetyStreakState {
  currentStreak: number;
  highestStreak: number;
  totalTipsCompleted: number;
  shieldXp: number;
  lastCompletedDate: string; // YYYY-MM-DD
  history: { [dateStr: string]: boolean };
  activeFreezes: number;
  completedTipIds: string[];
  unlockedBadgeIds: string[];
}

export const MILESTONE_BADGES: MilestoneBadge[] = [
  {
    id: 'bronze-sentinel',
    requiredDays: 3,
    name: 'Bronze Sentinel',
    title: 'First Wall of Defense',
    icon: '🛡️',
    color: 'text-amber-700',
    borderColor: 'border-amber-300',
    bgGradient: 'from-amber-100 to-amber-50',
    perk: '+100 Shield XP & Bronze Citizen Ribbon',
    description: '3 consecutive days of cyber safety drills completed. The habit is forming!'
  },
  {
    id: 'silver-guardian',
    requiredDays: 7,
    name: 'Silver Cyber Guardian',
    title: 'Weekly Shield Veteran',
    icon: '⚔️',
    color: 'text-slate-700',
    borderColor: 'border-slate-300',
    bgGradient: 'from-slate-100 to-slate-50',
    perk: 'Free Streak Freeze + 250 Shield XP',
    description: '1 full week of zero lapses. You can spot 90% of basic phishing and UPI traps.'
  },
  {
    id: 'golden-fraud-buster',
    requiredDays: 14,
    name: 'Golden Fraud Buster',
    title: 'Two-Week Fortress',
    icon: '👑',
    color: 'text-yellow-700',
    borderColor: 'border-yellow-400',
    bgGradient: 'from-yellow-100 to-amber-50',
    perk: 'Gold Profile Badge & Priority Helpline Cards',
    description: '14 consecutive days of cyber vigilance. Immunity against social engineering attacks!'
  },
  {
    id: 'platinum-commander',
    requiredDays: 30,
    name: 'Platinum Cyber Commander',
    title: 'Monthly Suraksha Sentinel',
    icon: '💎',
    color: 'text-cyan-700',
    borderColor: 'border-cyan-300',
    bgGradient: 'from-cyan-100 to-blue-50',
    perk: 'National Cyber Warrior Certificate of Knowledge',
    description: '30 consecutive days of mastery. You protect not just yourself, but your family.'
  },
  {
    id: 'bharat-champion',
    requiredDays: 60,
    name: 'Bharat Cyber Champion',
    title: 'Digital India Guardian',
    icon: '🇮🇳',
    color: 'text-indigo-700',
    borderColor: 'border-indigo-400',
    bgGradient: 'from-indigo-100 to-purple-50',
    perk: 'Master Sentinel Seal & Elite Cyber Rank',
    description: '60 days of relentless cyber hygiene. You are an untouchable digital asset.'
  }
];

export const DAILY_SAFETY_TIPS: DailySafetyTip[] = [
  {
    id: 'tip-1',
    dayNumber: 1,
    category: 'UPI & Banking',
    title: 'The Golden UPI Rule: Receiving Money NEVER Requires a PIN',
    goldenRule: 'PIN entry is strictly for SENDING money. If someone claims you must enter a PIN to receive a payment or refund, it is ALWAYS fraud.',
    scenario: 'OLX buyer sends a ₹15,000 QR code saying "Scan this in PhonePe to receive advance token money."',
    actionDrill: 'Never enter your 4 or 6 digit UPI PIN on any request that mentions "credit", "cashback", or "receive funds".',
    keyWarning: 'Under NPCI rules, incoming transfers credit automatically into your account without PIN or QR scan.',
    officialRef: 'NPCI / RBI Circular on UPI Security (2024)',
    readTime: '1 min drill'
  },
  {
    id: 'tip-2',
    dayNumber: 2,
    category: 'Digital Arrests',
    title: 'Debunking "Digital Arrest": Police NEVER Interrogate via WhatsApp Video',
    goldenRule: 'Indian law enforcement (CBI, ED, Narcotics, Police) NEVER conduct arrests, bail settlements, or court hearings via Skype or WhatsApp.',
    scenario: 'A caller in police uniform shows fake warrant saying your Aadhaar was found in 58 parcel drug shipments to Cambodia.',
    actionDrill: 'Disconnect the video call immediately. Dial National Cyber Helpline 1930 or visit your local police station.',
    keyWarning: 'Scammers use fake Supreme Court badges and artificial courtroom sets to induce panic.',
    officialRef: 'Ministry of Home Affairs (MHA) & I4C Public Advisory (2025)',
    readTime: '1 min drill'
  },
  {
    id: 'tip-3',
    dayNumber: 3,
    category: 'Identity & Aadhaar',
    title: 'Lock Your Aadhaar Biometrics on the Official mAadhaar App',
    goldenRule: 'Prevent unauthorized thumbprint AePS bank withdrawals by keeping your Aadhaar biometric status locked.',
    scenario: 'Fraudsters extract thumbprint impressions from land registry sale deed PDFs and empty bank accounts via AePS micro-ATMs.',
    actionDrill: 'Open the mAadhaar app or myaadhaar.uidai.gov.in right now, navigate to "Lock/Unlock Biometrics", and activate the lock.',
    keyWarning: 'Locked biometrics prevent all AePS withdrawals until you temporarily unlock it for 10 minutes when needed.',
    officialRef: 'UIDAI AePS Hardening Guidelines',
    readTime: '2 min drill'
  },
  {
    id: 'tip-4',
    dayNumber: 4,
    category: 'Telecom & SIM',
    title: 'Beware eSIM & SIM Swap: The Deadly 12-Hour Silence Trap',
    goldenRule: 'If your mobile network suddenly shows "No Service" or SOS without explanation, investigate immediately from another phone.',
    scenario: 'Scammer submits fake duplicate SIM request; your phone goes dead while they drain bank accounts using OTPs sent to the swapped SIM.',
    actionDrill: 'Immediately contact your telecom provider (Airtel/Jio/Vi) and inform your bank to temporarily freeze internet banking.',
    keyWarning: 'Never forward SMS containing "SWAP", "121", or 19-digit eSIM QR codes to unknown numbers.',
    officialRef: 'DoT Guidelines on Telecommunication Security & TAFCOP',
    readTime: '2 min drill'
  },
  {
    id: 'tip-5',
    dayNumber: 5,
    category: 'Device Security',
    title: 'The Danger of Sideloaded APKs: "Electricity Bill Update" Scam',
    goldenRule: 'Never install Android APK files received over WhatsApp, Telegram, or SMS. Always download exclusively from Google Play Store.',
    scenario: 'SMS says: "Your electricity will be disconnected tonight at 9:30 PM. Call officer Sharma or install BijliUpdate.apk to update bill."',
    actionDrill: 'Inspect and disable "Install apps from Unknown Sources" in your Android security settings. Verify electricity bills on the official DISCOM portal.',
    keyWarning: 'Malicious APKs contain remote overlay malware (like SharkBot/Brat) that mirror screen and steal OTPs.',
    officialRef: 'CERT-In Vulnerability Note CIVN-2025-014',
    readTime: '1 min drill'
  },
  {
    id: 'tip-6',
    dayNumber: 6,
    category: 'Social Engineering',
    title: 'Urgent AI Voice Clones: Establish a Secret Family Safe-Word',
    goldenRule: 'Never transfer emergency bail or hospital funds without independently calling the family member back on their known number.',
    scenario: 'A caller sounds exactly like your child crying: "Papa, police caught me in an accident, give ₹50,000 to this lawyer or I go to jail."',
    actionDrill: 'Agree on a private family verification word or question (e.g. "What was the name of our childhood street dog?") that AI cannot guess.',
    keyWarning: 'Scammers scrape 3-second audio snippets from Instagram reels or YouTube to clone voices with 95% acoustic fidelity.',
    officialRef: 'I4C Advisory on Generative AI Audio Impersonation',
    readTime: '2 min drill'
  },
  {
    id: 'tip-7',
    dayNumber: 7,
    category: 'UPI & Banking',
    title: 'The "Golden Hour" Action: Freeze Transactions within 2 Hours',
    goldenRule: 'Reporting financial fraud on 1930 within 120 minutes increases funds recovery probability to over 85%.',
    scenario: 'Accidental payment to fraudster: Money travels through 4 "mule accounts" in 60 minutes before ATM withdrawal.',
    actionDrill: 'Save National Cyber Crime Reporting Portal helpline 1930 and keep bank Transaction ID (UTR/RRN) ready.',
    keyWarning: 'The Indian Cyber Crime Coordination Centre (I4C) CFCFRMS system automatically halts funds in mule accounts if notified promptly.',
    officialRef: 'CFCFRMS / Citizen Financial Cyber Fraud Reporting System',
    readTime: '1 min drill'
  }
];

export const REINFORCEMENT_QUOTES = [
  { days: 1, quote: 'A single spark begins the flame of digital self-defense. Welcome to day one!', author: 'Cyber Seva Academy' },
  { days: 2, quote: 'Two days of awareness have already reduced your risk of impulse scams by 40%.', author: 'I4C Research' },
  { days: 3, quote: 'Bronze Sentinel unlocked! You are building proactive muscle memory against fraud.', author: 'National Cyber Security Protocol' },
  { days: 4, quote: 'Consistent knowledge is your strongest firewall. No hacker can bypass an informed citizen.', author: 'CERT-In Advisory' },
  { days: 5, quote: 'Outstanding streak! 5 days of vigilance places you ahead of 92% of internet users.', author: 'Digital India Initiative' },
  { days: 6, quote: 'One more day to your 7-Day Silver Guardian status. Keep your shield raised!', author: 'Cyber Suraksha Mission' },
  { days: 7, quote: '7 Days of Zero Vulnerability! You have completed a full week of proactive defense.', author: 'Bharat Cyber Cell' }
];
