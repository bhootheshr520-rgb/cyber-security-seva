export interface PushAdvisory {
  id: string;
  title: string;
  body: string;
  severity: 'Critical' | 'High' | 'Advisory';
  agency: string;
  advisoryCode: string;
  timestamp: string;
  createdAt: number;
  read: boolean;
  threatType: 'digital_arrest' | 'apk' | 'phishing' | 'banking' | 'job_scam' | 'electricity' | 'ai_deepfake';
  immediateAction: string;
  fullDetails: string;
}

export const INITIAL_PUSH_ADVISORIES: PushAdvisory[] = [
  {
    id: 'push-2025-01',
    title: '🚨 CRITICAL: Fake Supreme Court "Digital Arrest" Video Extortion Wave',
    body: 'Syndicates posing as CBI & Police on Skype threatening fake arrest over drug courier parcels. Disconnect immediately.',
    severity: 'Critical',
    agency: 'I4C & Ministry of Home Affairs (MHA)',
    advisoryCode: 'I4C/ADV/2025/DA-09',
    timestamp: '2m ago',
    createdAt: Date.now() - 2 * 60 * 1000,
    read: false,
    threatType: 'digital_arrest',
    immediateAction: 'Disconnect Skype/WhatsApp video call immediately. No police or court conducts arrests online. Dial 1930.',
    fullDetails: 'Active pan-India syndicates are running simulated Skype courtrooms with fake police insignias and forged supreme court arrest warrants. Victims are coerced into staying on continuous video calls while liquidating fixed deposits into "escrow clearance accounts".'
  },
  {
    id: 'push-2025-02',
    title: '⚡ URGENT: Fake Electricity Bill Power Cutoff SMS Alert',
    body: 'SMS claims electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Contains fake officer phone number.',
    severity: 'Critical',
    agency: 'CERT-In Cyber Threat Advisory',
    advisoryCode: 'CERT-IN/ADV/2025/EB-18',
    timestamp: '18m ago',
    createdAt: Date.now() - 18 * 60 * 1000,
    read: false,
    threatType: 'electricity',
    immediateAction: 'Do NOT call the mobile number in the SMS. Check bill balance only through your official electricity board portal/app.',
    fullDetails: 'Attackers send mass SMS alerts reading "Dear Customer, Electricity power will be disconnected at 9:30 PM from power house because previous month bill was not updated. Please immediately contact power officer on 98XXXXXXXX". Calling the number leads to remote desktop apps (AnyDesk/TeamViewer) installation.'
  },
  {
    id: 'push-2025-03',
    title: '⚠️ HIGH: Trojanized APK "PM-Kisan-Update.apk" circulating on WhatsApp',
    body: 'Malicious Android application intercepts banking SMS and forwards incoming OTPs to offshore servers.',
    severity: 'High',
    agency: 'CERT-In & NPCI',
    advisoryCode: 'CERT-IN/ADV/2025/APK-04',
    timestamp: '1h ago',
    createdAt: Date.now() - 60 * 60 * 1000,
    read: true,
    threatType: 'apk',
    immediateAction: 'Never install .apk files received via WhatsApp or Telegram. Uninstall immediately and reboot phone in Safe Mode.',
    fullDetails: 'A high-risk malware APK is being distributed via WhatsApp forward messages promising government subsidies. Once installed, it requests SMS interception and notification listener permissions, secretly stealing two-factor authentication codes.'
  }
];

export const UPCOMING_THREAT_POOL: Omit<PushAdvisory, 'id' | 'createdAt' | 'timestamp' | 'read'>[] = [
  {
    title: '🚨 CRITICAL: Spoofed Bank Helpline Robocall Claiming Unauthorized ₹48,500 Debit',
    body: 'IVR robocalls spoofing top national banks claiming urgent debit card block. Prompts user to key in ATM PIN.',
    severity: 'Critical',
    agency: 'Reserve Bank of India (RBI) & I4C',
    advisoryCode: 'RBI/CYBER/2025/IVR-03',
    threatType: 'banking',
    immediateAction: 'Disconnect call immediately. Banks never ask for PIN or OTP over automated phone calls. Dial 1930.',
    fullDetails: 'Syndicates use caller ID spoofing to display official bank customer care numbers. Automated voice warns of unauthorized international transactions and instructs the victim to press 1 and enter their 4-digit PIN for immediate reversal.'
  },
  {
    title: '⚠️ HIGH: TRAI Mobile Number Disconnection in 2 Hours Deception',
    body: 'Threatening calls claiming TRAI will block your SIM card today due to illegal advertisement spam. Demands Aadhaar verification.',
    severity: 'High',
    agency: 'Department of Telecommunications (DoT)',
    advisoryCode: 'DOT/CHAKSHU/2025/TEL-11',
    threatType: 'phishing',
    immediateAction: 'Disconnect and report the calling number directly on the Chakshu facility at sancharsaathi.gov.in.',
    fullDetails: 'Automated robocalls impersonating the Telecom Regulatory Authority of India (TRAI) threaten immediate SIM deactivation within 2 hours. Victims are pressured into sharing biometric or Aadhaar details under intimidation.'
  },
  {
    title: '🚨 CRITICAL: AI Voice Clone "Child in Police Custody" Distress Call',
    body: 'Fraudsters use 3-second audio samples from social media to clone family members\' voices crying for urgent bail money.',
    severity: 'Critical',
    agency: 'Indian Cyber Crime Coordination Centre (I4C)',
    advisoryCode: 'I4C/ADV/2025/VOICE-07',
    threatType: 'ai_deepfake',
    immediateAction: 'Pause. Ask a personal secret question only your child/relative knows. Do NOT transfer money in panic.',
    fullDetails: 'Scammers scrape public reels and video posts on Instagram/TikTok to clone high-fidelity voices of young adults. They call parents claiming an urgent road accident or police custody requiring immediate ₹50,000 via UPI.'
  },
  {
    title: '⚠️ HIGH: Fraudulent "Part-Time YouTube Like & Earn" Telegram Syndicate',
    body: 'Promises ₹150 per video like, then traps victims in high-value VIP cryptocurrency escrow schemes.',
    severity: 'High',
    agency: 'State Cyber Crime Police',
    advisoryCode: 'POLICE/ADV/2025/TASK-88',
    threatType: 'job_scam',
    immediateAction: 'Do not pay any deposits for remote freelance work. Legitimate companies never demand advance escrow payments.',
    fullDetails: 'Victims receive WhatsApp invitations for easy part-time work liking YouTube clips. After a small ₹300 payout to establish trust, they are coerced into transferring lakhs into fraudulent merchant trading pools.'
  }
];
