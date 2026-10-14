import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Lock,
  Smartphone,
  FileText,
  Clock,
  ArrowRight,
  Download,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  FileCheck2,
  Shield,
  HelpCircle,
  Sparkles,
  Printer,
  Video,
  Play,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { ScamPattern } from '../data/scamsData';
import { ThreatAlert } from '../data/threatAlertsData';
import { PushAdvisory } from '../data/pushNotificationsData';
import { VIDEO_MODULES, VideoModule } from '../data/educationalVideosData';

export interface ThreatMitigationPlanProps {
  isOpen: boolean;
  onClose: () => void;
  // Context passed in when triggered from ScamDatabase or PostFraud alerts
  initialScam?: ScamPattern | null;
  initialAlert?: ThreatAlert | null;
  initialAdvisory?: PushAdvisory | null;
  initialScenario?: string | null;
  onOpenSos: () => void;
  onOpenEvidenceLocker: () => void;
  onGoToLegal: () => void;
}

export interface MitigationStep {
  id: string;
  phaseId: number;
  phaseName: string;
  timeframe: string;
  priority: 'CRITICAL' | 'HIGH' | 'RECOMMENDED';
  title: string;
  description: string;
  actionHint?: string;
  callShortcut?: string;
  quickTool?: 'sos' | 'evidence' | 'legal' | 'ussd';
  dataFieldLabel?: string;
  dataFieldPlaceholder?: string;
}

// Preset archetypes
export type PresetType =
  | 'digital-arrest'
  | 'unauthorized-debit'
  | 'remote-apk'
  | 'task-crypto'
  | 'sextortion'
  | 'phishing-electricity'
  | 'general-scam';

interface PresetConfig {
  id: PresetType;
  title: string;
  subtitle: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium';
  goldenHourUrgency: string;
  threatSummary: string;
}

const PRESETS: Record<PresetType, PresetConfig> = {
  'digital-arrest': {
    id: 'digital-arrest',
    title: 'Digital Arrest / Law Enforcement Impersonation',
    subtitle: 'Threatened by fake CBI, ED, Police, or Customs officers over Skype / WhatsApp video',
    category: 'Impersonation & Threat',
    severity: 'Critical',
    goldenHourUrgency: 'Immediate: Scammers rely on sustained video panic to force escrow transfers.',
    threatSummary: 'No law enforcement agency in India or globally conducts arrests or trials over video calls. Severing communication terminates their psychological hold completely.'
  },
  'unauthorized-debit': {
    id: 'unauthorized-debit',
    title: 'Unauthorized UPI / Bank Debit Incident',
    subtitle: 'Money moved from bank account, fraudulent UPI Collect, or card compromised',
    category: 'Banking & UPI',
    severity: 'Critical',
    goldenHourUrgency: 'Golden Hour (0-2 Hours): 1930 automated lien can freeze funds in beneficiary account.',
    threatSummary: 'Electronic fund transfers pass through intermediary clearing banks. Calling 1930 prompts an automated freeze on the receiver account before cash is cashed out.'
  },
  'remote-apk': {
    id: 'remote-apk',
    title: 'Malicious APK / Remote Access (AnyDesk / QuickSupport)',
    subtitle: 'Rogue APK installed, screen sharing approved, or unknown accessibility app active',
    category: 'Malware & Tech',
    severity: 'Critical',
    goldenHourUrgency: 'Minutes 0-15: Sever network connection immediately before OTP interception.',
    threatSummary: 'Malware and screen-mirroring apps require active internet connectivity to relay device screens and intercept incoming SMS OTPs.'
  },
  'task-crypto': {
    id: 'task-crypto',
    title: 'Telegram Job / Prepaid Task / Crypto Investment Scam',
    subtitle: 'Trapped in Telegram task group, requested to pay "withdrawal fee" or "unfreeze tax"',
    category: 'Job & Investment',
    severity: 'High',
    goldenHourUrgency: 'Immediate: Stop sending funds. Never pay an unfreeze fee.',
    threatSummary: 'Platform account balances are simulated graphics. Demands for 30% taxes or unlock fees are extraction scripts. Gather transaction UTRs for cyber police.'
  },
  'sextortion': {
    id: 'sextortion',
    title: 'Sextortion / Private Video Call Blackmail',
    subtitle: 'Scammers threatening to leak morphed clips or video call recordings to contacts',
    category: 'Extortion & Blackmail',
    severity: 'Critical',
    goldenHourUrgency: 'Immediate: Do not pay. Paying causes scammers to double demands.',
    threatSummary: 'Extortionists exploit fear. Law treats you as a victim under IT Act 66E/67 and BNS 308. Hashing images via StopNCII prevents platform uploads.'
  },
  'phishing-electricity': {
    id: 'phishing-electricity',
    title: 'Phishing Link / Electricity Cutoff / FASTag Deception',
    subtitle: 'Received urgency SMS threatening power cutoff, KYC expiry, or account suspension',
    category: 'Banking & Phishing',
    severity: 'High',
    goldenHourUrgency: 'Hours 0-1: Change passwords if credentials or OTP were entered on fake site.',
    threatSummary: 'Urgent cutoff threats are engineered to bypass critical thinking. State discoms and banks never message from personal 10-digit mobile numbers.'
  },
  'general-scam': {
    id: 'general-scam',
    title: 'Identified Cyber Threat / General Incident Plan',
    subtitle: 'Universal step-by-step incident response and legal containment protocol',
    category: 'Cyber Defense',
    severity: 'High',
    goldenHourUrgency: 'Hours 0-2: Crucial window to preserve digital evidence and report.',
    threatSummary: 'Standard multi-stage incident containment: Sever communication, lock accounts, log evidence, and report under statutory frameworks.'
  }
};

const BASE_MITIGATION_STEPS: Record<PresetType, MitigationStep[]> = {
  'digital-arrest': [
    {
      id: 'da-1',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Triage & Psychological Break',
      timeframe: 'Minute 0 - 5',
      priority: 'CRITICAL',
      title: 'Disconnect Video / Skype Call Immediately',
      description: 'Hang up the call right now and block the contact. You are in ZERO legal jeopardy. No genuine court or CBI team operates on Skype.',
      actionHint: 'Severing contact terminates their control instantly.'
    },
    {
      id: 'da-2',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Triage & Psychological Break',
      timeframe: 'Minute 5 - 15',
      priority: 'CRITICAL',
      title: 'DO NOT Transfer Any "Asset Clearance / Verification" Money',
      description: 'Under no circumstance send money to any "RBI Secret Escrow Account" or "Supreme Court Bail Account". These accounts belong to criminal mules.',
      actionHint: 'Law enforcement never demands citizen funds for verification.'
    },
    {
      id: 'da-3',
      phaseId: 2,
      phaseName: 'Phase 2: Emergency Financial Lockdown',
      timeframe: 'Minute 15 - 60',
      priority: 'CRITICAL',
      title: 'Call 1930 Immediately if Funds Were Transferred',
      description: 'Have your bank account number and the recipient transaction ID/UTR ready so the I4C portal can place an automated lien on the receiver account.',
      callShortcut: 'tel:1930',
      quickTool: 'sos',
      dataFieldLabel: '12-Digit Transaction UTR / Ref Number',
      dataFieldPlaceholder: 'e.g. 509281729381'
    },
    {
      id: 'da-4',
      phaseId: 2,
      phaseName: 'Phase 2: Emergency Financial Lockdown',
      timeframe: 'Minute 30 - 60',
      priority: 'HIGH',
      title: 'Call Your Bank Hotline to Freeze Debit Cards & Net Banking',
      description: 'Notify your bank branch and customer care that you have been targeted in a cyber extortion attempt to flag suspicious outbound transfers.',
      quickTool: 'sos',
      dataFieldLabel: 'Bank Service Request / Dispute Number',
      dataFieldPlaceholder: 'e.g. SR-99201928'
    },
    {
      id: 'da-5',
      phaseId: 3,
      phaseName: 'Phase 3: Evidence Capture & Digital Forensics',
      timeframe: 'Hour 1 - 2',
      priority: 'HIGH',
      title: 'Preserve Caller ID, Skype Username & Forged Warrants',
      description: 'Take high-resolution screenshots of the caller’s WhatsApp profile, Skype ID, forged arrest warrants with Supreme Court seals, and payment requests.',
      quickTool: 'evidence'
    },
    {
      id: 'da-6',
      phaseId: 4,
      phaseName: 'Phase 4: Statutory Legal Reporting',
      timeframe: 'Hour 2 - 24',
      priority: 'CRITICAL',
      title: 'File Impersonation Complaint on cybercrime.gov.in',
      description: 'Report under "Impersonation of Government Official / Extortion" on the National Cyber Crime Reporting Portal (NCRP). Save the acknowledgment number.',
      quickTool: 'legal',
      dataFieldLabel: 'NCRP Complaint Acknowledgment #',
      dataFieldPlaceholder: 'e.g. 202503180019283'
    },
    {
      id: 'da-7',
      phaseId: 4,
      phaseName: 'Phase 4: Statutory Legal Reporting',
      timeframe: 'Hour 4 - 24',
      priority: 'HIGH',
      title: 'Report Impersonating Phone Numbers on DoT Chakshu Portal',
      description: 'Visit sancharsaathi.gov.in/sfc/ to flag the fraudulent caller numbers for immediate pan-India telecom disconnection.',
      actionHint: 'Prevents the same SIM from targeting other citizens.'
    },
    {
      id: 'da-8',
      phaseId: 5,
      phaseName: 'Phase 5: Reassurance & Family Support',
      timeframe: 'Day 1 - 7',
      priority: 'RECOMMENDED',
      title: 'Confide in Family or a Trusted Friend',
      description: 'Scammers rely heavily on isolation and shame. Confiding in loved ones relieves emotional anxiety and ensures communal vigilance.',
      actionHint: 'You did nothing wrong — you were targeted by organized syndicates.'
    }
  ],

  'unauthorized-debit': [
    {
      id: 'ud-1',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Financial Golden Hour',
      timeframe: 'Minute 0 - 15',
      priority: 'CRITICAL',
      title: 'Dial 1930 (National Cyber Crime Helpline) Immediately',
      description: 'The Golden Hour (first 2 hours) is decisive. Reporting to 1930 automatically triggers an inter-bank lien to freeze the fraudulent receiver bank account.',
      callShortcut: 'tel:1930',
      quickTool: 'sos',
      dataFieldLabel: 'Beneficiary Account / UPI VPA (Receiver)',
      dataFieldPlaceholder: 'e.g. fraudulent99@okaxis or 982109281928'
    },
    {
      id: 'ud-2',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Financial Golden Hour',
      timeframe: 'Minute 15 - 30',
      priority: 'CRITICAL',
      title: 'Call Bank Hotline to Freeze Account & Debit/Credit Cards',
      description: 'Temporarily lock debit cards, block international and online transactions in your bank mobile app, and disable Net Banking access.',
      quickTool: 'sos',
      dataFieldLabel: 'Bank Complaint / SR Reference Number',
      dataFieldPlaceholder: 'e.g. HDFC-CMP-2025-0192'
    },
    {
      id: 'ud-3',
      phaseId: 2,
      phaseName: 'Phase 2: App & Credential Lockdown',
      timeframe: 'Minute 30 - 60',
      priority: 'CRITICAL',
      title: 'Change UPI MPIN & NetBanking Password',
      description: 'Reset your UPI PIN across Google Pay, PhonePe, and Paytm. If your SIM or phone was accessed, perform this reset from an uncompromised family phone.',
      actionHint: 'Never use common dates of birth or sequential digits for MPIN.'
    },
    {
      id: 'ud-4',
      phaseId: 2,
      phaseName: 'Phase 2: App & Credential Lockdown',
      timeframe: 'Minute 45 - 60',
      priority: 'HIGH',
      title: 'File In-App Payment Dispute in UPI Application',
      description: 'Open GPay/PhonePe/Paytm -> Transaction History -> Select Fraud Debit -> "Have an issue / Report Fraud". Note the dispute ticket.',
      dataFieldLabel: 'Payment App Dispute Ticket ID',
      dataFieldPlaceholder: 'e.g. GP-DISP-892182'
    },
    {
      id: 'ud-5',
      phaseId: 3,
      phaseName: 'Phase 3: Evidence Capture & Digital Forensics',
      timeframe: 'Hour 1 - 2',
      priority: 'HIGH',
      title: 'Save Bank Statement PDF & SMS Alerts in Evidence Locker',
      description: 'Download the official bank statement showing the transaction line item, 12-digit UTR, timestamp, and save it in the browser Evidence Locker.',
      quickTool: 'evidence',
      dataFieldLabel: '12-Digit Bank UTR / Reference ID',
      dataFieldPlaceholder: 'e.g. 509218291029'
    },
    {
      id: 'ud-6',
      phaseId: 4,
      phaseName: 'Phase 4: Statutory Legal Protection & Zero Liability',
      timeframe: 'Hour 2 - 72',
      priority: 'CRITICAL',
      title: 'Submit Formal Written Dispute Under RBI Circular',
      description: 'Under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18, reporting unauthorized electronic fraud within 3 working days guarantees zero customer liability.',
      quickTool: 'legal'
    },
    {
      id: 'ud-7',
      phaseId: 4,
      phaseName: 'Phase 4: Statutory Legal Protection & Zero Liability',
      timeframe: 'Hour 4 - 24',
      priority: 'CRITICAL',
      title: 'Lodge Police FIR / Zero-FIR at Nearest Police Station',
      description: 'Lodge complaint under BNSS Section 173 and IT Act Section 66D. Provide bank dispute number and 1930 acknowledgment slip.',
      quickTool: 'legal',
      dataFieldLabel: 'Police FIR Number / GD Entry #',
      dataFieldPlaceholder: 'e.g. FIR 104/2025 Cyber Cell'
    },
    {
      id: 'ud-8',
      phaseId: 5,
      phaseName: 'Phase 5: Post-Incident Hardening',
      timeframe: 'Day 1 - 7',
      priority: 'RECOMMENDED',
      title: 'Monitor Bank Statements & Beware Recovery Scammers',
      description: 'Watch for secondary scams: Fraudsters posing as "White-hat Hackers" or "Refund Agents" on Instagram/Telegram demanding upfront fees to recover your money.',
      actionHint: '100% of third-party internet money recovery agents are scams.'
    }
  ],

  'remote-apk': [
    {
      id: 'ra-1',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Network Isolation',
      timeframe: 'Minute 0 - 2',
      priority: 'CRITICAL',
      title: 'Switch on Airplane Mode Immediately',
      description: 'Turn on Airplane Mode or turn off Wi-Fi and Mobile Data immediately. Without an active network connection, the rogue app cannot send OTPs or stream your screen.',
      actionHint: 'Severing the network stops the attacker in their tracks.'
    },
    {
      id: 'ra-2',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Network Isolation',
      timeframe: 'Minute 2 - 10',
      priority: 'CRITICAL',
      title: 'Uninstall the Malicious App or Screen Sharing Tool',
      description: 'Navigate to Android Settings -> Apps -> All Apps. Uninstall AnyDesk, TeamViewer QuickSupport, RustDesk, or any APK downloaded via WhatsApp.',
      actionHint: 'If uninstall is grayed out, first revoke Device Admin under Settings -> Security.'
    },
    {
      id: 'ra-3',
      phaseId: 2,
      phaseName: 'Phase 2: Accessibility & Permission Purge',
      timeframe: 'Minute 10 - 20',
      priority: 'CRITICAL',
      title: 'Revoke Accessibility Services Permissions',
      description: 'Open Settings -> Accessibility -> Installed Services. Ensure NO app has permission to read your screen or perform clicks.',
      actionHint: 'Trojans abuse Accessibility services to auto-approve OTPs.'
    },
    {
      id: 'ra-4',
      phaseId: 2,
      phaseName: 'Phase 2: Secondary Device Password Reset',
      timeframe: 'Minute 20 - 45',
      priority: 'CRITICAL',
      title: 'Reset Banking & Google Passwords from a Clean Device',
      description: 'Using a family member’s phone or clean PC, change your net banking passwords, UPI PIN, and primary Google Account password.',
      actionHint: 'Do NOT reset passwords from the infected phone until fully sanitized.'
    },
    {
      id: 'ra-5',
      phaseId: 3,
      phaseName: 'Phase 3: Call & SMS Forwarding Check',
      timeframe: 'Minute 45 - 60',
      priority: 'HIGH',
      title: 'Dial ##002# to Cancel Unauthorized Call/SMS Forwarding',
      description: 'Scammers frequently activate GSM call forwarding to redirect banking verification calls. Dial ##002# to cancel all forwards.',
      callShortcut: 'tel:##002#',
      quickTool: 'ussd',
      actionHint: 'Also dial *#67# to audit active forwarding numbers.'
    },
    {
      id: 'ra-6',
      phaseId: 3,
      phaseName: 'Phase 3: Antivirus & Play Protect Scan',
      timeframe: 'Hour 1 - 2',
      priority: 'HIGH',
      title: 'Trigger Full Google Play Protect Security Scan',
      description: 'Open Google Play Store -> Profile -> Play Protect -> Tap Scan. Verify that no unrecognized malicious packages remain.',
      actionHint: 'Google Play Protect checks apps against known Android malware definitions.'
    },
    {
      id: 'ra-7',
      phaseId: 4,
      phaseName: 'Phase 4: Statutory Legal & Telecom Report',
      timeframe: 'Hour 2 - 24',
      priority: 'HIGH',
      title: 'Lodge Cyber Complaint & Audit Financial Accounts',
      description: 'Check bank mini-statements for micro-debits (₹1, ₹5 tests). File a report on cybercrime.gov.in under Malicious Software / Remote Access.',
      quickTool: 'legal',
      dataFieldLabel: 'NCRP Complaint ID',
      dataFieldPlaceholder: 'e.g. 20250318001248'
    }
  ],

  'task-crypto': [
    {
      id: 'tc-1',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Financial Bleed Halt',
      timeframe: 'Minute 0 - 5',
      priority: 'CRITICAL',
      title: 'STOP SENDING MONEY! Cut Off All Payments',
      description: 'Do not pay any "30% withdrawal tax", "credit score unfreeze fee", or "merchant deposit". Every rupee sent from now on is 100% lost.',
      actionHint: 'Paying more will never release previous funds.'
    },
    {
      id: 'tc-2',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Financial Bleed Halt',
      timeframe: 'Minute 5 - 15',
      priority: 'HIGH',
      title: 'Do Not Believe "Group Members" Claiming Successful Payouts',
      description: 'Other members in the Telegram group praising the scheme are colluders or bot accounts run by the syndicate to deceive you.',
      actionHint: 'They are paid accomplices or fake sockpuppet profiles.'
    },
    {
      id: 'tc-3',
      phaseId: 2,
      phaseName: 'Phase 2: Chat & Evidence Preservation',
      timeframe: 'Minute 15 - 60',
      priority: 'CRITICAL',
      title: 'Export Telegram Chat & Screenshot Platform Dashboard',
      description: 'Export Telegram chat (.txt) before admins wipe history. Screenshot the fake portal dashboard showing the fake balance and deposit instructions.',
      quickTool: 'evidence'
    },
    {
      id: 'tc-4',
      phaseId: 2,
      phaseName: 'Phase 2: Beneficiary Ledger Compilation',
      timeframe: 'Hour 1 - 2',
      priority: 'CRITICAL',
      title: 'Compile Complete Table of Recipient Accounts & UTR Numbers',
      description: 'List each transfer: Date, Amount, Recipient Bank Name, Beneficiary Account Number/UPI ID, and 12-digit UTR number.',
      dataFieldLabel: 'Total Amount Transferred (₹) & Primary UTR',
      dataFieldPlaceholder: 'e.g. ₹85,000 | UTR 509182910281'
    },
    {
      id: 'tc-5',
      phaseId: 3,
      phaseName: 'Phase 3: Statutory Financial & Cyber Filing',
      timeframe: 'Hour 2 - 12',
      priority: 'CRITICAL',
      title: 'Report Every Beneficiary Account to 1930 & cybercrime.gov.in',
      description: 'File under "Part-Time Job / Task-Based Investment Fraud". Providing the exact recipient bank accounts allows police to freeze mule syndicates.',
      callShortcut: 'tel:1930',
      quickTool: 'sos',
      dataFieldLabel: 'NCRP Financial Fraud Token',
      dataFieldPlaceholder: 'e.g. ACK-2025-TASK-992'
    },
    {
      id: 'tc-6',
      phaseId: 4,
      phaseName: 'Phase 4: Legal FIR Lodging',
      timeframe: 'Hour 12 - 48',
      priority: 'HIGH',
      title: 'File Police FIR under BNS 318(4) & IT Act 66D',
      description: 'Use the Legal FIR guide to generate a formal complaint with the complete transaction schedule for the District Cyber Cell.',
      quickTool: 'legal',
      dataFieldLabel: 'Cyber Police Station / Diary Entry',
      dataFieldPlaceholder: 'e.g. Cyber Cell Case #28/2025'
    },
    {
      id: 'tc-7',
      phaseId: 5,
      phaseName: 'Phase 5: Secondary Scam Immunity',
      timeframe: 'Day 1 - 14',
      priority: 'RECOMMENDED',
      title: 'Beware Instagram/Telegram "Fund Recovery Specialists"',
      description: 'You will receive messages from "White-Hat Hackers" claiming they can hack the scammer server. These are recovery scams targeting known victims.',
      actionHint: 'Only lawful bank lien orders via 1930 can recover funds.'
    }
  ],

  'sextortion': [
    {
      id: 'se-1',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Communication Blackout',
      timeframe: 'Minute 0 - 5',
      priority: 'CRITICAL',
      title: 'DO NOT PAY A SINGLE RUPEE! Refuse Payment',
      description: 'Paying once never stops extortion — scammers immediately demand 3x more. Paying marks you as a lucrative paying target.',
      actionHint: 'Extortionists abandon silent targets who refuse to pay.'
    },
    {
      id: 'se-2',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Communication Blackout',
      timeframe: 'Minute 5 - 15',
      priority: 'CRITICAL',
      title: 'Block Extortionist on WhatsApp & Phone Calls',
      description: 'Do NOT plead, apologize, or negotiate. End contact cleanly. Do not answer calls from new unknown numbers.',
      actionHint: 'Emotional responses give scammers leverage.'
    },
    {
      id: 'se-3',
      phaseId: 2,
      phaseName: 'Phase 2: Social Media Fortress Lockdown',
      timeframe: 'Minute 15 - 45',
      priority: 'CRITICAL',
      title: 'Set Facebook, Instagram & LinkedIn to Maximum Privacy',
      description: 'Make profiles private, hide friend/following lists, disable tagging, and turn off direct messaging from non-followers.',
      actionHint: 'Prevents extortionists from scraping your family contact lists.'
    },
    {
      id: 'se-4',
      phaseId: 2,
      phaseName: 'Phase 2: Cryptographic Upload Prevention',
      timeframe: 'Minute 45 - 60',
      priority: 'HIGH',
      title: 'Submit Cryptographic Hash on StopNCII.org',
      description: 'StopNCII.org generates a secure hash of private media on your device without uploading the media itself. Meta/Instagram automatically blocks matching uploads.',
      actionHint: 'Backed by major social networks to prevent viral distribution.'
    },
    {
      id: 'se-5',
      phaseId: 3,
      phaseName: 'Phase 3: Evidence Capture',
      timeframe: 'Hour 1 - 2',
      priority: 'HIGH',
      title: 'Capture Screenshots of Threats & Beneficiary UPI ID',
      description: 'Screenshot the extortion chat, caller mobile number, and payment demands before blocking. Store securely in Evidence Locker.',
      quickTool: 'evidence',
      dataFieldLabel: 'Extortionist Phone / UPI ID Demanded',
      dataFieldPlaceholder: 'e.g. +91 98xxxxxx / extortion@paytm'
    },
    {
      id: 'se-6',
      phaseId: 4,
      phaseName: 'Phase 4: Statutory Legal Protection',
      timeframe: 'Hour 2 - 24',
      priority: 'CRITICAL',
      title: 'File Confidential Complaint on cybercrime.gov.in',
      description: 'Report under "Cyber Blackmail / Non-Consensual Images" or call Women Cyber Helpline (1091 / 1090) or 1930 for confidential handling.',
      callShortcut: 'tel:1930',
      quickTool: 'legal',
      dataFieldLabel: 'Confidential NCRP Complaint Acknowledgment #',
      dataFieldPlaceholder: 'e.g. 20250318002910'
    },
    {
      id: 'se-7',
      phaseId: 5,
      phaseName: 'Phase 5: Emotional Reassurance & De-escalation',
      timeframe: 'Day 1 - 7',
      priority: 'RECOMMENDED',
      title: 'Ignore Fake "Delhi Police / YouTube Officer" Settlement Calls',
      description: 'Partners of the extortionist will call claiming to be "Cyber Cell Inspector" demanding ₹20,000 to "delete video from server". These are partners of the scammer.',
      actionHint: 'Genuine police never demand money to remove web files.'
    }
  ],

  'phishing-electricity': [
    {
      id: 'pe-1',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Containment',
      timeframe: 'Minute 0 - 10',
      priority: 'CRITICAL',
      title: 'Do Not Click Link or Call the 10-Digit Officer Number',
      description: 'Official electricity boards (BESCOM, Tata Power, BSES, etc.) send SMS via verified alphanumeric sender IDs (e.g., AD-BESCOM), never personal mobile numbers.',
      actionHint: 'Electric power will NOT be disconnected tonight.'
    },
    {
      id: 'pe-2',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Containment',
      timeframe: 'Minute 10 - 20',
      priority: 'CRITICAL',
      title: 'If You Clicked Link: Close Browser Tab Immediately',
      description: 'Do not enter Consumer Number, Debit Card, Net Banking login, or OTP on the web page. If entered, proceed to step 3 immediately.',
      actionHint: 'Phishing pages mimic state electricity portals.'
    },
    {
      id: 'pe-3',
      phaseId: 2,
      phaseName: 'Phase 2: Credential & Account Lockdown',
      timeframe: 'Minute 20 - 45',
      priority: 'CRITICAL',
      title: 'Change NetBanking & UPI Passwords if Entered on Phishing Site',
      description: 'If you typed your card details or net banking credentials on the fake link, immediately login to your official banking app and reset passwords.',
      quickTool: 'sos'
    },
    {
      id: 'pe-4',
      phaseId: 2,
      phaseName: 'Phase 2: Credential & Account Lockdown',
      timeframe: 'Minute 30 - 60',
      priority: 'HIGH',
      title: 'Audit Electricity Bill in Official Utility App / Portal',
      description: 'Open your state discom official app or pay bill via official Electricity Board website. Check your genuine balance.',
      actionHint: 'You will find no disconnection order or pending dues.'
    },
    {
      id: 'pe-5',
      phaseId: 3,
      phaseName: 'Phase 3: Digital Evidence Preservation',
      timeframe: 'Hour 1 - 2',
      priority: 'HIGH',
      title: 'Screenshot the SMS Showing Sender Header & Links',
      description: 'Capture screenshot showing the exact sender phone number and URL domain. Save into Evidence Locker.',
      quickTool: 'evidence'
    },
    {
      id: 'pe-6',
      phaseId: 4,
      phaseName: 'Phase 4: Report on Chakshu Portal',
      timeframe: 'Hour 2 - 24',
      priority: 'HIGH',
      title: 'Flag Phishing SMS on DoT Chakshu Portal (sancharsaathi.gov.in)',
      description: 'Report the scammer mobile number on the Department of Telecommunications portal to blacklist the SIM across Indian telecom networks.',
      actionHint: 'Direct link: sancharsaathi.gov.in/sfc/'
    }
  ],

  'general-scam': [
    {
      id: 'gs-1',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Triage',
      timeframe: 'Minute 0 - 15',
      priority: 'CRITICAL',
      title: 'Stop Communication & Do Not Transfer Any Money',
      description: 'Sever all communication with the suspect. Do not click links, send verification amounts, or disclose OTPs.',
      actionHint: 'Silence cuts off the attacker’s progression.'
    },
    {
      id: 'gs-2',
      phaseId: 1,
      phaseName: 'Phase 1: Immediate Triage',
      timeframe: 'Minute 15 - 30',
      priority: 'CRITICAL',
      title: 'Call 1930 if Financial Loss Occurred',
      description: 'The National Cyber Financial Crime Helpline (1930) operates 24/7. Have your bank account number and transaction UTR ready.',
      callShortcut: 'tel:1930',
      quickTool: 'sos',
      dataFieldLabel: 'Transaction UTR Number',
      dataFieldPlaceholder: 'e.g. 5092819281'
    },
    {
      id: 'gs-3',
      phaseId: 2,
      phaseName: 'Phase 2: Account Lockdown',
      timeframe: 'Minute 30 - 60',
      priority: 'HIGH',
      title: 'Reset Passwords & Enable Two-Factor Authentication',
      description: 'Update passwords on primary email, net banking, and UPI apps. Ensure authenticator app (Google Authenticator) is used instead of SMS where possible.',
      actionHint: 'Strengthens account defenses.'
    },
    {
      id: 'gs-4',
      phaseId: 3,
      phaseName: 'Phase 3: Evidence Capture',
      timeframe: 'Hour 1 - 2',
      priority: 'HIGH',
      title: 'Store Chat Transcripts & Receipts in Evidence Locker',
      description: 'Preserve full chat screenshots, URL links, audio recordings, and payment receipts before the suspect clears chats.',
      quickTool: 'evidence'
    },
    {
      id: 'gs-5',
      phaseId: 4,
      phaseName: 'Phase 4: Statutory Legal Filing',
      timeframe: 'Hour 2 - 24',
      priority: 'CRITICAL',
      title: 'File Formal Incident Report on cybercrime.gov.in',
      description: 'Submit an incident report on the National Cyber Crime Reporting Portal to establish legal paper trail.',
      quickTool: 'legal',
      dataFieldLabel: 'NCRP Acknowledgment Number',
      dataFieldPlaceholder: 'e.g. 202503180012'
    },
    {
      id: 'gs-6',
      phaseId: 5,
      phaseName: 'Phase 5: Post-Incident Hardening',
      timeframe: 'Day 1 - 7',
      priority: 'RECOMMENDED',
      title: 'Review Device Permissions & Beware Secondary Scams',
      description: 'Audit installed apps, check for unauthorized call forwarding (*#67#), and never trust third-party fund recovery services.',
      quickTool: 'ussd'
    }
  ]
};

export const ThreatMitigationPlan: React.FC<ThreatMitigationPlanProps> = ({
  isOpen,
  onClose,
  initialScam,
  initialAlert,
  initialAdvisory,
  initialScenario,
  onOpenSos,
  onOpenEvidenceLocker,
  onGoToLegal,
}) => {
  // Determine matching preset
  const determineInitialPreset = (): PresetType => {
    if (initialScam) {
      if (initialScam.id === 'digital-arrest' || initialScam.title.toLowerCase().includes('digital arrest')) {
        return 'digital-arrest';
      }
      if (initialScam.category === 'Banking & UPI' || initialScam.title.toLowerCase().includes('upi') || initialScam.title.toLowerCase().includes('qr')) {
        return 'unauthorized-debit';
      }
      if (initialScam.id.includes('apk') || initialScam.category === 'Malware & Tech') {
        return 'remote-apk';
      }
      if (initialScam.category === 'Job & Task' || initialScam.title.toLowerCase().includes('job') || initialScam.title.toLowerCase().includes('crypto')) {
        return 'task-crypto';
      }
      if (initialScam.category === 'Extortion & Blackmail' || initialScam.title.toLowerCase().includes('sextortion')) {
        return 'sextortion';
      }
      if (initialScam.title.toLowerCase().includes('electricity') || initialScam.title.toLowerCase().includes('phishing')) {
        return 'phishing-electricity';
      }
    }

    if (initialAlert) {
      const lower = (initialAlert.title + ' ' + initialAlert.description).toLowerCase();
      if (lower.includes('digital arrest') || lower.includes('cbi') || lower.includes('police')) return 'digital-arrest';
      if (lower.includes('apk') || lower.includes('malware')) return 'remote-apk';
      if (lower.includes('electricity') || lower.includes('trai')) return 'phishing-electricity';
      if (lower.includes('bank') || lower.includes('upi')) return 'unauthorized-debit';
    }

    if (initialAdvisory) {
      if (initialAdvisory.threatType === 'digital_arrest') return 'digital-arrest';
      if (initialAdvisory.threatType === 'apk') return 'remote-apk';
      if (initialAdvisory.threatType === 'banking') return 'unauthorized-debit';
      if (initialAdvisory.threatType === 'job_scam') return 'task-crypto';
      if (initialAdvisory.threatType === 'electricity') return 'phishing-electricity';
    }

    if (initialScenario) {
      if (initialScenario === 'digital-arrest') return 'digital-arrest';
      if (initialScenario === 'money-debited') return 'unauthorized-debit';
      if (initialScenario === 'remote-apk') return 'remote-apk';
      if (initialScenario === 'task-crypto') return 'task-crypto';
      if (initialScenario === 'sextortion') return 'sextortion';
      if (initialScenario === 'sim-swap') return 'remote-apk';
    }

    return 'general-scam';
  };

  const [activePreset, setActivePreset] = useState<PresetType>(determineInitialPreset());
  const [completedSteps, setCompletedSteps] = useState<Record<string, { done: boolean; timestamp: string }>>({});
  const [stepDataValues, setStepDataValues] = useState<Record<string, string>>({});
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'ALL'>('ALL');
  const [startTime] = useState<number>(Date.now());
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  // Recommended Educational Video Explainer State
  const [activeVideoModal, setActiveVideoModal] = useState<VideoModule | null>(null);
  const [videoModalStepIndex, setVideoModalStepIndex] = useState(0);

  const recommendedVideos = useMemo(() => {
    const mapping: Record<PresetType, string[]> = {
      'digital-arrest': ['vid-digital-arrest', 'vid-ai-voice-cloning'],
      'unauthorized-debit': ['vid-upi-rules', 'vid-phishing-fake-sites'],
      'remote-apk': ['vid-remote-screen-share', 'vid-electricity-bill-fraud'],
      'task-crypto': ['vid-task-telegram-scam', 'vid-investment-trading-scam'],
      'sextortion': ['vid-sextortion-defense', 'vid-ai-voice-cloning'],
      'phishing-electricity': ['vid-electricity-bill-fraud', 'vid-phishing-fake-sites'],
      'general-scam': ['vid-upi-rules', 'vid-digital-arrest', 'vid-remote-screen-share'],
    };
    const ids = mapping[activePreset] || mapping['general-scam'];
    return VIDEO_MODULES.filter((v) => ids.includes(v.id));
  }, [activePreset]);

  // Sync preset if prop changes
  useEffect(() => {
    setActivePreset(determineInitialPreset());
  }, [initialScam, initialAlert, initialAdvisory, initialScenario]);

  // Track elapsed minutes since incident plan launched
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - startTime) / 60000));
    }, 30000);
    return () => clearInterval(timer);
  }, [startTime]);

  const currentPresetConfig = PRESETS[activePreset];
  const steps = useMemo(() => {
    let list = BASE_MITIGATION_STEPS[activePreset] || BASE_MITIGATION_STEPS['general-scam'];

    // If a custom scam pattern is present and has immediateSteps, inject them seamlessly
    if (initialScam && initialScam.immediateSteps && initialScam.immediateSteps.length > 0) {
      // Keep curated flow
      return list;
    }
    return list;
  }, [activePreset, initialScam]);

  const filteredSteps = useMemo(() => {
    if (selectedPhaseFilter === 'ALL') return steps;
    return steps.filter((s) => s.phaseId === selectedPhaseFilter);
  }, [steps, selectedPhaseFilter]);

  const totalSteps = steps.length;
  const completedCount = useMemo(() => {
    return steps.filter((s) => completedSteps[s.id]?.done).length;
  }, [steps, completedSteps]);

  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const current = prev[stepId]?.done;
      if (current) {
        const copy = { ...prev };
        delete copy[stepId];
        return copy;
      } else {
        const timeStr = new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        return {
          ...prev,
          [stepId]: { done: true, timestamp: timeStr },
        };
      }
    });
  };

  const handleDataChange = (stepId: string, value: string) => {
    setStepDataValues((prev) => ({ ...prev, [stepId]: value }));
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset all checklist progress for this mitigation plan?')) {
      setCompletedSteps({});
      setStepDataValues({});
    }
  };

  // Generate clean exportable Dossier
  const generateDossierText = () => {
    const timestampStr = new Date().toLocaleString('en-IN');
    let text = `====================================================================\n`;
    text += `CYBER CRIME INCIDENT THREAT MITIGATION PLAN & ACTION DOSSIER\n`;
    text += `Generated via Cyber Mitra AI Studio Platform\n`;
    text += `====================================================================\n\n`;
    text += `INCIDENT DATE & TIME: ${timestampStr}\n`;
    text += `THREAT ARCHETYPE: ${currentPresetConfig.title}\n`;
    text += `CATEGORY: ${currentPresetConfig.category} | SEVERITY: ${currentPresetConfig.severity}\n`;
    if (initialScam) {
      text += `IDENTIFIED PATTERN: ${initialScam.title}\n`;
    }
    text += `MITIGATION PROGRESS: ${completedCount} of ${totalSteps} actions completed (${progressPercent}%)\n\n`;
    text += `--------------------------------------------------------------------\n`;
    text += `EXECUTIVE THREAT SUMMARY:\n`;
    text += `${currentPresetConfig.threatSummary}\n`;
    text += `--------------------------------------------------------------------\n\n`;

    text += `STEP-BY-STEP INCIDENT ACTIONS EXECUTED:\n\n`;

    steps.forEach((step, idx) => {
      const status = completedSteps[step.id]?.done ? `[ COMPLETED at ${completedSteps[step.id].timestamp} ]` : `[ PENDING ]`;
      text += `${idx + 1}. ${status} ${step.title}\n`;
      text += `   Phase: ${step.phaseName} (${step.timeframe})\n`;
      text += `   Action: ${step.description}\n`;
      if (stepDataValues[step.id]) {
        text += `   RECORDED DATA (${step.dataFieldLabel || 'Note'}): ${stepDataValues[step.id]}\n`;
      }
      text += `\n`;
    });

    text += `--------------------------------------------------------------------\n`;
    text += `RELEVANT STATUTORY LEGAL CITATIONS (INDIAN LAW):\n`;
    text += `• BNS Section 318(4) (Cheating & Dishonest Inducement of Property)\n`;
    text += `• BNS Section 319 / IPC 419 (Cheating by Personation)\n`;
    text += `• IT Act Section 66D (Cheating by Personation using Computer Resource)\n`;
    text += `• BNSS Section 173 (Mandatory Zero-FIR Lodging Jurisdiction)\n`;
    text += `• RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 (Customer Zero Liability if reported within 3 days)\n`;
    text += `--------------------------------------------------------------------\n`;
    text += `National Cyber Crime Helpline: 1930 | Portal: cybercrime.gov.in\n`;
    text += `Department of Telecom Chakshu Portal: sancharsaathi.gov.in/sfc/\n`;
    text += `====================================================================\n`;

    return text;
  };

  const handleCopyDossier = () => {
    const text = generateDossierText();
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleDownloadDossier = () => {
    const text = generateDossierText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberMitra_Mitigation_Report_${activePreset}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadFeedback(true);
    setTimeout(() => setDownloadFeedback(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0 border-b border-indigo-900/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/40">
                    Active Incident Response
                  </span>
                  <span className="text-slate-400 text-xs hidden sm:inline">
                    · Golden Hour Elapsed: {elapsedMinutes}m
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  Interactive Threat Mitigation Plan
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetChecklist}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="Reset checklist items"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Mitigation Plan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preset Selector Dropdown Bar */}
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold shrink-0">Scam Scenario:</span>
              <select
                value={activePreset}
                onChange={(e) => {
                  setActivePreset(e.target.value as PresetType);
                }}
                className="bg-slate-800/90 border border-indigo-400/30 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
              >
                <option value="digital-arrest">🚨 Digital Arrest / Police & CBI Video Call</option>
                <option value="unauthorized-debit">💳 Unauthorized UPI / Net Banking Debit</option>
                <option value="remote-apk">📱 Malicious APK / AnyDesk Remote Access</option>
                <option value="task-crypto">💼 Telegram Job / Task & Crypto Scam</option>
                <option value="sextortion">🔒 Sextortion / Video Call Blackmail</option>
                <option value="phishing-electricity">⚡ Fake Electricity Bill / Phishing Link</option>
                <option value="general-scam">🛡️ Universal Cyber Incident Plan</option>
              </select>
            </div>

            {/* Severity and Source indicator */}
            <div className="flex items-center gap-2 text-xs">
              {initialScam && (
                <span className="text-indigo-300 truncate max-w-[220px] text-[11px]">
                  Pattern: <strong className="text-white">{initialScam.title}</strong>
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {currentPresetConfig.severity} Urgency
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress & Golden Hour Alert Bar */}
        <div className="bg-slate-900/95 px-4 sm:px-6 py-3 border-b border-slate-800 shrink-0 text-xs text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between mb-1 text-[11px]">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Containment Progress:</span>
                <strong className="text-white">{completedCount}/{totalSteps} Steps</strong>
              </span>
              <span className="font-mono font-bold text-emerald-400">{progressPercent}% Contained</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent === 100
                    ? 'bg-emerald-500'
                    : progressPercent > 50
                    ? 'bg-indigo-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDossier}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Copy formal mitigation text"
            >
              {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copyFeedback ? 'Copied Dossier!' : 'Copy Plan'}</span>
            </button>
            <button
              onClick={handleDownloadDossier}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Download print-ready text file"
            >
              {downloadFeedback ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadFeedback ? 'Downloaded!' : 'Export Dossier'}</span>
            </button>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setSelectedPhaseFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedPhaseFilter === 'ALL'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Phases ({totalSteps})
          </button>
          {[
            { id: 1, label: 'Phase 1: Immediate Triage (0-15m)' },
            { id: 2, label: 'Phase 2: Financial Lockdown (15-60m)' },
            { id: 3, label: 'Phase 3: Evidence Capture (1-2h)' },
            { id: 4, label: 'Phase 4: Police & Legal (2-24h)' },
            { id: 5, label: 'Phase 5: Post-Incident Hardening' },
          ].map((p) => {
            const phaseStepCount = steps.filter((s) => s.phaseId === p.id).length;
            if (phaseStepCount === 0) return null;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhaseFilter(p.id)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedPhaseFilter === p.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Checklist Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Reassurance & Threat Synopsis Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row items-start justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Threat Context & Golden Hour Window</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {currentPresetConfig.threatSummary}
              </p>
              <p className="text-amber-800 font-semibold mt-1">
                ⏱️ {currentPresetConfig.goldenHourUrgency}
              </p>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={onOpenSos}
                className="flex-1 sm:flex-none px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Dial 1930 Helpline</span>
              </button>
              <button
                onClick={onOpenEvidenceLocker}
                className="flex-1 sm:flex-none px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Open Evidence Locker</span>
              </button>
            </div>
          </div>

          {/* Interactive Checklist Steps */}
          <div className="space-y-3">
            {filteredSteps.map((step, idx) => {
              const isChecked = !!completedSteps[step.id]?.done;
              const isExpanded = !!expandedDetails[step.id];

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                      : 'bg-white hover:border-slate-300 border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Step Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              step.priority === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : step.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {step.priority}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {step.phaseName} · {step.timeframe}
                          </span>
                        </div>

                        {isChecked && (
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-semibold">
                            ✓ Done at {completedSteps[step.id].timestamp}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2
                        onClick={() => toggleStep(step.id)}
                        className={`text-sm sm:text-base font-bold cursor-pointer transition-colors ${
                          isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'
                        }`}
                      >
                        {step.title}
                      </h2>

                      {/* Description */}
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {step.description}
                      </p>

                      {step.actionHint && (
                        <div className="mt-1.5 text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <span className="text-indigo-600">💡 Tip:</span>
                          <span>{step.actionHint}</span>
                        </div>
                      )}

                      {/* Action Tools & Data Entry Inputs */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {step.callShortcut && (
                            <a
                              href={step.callShortcut}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>{step.callShortcut.replace('tel:', 'Dial ')}</span>
                            </a>
                          )}

                          {step.quickTool === 'evidence' && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenEvidenceLocker();
                              }}
                              className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Bookmark className="w-3 h-3" />
                              <span>Save to Evidence Locker</span>
                            </button>
                          )}

                          {step.quickTool === 'legal' && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onGoToLegal();
                              }}
                              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Open Police FIR Drafter</span>
                            </button>
                          )}

                          {step.quickTool === 'sos' && (
                            <button
                              type="button"
                              onClick={onOpenSos}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>View Bank Hotlines</span>
                            </button>
                          )}

                          {step.quickTool === 'ussd' && (
                            <div className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              USSD Forwarding Check: *#67# | Cancel: ##002#
                            </div>
                          )}
                        </div>

                        {/* Interactive Data Entry Input if present */}
                        {step.dataFieldLabel && (
                          <div className="w-full sm:w-auto flex-1 max-w-sm mt-1 sm:mt-0">
                            <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                              {step.dataFieldLabel}:
                            </label>
                            <input
                              type="text"
                              value={stepDataValues[step.id] || ''}
                              onChange={(e) => handleDataChange(step.id, e.target.value)}
                              placeholder={step.dataFieldPlaceholder || 'Enter reference #'}
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended Educational & De-escalation Videos for Active Threat */}
          {recommendedVideos.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900/50 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/80 flex items-center justify-center text-white shrink-0">
                    <Video className="w-4 h-4 text-indigo-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold">
                      <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span>Recommended Video Briefings &amp; Storyboard Simulations</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      Understand What Happened: Video Walkthrough
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300 w-fit">
                  {recommendedVideos.length} Curated for {currentPresetConfig.title.split('/')[0].trim()}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Step-by-step visual reconstructions demonstrating how fraudsters trigger panic or manipulate banking protocols, paired with golden countermeasures.
              </p>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {recommendedVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setActiveVideoModal(vid);
                      setVideoModalStepIndex(0);
                    }}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top row */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                          {vid.category}
                        </span>
                        <span className="font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-slate-300">
                          {vid.duration}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                        {vid.title}
                      </h4>

                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>

                      <div className="mt-2.5 p-2 rounded-lg bg-black/30 border border-white/5 text-[11px] text-amber-300 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{vid.keyTakeaways[0]}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {vid.videoStoryboard.length} Interactive Scenes
                      </span>
                      <span className="text-indigo-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                        <Play className="w-3 h-3 fill-indigo-300" />
                        <span>Watch Simulation</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statutory Law & Citizen Guarantee Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Statutory Legal Protection Guaranteed by Indian Law</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 leading-relaxed">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Section 173 BNSS (Zero-FIR Mandate)</strong>
                Any police station in India is legally obligated to accept your FIR immediately without rejecting on jurisdictional grounds.
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">RBI Zero-Liability Notification</strong>
                If unauthorized online banking or UPI debit is reported within 3 days, customer liability is strictly zero under RBI mandate.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 w-full sm:w-auto justify-between sm:justify-start">
            <span>
              Status: <strong className="text-slate-800">{completedCount === totalSteps ? 'Fully Secured' : 'Mitigation in Progress'}</strong>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Helpline 1930 is active 24x7</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadDossier}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close Plan
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Video Storyboard Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col my-auto max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {videoModalStepIndex + 1}/{activeVideoModal.videoStoryboard.length}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold">
                      {activeVideoModal.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeVideoModal.duration}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                    {activeVideoModal.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scene Player */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {(() => {
                const currentScene =
                  activeVideoModal.videoStoryboard[videoModalStepIndex] || activeVideoModal.videoStoryboard[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Left Narrative */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-xs font-semibold mb-2">
                          <span>Scene {currentScene.stepNumber}: {currentScene.title}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">
                          {currentScene.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                          {currentScene.description}
                        </p>
                      </div>

                      {currentScene.warningCallout && (
                        <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-100 block mb-0.5">Critical Warning</span>
                            <span>{currentScene.warningCallout}</span>
                          </div>
                        </div>
                      )}

                      {/* Stepper Dots & Player Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <div className="flex items-center gap-1.5">
                          {activeVideoModal.videoStoryboard.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setVideoModalStepIndex(i)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                videoModalStepIndex === i ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setVideoModalStepIndex(0)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                            title="Restart"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={videoModalStepIndex === 0}
                            onClick={() => setVideoModalStepIndex((prev) => Math.max(0, prev - 1))}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (videoModalStepIndex < activeVideoModal.videoStoryboard.length - 1) {
                                setVideoModalStepIndex((prev) => prev + 1);
                              } else {
                                setVideoModalStepIndex(0);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>{videoModalStepIndex === activeVideoModal.videoStoryboard.length - 1 ? 'Replay' : 'Next Scene'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Screen Simulation */}
                    <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center">
                      <div className="w-full max-w-[240px] bg-slate-900 rounded-[24px] border-[4px] border-slate-800 p-3 shadow-xl space-y-2">
                        <div className="w-12 h-2.5 bg-black rounded-full mx-auto" />
                        <div className="bg-slate-950 rounded-lg p-2.5 text-xs space-y-2 border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] text-slate-400 border-b border-slate-800 pb-1">
                            <span className="font-mono uppercase">{currentScene.screenSimulation.type} SIMULATION</span>
                            <span className="text-rose-400 font-bold">UNVERIFIED</span>
                          </div>
                          <div className="text-slate-200 font-bold text-[11px] truncate">
                            {currentScene.screenSimulation.senderOrTitle}
                          </div>
                          <p className="text-slate-300 font-mono text-[10px] leading-relaxed bg-slate-900/90 p-2 rounded border border-slate-800">
                            {currentScene.screenSimulation.body}
                          </p>
                          <div className="p-1.5 bg-rose-950/80 border border-rose-800/80 rounded text-center text-[9px] font-bold text-rose-300">
                            {currentScene.screenSimulation.actionText}
                          </div>
                        </div>
                        <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Key Takeaways */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Essential Takeaways &amp; Golden Rules</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {activeVideoModal.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Watching this walkthrough establishes psychological immunity.
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done Watching
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
