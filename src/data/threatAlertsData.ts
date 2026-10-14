export interface ThreatAlert {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Advisory';
  agency: string;
  date: string;
  description: string;
  impactArea: string;
  recommendedAction: string;
  advisoryCode: string;
}

export const INITIAL_THREAT_ALERTS: ThreatAlert[] = [
  {
    id: 'alert-2025-01',
    title: 'Surge in Fake Supreme Court & CBI "Digital Arrest" Video Extortions',
    severity: 'Critical',
    agency: 'Indian Cyber Crime Coordination Centre (I4C) & MHA',
    date: 'March 2025',
    description: 'Coordinated syndicates are conducting Skype video calls with fake courtrooms and police station backdrops, intimidating citizens with forged arrest warrants over fictitious courier parcels.',
    impactArea: 'Pan-India / Senior Citizens & Professionals',
    recommendedAction: 'Disconnect immediately. No Indian police force conducts arrests or interrogations via Skype/WhatsApp. Report directly to 1930.',
    advisoryCode: 'I4C/ADV/2025/DA-09'
  },
  {
    id: 'alert-2025-02',
    title: 'Malicious "ITR Tax Refund" APK Circulating on WhatsApp',
    severity: 'Critical',
    agency: 'CERT-In & Income Tax Dept',
    date: 'February 2025',
    description: 'Fraudulent SMS stating "Your Tax Refund of ₹18,490 has been approved. Update bank details via refund-incometax.apk" drops an SMS-stealer Trojan intercepting banking OTPs.',
    impactArea: 'Android Smartphone Users',
    recommendedAction: 'Do not download any APK files from links or chat apps. Income Tax department never distributes APKs for refunds; refunds are credited directly to pre-validated bank accounts via incometax.gov.in.',
    advisoryCode: 'CERT-IN/ADV/2025/APK-04'
  },
  {
    id: 'alert-2025-03',
    title: 'TRAI Mobile Number Disconnection / Tower Lease Deception',
    severity: 'High',
    agency: 'Department of Telecommunications (DoT)',
    date: 'March 2025',
    description: 'IVR robocalls claiming "Your mobile number will be disconnected in 2 hours by TRAI due to illicit activities, press 9 to connect with verification officer".',
    impactArea: 'Mobile Subscribers (Airtel, Jio, Vi, BSNL)',
    recommendedAction: 'Report suspicious calls immediately on the Chakshu facility at Sanchar Saathi (sancharsaathi.gov.in). TRAI never blocks personal mobile numbers via IVR calls.',
    advisoryCode: 'DOT/CHAKSHU/2025/TEL-11'
  },
  {
    id: 'alert-2025-04',
    title: 'Deceptive "Prepaid Merchant Task" on Telegram with Fake Escrow',
    severity: 'High',
    agency: 'Delhi Police Cyber Cell & RBI',
    date: 'January 2025',
    description: 'Victims invited to like social media videos and gradually coerced into investing in fake cryptocurrency merchant orders with promises of 40% immediate profit.',
    impactArea: 'Work-from-home seekers & Students',
    recommendedAction: 'Never transfer funds for performing remote jobs. Disconnect and lodge a financial complaint on cybercrime.gov.in before deleting logs.',
    advisoryCode: 'DPCC/TASK/2025/104'
  },
  {
    id: 'alert-2025-05',
    title: 'AI Voice Cloning of Children / Hostage Distress Hoax',
    severity: 'High',
    agency: 'Global Interpol & National Cyber Coordination',
    date: 'March 2025',
    description: 'Attackers synthesize family member voices from social media clips and contact parents claiming an emergency accident or police detainment, demanding instant UPI transfer.',
    impactArea: 'Parents of college students and frequent travelers',
    recommendedAction: 'Always establish an offline secret family safe word. Verify independently with other family members before sending any funds.',
    advisoryCode: 'I4C/AI-VOICE/2025/03'
  }
];
