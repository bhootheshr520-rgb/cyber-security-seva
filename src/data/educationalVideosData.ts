export interface VideoModule {
  id: string;
  title: string;
  category: 'Banking & UPI' | 'Identity & Calls' | 'Remote Apps & APKs' | 'Blackmail Protection' | 'Phishing & Fake Sites';
  duration: string;
  badge: string;
  description: string;
  videoStoryboard: {
    stepNumber: number;
    title: string;
    description: string;
    warningCallout?: string;
    screenSimulation: {
      type: 'sms' | 'call' | 'app' | 'alert';
      senderOrTitle: string;
      body: string;
      actionText: string;
    };
  }[];
  keyTakeaways: string[];
  safetyChecklist: string[];
}

export const VIDEO_MODULES: VideoModule[] = [
  {
    id: 'vid-upi-rules',
    title: 'The Golden Rule of UPI: Why You Never Enter a PIN to Receive Money',
    category: 'Banking & UPI',
    duration: '3 min masterclass',
    badge: 'Essential',
    description: 'Learn how fraudsters manipulate online marketplace sellers and refund seekers into entering their secret UPI PIN, and how UPI protocols actually work.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Bait: Advance Payment Promise',
        description: 'Scammer contacts you posing as an eager buyer on OLX/Marketplace and offers to pay full advance via Google Pay/PhonePe without negotiation.',
        screenSimulation: {
          type: 'sms',
          senderOrTitle: 'Buyer WhatsApp',
          body: '"Sir, I am transferring full ₹14,000 for your furniture right now. Please check notification in PhonePe."',
          actionText: 'Scammer prepares deceit'
        }
      },
      {
        stepNumber: 2,
        title: 'The Trap: A "Collect Request" disguised as a Refund/Credit',
        description: 'Instead of sending money, the fraudster creates a UPI "Collect Request" for ₹14,000 or sends a QR code labeled "Scan to Credit ₹14,000".',
        warningCallout: 'CRITICAL: Scanning a QR code only initiates an OUTGOING debit, never an incoming credit!',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'UPI Prompt: Collect Request',
          body: 'Merchant/User "Direct_Pay_Desk" requested ₹14,000 from your account.',
          actionText: 'Scammer says: "Click Pay and enter PIN to verify receipt"'
        }
      },
      {
        stepNumber: 3,
        title: 'The Protocol Truth',
        description: 'When money is sent to you, UPI routes it directly to your bank account using your VPA/Mobile number. No user interaction or PIN entry is ever required from the receiver.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'National Payments Corporation of India (NPCI) Fact',
          body: 'UPI PIN is ONLY required for debiting (sending) money or checking bank balance. RECEIVING MONEY NEVER REQUIRES A PIN.',
          actionText: 'Never Enter PIN to Receive'
        }
      }
    ],
    keyTakeaways: [
      'UPI PIN = Secret Password to DEDUCT money from your account.',
      'To receive money, you only need to provide your UPI ID or phone number; you never tap "Pay" or enter any PIN.',
      'Never scan a QR code sent over WhatsApp by an unknown person.',
      'Report fake buyer profiles immediately to platform moderators.'
    ],
    safetyChecklist: [
      'Check SMS sender header: Legitimate banks use 6-character sender IDs like BP-SBIIN, never 10-digit mobile numbers.',
      'Always verify bank balance inside your official banking app directly, rather than relying on external SMS screenshots.',
      'Turn on transaction SMS alerts with your bank.'
    ]
  },
  {
    id: 'vid-digital-arrest',
    title: 'Anatomy of a "Digital Arrest": Why Police Never Arrest You on Skype',
    category: 'Identity & Calls',
    duration: '4 min walkthrough',
    badge: 'Critical Defense',
    description: 'Demystifying the psychological manipulation behind fake police, ED, and CBI video calls that have cost citizens hundreds of crores.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Fake Parcel & Fear Induction',
        description: 'An automated IVR call claims your Aadhaar card was found in a FedEx package bound for Europe containing passports and synthetic drugs.',
        screenSimulation: {
          type: 'call',
          senderOrTitle: '+91 94021-XXXXX (IVR)',
          body: '"Your parcel at customs has been quarantined for contraband. Press 1 to speak with the investigative officer or face non-bailable arrest warrant."',
          actionText: 'Victim feels sudden intense fear'
        }
      },
      {
        stepNumber: 2,
        title: 'The Studio Set Police Station & Forged Documents',
        description: 'You are forced onto a Skype video call. The attacker sits against a backdrop with state police logos, wearing a police uniform, holding fake documents stamped with "Supreme Court of India".',
        warningCallout: 'Indian Law Fact: "Digital Arrest" DOES NOT EXIST under the Code of Criminal Procedure or Bharatiya Nagarik Suraksha Sanhita (BNSS).',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'Skype: "cbi_headquarters_investigation"',
          body: '"You are in official digital remand. You cannot disconnect this camera or inform anyone until asset audit clearance is completed."',
          actionText: 'Emotional isolation tactic'
        }
      },
      {
        stepNumber: 3,
        title: 'The "Secret Government Verification Account" Demanded',
        description: 'The scammer orders you to liquidate your fixed deposits and transfer all savings to a "Reserve Bank verification account" which will purportedly be refunded in 1 hour.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'The Reality',
          body: 'The account belongs to a "money mule" (a compromised account bought by cyber criminals). The moment funds enter, they are instantly withdrawn at ATMs across multiple states.',
          actionText: 'Hang up immediately'
        }
      }
    ],
    keyTakeaways: [
      'No law enforcement agency (Police, CBI, ED, NIA, Customs) ever conducts legal proceedings, interrogation, or arrests on Skype/WhatsApp.',
      'No government authority ever demands that you transfer personal savings to any account for "verification" or "bail".',
      'If you receive such a call, DISCONNECT IMMEDIATELY. You are completely safe.',
      'Report the caller on sancharsaathi.gov.in (Chakshu) and 1930.'
    ],
    safetyChecklist: [
      'Never allow an unknown caller to isolate you from your family or advisors.',
      'Demand to speak in person at your local police station.',
      'Remember: Genuine police summons arrive via signed physical notices with official case diary numbers (under Section 41A CrPC / BNSS 35).'
    ]
  },
  {
    id: 'vid-remote-screen-share',
    title: 'Screen Sharing & Rogue APKs: How Fraudsters Take Over Your Phone',
    category: 'Remote Apps & APKs',
    duration: '3 min guide',
    badge: 'Device Safety',
    description: 'Understand how downloading AnyDesk, TeamViewer QuickSupport, or suspicious .APK files grants scammers total control of your OTPs and banking credentials.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Pretext: Fake Bank/Utility Support Agent',
        description: 'You search Google for a customer care number or receive an SMS about an expired KYC or pending electricity bill. The fake agent says: "Let me assist you remotely in 2 minutes."',
        screenSimulation: {
          type: 'call',
          senderOrTitle: 'Fake Customer Support',
          body: '"Sir, please install our official support tool from link or Play Store to complete your KYC re-verification."',
          actionText: 'Pretexting'
        }
      },
      {
        stepNumber: 2,
        title: 'The 9-Digit Code Handover',
        description: 'The agent directs you to install AnyDesk or RustDesk and asks you to read out the 9-digit session code or approve "Allow Accessibility / Screen Mirroring".',
        warningCallout: 'Danger: The scammer can now see every tap, password, and incoming SMS on your phone in real time.',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'Remote Support Tool',
          body: 'Session ID: 948 201 559 — "Incoming connection from Agent-04. Allow full screen broadcast and touch control?"',
          actionText: 'Never approve screen sharing with strangers'
        }
      },
      {
        stepNumber: 3,
        title: 'The Silent OTP Drain',
        description: 'The scammer asks you to open your banking app or transfer ₹1 to test. As you type your PIN and receive OTPs, the attacker records the credentials or takes over controls.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'Immediate Countermeasure',
          body: 'Turn on Airplane Mode immediately. Disconnect Wi-Fi. Uninstall the app immediately.',
          actionText: 'Cut off network connection'
        }
      }
    ],
    keyTakeaways: [
      'Never install AnyDesk, TeamViewer QuickSupport, or RustDesk on the instructions of any caller.',
      'Never download APK files sent via WhatsApp, Telegram, or unknown websites.',
      'Bank employees will never ask you to share your screen.',
      'Keep Google Play Protect always enabled in Android Settings.'
    ],
    safetyChecklist: [
      'Check Settings -> Accessibility: Verify no unfamiliar app has accessibility permissions.',
      'Verify Settings -> Apps -> Special App Access -> Install Unknown Apps: Keep this disabled.',
      'Only search for customer support on the back of your physical bank card or inside the official app.'
    ]
  },
  {
    id: 'vid-sextortion-defense',
    title: 'Sextortion Emergency: The Truth, The Law, and Why You Must NOT Pay',
    category: 'Blackmail Protection',
    duration: '4 min counselor session',
    badge: 'Confidential Support',
    description: 'A calm, empowering psychological and legal guide for anyone targeted by WhatsApp video call traps or morphed photo blackmail.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Rapid Shock & Shaming Attack',
        description: 'You answered a video call, an explicit video played, your face was screenshotted, and now you are bombarded with terrifying threats to ruin your reputation.',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'Blackmailer WhatsApp',
          body: '"We have your Facebook friend list and your mother’s phone number. Pay ₹30,000 in 15 minutes or your video will go viral."',
          actionText: 'Engineered panic & shame'
        }
      },
      {
        stepNumber: 2,
        title: 'The Crucial Psychological Realization',
        description: 'The extortionist has zero interest in posting the video. Posting the video burns their burner SIM, gets their accounts permanently banned, and triggers non-bailable criminal arrest. Their ONLY leverage is keeping you in fear so you keep transferring money.',
        warningCallout: 'Rule #1: If you pay ₹10,000, they will immediately ask for ₹25,000. Paying NEVER stops the blackmail.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'Cyber Psychology Fact',
          body: 'Blackmailers operate on volume. When a victim refuses to pay, disconnects communication, and blocks them, the scammer moves on to another target within hours.',
          actionText: 'Do not pay. Block and report.'
        }
      },
      {
        stepNumber: 3,
        title: 'The Legal Protection Shield',
        description: 'Under Indian law (IT Act Section 66E, 67, 67A, and BNS 308/351), YOU are the victim of a heinous crime. The police protect your privacy, and women & children complaints are handled under special confidential wings.',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'StopNCII.org & Cyber Crime Portal',
          body: 'Register image hashes confidentially on StopNCII.org to prevent publication across Meta (Facebook & Instagram). File at cybercrime.gov.in.',
          actionText: 'Citizen is legally protected'
        }
      }
    ],
    keyTakeaways: [
      'DO NOT PAY. Not even ₹100. Paying signals compliance and invites unending demands.',
      'You are NOT at fault. This is automated organized crime preying on human vulnerability.',
      'Take screenshots of the threats, numbers, and UPI details before blocking.',
      'Lock down your social media privacy settings immediately.',
      'Confidential reporting is available at cybercrime.gov.in and Women Helpline 1090/1091.'
    ],
    safetyChecklist: [
      'Set WhatsApp Privacy: Who can add me to groups -> "My Contacts".',
      'Set WhatsApp: Silence unknown callers in Settings -> Privacy -> Calls.',
      'Make Facebook and Instagram accounts strictly private.'
    ]
  },
  {
    id: 'vid-phishing-fake-sites',
    title: 'Spotting Phishing Websites & Social Engineering Traps',
    category: 'Phishing & Fake Sites',
    duration: '3 min explainer',
    badge: 'Web Safety',
    description: 'Learn how fraudsters clone bank portals and e-commerce stores using typosquatting and deceptive URL shortcuts.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Deceptive SMS or Sponsored Ad',
        description: 'You search for "Customer Care" on Google or receive an SMS: "Your credit card reward points are expiring. Redeem ₹9,850 now at sbi-reward-points.site".',
        screenSimulation: {
          type: 'sms',
          senderOrTitle: 'Alert SMS: Reward Points',
          body: '"Dear Cardholder, 8,920 reward points expiring in 24 hrs. Convert to cash ₹8,920 at: https://sbi-card-rewards.net/claim"',
          actionText: 'Urgency & Free Money Hook'
        }
      },
      {
        stepNumber: 2,
        title: 'The Cloned Web Portal Interface',
        description: 'The link opens a webpage that looks identical to your real bank website with official logos, colors, and fonts. It asks you to enter Card Number, Expiry, CVV, and Date of Birth to "verify eligibility".',
        warningCallout: 'Inspect the Address Bar: Notice the domain is "sbi-card-rewards.net", NOT the official "sbicard.com" or "onlinesbi.sbi".',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'Browser URL Check',
          body: 'URL: https://sbi-card-rewards.net/login.php — Prompt: "Enter 16-Digit Card No & 3-Digit CVV"',
          actionText: 'Never type card CVV on unverified links'
        }
      },
      {
        stepNumber: 3,
        title: 'The Instant OTP Interception',
        description: 'As you enter your details, the attacker backend immediately triggers a real debit on an e-commerce platform and presents a fake "Verification OTP" box on their site to capture your bank OTP.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'Read Bank SMS Carefully',
          body: 'Bank SMS says: "OTP for purchase of ₹49,999 on Flipkart is 904812", NOT "OTP to claim points". ALWAYS READ WHAT THE OTP IS ACTUALLY FOR!',
          actionText: 'Never Share or Enter OTP'
        }
      }
    ],
    keyTakeaways: [
      'ALWAYS read the exact wording of bank OTP messages: notice the amount and merchant name.',
      'Official bank domains in India end with `.sbi`, `.bank.in`, or their verified registered corporate domains.',
      'Banks never ask for CVV or ATM PIN to credit reward points or cashbacks.',
      'Never click shortened links (bit.ly, tinyurl, .xyz, .site) claiming utility updates or refunds.'
    ],
    safetyChecklist: [
      'Bookmark official bank web portals in your browser; never click sponsored search engine ads.',
      'Check SSL certificate details in your browser address bar by clicking the lock/tune icon.',
      'Use a password manager: it will refuse to autofill your credentials on spoofed phishing domains.'
    ]
  },
  {
    id: 'vid-ai-voice-cloning',
    title: 'AI Voice Cloning: How Scammers Mimic Your Child or Family in Distress',
    category: 'Identity & Calls',
    duration: '4 min masterclass',
    badge: 'AI Threat',
    description: 'Learn how cyber syndicates use short 3-second audio clips from social media to generate ultra-realistic voice clones of loved ones begging for urgent bail money, and the "Family Code Word" defense.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Terrifying Call: Familiar Voice in Panic',
        description: 'You answer an incoming call. The caller sounds exactly like your son, daughter, or spouse crying hysterically: "Dad, please help me, I had an accident and the police have seized me!"',
        screenSimulation: {
          type: 'call',
          senderOrTitle: 'Unknown Caller ID (Spoofed)',
          body: '"Papa, please save me, I am at the police station. They took my phone, talk to the officer!" [Voice identical to family member]',
          actionText: 'Deep emotional shock & urgency'
        }
      },
      {
        stepNumber: 2,
        title: 'The Coerced Immediate Escrow Transfer',
        description: 'A stern individual grabs the phone posing as an Inspector, demanding ₹1,50,000 immediately to an urgent UPI ID to "settle out of court before an FIR is lodged".',
        warningCallout: 'AI Reality: Modern generative neural audio models can clone any human voice with as little as 3 seconds of clean audio from a public Instagram reel or YouTube clip.',
        screenSimulation: {
          type: 'sms',
          senderOrTitle: 'Inspector Sharma (Fake)',
          body: '"Transfer ₹1,50,000 to emergency settlement UPI: settlement.court99@sbi immediately or your son will be remanded to central jail tonight."',
          actionText: 'High-pressure financial coercion'
        }
      },
      {
        stepNumber: 3,
        title: 'The Family Safe Word Defense',
        description: 'Pause and ask the caller your secret "Family Safe Word" (a private keyword agreed upon in advance, like a pet’s secret nickname). AI voice models cannot answer unanticipated personal questions.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'Immediate Golden Countermeasure',
          body: 'Ask your secret family safe word. Hang up and dial your family member directly on their normal number or contact their friend/school/workplace. NEVER transfer money in panic.',
          actionText: 'Establish a Family Safe Word Today'
        }
      }
    ],
    keyTakeaways: [
      'Establish a secret "Family Safe Word" known only to your immediate household.',
      'Voice alone is no longer proof of identity in the era of generative AI.',
      'Never send funds under panic without independent two-way verification.',
      'Police never negotiate cash settlements or bail transfers over phone calls.'
    ],
    safetyChecklist: [
      'Agree on a unique family passphrase tonight.',
      'Keep social media audio clips private or set profile privacy to friends-only.',
      'Save secondary emergency contact numbers for colleagues and roommates.'
    ]
  },
  {
    id: 'vid-electricity-bill-fraud',
    title: 'The 9:30 PM Power Cut Threat: How Fake Discom Officers Siphon Accounts',
    category: 'Remote Apps & APKs',
    duration: '3 min breakdown',
    badge: 'Trending Fraud',
    description: 'Deconstruct the widespread SMS scam warning of immediate power supply disconnection from the substation, why Discoms never use personal phone numbers, and how ₹10 test recharges install remote trojans.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Engineered Panic SMS',
        description: 'You receive an SMS in the evening: "Dear Consumer, your electricity supply will be disconnected tonight at 9:30 PM from the power office because your previous bill was not updated. Call electricity officer at 9811234567."',
        screenSimulation: {
          type: 'sms',
          senderOrTitle: 'VM-POWEROFC',
          body: '"Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from electric office. Please immediately call officer 9811234567."',
          actionText: 'Engineered Panic & Artificial Time Pressure'
        }
      },
      {
        stepNumber: 2,
        title: 'The Remote Screen App Pretext',
        description: 'You call the number. The polite "officer" apologizes for the billing glitch and instructs you to download a small "Discom Suvidha" app or QuickSupport to update your meter record.',
        warningCallout: 'Danger: State Discoms (BSES, TPDDL, UPPCL, BESCOM, MSEDCL) NEVER ask consumers to call 10-digit mobile numbers or install remote access apps.',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'Malicious App Installer',
          body: 'Installing "Bijli_Bill_Support_v2.apk" — Requesting: Full SMS Read & Accessibility Privileges',
          actionText: 'Do NOT install sideloaded APKs'
        }
      },
      {
        stepNumber: 3,
        title: 'The ₹10 Test Recharge Siphon',
        description: 'The scammer asks you to do a nominal ₹10 test recharge to "reactivate your connection". As you enter your UPI PIN and Netbanking credentials, the sideloaded trojan intercepts OTPs and drains your entire account balance.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'Official Discom Rule',
          body: 'Electricity boards always send official consumer-specific CA numbers and only accept payments through official portals or authorized apps (e.g. BBPS, official Discom app).',
          actionText: 'Pay Only on Official Discom Portals'
        }
      }
    ],
    keyTakeaways: [
      'Official Discoms NEVER send personal 10-digit mobile numbers in SMS alerts.',
      'Never install APK files or remote control software (AnyDesk, TeamViewer) for utility bills.',
      'Never perform a "test recharge" on unverified links.',
      'Verify bill status directly on your official state electricity board website or app.'
    ],
    safetyChecklist: [
      'Always pay electricity bills exclusively through BBPS or your official Discom portal.',
      'Block and report fake utility SMS senders on Chakshu portal (sancharsaathi.gov.in).',
      'Inform elderly family members: Discoms do not disconnect power at night without statutory physical notices.'
    ]
  },
  {
    id: 'vid-investment-trading-scam',
    title: 'Fake Institutional Trading & Upper Circuit Traps: Unmasking WhatsApp VIP Groups',
    category: 'Banking & UPI',
    duration: '4 min deep dive',
    badge: 'Financial Alert',
    description: 'Unmask the multi-crore investment syndicates posing as foreign institutional investors (FIIs) offering 500% returns on pre-IPO allotments through custom fake trading apps.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The VIP WhatsApp Investment Group',
        description: 'You are added to a WhatsApp group named "Goldman Institutional Club" or "VIP Stock Tips". Group members (all syndicate bots) share screenshots of massive 80% daily profits and praise "Professor Sharma".',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'WhatsApp VIP Group',
          body: '"Member Rajesh just booked ₹4.5 Lakhs profit on Institutional Pre-IPO! Only 3 slots left for today\'s block trade allotment."',
          actionText: 'Social proof illusion'
        }
      },
      {
        stepNumber: 2,
        title: 'The Counterfeit Trading Terminal App',
        description: 'The coordinator sends a custom link to install a private trading app not available on Play Store. You deposit ₹50,000, and the app dashboard magically shows your portfolio doubling to ₹1,50,000 in two days.',
        warningCallout: 'SEBI Fact: Institutional trading accounts cannot be opened via WhatsApp links or deposited into unverified individual savings accounts.',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'Fake Trading App Dashboard',
          body: 'Portfolio Balance: ₹12,80,000 [Unrealized Gain: +850%] — "Request Withdrawal"',
          actionText: 'Fictitious Numbers on Screen'
        }
      },
      {
        stepNumber: 3,
        title: 'The "TDS & Clearance Fee" Withdrawal Trap',
        description: 'When you attempt to withdraw your funds, the coordinator demands an additional 20% "TDS Clearance Fee" (₹2.5 Lakhs). No matter how much you pay, your money is never released.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'The Sunk-Cost Extortion Trap',
          body: 'Scammer states: "Pay ₹2,50,000 regulatory clearance fee or SEBI will freeze your total ₹12 Lakhs profit forever." DO NOT PAY! The entire portfolio is fabricated.',
          actionText: 'Never Pay Fees to Withdraw Profits'
        }
      }
    ],
    keyTakeaways: [
      'Legitimate stock brokers in India MUST be registered with SEBI; verify their registration number on sebi.gov.in.',
      'Never transfer investment capital to personal bank accounts or unverified corporate currents.',
      'Legitimate brokers deduct TDS directly from trades; they NEVER ask for advance cash transfers to withdraw your funds.',
      'High-return promises (50%–200% per month) are ALWAYS Ponzi or pig-butchering scams.'
    ],
    safetyChecklist: [
      'Verify broker registration on the SEBI portal before depositing a single rupee.',
      'Leave and report unsolicited WhatsApp/Telegram investment groups immediately.',
      'Only trade through registered platforms (Zerodha, Groww, AngelOne, ICICI Direct, HDFC Sky, etc.).'
    ]
  },
  {
    id: 'vid-task-telegram-scam',
    title: 'The ₹150 Hook to ₹10 Lakh Trap: Anatomy of YouTube Liking & Part-Time Job Scams',
    category: 'Banking & UPI',
    duration: '3 min explainer',
    badge: 'Daily Alert',
    description: 'How cyber syndicates pay initial small rewards (₹150 - ₹500) for liking YouTube videos or rating hotels on Google Maps to build trust, before trapping victims in high-stake prepaid "merchant task" levels.',
    videoStoryboard: [
      {
        stepNumber: 1,
        title: 'The Easy ₹150 Reward Hook',
        description: 'You receive a WhatsApp message offering ₹50 per YouTube video liked. You like 3 videos, send screenshots, and the coordinator immediately transfers ₹150 to your UPI. You feel it is 100% genuine.',
        screenSimulation: {
          type: 'app',
          senderOrTitle: 'Google Pay Notification',
          body: 'Received ₹150 from "Apex Media Marketing" · "Congratulations! You have completed Level 1 task."',
          actionText: 'Trust-building psychological hook'
        }
      },
      {
        stepNumber: 2,
        title: 'The "Prepaid Merchant Task" Transition',
        description: 'The coordinator invites you to a Telegram group with hundreds of members. They introduce "Prepaid Merchant Tasks": invest ₹2,000 to get ₹2,800 back, or invest ₹10,000 to get ₹14,000 back.',
        warningCallout: 'Warning: Real companies never require employees to pay money to receive work or earn salary.',
        screenSimulation: {
          type: 'sms',
          senderOrTitle: 'Telegram Task Coordinator',
          body: '"Pay ₹10,000 to recharge merchant account. Complete 3 crypto rating tasks and withdraw ₹14,000 instantly."',
          actionText: 'Escalating financial commitment'
        }
      },
      {
        stepNumber: 3,
        title: 'The System Error Lock & Compound Trap',
        description: 'After you transfer ₹10,000, they claim you made a "data entry error" and must deposit ₹50,000 to unfreeze your funds. The demands escalate to lakhs until you run out of money.',
        screenSimulation: {
          type: 'alert',
          senderOrTitle: 'Stop Immediately',
          body: 'The ₹150 was bait. The money you transferred has been diverted to multi-tier mule accounts. Stop immediately, preserve chat evidence, and file on 1930.',
          actionText: 'Never Pay to Work'
        }
      }
    ],
    keyTakeaways: [
      'No legitimate company pays you to like YouTube videos or write fake reviews on Google Maps.',
      'Initial small payouts are engineered bait to make you confident in sending large sums.',
      'ANY job that asks you to deposit money to "unlock tasks" or "upgrade VIP status" is 100% fraud.',
      'Never send funds to random individual accounts provided on Telegram.'
    ],
    safetyChecklist: [
      'Set Telegram Privacy: Who can add me to groups -> "My Contacts Only".',
      'Never accept job offers from unknown international numbers (+84, +62, +234, +44, +1).',
      'If you have already paid, dial 1930 immediately within the golden hour to freeze the beneficiary accounts.'
    ]
  }
];

