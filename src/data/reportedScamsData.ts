export interface ReportedScam {
  id: string;
  timestamp: string;
  encounterType: 'url' | 'message' | 'app' | 'other';
  category: 'Digital Arrest / Fake Police' | 'UPI Phishing & QR Deception' | 'Phishing Portal / Fake Bank' | 'Telegram / Part-Time Job' | 'Electricity / Utility Bill' | 'Malware / APK Trojan' | 'Other Cyber Fraud';
  title: string;
  description: string;
  fraudUrl?: string;
  messageText?: string;
  senderId?: string;
  appName?: string;
  appPackage?: string;
  appPermissions?: string[];
  scammerContact?: string;
  amountLost?: string;
  city: string;
  screenshotUrl: string; // base64 or SVG data URL
  screenshotCaption?: string;
  screenshotType: 'camera_live' | 'camera_simulated' | 'uploaded';
  status: 'Report Logged' | 'Dispatched to 1930' | 'Added to Regional Heatmap';
  riskScore: number;
  detectedThreatFlags: string[];
}

export const PRESET_SCREENSHOTS = [
  {
    id: 'cbi-digital-arrest',
    title: 'Fake CBI Digital Arrest Video Notice',
    encounterType: 'message' as const,
    category: 'Digital Arrest / Fake Police' as const,
    defaultUrl: 'https://cbi-investigation-notice.gov-verify.xyz/case-9812',
    defaultDesc: 'Received WhatsApp video call from a person wearing police uniform with national emblem backdrop, claiming an illegal FedEx courier containing narcotics was sent under my Aadhaar and demanding immediate fund transfer to RBI "safety escrow account".',
    defaultContact: '+91 98712 34567 (Skype: cbi.cybercell.hq)',
    defaultAmount: '₹2,50,000 demanded',
    badge: 'High Threat Police Impersonation',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480" fill="%230f172a"><rect width="400" height="480" fill="%230f172a"/><rect x="15" y="15" width="370" height="450" rx="16" fill="%231e293b" stroke="%23dc2626" stroke-width="2"/><circle cx="200" cy="90" r="32" fill="%23991b1b"/><text x="200" y="98" font-size="28" font-weight="bold" fill="white" text-anchor="middle">⚖️</text><text x="200" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23f87171" text-anchor="middle">CENTRAL BUREAU OF INVESTIGATION</text><text x="200" y="165" font-family="sans-serif" font-size="11" fill="%2394a3b8" text-anchor="middle">CYBER CRIME ENFORCEMENT WING</text><rect x="40" y="185" width="320" height="75" rx="8" fill="%23450a0a" stroke="%23ef4444"/><text x="200" y="210" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23fca5a5" text-anchor="middle">IMMEDIATE DIGITAL ARREST WARRANT</text><text x="200" y="230" font-family="sans-serif" font-size="10" fill="%23fecaca" text-anchor="middle">Case No: CR-ND-84920/2026 · Anti-Money Laundering</text><text x="200" y="246" font-family="sans-serif" font-size="9" fill="%23f87171" text-anchor="middle">STRICT ORDER: DO NOT DISCONNECT OR ALERT FAMILY</text><rect x="40" y="275" width="320" height="110" rx="8" fill="%23090d16"/><text x="55" y="300" font-family="sans-serif" font-size="11" fill="%23cbd5e1">Suspect: Citizen Aadhaar Linked</text><text x="55" y="322" font-family="sans-serif" font-size="11" fill="%23cbd5e1">Allegation: International Parcel with 16 MDMA tablets</text><text x="55" y="344" font-family="sans-serif" font-size="11" fill="%23fbbf24">Mandatory Verification Escrow: ₹2,50,000</text><text x="55" y="366" font-family="sans-serif" font-size="10" fill="%2394a3b8">Officer: Dy. SP A.K. Sharma · ID: CBI-8942</text><rect x="40" y="405" width="320" height="40" rx="8" fill="%23dc2626"/><text x="200" y="430" font-family="sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">CRITICAL SCAM EVIDENCE SNAPSHOT</text></svg>`
  },
  {
    id: 'fake-sbi-phishing',
    title: 'Fake SBI YONO KYC Update Phishing Page',
    encounterType: 'url' as const,
    category: 'Phishing Portal / Fake Bank' as const,
    defaultUrl: 'https://sbi-yono-kyc-verify-portal.top/login.php',
    defaultDesc: 'SMS claimed: "Dear SBI User, your YONO NetBanking will be suspended within 24 hrs due to pending Aadhaar PAN KYC. Update immediately at link below". The opened page mimics State Bank of India login and demands Netbanking password and profile password.',
    defaultContact: 'SMS Sender: VK-SBIBNK',
    defaultAmount: '₹0 (Intercepted before payment)',
    badge: 'Deceptive Phishing Domain',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480" fill="%23f8fafc"><rect width="400" height="480" fill="%23ffffff"/><rect x="0" y="0" width="400" height="70" fill="%231e3a8a"/><circle cx="45" cy="35" r="18" fill="%230284c7"/><text x="45" y="41" font-size="18" font-weight="bold" fill="white" text-anchor="middle">₹</text><text x="75" y="42" font-family="sans-serif" font-size="16" font-weight="bold" fill="white">State Bank of India - YONO</text><rect x="20" y="85" width="360" height="35" rx="6" fill="%23fef2f2" stroke="%23ef4444"/><text x="200" y="107" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="%23b91c1c" text-anchor="middle">⚠️ URGENT: Complete PAN-Aadhaar KYC to prevent block</text><rect x="25" y="135" width="350" height="270" rx="12" fill="%23f1f5f9" stroke="%23cbd5e1"/><text x="45" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">Internet Banking Login</text><rect x="45" y="180" width="310" height="36" rx="6" fill="white" stroke="%2394a3b8"/><text x="55" y="203" font-family="sans-serif" font-size="11" fill="%2364748b">User Name / CIF Number</text><rect x="45" y="230" width="310" height="36" rx="6" fill="white" stroke="%2394a3b8"/><text x="55" y="253" font-family="sans-serif" font-size="11" fill="%2364748b">Password / Profile Password</text><rect x="45" y="280" width="310" height="36" rx="6" fill="white" stroke="%2394a3b8"/><text x="55" y="303" font-family="sans-serif" font-size="11" fill="%2364748b">Registered Mobile &amp; OTP</text><rect x="45" y="335" width="310" height="42" rx="8" fill="%232563eb"/><text x="200" y="361" font-family="sans-serif" font-size="13" font-weight="bold" fill="white" text-anchor="middle">SUBMIT &amp; UNFREEZE ACCOUNT</text><rect x="20" y="420" width="360" height="42" rx="8" fill="%23991b1b"/><text x="200" y="446" font-family="sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">URL DETECTED: .top SUSPICIOUS TLD (PHISHING)</text></svg>`
  },
  {
    id: 'fake-qr-refund',
    title: 'Deceptive "Scan QR to Receive Money" UPI Scam',
    encounterType: 'message' as const,
    category: 'UPI Phishing & QR Deception' as const,
    defaultUrl: 'upi://pay?pa=refundcell.merchant89@ybl&pn=PhonePeRefund&am=15000',
    defaultDesc: 'Caller posed as PhonePe / OLX customer care representative claiming a ₹15,000 refund/cashback was pending. Sent WhatsApp QR code stating "Scan this QR code in GPay and enter your UPI PIN to receive the ₹15,000 credit immediately".',
    defaultContact: '+91 88231 09845 (WhatsApp: PhonePe Official Helpdesk)',
    defaultAmount: '₹15,000 debited',
    badge: 'UPI PIN Reversal Trick',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480" fill="%23581c87"><rect width="400" height="480" fill="%233b0764"/><rect x="20" y="20" width="360" height="440" rx="16" fill="%23ffffff"/><circle cx="200" cy="65" r="28" fill="%23673ab7"/><text x="200" y="73" font-size="24" font-weight="bold" fill="white" text-anchor="middle">₹</text><text x="200" y="112" font-family="sans-serif" font-size="15" font-weight="bold" fill="%231e1b4b" text-anchor="middle">PHONEPE CASHBACK CLAIM</text><text x="200" y="130" font-family="sans-serif" font-size="11" fill="%236b21a8" text-anchor="middle">You have received a voucher of ₹15,000</text><rect x="90" y="145" width="220" height="220" rx="12" fill="%23f3e8ff" stroke="%239333ea" stroke-width="2"/><rect x="115" y="170" width="50" height="50" fill="%231e1b4b"/><rect x="235" y="170" width="50" height="50" fill="%231e1b4b"/><rect x="115" y="290" width="50" height="50" fill="%231e1b4b"/><rect x="180" y="235" width="40" height="40" fill="%239333ea"/><circle cx="200" cy="255" r="10" fill="white"/><text x="200" y="388" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23b91c1c" text-anchor="middle">SCAM FRAUD: SCANNING QR DEBITS YOUR ACCOUNT</text><rect x="40" y="405" width="320" height="40" rx="8" fill="%23dc2626"/><text x="200" y="430" font-family="sans-serif" font-size="11.5" font-weight="bold" fill="white" text-anchor="middle">NEVER ENTER UPI PIN TO RECEIVE MONEY</text></svg>`
  },
  {
    id: 'fake-bijli-sms',
    title: 'Electricity Bill Disconnection Threat SMS',
    encounterType: 'message' as const,
    category: 'Electricity / Utility Bill' as const,
    defaultUrl: 'https://bijli-bill-support-desk.online/pay-now',
    defaultDesc: 'SMS message: "Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from the power substation because your previous month bill was not updated. Immediately call electricity officer at 9811234567 or pay bill".',
    defaultContact: '+91 97110 54321 (Electricity Officer Verma)',
    defaultAmount: '₹1,450 bill + remote access app',
    badge: 'Urgent Disconnection Extortion',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480" fill="%230f172a"><rect width="400" height="480" fill="%231e293b"/><rect x="15" y="15" width="370" height="450" rx="14" fill="%230f172a" stroke="%23f59e0b" stroke-width="2"/><text x="35" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23fbbf24">⚡ SMS WARNING · BSES / DISCOM</text><rect x="30" y="65" width="340" height="150" rx="10" fill="%23334155"/><text x="45" y="92" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f8fafc">From: VM-POWEROFC</text><text x="45" y="116" font-family="sans-serif" font-size="10.5" fill="%23fca5a5">"Dear Consumer, Your Electricity power supply</text><text x="45" y="134" font-family="sans-serif" font-size="10.5" fill="%23fca5a5">will be disconnected tonight at 9:30 PM from</text><text x="45" y="152" font-family="sans-serif" font-size="10.5" fill="%23fca5a5">electric office because your previous bill was</text><text x="45" y="170" font-family="sans-serif" font-size="10.5" fill="%23fca5a5">not updated. Please immediately contact our</text><text x="45" y="188" font-family="sans-serif" font-size="10.5" fill="%2338bdf8">officer 9711054321. Thank you."</text><rect x="30" y="235" width="340" height="150" rx="10" fill="%23450a0a" stroke="%23ef4444"/><text x="45" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23fca5a5">🚨 Fraud Syndicate Modus Operandi:</text><text x="45" y="285" font-family="sans-serif" font-size="10.5" fill="%23cbd5e1">1. Victim calls the unverified personal mobile number.</text><text x="45" y="305" font-family="sans-serif" font-size="10.5" fill="%23cbd5e1">2. Fraudster instructs installing an APK or AnyDesk.</text><text x="45" y="325" font-family="sans-serif" font-size="10.5" fill="%23cbd5e1">3. Asks for ₹10 test recharge to siphon entire savings.</text><text x="45" y="355" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23f87171">State Discoms NEVER send personal phone numbers for bill pay.</text><rect x="30" y="405" width="340" height="42" rx="8" fill="%23ea580c"/><text x="200" y="431" font-family="sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">SUSPICIOUS DISCOM EXTORTION EVIDENCE</text></svg>`
  },
  {
    id: 'fake-apk-trojan',
    title: 'Deceptive PM-Kisan / Bank Update APK Trojan',
    encounterType: 'app' as const,
    category: 'Malware / APK Trojan' as const,
    defaultUrl: 'https://pmkisan-install-direct.s3.ap-south-1.amazonaws.com/update_v3.apk',
    defaultDesc: 'Scammer sent a malicious Android Package file via WhatsApp named "SBI_Rewards_2026.apk" or "PM_Kisan_16th_Kist.apk". When installed, it requests SMS Read & Send permissions and Accessibility service to intercept NetBanking OTPs without user knowledge.',
    defaultContact: '+91 70119 88321 (WhatsApp APK link)',
    defaultAmount: '₹48,000 auto-debited via SMS hijack',
    badge: 'Malicious Android RAT',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480" fill="%2309090b"><rect width="400" height="480" fill="%2318181b"/><rect x="20" y="20" width="360" height="440" rx="16" fill="%2327272a" stroke="%23ef4444" stroke-width="2"/><circle cx="200" cy="70" r="30" fill="%23b91c1c"/><text x="200" y="79" font-size="28" font-weight="bold" fill="white" text-anchor="middle">🤖</text><text x="200" y="125" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23f87171" text-anchor="middle">ANDROID PACKAGE INSTALLER</text><text x="200" y="145" font-family="sans-serif" font-size="11" fill="%23a1a1aa" text-anchor="middle">File: PM_Kisan_Yojana_v3.apk (Unknown Source)</text><rect x="40" y="165" width="320" height="150" rx="8" fill="%233f3f46"/><text x="55" y="190" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23fbbf24">⚠️ Malicious Permissions Requested:</text><text x="55" y="215" font-family="sans-serif" font-size="10.5" fill="%23f43f5e">☒ Read, Intercept &amp; Send All SMS messages</text><text x="55" y="235" font-family="sans-serif" font-size="10.5" fill="%23f43f5e">☒ Full Device Accessibility Control</text><text x="55" y="255" font-family="sans-serif" font-size="10.5" fill="%23f43f5e">☒ Overlay on Banking &amp; UPI applications</text><text x="55" y="280" font-family="sans-serif" font-size="10" fill="%23e4e4e7">This app bypasses Google Play Protect verification.</text><rect x="40" y="335" width="320" height="50" rx="8" fill="%237f1d1d"/><text x="200" y="365" font-family="sans-serif" font-size="11.5" font-weight="bold" fill="%23fecaca" text-anchor="middle">TROJAN DETECTED · REMOTE ACCESS TOOL</text><rect x="40" y="405" width="320" height="40" rx="8" fill="%23dc2626"/><text x="200" y="430" font-family="sans-serif" font-size="11.5" font-weight="bold" fill="white" text-anchor="middle">SCREENSHOT CAPTURED FROM VICTIM PHONE</text></svg>`
  }
];

export const INITIAL_USER_REPORTS: ReportedScam[] = [
  {
    id: 'SCAM-2026-IND-9042',
    timestamp: '2026-10-13T06:15:00Z',
    encounterType: 'url',
    category: 'Phishing Portal / Fake Bank',
    title: 'Cloned SBI YONO Portal Harvests NetBanking Credentials & OTPs',
    description: 'Received SMS stating netbanking was frozen. Link redirected to an identical clone of SBI retail login on a suspicious .top domain demanding password and profile password.',
    fraudUrl: 'https://sbi-yono-kyc-verify-portal.top/login.php',
    senderId: 'VK-SBIBNK',
    scammerContact: '+91 88001 92834 (SMS Sender)',
    amountLost: '₹0 (Citizen flagged before OTP submission)',
    city: 'Mumbai',
    screenshotUrl: PRESET_SCREENSHOTS[1].svgDataUrl,
    screenshotCaption: 'Deceptive fake bank credential harvesting login screen',
    screenshotType: 'camera_simulated',
    status: 'Dispatched to 1930',
    riskScore: 97,
    detectedThreatFlags: [
      'Unverified .top Domain',
      'Banking Credential Harvester',
      'Urgent Account Freeze Threat',
      'Phishing Portal'
    ]
  },
  {
    id: 'SCAM-2026-IND-8912',
    timestamp: '2026-10-12T18:42:00Z',
    encounterType: 'message',
    category: 'Digital Arrest / Fake Police',
    title: 'Extortion Call Posing as Mumbai Crime Branch over FedEx Narcotics',
    description: 'Victim received a video call from an individual in khaki uniform alleging a parcel seized with 15 fake passports and narcotic drugs in Mumbai airport. Threat of immediate non-bailable warrant if ₹2,00,000 was not deposited into an RBI clearance account.',
    fraudUrl: 'https://cbi-investigation-notice.gov-verify.xyz/case-9812',
    messageText: 'Immediate Digital Arrest Warrant issued by Cyber Crime Enforcement Wing. Strict order: do not disconnect or alert family.',
    scammerContact: '+91 98712 34567 (Skype: cbi.cybercell.hq)',
    amountLost: '₹2,00,000 demanded',
    city: 'Delhi NCR',
    screenshotUrl: PRESET_SCREENSHOTS[0].svgDataUrl,
    screenshotCaption: 'Fake CBI Digital Arrest Notice with fabricated National Emblem and fake Dy. SP badge',
    screenshotType: 'camera_simulated',
    status: 'Dispatched to 1930',
    riskScore: 98,
    detectedThreatFlags: [
      'Police / CBI Impersonation',
      'Digital Arrest Extortion',
      'Unverified .xyz Phishing Link',
      'Coerced Bank Transfer'
    ]
  },
  {
    id: 'SCAM-2026-IND-8431',
    timestamp: '2026-10-12T16:20:00Z',
    encounterType: 'app',
    category: 'Malware / APK Trojan',
    title: 'Malicious PM-Kisan & Bank Rewards APK Trojan Siphons OTPs',
    description: 'WhatsApp message offered ₹2,000 direct subsidy via PM Kisan scheme with an attached APK installer. On install, requested full SMS read permissions and accessibility control to bypass 2FA.',
    appName: 'PM_Kisan_Yojana_v3.apk',
    appPackage: 'com.gov.kisan.update.apk',
    appPermissions: ['Read & Send All SMS', 'Accessibility Service', 'Screen Overlay'],
    fraudUrl: 'https://pmkisan-install-direct.s3.ap-south-1.amazonaws.com/update_v3.apk',
    scammerContact: '+91 70119 88321 (WhatsApp Forward)',
    amountLost: '₹48,000 unauthorized debit',
    city: 'Jaipur',
    screenshotUrl: PRESET_SCREENSHOTS[4].svgDataUrl,
    screenshotCaption: 'Malicious Android APK requesting sensitive SMS interception privileges',
    screenshotType: 'camera_simulated',
    status: 'Added to Regional Heatmap',
    riskScore: 96,
    detectedThreatFlags: [
      'Remote Device Hijack',
      'SMS 2FA Bypass Trojan',
      'Malicious APK Sideloading',
      'Accessibility Privilege Abuse'
    ]
  },
  {
    id: 'SCAM-2026-IND-7641',
    timestamp: '2026-10-12T14:15:00Z',
    encounterType: 'url',
    category: 'UPI Phishing & QR Deception',
    title: 'Fraudulent PhonePe Cashback QR Code Request',
    description: 'Scammer sent a QR code stating it was a cashback payment for an OLX furniture sale. Asked victim to scan in Google Pay and punch in UPI PIN to credit the ₹15,000.',
    fraudUrl: 'upi://pay?pa=refundcell.merchant89@ybl&pn=PhonePeRefund&am=15000',
    scammerContact: '+91 88231 09845',
    amountLost: '₹15,000',
    city: 'Bengaluru',
    screenshotUrl: PRESET_SCREENSHOTS[2].svgDataUrl,
    screenshotCaption: 'Phony PhonePe Cashback QR code deceptive claim voucher',
    screenshotType: 'camera_simulated',
    status: 'Added to Regional Heatmap',
    riskScore: 92,
    detectedThreatFlags: [
      'UPI PIN Reversal Deception',
      'Fake OLX Merchant Account',
      'Cashback Social Engineering'
    ]
  },
  {
    id: 'SCAM-2026-IND-7104',
    timestamp: '2026-10-12T11:05:00Z',
    encounterType: 'message',
    category: 'Electricity / Utility Bill',
    title: 'Threatening SMS Warning of Immediate Power Cut Tonight',
    description: 'SMS from VM-POWEROFC stating electricity supply will be disconnected tonight at 9:30 PM due to unpaid bill. Directed victim to call an unauthorized mobile number.',
    messageText: 'Dear Consumer, Your Electricity power supply will be disconnected tonight at 9:30 PM from electric office because your previous bill was not updated. Please immediately contact our officer 9711054321.',
    senderId: 'VM-POWEROFC',
    fraudUrl: 'https://bijli-bill-support-desk.online/pay-now',
    scammerContact: '+91 97110 54321',
    amountLost: '₹1,450 + attempt to install remote screen app',
    city: 'Lucknow',
    screenshotUrl: PRESET_SCREENSHOTS[3].svgDataUrl,
    screenshotCaption: 'Electricity disconnection threat SMS pretending to be state power corporation',
    screenshotType: 'camera_simulated',
    status: 'Dispatched to 1930',
    riskScore: 89,
    detectedThreatFlags: [
      'Engineered Urgency & Panic',
      'Impersonation of State Utility',
      'Personal Phone Number for Official Payment'
    ]
  }
];

