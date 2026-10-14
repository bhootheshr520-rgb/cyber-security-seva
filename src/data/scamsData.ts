export interface ScamPattern {
  id: string;
  title: string;
  category: 'Banking & UPI' | 'Impersonation & Threat' | 'Job & Task' | 'Investment' | 'Extortion & Blackmail' | 'Malware & Tech';
  threatLevel: 'Critical' | 'High' | 'Medium';
  victimProfile: string;
  summary: string;
  modusOperandi: string[];
  redFlags: string[];
  sampleMessages: string[];
  immediateSteps: string[];
  legalSections: string[];
}

export const SCAM_PATTERNS: ScamPattern[] = [
  {
    id: 'digital-arrest',
    title: 'Digital Arrest / Fake Police & CBI Video Call',
    category: 'Impersonation & Threat',
    threatLevel: 'Critical',
    victimProfile: 'Senior citizens, working professionals, homemakers',
    summary: 'Fraudsters impersonate Police, CBI, ED, or Customs officers over Skype or WhatsApp video, falsely accusing the victim of money laundering, narcotics in parcels, or illegal SIM cards, and force them into illegal "digital custody" until money is transferred.',
    modusOperandi: [
      'Victim receives an automated IVR call claiming their mobile number or parcel via FedEx/DHL is linked to illegal narcotics/passports.',
      'Call transferred to a fake "Cyber Crime Inspector" or "CBI Officer" wearing a uniform in a simulated police station backdrop.',
      'Fraudster displays forged arrest warrants, Supreme Court seals, and CBI official letters with the victim’s Aadhaar details.',
      'Victim is commanded to remain on camera 24/7 without informing family or lawyers under threat of immediate physical arrest.',
      'Victim is coerced into transferring all savings to a "Secret Government RBI Escrow Account" for "asset verification", promising a full refund within 30 minutes.'
    ],
    redFlags: [
      'No Indian police force, CBI, ED, or court ever conducts arrests, interrogations, or trials over Skype or WhatsApp video.',
      'No law enforcement agency ever asks citizens to transfer money to a bank account for "verification" or "clearance".',
      'High pressure to stay on call and keep it strictly confidential from family, bank officials, or lawyers.',
      'Use of fake police letterheads, fake official stamps, and urgent countdown deadlines.'
    ],
    sampleMessages: [
      '"This is Telecom Regulatory Authority / CBI. A FedEx parcel from Mumbai to Thailand containing 16 passports and 140g MDMA was booked in your Aadhaar. Connect immediately on Skype: cbi.investigation.hq to avoid non-bailable warrant."',
      '"Supreme Court Digital Court has initiated your judicial remand. Do not disconnect video or you will be intercepted within 15 minutes."'
    ],
    immediateSteps: [
      'Immediately disconnect the video call. You are in NO legal danger from these fraudsters.',
      'Block the caller number and report the WhatsApp/Skype account.',
      'Call 1930 or file an alert on cybercrime.gov.in immediately.',
      'If you transferred funds, note down the Transaction ID/UTR immediately and report to 1930 to freeze the beneficiary account.',
      'Report the fake number on the Department of Telecom Chakshu portal (sancharsaathi.gov.in).'
    ],
    legalSections: [
      'BNS Section 318(4) / IPC 420 (Cheating and dishonestly inducing delivery of property)',
      'BNS Section 308 / IPC 384 (Extortion)',
      'BNS Section 319 / IPC 419 (Cheating by personation)',
      'IT Act Section 66D (Cheating by personation by using computer resource)'
    ]
  },
  {
    id: 'upi-qr-code-refund',
    title: 'UPI "Scan QR to Receive Money" Fraud',
    category: 'Banking & UPI',
    threatLevel: 'Critical',
    victimProfile: 'OLX sellers, small business owners, online marketplace users',
    summary: 'Scammers pose as buyers or refund agents and send a QR code or UPI Collect Request, claiming the victim must scan the QR code or enter their UPI PIN to "receive payment" or "claim refund".',
    modusOperandi: [
      'Scammer contacts a seller on OLX, Facebook Marketplace, or pretends to be a courier/utility refund agent.',
      'Scammer agrees to buy an item immediately without bargaining and insists on paying via Google Pay/PhonePe/Paytm.',
      'Sends a screenshot of a fake payment confirmation showing the amount credited.',
      'Claims payment failed and sends a QR code: "Please scan this QR code or click Approve to accept ₹15,000 in your account."',
      'The moment the victim scans the QR code and enters their secret UPI PIN, money is debited from their account instead of credited.'
    ],
    redFlags: [
      'GOLDEN RULE: You NEVER enter your UPI PIN to RECEIVE money. UPI PIN is exclusively used to SEND money.',
      'Scanning a QR code never deposits money into your bank account; it only initiates an outgoing payment.',
      'Buyer insists on paying the full amount in advance before inspecting the product.',
      'Fake SMS notifications from non-bank standard numbers (e.g., standard 10-digit mobile numbers instead of official sender IDs like AXISBK or SBIBNK).'
    ],
    sampleMessages: [
      '"Dear Customer, your ₹4,999 cashback is pending approval. Scan the attached QR code in Google Pay and enter UPI PIN to receive money instantly."',
      '"Hi, I am Indian Army officer buying your sofa on OLX. My account is Army merchant account. Scan this barcode to collect ₹18,000 advance payment."'
    ],
    immediateSteps: [
      'Immediately call 1930 within the Golden Hour to freeze the recipient bank or wallet.',
      'Open your UPI app (GPay/PhonePe/Paytm) -> Go to History -> Tap the transaction -> Click "Report Fraud / Raise Dispute".',
      'Call your bank helpline to block your UPI ID and linked debit card.',
      'Preserve the QR code image, scammer UPI VPA ID (e.g. merchant99@ybl), and chat history.'
    ],
    legalSections: [
      'IT Act Section 66C (Identity theft)',
      'IT Act Section 66D (Cheating using computer resource)',
      'BNS Section 318 / IPC 420 (Cheating)'
    ]
  },
  {
    id: 'part-time-telegram-task',
    title: 'Telegram Part-Time Task & YouTube "Like" Scam',
    category: 'Job & Task',
    threatLevel: 'High',
    victimProfile: 'College students, job seekers, homemakers, remote workers',
    summary: 'Victims are lured with offers of ₹2,000–₹5,000 daily for easy tasks like liking YouTube videos or rating Google Maps hotels. After paying small initial rewards to build trust, fraudsters trap victims in high-value "prepaid cryptocurrency/investment tasks" where money cannot be withdrawn.',
    modusOperandi: [
      'Unsolicited WhatsApp/Telegram message offering flexible part-time work of liking videos or rating hotels.',
      'Victim completes 3 simple tasks and receives ₹150–₹500 real payment in their UPI account as bait.',
      'Victim is added to an exclusive Telegram group with 50+ "members" (fake shill bots posting screenshots of huge earnings).',
      'Victim is introduced to "Prepaid Merchant Tasks": invest ₹5,000 to earn ₹7,500; invest ₹50,000 to earn ₹80,000.',
      'When the victim attempts to withdraw, the scammer claims "Credit score fell below 100", "System audit lock", or "30% tax clearance required", extorting more money until the victim is financially ruined.'
    ],
    redFlags: [
      'Legitimate multinational companies do not hire via anonymous WhatsApp messages or conduct official payroll on Telegram.',
      'Legitimate employers never demand that you deposit money to perform work tasks.',
      'Unrealistic payouts (e.g., ₹150 for 10 seconds of liking a video).',
      'Telegram group members posting identical ecstatic messages and screenshots of bank deposits.'
    ],
    sampleMessages: [
      '"Hello! I am HR manager at Global Digital Marketing. We offer remote work: like YouTube channels and earn ₹3,500/day. No qualification needed. Contact Telegram @HR_Pooja_Sharma"',
      '"System Warning: Your withdrawal of ₹1,42,000 is on hold due to wrong sequence entry. Deposit ₹65,000 within 2 hours to unlock all funds and principal."'
    ],
    immediateSteps: [
      'Stop sending any additional money immediately! No matter what the scammer claims, paying "clearance fees" will NEVER release your money.',
      'Export the Telegram chat before you are blocked or the scammer deletes the channel.',
      'Note down all bank accounts and UPI IDs where you transferred deposits.',
      'Dial 1930 and register a complaint on cybercrime.gov.in under "Financial Fraud".',
      'Do not hire online "hacker recovery agents" — 99% of them are second-tier scammers.'
    ],
    legalSections: [
      'BNS Section 318(4) / IPC 420 (Cheating)',
      'BNS Section 61 / IPC 120B (Criminal conspiracy)',
      'IT Act Section 66D (Cheating by impersonation)'
    ]
  },
  {
    id: 'fake-apk-electricity-bill',
    title: 'Fake APK & Electricity Bill Disconnection Fraud',
    category: 'Malware & Tech',
    threatLevel: 'Critical',
    victimProfile: 'Domestic power consumers, elderly residents, shopkeepers',
    summary: 'SMS threats warning that electricity will be disconnected tonight due to an unpaid bill. The victim calls the listed number and is tricked into installing a malicious Android APK (disguised as an electricity portal or quick-support tool) that steals OTPs and drains bank accounts.',
    modusOperandi: [
      'Victim receives an urgent SMS: "Dear consumer, your electricity power will be disconnected at 9:30 PM tonight because your previous month bill was not updated."',
      'Message includes a private mobile number to contact "Electricity Officer".',
      'When called, the fake officer asks the victim to pay a token amount (e.g. ₹10 or ₹50) to reactivate the connection.',
      'Officer sends a link to download an APK file (e.g., "BijliVibhag.apk" or "QuickSupport.apk").',
      'Once installed, the malware requests SMS permissions, accessibility services, and forwards incoming OTPs silently to the attacker while overlaying fake payment screens.'
    ],
    redFlags: [
      'Power distribution boards (BESCOM, MSEDCL, TPDDL, etc.) NEVER send disconnection SMS from personal 10-digit mobile numbers.',
      'Official utility providers send messages only through registered alphanumeric sender IDs (e.g., AD-BESCOM, VK-MSEB).',
      'Requests to install APK files sent via WhatsApp or third-party download links instead of official Google Play Store.',
      'Emergency countdown urging you to resolve it immediately before midnight.'
    ],
    sampleMessages: [
      '"Dear Consumer, Your Electricity power will be disconnected Tonight at 9:30 pm from electricity office because your previous month bill was not update. Please immediately contact with our electricity officer 9876543210. Thank you."',
      '"Download our official bill update utility: http://power-bill-update.apk to pay ₹11 pending charges."'
    ],
    immediateSteps: [
      'Turn on Airplane mode or disconnect Wi-Fi and mobile data immediately to cut off the malware remote control.',
      'Uninstall the suspicious app from Android Settings -> Apps -> Recently Installed.',
      'If you entered bank/card details, call your bank hotline from a DIFFERENT phone to block internet banking and cards.',
      'Dial 1930 to report the unauthorized transactions and beneficiary details.',
      'Run a Google Play Protect scan and reset your device if malware persists.'
    ],
    legalSections: [
      'IT Act Section 43 & 66 (Hacking, unauthorized access to computer systems)',
      'IT Act Section 66C (Identity theft)',
      'BNS Section 318 / IPC 420 (Cheating)'
    ]
  },
  {
    id: 'sextortion-video-call',
    title: 'Sextortion & WhatsApp Video Call Blackmail',
    category: 'Extortion & Blackmail',
    threatLevel: 'Critical',
    victimProfile: 'Men and women of all ages, students, professionals',
    summary: 'Victim receives an unexpected WhatsApp video call showing an explicit video. The screen is recorded with the victim’s face, and fraudsters demand immediate money, threatening to leak the morphed video to family, employer, and social media.',
    modusOperandi: [
      'Victim accepts a video call from an unknown attractive profile on WhatsApp, Instagram, or Facebook.',
      'A woman appears undressing or performing explicit acts (often a pre-recorded clip played on loop).',
      'Scammers take a screenshot capturing the victim’s bewildered face alongside the explicit footage.',
      'Within minutes, the victim receives the edited video clip with threatening messages.',
      'Shortly after, another scammer calls posing as "Delhi Police Cyber Crime Head" or "YouTube Grievance Officer", claiming a complaint has been registered and demanding money to delete the video.'
    ],
    redFlags: [
      'Unsolicited video calls from unknown numbers, especially late at night.',
      'Callers demanding ransom and claiming they will upload the video to YouTube within 15 minutes.',
      'Police officers calling on WhatsApp to "settle" or "delete" a video in exchange for money (Police never act as video deletion brokers).',
      'Pressure to pay immediately to prevent social shame.'
    ],
    sampleMessages: [
      '"See this video of you. We have your contact list, your Facebook friends, and your office address. Pay ₹25,000 on this UPI right now or we will send this to your father and colleagues."',
      '"This is Inspector Vikram from Delhi Cyber Cell. A sexual harassment complaint has been filed against your video. Transfer ₹40,000 to close the case file."'
    ],
    immediateSteps: [
      'DO NOT PAY A SINGLE RUPEE! Paying once will NOT delete the video; they will demand double next time.',
      'Stay calm. In over 95% of cases, scammers never post the video because posting exposes them to severe POCSO / IT Act penalties and account bans.',
      'Do not panic and do not delete your WhatsApp chat yet — take screenshots of the phone numbers, profile, and messages as evidence.',
      'Lock your social media accounts (make Facebook profile private, set Instagram to private, disable friend list visibility).',
      'Dial 1930 or submit a confidential complaint at cybercrime.gov.in under the "Women/Children Cyber Crime" or "Blackmail" tab.',
      'Use StopNCII.org (supported by major platforms) to create a hash of the image/video to prevent it from ever being shared on Facebook/Instagram.'
    ],
    legalSections: [
      'IT Act Section 66E (Violation of privacy)',
      'IT Act Section 67 / 67A (Publishing obscene / sexually explicit material in electronic form)',
      'BNS Section 308 / IPC 384 (Extortion)',
      'BNS Section 351 / IPC 506 (Criminal intimidation)'
    ]
  },
  {
    id: 'ai-voice-clone-kidnapping',
    title: 'AI Voice Clone & Fake Accident Emergency Scam',
    category: 'Impersonation & Threat',
    threatLevel: 'High',
    victimProfile: 'Parents of college students or travelers, family members',
    summary: 'Fraudsters use generative AI to clone the voice of a family member (sampled from social media videos/reels), calling the parents in a state of simulated panic, claiming an arrest or critical accident requiring immediate emergency funds.',
    modusOperandi: [
      'Scammers scrape 10-15 seconds of a family member’s voice from Instagram Reels, YouTube, or voicemail.',
      'Use voice cloning AI tools to synthesize distress calls ("Mom/Dad, I am in big trouble, please help me!").',
      'The call is passed to a fake lawyer or police officer claiming the child has been caught in a fatal hit-and-run or drug raid.',
      'Parents are ordered to immediately transfer ₹50,000–₹3,00,000 via UPI for hospital surgery deposit or bail bond.',
      'Scammers keep parents on the line continuously to prevent them from contacting their child directly.'
    ],
    redFlags: [
      'Extreme emotional panic created intentionally to suppress rational thought.',
      'Voice sounds slightly distorted or robotic with background noise to mask AI synthesis artifacts.',
      'Insistence that you must not disconnect the call to call the relative.',
      'Demands for instant UPI or cryptocurrency transfer instead of official hospital billing.'
    ],
    sampleMessages: [
      '"(Cloned voice crying): Papa, police have arrested me in college, please talk to inspector sir... (Fake cop speaks): Your son is in our lockup for a major incident. Send ₹1,50,000 immediately to settle this before media arrives."'
    ],
    immediateSteps: [
      'Take a deep breath and pause for 30 seconds. Do not transfer any money.',
      'Establish a Family Safe Word / Secret Code (a word only immediate family knows). Ask the caller: "What is our family code word?"',
      'Try calling your family member directly on their actual phone number from another phone, or contact their roommate, hostel, or friends.',
      'Hang up and verify. Fraudsters rely on non-stop call holding to prevent verification.',
      'Report the extortion attempt to local police and 1930.'
    ],
    legalSections: [
      'IT Act Section 66D (Cheating by personation)',
      'BNS Section 308 / IPC 384 (Extortion)',
      'BNS Section 318 / IPC 420 (Cheating)'
    ]
  },
  {
    id: 'fake-loan-app-harassment',
    title: 'Illegal Chinese Instant Loan Apps & Gallery Extortion',
    category: 'Extortion & Blackmail',
    threatLevel: 'Critical',
    victimProfile: 'Borrowers in urgent need of small cash, gig workers, youth',
    summary: 'Instant loan apps offer collateral-free loans in 2 minutes. The app steals the victim’s contacts, photos, and messages, then levies 100%+ interest rates and blackmails the victim by threatening to circulate morphed nude photos to their entire contact book.',
    modusOperandi: [
      'Victim downloads an unverified instant loan app advertised on Instagram/Facebook (promising ₹10,000 in 2 minutes).',
      'App demands full permissions to Contacts, SMS, Gallery, and Camera before granting the loan.',
      'Only ₹3,500 is disbursed, but 6 days later, the borrower is told to repay ₹12,000.',
      'Recovery agents call the borrower’s family members, colleagues, and friends with abusive language.',
      'Agents morph the victim’s gallery photos onto obscene pornographic bodies and circulate them on WhatsApp contact groups.'
    ],
    redFlags: [
      'Apps not registered as Non-Banking Financial Companies (NBFCs) with the Reserve Bank of India (RBI).',
      'App requested access to your photo gallery and contact list (RBI guidelines explicitly forbid loan apps from accessing device media and contacts).',
      'Loan tenure of only 6 to 7 days with exorbitant processing fees and 100%+ interest.',
      'Repayment accounts belong to random individual UPI IDs or shell mule accounts.'
    ],
    sampleMessages: [
      '"Your relative has defaulted on loan. If not paid by 2 PM, we are publishing their morphed pornographic photos to all 340 contacts in their address book."',
      '"Send ₹8,000 to UPI recovery998@paytm or face public defamation across your neighborhood."'
    ],
    immediateSteps: [
      'Stop paying! Fraudulent loan syndicates do not close loan accounts even after repayment.',
      'Immediately uninstall the application and revoke all app permissions.',
      'Send a broadcast message to all your contacts explaining: "Friends and family, my phone was compromised by a rogue app that stole contacts. Please ignore any malicious or abusive messages sent from unknown numbers in my name."',
      'File a complaint immediately at cybercrime.gov.in under "Financial Fraud / Harassment".',
      'Report the rogue app to Google Play Store and RBI Sachet portal (sachet.rbi.org.in).'
    ],
    legalSections: [
      'RBI Fair Practices Code Violations',
      'IT Act Section 66E (Privacy violation)',
      'IT Act Section 67 (Publishing obscenity)',
      'BNS Section 308 / IPC 384 (Extortion)',
      'BNS Section 356 / IPC 500 (Defamation)'
    ]
  },
  {
    id: 'fake-investment-crypto-whatsapp',
    title: 'VIP Stock & Crypto "Institutional" Trading Groups',
    category: 'Investment',
    threatLevel: 'Critical',
    victimProfile: 'Retail stock market investors, retirees, high-net-worth individuals',
    summary: 'Fraudsters invite victims to WhatsApp/Telegram groups pretending to be institutional portfolio managers from reputable firms (e.g. Goldman Sachs, BlackRock, Kotak). Victims trade on rigged websites showing fake 500% gains, but all real money is stolen.',
    modusOperandi: [
      'Victim sees a Facebook/Instagram ad offering free stock trading tips from renowned analysts or professors.',
      'Added to a WhatsApp group where "Admin" and "Professor" share real-looking daily stock market calls.',
      'Victims are invited to join an "Institutional VIP Account" using a custom web trading portal or APK.',
      'Initial investments of ₹50,000 show skyrocketing profits (₹3,00,000) on the fabricated trading screen.',
      'When withdrawing, victims are told they must pay 20% "Securities Transaction Tax" or "SEBI clearance fee", sinking lakhs more before the platform abruptly vanishes.'
    ],
    redFlags: [
      'SEBI-registered brokers NEVER operate public WhatsApp groups offering guaranteed returns or VIP block trade allocations.',
      'Transfers are requested to personal savings accounts or current accounts of unrelated private entities (mule accounts) rather than SEBI-registered clearing corporations.',
      'Guaranteed returns of 20% to 100% per week.',
      'Withdrawal requires paying additional taxes upfront in cash or crypto.'
    ],
    sampleMessages: [
      '"Institutional VIP Trading Club: Our AI quantitative algorithm yielded +640% this month. Guaranteed 40% monthly returns. Open institutional account with minimum ₹1,00,000."',
      '"Withdrawal Status: Your balance is ₹48,00,000. Under SEBI Foreign Exchange regulations, transfer ₹9,60,000 tax clearance to account 4098234812 within 24 hours."'
    ],
    immediateSteps: [
      'Cease all fund transfers immediately. Do not pay any "tax", "gas fee", or "withdrawal deposit".',
      'Collect all bank account numbers, IFSC codes, and beneficiary names you sent money to.',
      'Report immediately to 1930 and cybercrime.gov.in.',
      'Verify if the entity is registered on the SEBI portal (sebi.gov.in/intermediaries.html).',
      'Submit a fraud report to SEBI SCORES portal (scores.sebi.gov.in).'
    ],
    legalSections: [
      'SEBI Act 1992 Section 12A (Prohibition of manipulative and deceptive devices)',
      'BNS Section 318(4) / IPC 420 (Cheating)',
      'IT Act Section 66D (Cheating by personation)'
    ]
  }
];
