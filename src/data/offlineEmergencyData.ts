export interface OfflineSosProcedure {
  id: string;
  stepNumber: number;
  title: string;
  urgentTimeframe: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  keyActions: string[];
  helplineOrCode?: string;
  helplineLabel?: string;
  actionType?: 'call' | 'ussd' | 'sms' | 'action';
}

export interface OfflineLegalGuideline {
  id: string;
  category: 'ZERO_FIR' | 'RBI_LIABILITY' | 'STATUTORY_SECTIONS' | 'VICTIM_RIGHTS' | 'EVIDENCE_ACT';
  title: string;
  lawReference: string;
  summary: string;
  keyRights: string[];
  practicalAdvice: string;
  courtOrAuthority: string;
}

export interface OfflineEmergencyDataset {
  version: string;
  cachedAt: string;
  helpline1930: {
    number: string;
    hours: string;
    description: string;
    goldenHourNote: string;
  };
  procedures: OfflineSosProcedure[];
  legalGuidelines: OfflineLegalGuideline[];
  bankEmergencyUSSD: {
    title: string;
    description: string;
    code: string;
    note: string;
  }[];
  offlineFirTemplate: string;
  section65BCertificateTemplate: string;
}

export const OFFLINE_EMERGENCY_DATA: OfflineEmergencyDataset = {
  version: '2026.1',
  cachedAt: new Date().toISOString(),
  helpline1930: {
    number: '1930',
    hours: '24 Hours x 7 Days',
    description: 'National Cyber Financial Fraud Reporting Helpline operated by Ministry of Home Affairs (I4C). Direct integration with all Indian banks, NPCI, and State Police cyber cells.',
    goldenHourNote: 'Within 2 hours of money debit, call 1930 immediately to place a lien-freeze on the recipient fraudulent bank accounts before cash withdrawal at ATMs.',
  },
  procedures: [
    {
      id: 'sos-step-1',
      stepNumber: 1,
      title: 'Call 1930 Citizen Cyber Financial Helpline',
      urgentTimeframe: 'First 0 - 2 Hours (Golden Window)',
      priority: 'CRITICAL',
      description: 'Dial 1930 to trigger instantaneous inter-bank lien stop. Keep your Bank Name, 12-digit UPI / IMPS Transaction Reference Number (UTR / RRN), and debit SMS ready.',
      keyActions: [
        'Dial 1930 from any mobile or landline',
        'State: "I am reporting an unauthorized financial debit in progress"',
        'Provide your bank account number, suspect UPI ID/account, and exact transaction amount',
        'Note down the 14-digit National Cyber Crime Portal (NCRP) Acknowledgement Number provided by the officer',
      ],
      helplineOrCode: '1930',
      helplineLabel: 'Dial 1930 Toll-Free',
      actionType: 'call',
    },
    {
      id: 'sos-step-2',
      stepNumber: 2,
      title: 'Emergency Freeze on Debit/Credit Cards & Net Banking',
      urgentTimeframe: 'First 15 Minutes',
      priority: 'CRITICAL',
      description: 'Block your card and internet banking credentials immediately to halt subsequent secondary automated sweeps or recurrent e-mandates.',
      keyActions: [
        'Dial your bank toll-free emergency hotline or use SMS card block format',
        'Send SMS "BLOCK <Last 4 digits of card>" to bank emergency SMS number',
        'Use USSD *99# from your registered mobile number if internet/data is disabled',
        'Request immediate temporary freeze on Net Banking User ID',
      ],
      helplineOrCode: '*99#',
      helplineLabel: 'Emergency USSD *99# (Works without Internet)',
      actionType: 'ussd',
    },
    {
      id: 'sos-step-3',
      stepNumber: 3,
      title: 'Block and Secure UPI Applications',
      urgentTimeframe: 'Within 30 Minutes',
      priority: 'HIGH',
      description: 'Deregister device or revoke UPI PIN on Google Pay, PhonePe, Paytm, or BHIM if malicious screen-sharing APK (AnyDesk, TeamViewer, RustDesk) was installed.',
      keyActions: [
        'Turn on Airplane mode or disable Wi-Fi/Mobile Data immediately if remote screen control is active',
        'Uninstall any unknown APKs (.apk files downloaded from WhatsApp/Telegram/Chrome)',
        'Change UPI PIN immediately from another clean device or after factory resetting the handset',
        'Contact UPI PSP payment aggregator customer service to flag the beneficiary VPA',
      ],
      helplineOrCode: '18001201740',
      helplineLabel: 'NPCI UPI Dispute Desk (1800-120-1740)',
      actionType: 'call',
    },
    {
      id: 'sos-step-4',
      stepNumber: 4,
      title: 'Preserve Forensic Digital Evidence',
      urgentTimeframe: 'Same Day',
      priority: 'HIGH',
      description: 'Preserve electronic records before scammers delete chat histories, revoke fake websites, or delete suspicious call logs.',
      keyActions: [
        'Take full screen captures including battery icon, clock, and full URL bar',
        'Export WhatsApp/Telegram chat history with media attached',
        'Save bank debit SMS and download unedited PDF bank account statement from internet banking or branch',
        'Record the incoming scammer mobile numbers, fake courier tracking numbers, or fake arrest warrants',
      ],
    },
    {
      id: 'sos-step-5',
      stepNumber: 5,
      title: 'Lodge Official Cyber FIR Complaint',
      urgentTimeframe: 'Within 24 Hours',
      priority: 'HIGH',
      description: 'File a formal complaint on cybercrime.gov.in and obtain a stamped police acknowledgement at the nearest Cyber Crime Police Station or Local Police Station (Zero FIR).',
      keyActions: [
        'Convert 1930 call acknowledgement into a registered formal complaint',
        'Attach bank statement with disputed transactions highlighted',
        'Submit written complaint mentioning Section 66D IT Act and Section 318(4) BNS',
        'Collect signed and stamped copy of FIR / GD entry for bank submission under RBI guidelines',
      ],
      helplineOrCode: '112',
      helplineLabel: 'Dial 112 (National Emergency Support)',
      actionType: 'call',
    },
  ],
  bankEmergencyUSSD: [
    {
      title: 'NUUP National USSD Code (Offline Banking)',
      description: 'Works on any GSM phone without internet or mobile data.',
      code: '*99#',
      note: 'Dial *99# from your registered SIM -> Option to block UPI services, check balance, or disable profile.',
    },
    {
      title: 'State Bank of India (SBI)',
      description: 'Emergency Card Block via SMS',
      code: 'SMS: BLOCK <Last 4 digits> to 567676',
      note: 'Toll-free 24/7 hotline: 1800 1234 / 1800 2100',
    },
    {
      title: 'HDFC Bank',
      description: 'Emergency Card & NetBanking Block',
      code: 'SMS: BLOCK <Last 4 digits> to 5676712',
      note: 'Toll-free 24/7 hotline: 1800 1600 / 1800 266 4060',
    },
    {
      title: 'ICICI Bank',
      description: 'Emergency Card Block via SMS',
      code: 'SMS: IBLOCK <Last 4 digits> to 9215676766',
      note: 'Toll-free 24/7 hotline: 1800 1080',
    },
    {
      title: 'Punjab National Bank (PNB)',
      description: 'Emergency Hotlisting via SMS',
      code: 'SMS: HOT <16 digit Card No> to 5607040',
      note: 'Toll-free 24/7 hotline: 1800 180 2222',
    },
    {
      title: 'Bank of Baroda (BOB)',
      description: 'Emergency Card Block via SMS',
      code: 'SMS: BLOCK <Last 4 digits> to 8422009988',
      note: 'Toll-free 24/7 hotline: 1800 258 4455',
    },
    {
      title: 'Axis Bank',
      description: 'Emergency Card Block via SMS',
      code: 'SMS: BLOCK <Last 4 digits> to 5676782',
      note: 'Toll-free 24/7 hotline: 1860 419 5555 / 1860 500 5555',
    },
  ],
  legalGuidelines: [
    {
      id: 'legal-zero-fir',
      category: 'ZERO_FIR',
      title: 'Right to File a Zero FIR (Section 173 BNSS 2023 / Section 154 CrPC)',
      lawReference: 'Section 173(1) Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 & Supreme Court Lalita Kumari vs Govt of UP',
      summary: 'A victim of cyber fraud can approach ANY police station in India to register an FIR, irrespective of where the offense occurred or where the scammer resides. The police officer cannot refuse registration on grounds of jurisdiction.',
      keyRights: [
        'Mandatory Registration: Any station must register a "Zero-FIR" and subsequently transfer the investigation to the jurisdictional cyber crime station.',
        'Right to Free Copy: You are legally entitled to receive a free certified copy of the registered FIR immediately (Section 173(2) BNSS).',
        'Electronic Information: Information regarding cognizable cyber fraud may be sent electronically (e-FIR), which must be signed within three days.',
        'No Harassment Guarantee: Cyber fraud victims cannot be blamed or threatened with charges for being manipulated by criminal syndicates.',
      ],
      practicalAdvice: 'If an officer hesitates, cite Section 173 BNSS and inform them that Ministry of Home Affairs guidelines mandate immediate Zero FIR registration for cyber financial crimes.',
      courtOrAuthority: 'Supreme Court of India & Ministry of Home Affairs (MHA) Directive No. 24013/09/2019-CSR',
    },
    {
      id: 'legal-rbi-zero-liability',
      category: 'RBI_LIABILITY',
      title: 'RBI Customer Protection: Zero & Limited Liability for Unauthorized Electronic Banking',
      lawReference: 'Reserve Bank of India Circular DBR.No.Leg.BC.78/09.07.005/2017-18',
      summary: 'The RBI circular establishes clear statutory rules safeguarding customers against unauthorized electronic transactions through credit card, debit card, UPI, or net banking.',
      keyRights: [
        'Zero Liability (Within 3 Days): If reported within 3 working days of receiving bank notification, victim has ZERO liability where fraud is due to third-party breach/fraud where customer did not willingly share OTP.',
        'Limited Liability (4 to 7 Days): If reported between 4 to 7 working days, victim liability is capped at ₹5,000 (Basic savings), ₹10,000 (Savings/Overdraft), or ₹25,000 (Current/Credit card limit > ₹5 Lakh).',
        'Shadow Credit within 10 Days: The bank must credit the disputed amount back to the customer account within 10 working days from the date of reporting.',
        'Burden of Proof: The legal burden of proving customer negligence or OTP compromise rests entirely on the bank, NOT the customer.',
      ],
      practicalAdvice: 'Submit a formal written dispute letter to your bank branch within 72 hours, attaching the 1930 acknowledgement number and police complaint copy.',
      courtOrAuthority: 'Reserve Bank of India (RBI) Banking Ombudsman Regulations',
    },
    {
      id: 'legal-it-act-66d',
      category: 'STATUTORY_SECTIONS',
      title: 'Punishment for Cheating by Personation using Computer Resource',
      lawReference: 'Section 66D, Information Technology Act, 2000 (as amended)',
      summary: 'Applies to scams where fraudsters pose as police officers ("Digital Arrest"), customs agents, bank managers, electricity officials, or courier executives using phone calls, video calls, or spoofed portals.',
      keyRights: [
        'Cognizable & Non-Bailable Offense under cyber law jurisdiction.',
        'Punishment: Imprisonment of either description for a term which may extend to three (3) years, AND fine which may extend to one lakh rupees (₹1,00,000).',
        'Covers voice spoofing, synthetic audio, fake video calls, and forged official insignia.',
      ],
      practicalAdvice: 'Ensure the police officer explicitly mentions Section 66D IT Act in the FIR draft alongside Indian penal laws.',
      courtOrAuthority: 'Indian Judiciary / Designated Cyber Courts',
    },
    {
      id: 'legal-bns-318',
      category: 'STATUTORY_SECTIONS',
      title: 'Cheating and Dishonestly Inducing Delivery of Property (BNS 318(4) / IPC 420)',
      lawReference: 'Section 318(4) Bharatiya Nyaya Sanhita (BNS), 2023 (formerly Section 420 IPC)',
      summary: 'The principal criminal offense for defrauding individuals through false investment promises, fake lottery prizes, fraudulent QR codes, and malicious payment links.',
      keyRights: [
        'Cognizable Offense: Police must register an FIR and arrest suspects without requiring prior warrant from a magistrate.',
        'Punishment: Imprisonment of either description for a term which may extend to seven (7) years, and shall also be liable to fine.',
        'Section 319 BNS additionally punishes cheating by personation with up to five (5) years imprisonment.',
      ],
      practicalAdvice: 'State clearly in your FIR that the suspect induced you to part with money by making fraudulent representations that they knew to be false.',
      courtOrAuthority: 'Judicial Magistrate First Class (JMFC) / Sessions Court',
    },
    {
      id: 'legal-evidence-65b',
      category: 'EVIDENCE_ACT',
      title: 'Admissibility of Electronic Digital Evidence (Section 63 BNSS / Section 65B Evidence Act)',
      lawReference: 'Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA) / Section 65B Indian Evidence Act, 1872',
      summary: 'Digital printouts (screenshots, WhatsApp chat PDFs, bank statements) must be accompanied by a standard certificate to be admitted as substantive evidence in court.',
      keyRights: [
        'You have the legal right to submit certified electronic evidence created from your personal smartphone or computer.',
        'A simple self-declaration certificate verifying that the printout was produced by a computer/device used regularly by you satisfies Section 63 BSA.',
        'Original devices do not need to be permanently seized if certified electronic duplicates with hashing/metadata are provided.',
      ],
      practicalAdvice: 'Print out screenshots on paper and sign a one-page Section 63 BSA certificate (template provided in this offline tool) before handing them to the police.',
      courtOrAuthority: 'Supreme Court ruling in Arjun Panditrao Khotkar vs Kailash Kushanrao Gorantyal (2020)',
    },
    {
      id: 'legal-victim-rights',
      category: 'VICTIM_RIGHTS',
      title: 'Victim Compensation and Account De-Freezing Rights',
      lawReference: 'Section 396 BNSS, 2023 (Victim Compensation Scheme) & High Court Judgments on Lien Defreeze',
      summary: 'Legal avenues for victims to recover frozen funds from scammer accounts or seek state victim compensation.',
      keyRights: [
        'Lien Defreeze Procedure: When police freeze fraudulent accounts via 1930/NCRP, you can apply to the Magistrate under Section 503 BNSS (former Section 457 CrPC) for release of seized funds to your account.',
        'Victim Support: If funds cannot be recovered from absconding syndicates, state cyber victim relief schemes offer compensation through the District Legal Services Authority (DLSA).',
        'Right to Case Progress Updates: Section 193(3)(ii) BNSS obligates the investigating officer to inform the victim of the progress of investigation within 90 days.',
      ],
      practicalAdvice: 'Keep your NCRP acknowledgement number and copy of the freeze notice to file an application before the local magistrate court for refund of frozen funds.',
      courtOrAuthority: 'District Legal Services Authority (DLSA) & Chief Judicial Magistrate (CJM)',
    },
  ],
  offlineFirTemplate: `To,
The Station House Officer / Cyber Crime Police Station,
[POLICE_STATION_NAME],
[CITY_DISTRICT]

Subject: Formal Complaint under Section 66D Information Technology Act, 2000 and Section 318(4) Bharatiya Nyaya Sanhita (BNS), 2023 for Cyber Financial Fraud / Online Cheating.

Respected Sir / Madam,

I, [COMPLAINANT_NAME], Age: [AGE] years, residing at [ADDRESS], Mobile: [PHONE], Email: [EMAIL], submit this formal complaint regarding an online cyber fraud incident:

1. INCIDENT TIMELINE & PARTICULARS:
   - Date & Time of Incident: [INCIDENT_DATETIME]
   - Total Amount Defrauded: INR [AMOUNT_LOST] /-
   - Complainant Debited Bank: [DEBITED_BANK], Account/Card No: [DEBITED_ACCOUNT]
   - Transaction Reference Number (UTR / RRN / UPI Ref): [TRANSACTION_REF]
   - National Cyber Crime Helpline (1930) Acknowledgement No: [HELPLINE_ACK_NO]

2. SUSPECT DETAILS:
   - Suspect Phone / WhatsApp Number: [SUSPECT_PHONE]
   - Suspect UPI ID / Beneficiary Bank Account: [SUSPECT_ACCOUNT]
   - Fraudulent Website URL / Social Platform: [SUSPECT_PLATFORM]

3. MODUS OPERANDI / BRIEF FACTS:
   [INCIDENT_DESCRIPTION]

4. STATUTORY PROVISIONS APPLICABLE:
   - Section 66D, Information Technology Act, 2000 (Cheating by personation using computer resource)
   - Section 66C, Information Technology Act, 2000 (Identity theft)
   - Section 318(4) / 319, Bharatiya Nyaya Sanhita (BNS), 2023 (Cheating and dishonestly inducing delivery of property)
   - Section 173, Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (Mandatory registration of Zero FIR)

5. PRAYER:
   I pray that an FIR be registered immediately and communication be issued to the nodal officers of the beneficiary banks and payment gateways to freeze the tainted funds and trace the accused syndicates.

Yours faithfully,

________________________
(Signature of Complainant)
Name: [COMPLAINANT_NAME]
Date: [CURRENT_DATE]
Place: [CITY_DISTRICT]

ENCLOSURES ATTACHED:
1. Bank Account Statement with disputed debits highlighted
2. Printout of SMS alerts & UPI payment confirmation receipts
3. Screenshots of chat transcripts and suspicious phone numbers
4. Certificate under Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA)
5. Copy of Government Photo ID Proof (Aadhaar / PAN / Voter ID)
`,
  section65BCertificateTemplate: `CERTIFICATE UNDER SECTION 63 OF THE BHARATIYA SAKSHYA ADHINIYAM, 2023
(Corresponding to Section 65B of the Indian Evidence Act, 1872)

I, [COMPLAINANT_NAME], residing at [ADDRESS], do hereby state and certify on solemn affirmation as follows:

1. I am producing computer outputs / printouts comprising:
   (a) Bank statements and transaction receipts,
   (b) Mobile phone screenshots of WhatsApp/SMS messages,
   (c) Call logs and suspect profile information.

2. The computer output / printouts were produced by a device (Smartphone / Computer) that was under my regular and lawful control during the period over which the information was processed.

3. The device was operating properly during the said period, and the printout faithfully reproduces the electronic record without any alteration or manipulation.

4. To the best of my knowledge and belief, the electronic records submitted with this complaint are true and genuine copies.

Date: [CURRENT_DATE]
Place: [CITY_DISTRICT]

________________________
Signature of Deponent
Name: [COMPLAINANT_NAME]
`,
};
