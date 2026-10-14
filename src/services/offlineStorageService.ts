import { OFFLINE_EMERGENCY_DATA, OfflineEmergencyDataset, OfflineSosProcedure, OfflineLegalGuideline } from '../data/offlineEmergencyData';

const SOS_CACHE_KEY = 'cyber_emergency_sos_cache_v1';
const LEGAL_CACHE_KEY = 'cyber_legal_guidelines_cache_v1';
const DRAFT_CACHE_KEY = 'cyber_offline_fir_draft_v1';
const CACHE_METADATA_KEY = 'cyber_offline_cache_meta_v1';

export interface CacheMetadata {
  version: string;
  lastUpdated: string;
  itemCount: {
    procedures: number;
    legalGuidelines: number;
    ussdCodes: number;
  };
  storageBytes: number;
  status: 'CACHED' | 'OUTDATED' | 'CORRUPTED';
  isServiceWorkerActive: boolean;
}

export interface OfflineFirDraft {
  policeStationName: string;
  cityDistrict: string;
  complainantName: string;
  age: string;
  address: string;
  phone: string;
  email: string;
  incidentDateTime: string;
  amountLost: string;
  debitedBank: string;
  debitedAccount: string;
  transactionRef: string;
  helplineAckNo: string;
  suspectPhone: string;
  suspectAccount: string;
  suspectPlatform: string;
  incidentDescription: string;
  lastSavedAt: string;
}

export class OfflineStorageService {
  private static instance: OfflineStorageService;

  private constructor() {
    this.ensureCacheInitialized();
  }

  public static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  /**
   * Initializes or updates localStorage caches with emergency procedures and legal guidelines.
   */
  public ensureCacheInitialized(): CacheMetadata {
    try {
      const existingMeta = localStorage.getItem(CACHE_METADATA_KEY);
      const existingSos = localStorage.getItem(SOS_CACHE_KEY);
      const existingLegal = localStorage.getItem(LEGAL_CACHE_KEY);

      if (!existingMeta || !existingSos || !existingLegal) {
        return this.rebuildCache();
      }

      // Check version
      const meta: CacheMetadata = JSON.parse(existingMeta);
      if (meta.version !== OFFLINE_EMERGENCY_DATA.version) {
        return this.rebuildCache();
      }

      return meta;
    } catch (e) {
      console.warn('Error reading offline emergency cache, rebuilding:', e);
      return this.rebuildCache();
    }
  }

  public rebuildCache(): CacheMetadata {
    try {
      const sosJson = JSON.stringify({
        helpline1930: OFFLINE_EMERGENCY_DATA.helpline1930,
        procedures: OFFLINE_EMERGENCY_DATA.procedures,
        bankEmergencyUSSD: OFFLINE_EMERGENCY_DATA.bankEmergencyUSSD,
      });

      const legalJson = JSON.stringify({
        legalGuidelines: OFFLINE_EMERGENCY_DATA.legalGuidelines,
        offlineFirTemplate: OFFLINE_EMERGENCY_DATA.offlineFirTemplate,
        section65BCertificateTemplate: OFFLINE_EMERGENCY_DATA.section65BCertificateTemplate,
      });

      localStorage.setItem(SOS_CACHE_KEY, sosJson);
      localStorage.setItem(LEGAL_CACHE_KEY, legalJson);

      const totalBytes = (sosJson.length + legalJson.length) * 2; // rough UTF-16 byte estimate

      const meta: CacheMetadata = {
        version: OFFLINE_EMERGENCY_DATA.version,
        lastUpdated: new Date().toISOString(),
        itemCount: {
          procedures: OFFLINE_EMERGENCY_DATA.procedures.length,
          legalGuidelines: OFFLINE_EMERGENCY_DATA.legalGuidelines.length,
          ussdCodes: OFFLINE_EMERGENCY_DATA.bankEmergencyUSSD.length,
        },
        storageBytes: totalBytes,
        status: 'CACHED',
        isServiceWorkerActive: typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
      };

      localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(meta));
      window.dispatchEvent(new CustomEvent('cyber_cache_updated', { detail: meta }));
      return meta;
    } catch (err) {
      console.error('Failed to write to localStorage for offline cache:', err);
      return {
        version: OFFLINE_EMERGENCY_DATA.version,
        lastUpdated: new Date().toISOString(),
        itemCount: {
          procedures: OFFLINE_EMERGENCY_DATA.procedures.length,
          legalGuidelines: OFFLINE_EMERGENCY_DATA.legalGuidelines.length,
          ussdCodes: OFFLINE_EMERGENCY_DATA.bankEmergencyUSSD.length,
        },
        storageBytes: 0,
        status: 'CORRUPTED',
        isServiceWorkerActive: false,
      };
    }
  }

  public getEmergencySosProcedures(): OfflineSosProcedure[] {
    try {
      const cached = localStorage.getItem(SOS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.procedures && Array.isArray(parsed.procedures)) {
          return parsed.procedures;
        }
      }
    } catch (e) {
      console.error('Error reading cached SOS procedures:', e);
    }
    return OFFLINE_EMERGENCY_DATA.procedures;
  }

  public getBankUSSDCodes(): OfflineEmergencyDataset['bankEmergencyUSSD'] {
    try {
      const cached = localStorage.getItem(SOS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.bankEmergencyUSSD && Array.isArray(parsed.bankEmergencyUSSD)) {
          return parsed.bankEmergencyUSSD;
        }
      }
    } catch (e) {
      console.error('Error reading cached USSD codes:', e);
    }
    return OFFLINE_EMERGENCY_DATA.bankEmergencyUSSD;
  }

  public getLegalGuidelines(): OfflineLegalGuideline[] {
    try {
      const cached = localStorage.getItem(LEGAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.legalGuidelines && Array.isArray(parsed.legalGuidelines)) {
          return parsed.legalGuidelines;
        }
      }
    } catch (e) {
      console.error('Error reading cached legal guidelines:', e);
    }
    return OFFLINE_EMERGENCY_DATA.legalGuidelines;
  }

  public getFirTemplate(): string {
    try {
      const cached = localStorage.getItem(LEGAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.offlineFirTemplate) return parsed.offlineFirTemplate;
      }
    } catch (e) {
      // fallback
    }
    return OFFLINE_EMERGENCY_DATA.offlineFirTemplate;
  }

  public getSection65BCertificate(): string {
    try {
      const cached = localStorage.getItem(LEGAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.section65BCertificateTemplate) return parsed.section65BCertificateTemplate;
      }
    } catch (e) {
      // fallback
    }
    return OFFLINE_EMERGENCY_DATA.section65BCertificateTemplate;
  }

  public saveOfflineDraft(draft: Partial<OfflineFirDraft>): void {
    try {
      const current = this.getOfflineDraft() || {} as OfflineFirDraft;
      const updated: OfflineFirDraft = {
        ...current,
        ...draft,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_CACHE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving offline FIR draft:', e);
    }
  }

  public getOfflineDraft(): OfflineFirDraft | null {
    try {
      const cached = localStorage.getItem(DRAFT_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Error reading offline FIR draft:', e);
    }
    return null;
  }

  public getCacheMetadata(): CacheMetadata {
    try {
      const meta = localStorage.getItem(CACHE_METADATA_KEY);
      if (meta) {
        const parsed = JSON.parse(meta);
        parsed.isServiceWorkerActive = typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    return this.ensureCacheInitialized();
  }

  /**
   * Generates a fully self-contained offline Emergency HTML packet that can be saved
   * locally or printed by any victim even without internet or our app.
   */
  public generatePrintableEmergencyPacket(draft?: OfflineFirDraft | null): string {
    const procedures = this.getEmergencySosProcedures();
    const legal = this.getLegalGuidelines();
    const ussd = this.getBankUSSDCodes();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CYBER CRIME EMERGENCY SOS & LEGAL ACTION PACKET</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #1e293b; max-width: 800px; margin: 20px auto; padding: 20px; }
    h1 { color: #b91c1c; border-bottom: 3px solid #b91c1c; padding-bottom: 8px; }
    h2 { color: #0f172a; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    .emergency-banner { background: #fee2e2; border-left: 6px solid #ef4444; padding: 12px 16px; margin-bottom: 20px; font-weight: bold; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
    .tag { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    pre { background: #f1f5f9; padding: 12px; border-radius: 6px; white-space: pre-wrap; font-size: 13px; border: 1px solid #cbd5e1; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="emergency-banner">
    🚨 EMERGENCY ACTION REQUIRED: DIAL 1930 IMMEDIATELY FOR CYBER FINANCIAL FRAUD (GOLDEN HOUR FREEZE)
  </div>

  <h1>Cyber Security Seva — Offline Emergency Kit</h1>
  <p><strong>Generated on:</strong> ${new Date().toLocaleString('en-IN')}</p>
  <p><em>This document is saved offline on your device and contains all statutory legal rights, emergency bank freeze formats, and FIR draft templates.</em></p>

  <h2>1. Immediate Emergency Procedures (First 2 Hours)</h2>
  ${procedures.map(p => `
    <div class="card">
      <div style="display:flex; justify-content:space-between;">
        <strong>Step ${p.stepNumber}: ${p.title}</strong>
        <span class="tag">${p.urgentTimeframe}</span>
      </div>
      <p style="margin: 6px 0;">${p.description}</p>
      <ul>
        ${p.keyActions.map(a => `<li>${a}</li>`).join('')}
      </ul>
      ${p.helplineOrCode ? `<p><strong>Action Line:</strong> ${p.helplineOrCode} (${p.helplineLabel || ''})</p>` : ''}
    </div>
  `).join('')}

  <h2>2. Bank SMS & USSD Emergency Freezing Codes (Works Without Internet)</h2>
  ${ussd.map(u => `
    <div class="card">
      <strong>${u.title}</strong> - <span style="font-family:monospace; background:#e2e8f0; padding:2px 6px;">${u.code}</span>
      <p style="margin: 4px 0; font-size: 13px;">${u.description}</p>
      <p style="margin: 2px 0; font-size: 12px; color: #64748b;">${u.note}</p>
    </div>
  `).join('')}

  <h2>3. Key Statutory Legal Guidelines & Rights</h2>
  ${legal.map(l => `
    <div class="card">
      <div class="tag">${l.lawReference}</div>
      <h3 style="margin: 6px 0;">${l.title}</h3>
      <p>${l.summary}</p>
      <p><strong>Key Legal Rights:</strong></p>
      <ul>
        ${l.keyRights.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <p><strong>Practical Advice:</strong> ${l.practicalAdvice}</p>
      <p style="font-size: 12px; color: #64748b;">Authority: ${l.courtOrAuthority}</p>
    </div>
  `).join('')}

  <h2>4. Offline FIR Complaint Draft</h2>
  <pre>${draft ? this.fillDraft(draft) : OFFLINE_EMERGENCY_DATA.offlineFirTemplate}</pre>

  <h2>5. Section 63 BSA / Section 65B Evidence Certificate</h2>
  <pre>${OFFLINE_EMERGENCY_DATA.section65BCertificateTemplate}</pre>
</body>
</html>`;
  }

  private fillDraft(d: OfflineFirDraft): string {
    let t = OFFLINE_EMERGENCY_DATA.offlineFirTemplate;
    t = t.replace('[POLICE_STATION_NAME]', d.policeStationName || 'Local Cyber Crime Police Station');
    t = t.replace('[CITY_DISTRICT]', d.cityDistrict || 'City/District');
    t = t.replace(/\[COMPLAINANT_NAME\]/g, d.complainantName || '[Your Name]');
    t = t.replace('[AGE]', d.age || '[Age]');
    t = t.replace(/\[ADDRESS\]/g, d.address || '[Your Residential Address]');
    t = t.replace('[PHONE]', d.phone || '[Your Phone]');
    t = t.replace('[EMAIL]', d.email || '[Your Email]');
    t = t.replace('[INCIDENT_DATETIME]', d.incidentDateTime || new Date().toLocaleString());
    t = t.replace('[AMOUNT_LOST]', d.amountLost || '0.00');
    t = t.replace('[DEBITED_BANK]', d.debitedBank || '[Your Bank]');
    t = t.replace('[DEBITED_ACCOUNT]', d.debitedAccount || '[Your Account/Card]');
    t = t.replace('[TRANSACTION_REF]', d.transactionRef || '[UTR/Transaction ID]');
    t = t.replace('[HELPLINE_ACK_NO]', d.helplineAckNo || '1930 Acknowledgment Pending');
    t = t.replace('[SUSPECT_PHONE]', d.suspectPhone || '[Suspect Phone]');
    t = t.replace('[SUSPECT_ACCOUNT]', d.suspectAccount || '[Suspect UPI/Account]');
    t = t.replace('[SUSPECT_PLATFORM]', d.suspectPlatform || '[WhatsApp / Web Link]');
    t = t.replace('[INCIDENT_DESCRIPTION]', d.incidentDescription || '[Describe what occurred]');
    t = t.replace('[CURRENT_DATE]', new Date().toLocaleDateString('en-IN'));
    return t;
  }
}

export const offlineStorageService = OfflineStorageService.getInstance();
