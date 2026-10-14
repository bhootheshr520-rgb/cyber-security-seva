export interface BankHotline {
  name: string;
  category: 'Bank' | 'UPI / Wallet' | 'Government Helpline';
  tollFree: string;
  smsFreezeSyntax?: string;
  smsNumber?: string;
  ussdCode?: string;
  procedure: string;
  officialPortal: string;
}

export const BANK_HOTLINES: BankHotline[] = [
  {
    name: 'National Cyber Financial Fraud Helpline (1930)',
    category: 'Government Helpline',
    tollFree: '1930',
    procedure: 'Dial 1930 immediately within the "Golden Hour". Provide Transaction ID, Bank Name, Debited Account, and Beneficiary details to freeze funds in transit.',
    officialPortal: 'https://cybercrime.gov.in'
  },
  {
    name: 'State Bank of India (SBI)',
    category: 'Bank',
    tollFree: '1800 1234 / 1800 2100',
    smsFreezeSyntax: 'BLOCK <Last 4 digits of Card>',
    smsNumber: '567676',
    ussdCode: '*99*41#',
    procedure: 'To freeze UPI & Net Banking immediately, send SMS "UNHAPPY" to 9223008000 or dial 1800111109.',
    officialPortal: 'https://onlinesbi.sbi'
  },
  {
    name: 'HDFC Bank',
    category: 'Bank',
    tollFree: '1800 1600 / 1800 2600',
    smsFreezeSyntax: 'BLOCK <Last 4 digits of Card>',
    smsNumber: '5676712',
    procedure: 'Call 1800 2586 161 (Fraud Hotlline) or login to NetBanking -> Card Services -> Instant Hotlist.',
    officialPortal: 'https://hdfcbank.com'
  },
  {
    name: 'ICICI Bank',
    category: 'Bank',
    tollFree: '1800 1080',
    smsFreezeSyntax: 'BLOCK <Card Number>',
    smsNumber: '5676766',
    procedure: 'Call 1800 2662 direct cyber emergency helpline or block through iMobile app Security settings.',
    officialPortal: 'https://icicibank.com'
  },
  {
    name: 'Axis Bank',
    category: 'Bank',
    tollFree: '1800 419 5959',
    smsFreezeSyntax: 'BLOCK <Card Number>',
    smsNumber: '5676782',
    procedure: 'Emergency card block via SMS or call 1860 419 5555 / 1860 500 5555.',
    officialPortal: 'https://axisbank.com'
  },
  {
    name: 'Punjab National Bank (PNB)',
    category: 'Bank',
    tollFree: '1800 180 2222',
    smsFreezeSyntax: 'HOTLIST <Card Number>',
    smsNumber: '5607040',
    procedure: 'Dial 1800 103 2222 or send SMS to 5607040 to immediately hotlist card.',
    officialPortal: 'https://pnbindia.in'
  },
  {
    name: 'Kotak Mahindra Bank',
    category: 'Bank',
    tollFree: '1860 266 2666',
    smsFreezeSyntax: 'LOST <Last 4 digits of Card>',
    smsNumber: '9971056767',
    procedure: 'Call dedicated Fraud Desk on 1800 209 0000 or access Kotak NetBanking -> Service Request -> Block Card.',
    officialPortal: 'https://kotak.com'
  },
  {
    name: 'Google Pay (GPay)',
    category: 'UPI / Wallet',
    tollFree: '1800 419 0157',
    procedure: 'Open Google Pay -> Profile icon -> Help & feedback -> Raise dispute / Report unauthorized charges.',
    officialPortal: 'https://support.google.com/pay'
  },
  {
    name: 'PhonePe',
    category: 'UPI / Wallet',
    tollFree: '080-68727374 / 022-68727374',
    procedure: 'PhonePe app -> Help icon -> "I have an issue with a transaction" -> "Report Fraud". Or dial fraud support.',
    officialPortal: 'https://phonepe.com/contact-us/'
  },
  {
    name: 'Paytm Payments Bank / Wallet',
    category: 'UPI / Wallet',
    tollFree: '0120 4456 456',
    procedure: 'Call 24x7 Cyber Fraud Line on 0120-3888388 or tap 24x7 Helpdesk in Paytm App -> Report unauthorized activity.',
    officialPortal: 'https://paytm.com/care'
  }
];
