import React, { useState } from 'react';
import { 
  FileText, 
  Scale, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Download, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  BookOpen,
  MapPin,
  Search,
  Loader2,
  PhoneCall,
  HardDrive,
  WifiOff
} from 'lucide-react';
import { EvidenceRecord } from './EvidenceLockerModal';

interface LegalFIRGuideProps {
  initialEvidence?: EvidenceRecord | null;
  onOpenSos: () => void;
  onOpenOfflineHub?: () => void;
}

export const LegalFIRGuide: React.FC<LegalFIRGuideProps> = ({ initialEvidence, onOpenSos, onOpenOfflineHub }) => {
  const [activeTab, setActiveTab] = useState<'procedure' | 'generator' | 'stations' | 'sections'>('procedure');

  // Google Maps Grounding State for Police Stations
  const [stationCity, setStationCity] = useState('Bengaluru');
  const [isSearchingStations, setIsSearchingStations] = useState(false);
  const [stationsResult, setStationsResult] = useState<{
    text: string;
    places: { title: string; uri: string }[];
    searchedCity: string;
  } | null>(null);

  // FIR Generator Form State
  const [formData, setFormData] = useState({
    policeStationName: 'Cyber Crime Police Station / Local Police Station',
    cityDistrict: 'Bangalore / Mumbai / Delhi / Your City',
    complainantName: '',
    guardianName: '',
    age: '',
    address: '',
    complainantPhone: '',
    complainantEmail: '',
    incidentDate: initialEvidence?.incidentDateTime || new Date().toISOString().slice(0, 10),
    amountLost: initialEvidence?.amountLost || '',
    debitedBank: initialEvidence?.debitedBank || '',
    debitedAccountNo: initialEvidence?.debitedAccountNumber || '',
    transactionRef: initialEvidence?.transactionRefId || '',
    suspectPhone: initialEvidence?.suspectPhone || '',
    suspectUpiOrBank: initialEvidence?.suspectUpiOrAccount || '',
    suspectPlatform: initialEvidence?.suspectPlatform || 'WhatsApp / Telegram',
    incidentDescription: initialEvidence?.incidentDescription || ''
  });

  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const fetchNearbyStations = async (cityToSearch?: string) => {
    setIsSearchingStations(true);
    const target = cityToSearch || stationCity || 'Bengaluru';
    try {
      const res = await fetch('/api/legal/police-stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: target }),
      });
      const data = await res.json();
      if (data.success) {
        setStationsResult({
          text: data.text,
          places: data.places || [],
          searchedCity: target,
        });
      }
    } catch (err) {
      console.error('Failed to locate police stations:', err);
      setStationsResult({
        text: `Offline Statutory Advisory for ${target}:\nYou appear to be offline or network is disconnected. Under Section 173 BNSS (Zero FIR mandate), you do NOT need to travel to a designated cyber headquarters. Any local Police Station or Outpost within your walking distance is legally obligated to accept your complaint and transfer it to the specialized Cyber Cell. Helpline 1930 and 112 are operational 24/7 without internet.`,
        places: [
          { title: `${target} Cyber Crime Police Station / Local Station`, uri: '#' },
          { title: 'Nearest Territorial Police Station (Zero FIR Mandatory)', uri: '#' }
        ],
        searchedCity: target,
      });
    } finally {
      setIsSearchingStations(false);
    }
  };

  // Sync if initialEvidence changes
  React.useEffect(() => {
    if (initialEvidence) {
      setFormData((prev) => ({
        ...prev,
        incidentDate: initialEvidence.incidentDateTime.slice(0, 10),
        amountLost: initialEvidence.amountLost,
        debitedBank: initialEvidence.debitedBank,
        debitedAccountNo: initialEvidence.debitedAccountNumber,
        transactionRef: initialEvidence.transactionRefId,
        suspectPhone: initialEvidence.suspectPhone,
        suspectUpiOrBank: initialEvidence.suspectUpiOrAccount,
        suspectPlatform: initialEvidence.suspectPlatform,
        incidentDescription: initialEvidence.incidentDescription
      }));
      setActiveTab('generator');
    }
  }, [initialEvidence]);

  const generateComplaintLetter = () => {
    return `To,
The Station House Officer (SHO),
${formData.policeStationName},
${formData.cityDistrict}.

Subject: Formal Written Complaint Regarding Online Cyber Financial Fraud of ₹${formData.amountLost || '_______'} under Section 66D of Information Technology Act 2000 and Section 318(4) of Bharatiya Nyaya Sanhita (BNS) 2023.

Respected Sir/Madam,

I, ${formData.complainantName || '[Your Full Name]'}, aged about ${formData.age || '__'} years, Son/Daughter/Spouse of ${formData.guardianName || '[Father/Spouse Name]'}, residing at ${formData.address || '[Your Complete Residential Address]'}, contact number ${formData.complainantPhone || '[Your Mobile]'} and email ${formData.complainantEmail || '[Your Email]'}, do hereby lodge this formal criminal complaint regarding an organized cyber fraud committed against me.

1. PARTICULARS OF THE FRAUDULENT INCIDENT:
On or around ${formData.incidentDate}, I was contacted via ${formData.suspectPlatform} by an unknown cyber criminal using contact number ${formData.suspectPhone || 'Unknown'}.
Narrative of the incident:
${formData.incidentDescription || 'The perpetrator deceived me through misrepresentation and fraudulent pretenses, inducing me into making electronic transfers from my bank account under false assurances.'}

2. FINANCIAL AND TRANSACTION DETAILS:
- Total Financial Loss: ₹${formData.amountLost || '0'}
- Complainant Bank Name: ${formData.debitedBank || 'My Bank'}
- Complainant Account / Card: ${formData.debitedAccountNo || 'XXXX'}
- 12-Digit Transaction Reference / UTR Number: ${formData.transactionRef || 'N/A'}
- Suspect Beneficiary Account / UPI ID: ${formData.suspectUpiOrBank || 'N/A'}

3. APPLICABLE PROVISIONS OF LAW:
The accused individuals have committed deliberate and cognizable offences punishable under:
a) Section 66C of Information Technology Act, 2000 (Identity Theft).
b) Section 66D of Information Technology Act, 2000 (Cheating by personation using computer resource).
c) Section 318(4) of Bharatiya Nyaya Sanhita (BNS) 2023 (Cheating and dishonestly inducing delivery of property) [Equivalent to erstwhile Section 420 IPC].
d) Section 319 of Bharatiya Nyaya Sanhita (BNS) 2023 (Cheating by personation).
e) Section 61(2) of Bharatiya Nyaya Sanhita (BNS) 2023 (Criminal Conspiracy).

4. ENCLOSURES & ATTACHMENTS SUBMITTED:
1. Certified Bank Statement highlighting the debited fraudulent transaction with UTR number.
2. In-app payment receipts and transaction screenshots.
3. Chat logs, call detail logs, and SMS messages exchanged with the perpetrator.
4. Copy of Complainant's Government Identity Card (Aadhaar / Voter ID).
5. Acknowledgment receipt of complaint filed on National Cyber Crime Reporting Portal (cybercrime.gov.in / 1930).

5. PRAYER / RELIEF SOUGHT:
It is therefore most respectfully prayed that you kindly:
a) Register an official First Information Report (FIR) or Zero-FIR in the above matter.
b) Issue an immediate notice under Section 91 CrPC / Section 94 BNSS to the beneficiary bank and payment aggregator to freeze/lien-mark the recipient account.
c) Investigate the subscriber details of phone number ${formData.suspectPhone || 'used in the offence'} with the Telecom Service Provider.
d) Take strict lawful action to recover my hard-earned money and apprehend the culprits.

Yours faithfully,

Date: ${new Date().toLocaleDateString('en-IN')}
Place: ${formData.cityDistrict}

____________________________
Signature of Complainant
(${formData.complainantName || 'Complainant'})`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateComplaintLetter());
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Police Cyber Crime Complaint - ${formData.complainantName || 'Formal Draft'}</title>
          <style>
            body { font-family: serif; font-size: 14px; line-height: 1.6; padding: 40px; color: #111; max-width: 800px; margin: auto; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
          </style>
        </head>
        <body>
          <pre>${generateComplaintLetter()}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([generateComplaintLetter()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Cyber_Police_Complaint_${formData.complainantName ? formData.complainantName.replace(/\s+/g, '_') : 'Draft'}.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
            <Scale className="w-4 h-4" />
            <span>Statutory Citizen Rights & Legal Procedures</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Guide for Legal Procedures & Police FIR Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Understand your legal rights under Indian Law (Bharatiya Nyaya Sanhita & IT Act 2000), learn about mandatory Zero-FIR rules, and instantly compile a formal police complaint draft ready to file.
          </p>

          {/* Offline Caching Guaranteed Notice */}
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-medium">
              <HardDrive className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>Offline Cache Active: All legal sections, BNSS Zero-FIR procedures, and FIR drafting work 100% offline.</span>
            </div>
            {onOpenOfflineHub && (
              <button
                onClick={onOpenOfflineHub}
                className="px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shrink-0 flex items-center gap-1.5"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>Open Offline Hub</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('procedure')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'procedure'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            How to File a Complaint (Step-by-Step)
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Formal Police Complaint Draft Generator
          </button>
          <button
            onClick={() => {
              setActiveTab('stations');
              if (!stationsResult) fetchNearbyStations();
            }}
            className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stations'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            Nearby Police Stations & Nodal Contacts
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Legal Sections (IT Act & BNS)
          </button>
        </div>
      </section>

      {/* Tab 1: Step-by-Step Legal Procedure */}
      {activeTab === 'procedure' && (
        <div className="space-y-6">
          {/* Zero-FIR Golden Right Card */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl shadow-sm border border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-blue-300" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300 tracking-wider">
                  <span>MANDATORY STATUTORY CITIZEN RIGHT</span>
                </div>
                <h2 className="text-xl font-bold text-white">The Zero-FIR Guarantee Explained</h2>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Under the directives of the Supreme Court of India and Section 173 BNSS, <strong>any police station in India is legally obligated to register a "Zero-FIR"</strong> for a cognizable cyber crime, even if the incident occurred outside their geographic jurisdiction. The police officer CANNOT turn you away stating "this is not our police station limit". They must accept your written complaint, assign a Zero FIR number, and transfer it internally to the concerned cyber cell.
                </p>
              </div>
            </div>
          </div>

          {/* Procedure Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Step 1: Immediate Portal / 1930 Acknowledgment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dial 1930 or submit an online report on <strong>cybercrime.gov.in</strong>. You will receive an SMS with an official <strong>14-digit Complaint Acknowledgment Number</strong>. This is statutory proof of immediate reporting under RBI customer protection guidelines.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Step 2: Collect Certified Evidence Documents</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visit your home bank branch and request a <strong>stamped / signed bank account statement</strong> highlighting the fraudulent debits. Note the 12-digit UTR numbers and preserve unedited WhatsApp chat exports.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Step 3: Submit Written Complaint to Cyber Cell</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use our built-in FIR Generator below to compile a formal written complaint letter. Submit 2 printed copies to the Station House Officer (SHO). Take an acknowledged receiving stamp on the second copy for your records.
              </p>
            </div>
          </div>

          {/* RBI Customer Protection Guidelines */}
          <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>RBI Circular: Limited Liability of Customers in Unauthorized Electronic Banking</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Reserve Bank of India Circular (DBR.No.Leg.BC.78/09.07.005/2017-18) establishes clear rules:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-emerald-800 block mb-1">Zero Customer Liability (100% Refundable)</span>
                <p className="text-slate-600">
                  Applies when fraud occurs due to contributory negligence/deficiency on the part of the bank, or third-party breaches where the customer notifies the bank <strong>within 3 working days</strong> of receiving the transaction alert.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-amber-800 block mb-1">Limited Customer Liability (Capped)</span>
                <p className="text-slate-600">
                  If reported between 4 to 7 working days, customer liability is capped (e.g. ₹10,000 max for savings accounts). Banks must resolve and credit compensation within 90 days of notification.
                </p>
              </div>
            </div>
          </div>

          {/* Mandatory Documentation Checklist */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Mandatory Documentation Checklist for Filing a Formal Police Complaint</span>
            </div>
            <p className="text-xs text-slate-600">
              Bring the following items (2 sets of self-attested photocopies) when visiting the Cyber Police Station or filing with the Station House Officer (SHO):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">1. Certified Bank Statement</span>
                <p className="text-slate-600">Official statement from bank with bank stamp and signature, with all fraudulent debit lines clearly highlighted with marker.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">2. 12-Digit Transaction Reference (UTR / IMPS)</span>
                <p className="text-slate-600">Printed transaction slip or in-app receipt showing sender account, recipient account/UPI ID, timestamp, and UTR number.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">3. Communications & Chat Export Screenshots</span>
                <p className="text-slate-600">Complete, uncropped screenshots of WhatsApp/Telegram conversations, caller ID displays, and suspect website URLs.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">4. National Portal (1930) Acknowledgment</span>
                <p className="text-slate-600">Printout of the 14-digit acknowledgment receipt received via SMS/email upon filing on cybercrime.gov.in.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">5. Government Identity Proof</span>
                <p className="text-slate-600">Clear photocopy of Aadhaar Card, PAN Card, Voter ID, or Passport of the complainant with signature.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">6. Formal Written Complaint Letter</span>
                <p className="text-slate-600">Two printed, signed copies of the formal FIR draft generated from our Complaint Draft Generator.</p>
              </div>
            </div>
          </div>

          {/* Points of Contact & Escalation Hierarchy */}
          <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Scale className="w-5 h-5 text-indigo-600" />
              <span>Official Points of Contact & Escalation Ladder</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wide">Level 1: First Response</span>
                <h4 className="font-bold text-slate-900 text-sm">Station House Officer (SHO)</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">Local police station or City Cyber Crime Police Station (CCPS). Mandated under Section 173 BNSS to accept Zero-FIR.</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wide">Level 2: Police Escalation</span>
                <h4 className="font-bold text-slate-900 text-sm">Superintendent / DCP Crime</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">If local SHO refuses to register FIR, send written complaint by registered post under Section 173(4) BNSS (erstwhile 154(3) CrPC).</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wide">Level 3: Judicial Directive</span>
                <h4 className="font-bold text-slate-900 text-sm">Judicial Magistrate (Court)</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">Under Section 175(3) BNSS / 156(3) CrPC, petition the Judicial Magistrate to order the police to register FIR and investigate.</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wide">Level 4: Financial Redress</span>
                <h4 className="font-bold text-slate-900 text-sm">RBI Banking Ombudsman</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">If bank fails to resolve unauthorized electronic debits within 30 days, file on cms.rbi.org.in for reversal compensation.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Formal Complaint Generator */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enter Details to Generate Formal Police Complaint</h2>
              <p className="text-xs text-slate-500">
                All legal sections, statutory references, and formatted prayers are automatically arranged below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Police Station / Cyber Cell</label>
                <input
                  type="text"
                  value={formData.policeStationName}
                  onChange={(e) => setFormData({ ...formData, policeStationName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">City / District</label>
                <input
                  type="text"
                  value={formData.cityDistrict}
                  onChange={(e) => setFormData({ ...formData, cityDistrict: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Incident Date</label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Full Name (Complainant) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.complainantName}
                  onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Father / Spouse Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 34"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.complainantPhone}
                  onChange={(e) => setFormData({ ...formData, complainantPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Complete Residential Address</label>
                <input
                  type="text"
                  placeholder="House No, Street, Locality, Pincode"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Email</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={formData.complainantEmail}
                  onChange={(e) => setFormData({ ...formData, complainantEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount Lost (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.amountLost}
                  onChange={(e) => setFormData({ ...formData, amountLost: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Bank & A/C (Last 4 digits)</label>
                <input
                  type="text"
                  placeholder="SBI A/C ending in 4102"
                  value={formData.debitedBank}
                  onChange={(e) => setFormData({ ...formData, debitedBank: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">12-Digit Transaction UTR / Ref</label>
                <input
                  type="text"
                  placeholder="e.g. 409182390123"
                  value={formData.transactionRef}
                  onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Suspect Phone / Contact</label>
                <input
                  type="text"
                  placeholder="e.g. +91 91234 56789"
                  value={formData.suspectPhone}
                  onChange={(e) => setFormData({ ...formData, suspectPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Suspect Beneficiary UPI / Account</label>
                <input
                  type="text"
                  placeholder="e.g. scammer.desk@ybl or A/C 990182"
                  value={formData.suspectUpiOrBank}
                  onChange={(e) => setFormData({ ...formData, suspectUpiOrBank: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-700 block mb-1">Brief Description of the Incident *</label>
              <textarea
                rows={3}
                placeholder="Describe how the scammer contacted you, what deceit was used, and what happened..."
                value={formData.incidentDescription}
                onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Generated Letter Preview */}
          <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">Formal Police Complaint Letter Draft</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSuccess ? 'Copied to Clipboard' : 'Copy Draft'}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .TXT
                </button>
              </div>
            </div>

            <pre className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {generateComplaintLetter()}
            </pre>
          </div>
        </div>
      )}

      {/* Tab: Nearby Police Stations & Nodal Points (Google Maps Grounded) */}
      {activeTab === 'stations' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm border border-indigo-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 text-rose-300 text-xs font-semibold mb-1">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Google Maps Grounded Cyber Police Station Locator</span>
                </div>
                <h2 className="text-lg font-bold text-white">Find Your Nearest Cyber Crime Police Station</h2>
                <p className="text-xs text-slate-300">
                  Search by city to locate dedicated Cyber Economic Offences & Narcotics (CEN) Police Stations, Cyber Cells, and points of contact with verified Google Maps navigation links.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchNearbyStations(stationCity)}
                  disabled={isSearchingStations}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-sm transition-all"
                >
                  {isSearchingStations ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Locating Stations...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Stations</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* City Selector & Search Input */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter your City e.g. Bengaluru, Delhi, Mumbai, Hyderabad, Chennai, Pune, Kolkata..."
                  value={stationCity}
                  onChange={(e) => setStationCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchNearbyStations(stationCity)}
                  className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Quick City Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                {['Bengaluru', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setStationCity(c);
                      fetchNearbyStations(c);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                      stationCity === c
                        ? 'bg-rose-600 text-white border-rose-500 font-bold'
                        : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Maps Grounding Output */}
            {stationsResult && (
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs text-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-rose-300">
                    Verified Police Stations & Points of Contact in {stationsResult.searchedCity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Google Maps Grounded</span>
                </div>

                <p className="leading-relaxed whitespace-pre-line text-slate-100">
                  {stationsResult.text}
                </p>

                {stationsResult.places.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[11px] text-slate-400 block font-semibold">
                      Click to Open Directly in Google Maps (Navigation & Hours):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stationsResult.places.map((place, idx) => (
                        <a
                          key={idx}
                          href={place.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-black/40 hover:bg-black/60 border border-white/15 rounded-lg text-xs text-rose-300 hover:text-rose-200 flex items-center justify-between gap-2 transition-colors group"
                        >
                          <span className="font-medium truncate">{place.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Legal Sections Directory */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Key Statutes Governing Cyber Crime in India</h2>
            <p className="text-xs text-slate-500">
              Indian courts and police register cyber crimes under dual provisions of the Information Technology Act 2000 and Bharatiya Nyaya Sanhita (BNS) 2023.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* IT Act 66D */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-indigo-700 block">IT Act 2000 — Section 66D</span>
              <h3 className="font-bold text-slate-900 text-sm">Cheating by Personation using Computer Resource</h3>
              <p className="text-slate-600 leading-relaxed">
                Applies when anyone by means of any communication device or computer resource cheats by personation (e.g. fake police officer, fake bank manager, fake buyer).
                <br />
                <strong>Punishment: </strong> Imprisonment up to 3 years and fine up to ₹1,00,000. Cognizable offence.
              </p>
            </div>

            {/* BNS 318(4) / IPC 420 */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-indigo-700 block">BNS 2023 — Section 318(4) [Erstwhile IPC 420]</span>
              <h3 className="font-bold text-slate-900 text-sm">Cheating and Dishonestly Inducing Delivery of Property</h3>
              <p className="text-slate-600 leading-relaxed">
                Primary criminal charge for financial cyber frauds where victims are deceived into transferring money.
                <br />
                <strong>Punishment: </strong> Rigorous imprisonment up to 7 years and fine. Non-bailable and cognizable.
              </p>
            </div>

            {/* BNS 308 / IPC 384 */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-indigo-700 block">BNS 2023 — Section 308 [Erstwhile IPC 384]</span>
              <h3 className="font-bold text-slate-900 text-sm">Extortion & Coercion</h3>
              <p className="text-slate-600 leading-relaxed">
                Applies in Sextortion, Digital Arrest threats, and illegal loan app harassment where scammers put the victim in fear of injury or defamation to extract money.
                <br />
                <strong>Punishment: </strong> Imprisonment up to 3 or 7 years and fine.
              </p>
            </div>

            {/* IT Act 66E & 67A */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-indigo-700 block">IT Act 2000 — Section 66E, 67, 67A</span>
              <h3 className="font-bold text-slate-900 text-sm">Privacy Violation & Obscene Content Transmission</h3>
              <p className="text-slate-600 leading-relaxed">
                Protects victims whose private images are captured or morphed. Forbids publishing sexually explicit material online.
                <br />
                <strong>Punishment: </strong> Imprisonment up to 5 years (first conviction) and up to ₹10,00,000 fine.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
