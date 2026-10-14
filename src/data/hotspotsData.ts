export interface ThreatHotspot {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  intensity: number; // 0 - 100
  reportCount: number;
  trendingVector: string;
  severity: 'Critical' | 'High' | 'Moderate';
  targetProfile: string;
  lastReported: string;
  syndicateModus: string;
  spikePercentage: number;
  categoryBreakdown: {
    digitalArrest: number;
    apkTrojan: number;
    electricityBill: number;
    telegramTask: number;
    upiPhishing: number;
  };
}

export const INITIAL_HOTSPOTS: ThreatHotspot[] = [
  {
    id: 'hs-delhi-ncr',
    name: 'Delhi-NCR (Delhi, Gurugram, Noida)',
    state: 'Delhi / Haryana / UP',
    lat: 28.61,
    lng: 77.20,
    intensity: 96,
    reportCount: 3842,
    trendingVector: 'Digital Arrest Video Extortions & Customs Parcels',
    severity: 'Critical',
    targetProfile: 'Senior Citizens, Doctors, Corporate Executives',
    lastReported: '3 mins ago',
    syndicateModus: 'Coordinated Skype calls posing as CBI/ED officers with fake arrest warrants over narcotics courier.',
    spikePercentage: 28,
    categoryBreakdown: {
      digitalArrest: 46,
      apkTrojan: 18,
      electricityBill: 12,
      telegramTask: 14,
      upiPhishing: 10,
    }
  },
  {
    id: 'hs-mewat-bharatpur',
    name: 'Mewat - Bharatpur Cluster',
    state: 'Rajasthan / Haryana border',
    lat: 27.50,
    lng: 77.10,
    intensity: 93,
    reportCount: 3210,
    trendingVector: 'Sextortion & Fake Vehicle Marketplace Ads',
    severity: 'Critical',
    targetProfile: 'Youth, Defense Personnel, OLX Sellers',
    lastReported: '7 mins ago',
    syndicateModus: 'WhatsApp video call screen recording extortion and advance token deposits for phantom used cars.',
    spikePercentage: 19,
    categoryBreakdown: {
      digitalArrest: 12,
      apkTrojan: 15,
      electricityBill: 8,
      telegramTask: 22,
      upiPhishing: 43,
    }
  },
  {
    id: 'hs-jamtara-deoghar',
    name: 'Jamtara - Deoghar Belt',
    state: 'Jharkhand',
    lat: 23.95,
    lng: 86.80,
    intensity: 89,
    reportCount: 2740,
    trendingVector: 'Bank OTP Vishing & Electricity Bill APKs',
    severity: 'Critical',
    targetProfile: 'Retirees, Bank Customers, Rural Consumers',
    lastReported: '12 mins ago',
    syndicateModus: 'IVR spoofing claiming imminent power cut or debit card deactivation, tricking victims into sharing OTPs.',
    spikePercentage: 14,
    categoryBreakdown: {
      digitalArrest: 15,
      apkTrojan: 38,
      electricityBill: 25,
      telegramTask: 6,
      upiPhishing: 16,
    }
  },
  {
    id: 'hs-mumbai-thane',
    name: 'Mumbai Financial Corridor & Thane',
    state: 'Maharashtra',
    lat: 19.07,
    lng: 72.87,
    intensity: 91,
    reportCount: 3120,
    trendingVector: 'Fake Stock Trading Groups & Mule Accounts',
    severity: 'Critical',
    targetProfile: 'Retail Stock Investors, High Net-Worth Individuals',
    lastReported: '15 mins ago',
    syndicateModus: 'VIP WhatsApp institutional investment groups promising 500% returns on unlisted shares.',
    spikePercentage: 24,
    categoryBreakdown: {
      digitalArrest: 28,
      apkTrojan: 16,
      electricityBill: 10,
      telegramTask: 32,
      upiPhishing: 14,
    }
  },
  {
    id: 'hs-bengaluru',
    name: 'Bengaluru Tech Corridor',
    state: 'Karnataka',
    lat: 12.97,
    lng: 77.59,
    intensity: 84,
    reportCount: 2490,
    trendingVector: 'Part-Time Telegram Tasks & Fake Job Escrow',
    severity: 'High',
    targetProfile: 'Software Engineers, College Students, Gig Workers',
    lastReported: '22 mins ago',
    syndicateModus: 'Like YouTube videos for ₹150/task progressing into locked cryptocurrency merchant portfolios.',
    spikePercentage: 16,
    categoryBreakdown: {
      digitalArrest: 22,
      apkTrojan: 20,
      electricityBill: 6,
      telegramTask: 40,
      upiPhishing: 12,
    }
  },
  {
    id: 'hs-hyderabad',
    name: 'Cyberabad - Hyderabad Metropolitan',
    state: 'Telangana',
    lat: 17.38,
    lng: 78.48,
    intensity: 80,
    reportCount: 1950,
    trendingVector: 'Predatory Instant Loan Apps & Contact Blackmail',
    severity: 'High',
    targetProfile: 'Salaried Employees, Small Business Owners',
    lastReported: '35 mins ago',
    syndicateModus: 'Short-term credit apps harvesting smartphone contacts and photo galleries for morphed extortion.',
    spikePercentage: 11,
    categoryBreakdown: {
      digitalArrest: 18,
      apkTrojan: 34,
      electricityBill: 12,
      telegramTask: 24,
      upiPhishing: 12,
    }
  },
  {
    id: 'hs-kolkata-saltlake',
    name: 'Kolkata & Salt Lake Sector V',
    state: 'West Bengal',
    lat: 22.57,
    lng: 88.36,
    intensity: 85,
    reportCount: 2180,
    trendingVector: 'Fake Tech Support & International Gift Card Scams',
    severity: 'High',
    targetProfile: 'Internet Banking Users & Computer Users',
    lastReported: '41 mins ago',
    syndicateModus: 'Rogue pop-ups claiming computer virus infection directing victims to call fraudulent helpline call centers.',
    spikePercentage: 13,
    categoryBreakdown: {
      digitalArrest: 14,
      apkTrojan: 24,
      electricityBill: 18,
      telegramTask: 26,
      upiPhishing: 18,
    }
  },
  {
    id: 'hs-ahmedabad-surat',
    name: 'Ahmedabad - Surat Trading Belt',
    state: 'Gujarat',
    lat: 23.02,
    lng: 72.57,
    intensity: 76,
    reportCount: 1680,
    trendingVector: 'Forex Trading Schemes & Courier Customs Fraud',
    severity: 'High',
    targetProfile: 'Diamond Traders, Importers, Textile Merchants',
    lastReported: '50 mins ago',
    syndicateModus: 'Unregistered foreign currency trading bots and fake customs duties over overseas gifts.',
    spikePercentage: 9,
    categoryBreakdown: {
      digitalArrest: 20,
      apkTrojan: 12,
      electricityBill: 16,
      telegramTask: 30,
      upiPhishing: 22,
    }
  },
  {
    id: 'hs-patna-nalanda',
    name: 'Patna - Nalanda Hub',
    state: 'Bihar',
    lat: 25.59,
    lng: 85.13,
    intensity: 78,
    reportCount: 1540,
    trendingVector: 'KBC Lottery & Government Subsidy Fraud',
    severity: 'High',
    targetProfile: 'Rural Homemakers, Farmers, Senior Citizens',
    lastReported: '1 hour ago',
    syndicateModus: 'WhatsApp audio messages announcing ₹25 Lakh lottery wins requiring upfront processing GST fees.',
    spikePercentage: 8,
    categoryBreakdown: {
      digitalArrest: 10,
      apkTrojan: 22,
      electricityBill: 20,
      telegramTask: 18,
      upiPhishing: 30,
    }
  },
  {
    id: 'hs-jaipur',
    name: 'Jaipur - Alwar Corridor',
    state: 'Rajasthan',
    lat: 26.91,
    lng: 75.78,
    intensity: 71,
    reportCount: 1220,
    trendingVector: 'Fake Hotel Bookings & Tourist Escort Extortion',
    severity: 'Moderate',
    targetProfile: 'Travelers, Hotel Guests, Event Planners',
    lastReported: '1.5 hours ago',
    syndicateModus: 'Cloned resort websites and Google Maps merchant listings collecting upfront booking UPI transfers.',
    spikePercentage: 7,
    categoryBreakdown: {
      digitalArrest: 12,
      apkTrojan: 14,
      electricityBill: 14,
      telegramTask: 20,
      upiPhishing: 40,
    }
  }
];
