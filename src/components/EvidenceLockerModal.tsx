import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Save, Download, Copy, Check, Trash2, ShieldCheck, AlertCircle, MapPin, ExternalLink } from 'lucide-react';
import { BiometricLockOverlay } from './BiometricLockOverlay';
import { AudioTranscriber } from './AudioTranscriber';

export interface EvidenceRecord {
  id: string;
  incidentDateTime: string;
  amountLost: string;
  paymentMethod: string;
  debitedBank: string;
  debitedAccountNumber: string;
  transactionRefId: string;
  suspectPhone: string;
  suspectUpiOrAccount: string;
  suspectPlatform: string;
  incidentDescription: string;
  hasScreenshots: boolean;
  hasBankStatement: boolean;
  hasCallLogs: boolean;
  createdAt: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    mapsUrl?: string;
    locality?: string;
  };
}

interface EvidenceLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPopulateFir: (record: EvidenceRecord) => void;
}

const STORAGE_KEY = 'cyber_seva_evidence_records';

export const EvidenceLockerModal: React.FC<EvidenceLockerModalProps> = ({
  isOpen,
  onClose,
  onPopulateFir
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [activeForm, setActiveForm] = useState<Partial<EvidenceRecord>>({
    incidentDateTime: new Date().toISOString().slice(0, 16),
    amountLost: '',
    paymentMethod: 'UPI',
    debitedBank: '',
    debitedAccountNumber: '',
    transactionRefId: '',
    suspectPhone: '',
    suspectUpiOrAccount: '',
    suspectPlatform: 'WhatsApp / Phone Call',
    incidentDescription: '',
    hasScreenshots: true,
    hasBankStatement: false,
    hasCallLogs: true
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false);
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: EvidenceRecord = {
      id: 'REC-' + Date.now().toString().slice(-6),
      incidentDateTime: activeForm.incidentDateTime || new Date().toISOString(),
      amountLost: activeForm.amountLost || '0',
      paymentMethod: activeForm.paymentMethod || 'UPI',
      debitedBank: activeForm.debitedBank || 'Not specified',
      debitedAccountNumber: activeForm.debitedAccountNumber || '',
      transactionRefId: activeForm.transactionRefId || '',
      suspectPhone: activeForm.suspectPhone || '',
      suspectUpiOrAccount: activeForm.suspectUpiOrAccount || '',
      suspectPlatform: activeForm.suspectPlatform || 'Internet',
      incidentDescription: activeForm.incidentDescription || '',
      hasScreenshots: !!activeForm.hasScreenshots,
      hasBankStatement: !!activeForm.hasBankStatement,
      hasCallLogs: !!activeForm.hasCallLogs,
      createdAt: new Date().toLocaleString()
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCopySummary = (record: EvidenceRecord) => {
    const text = `CYBER CRIME EVIDENCE LOG [${record.id}]
Date/Time of Incident: ${record.incidentDateTime}
Amount Lost: ₹${record.amountLost}
Payment Method: ${record.paymentMethod}
Debited Bank: ${record.debitedBank} (A/C: ${record.debitedAccountNumber || 'N/A'})
Transaction Reference / UTR: ${record.transactionRefId || 'N/A'}
Suspect Contact / Phone: ${record.suspectPhone || 'N/A'}
Suspect Beneficiary UPI / Account: ${record.suspectUpiOrAccount || 'N/A'}
Platform Used: ${record.suspectPlatform}
Incident Narrative: ${record.incidentDescription}
Evidence Items Available: Screenshots (${record.hasScreenshots ? 'Yes' : 'No'}), Bank Statement (${record.hasBankStatement ? 'Yes' : 'No'}), Call Records (${record.hasCallLogs ? 'Yes' : 'No'})`;

    navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cyber_seva_evidence_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="bg-slate-900 text-white p-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isUnlocked
                ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-400'
                : 'bg-indigo-500/20 border-indigo-400/30 text-indigo-400'
            }`}>
              {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold tracking-tight">Evidence Locker</h2>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  isUnlocked
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isUnlocked ? 'Confidential Transaction Logs' : 'Biometric & PIN Protected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isUnlocked && (
              <button
                onClick={() => setIsUnlocked(false)}
                className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                title="Lock Locker Now"
              >
                <Lock className="w-3 h-3 text-rose-400" />
                <span>Lock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lock Overlay or Unlocked Content */}
        {!isUnlocked ? (
          <BiometricLockOverlay
            onUnlock={() => setIsUnlocked(true)}
            onCancel={onClose}
          />
        ) : (
          <>
            {/* Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Privacy Note */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
              <strong>Zero-Cloud Privacy Guarantee:</strong> All evidence entered here is stored strictly inside your local browser storage. No data is sent to external advertising trackers or 3rd-party servers.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Log New Incident Evidence</h3>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved to Locker
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date & Time of Fraud *</label>
                <input
                  type="datetime-local"
                  required
                  value={activeForm.incidentDateTime || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, incidentDateTime: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount Lost (in ₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 25000"
                  value={activeForm.amountLost || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, amountLost: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={activeForm.paymentMethod || 'UPI'}
                  onChange={(e) => setActiveForm({ ...activeForm, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                  <option value="IMPS">IMPS Immediate Transfer</option>
                  <option value="NEFT/RTGS">NEFT / RTGS</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cryptocurrency">Cryptocurrency (USDT / BTC)</option>
                  <option value="Gift Card">Gift Card (Amazon / Apple)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. SBI, HDFC, ICICI"
                  value={activeForm.debitedBank || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, debitedBank: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Account / Card (Last 4 digits)</label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g. XXXX 4821"
                  value={activeForm.debitedAccountNumber || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, debitedAccountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">12-Digit UPI Ref / UTR / TXN ID *</label>
                <input
                  type="text"
                  placeholder="e.g. 409283749102"
                  value={activeForm.transactionRefId || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, transactionRefId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Suspect Phone / Caller ID</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={activeForm.suspectPhone || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, suspectPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Suspect UPI ID or Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. merchant.desk@ybl or A/C 99018274"
                  value={activeForm.suspectUpiOrAccount || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, suspectUpiOrAccount: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Platform Used by Scammer</label>
                <input
                  type="text"
                  placeholder="e.g. WhatsApp, Skype, Telegram, OLX"
                  value={activeForm.suspectPlatform || ''}
                  onChange={(e) => setActiveForm({ ...activeForm, suspectPlatform: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Brief Narrative / Modus Operandi (What they said)</label>
                <AudioTranscriber
                  buttonLabel="Voice Statement"
                  compact
                  onTranscribeComplete={(transcribed) => {
                    setActiveForm((prev) => ({
                      ...prev,
                      incidentDescription: prev.incidentDescription
                        ? `${prev.incidentDescription}\n${transcribed}`
                        : transcribed,
                    }));
                  }}
                />
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Caller claimed to be FedEx officer saying parcel contained narcotics, forced on Skype, demanded verification transfer..."
                value={activeForm.incidentDescription || ''}
                onChange={(e) => setActiveForm({ ...activeForm, incidentDescription: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Evidence Checklist */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-700">
              <span className="font-bold">Preserved Evidence:</span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeForm.hasScreenshots}
                  onChange={(e) => setActiveForm({ ...activeForm, hasScreenshots: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span>Screenshots of Chats/App</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeForm.hasBankStatement}
                  onChange={(e) => setActiveForm({ ...activeForm, hasBankStatement: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span>Bank Statement (PDF)</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeForm.hasCallLogs}
                  onChange={(e) => setActiveForm({ ...activeForm, hasCallLogs: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span>Call Logs / Numbers</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save to Evidence Locker
              </button>
            </div>
          </form>

          {/* Stored Records Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Saved Evidence Entries ({records.length})</h3>
              {records.length > 0 && (
                <button
                  onClick={handleExportJson}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export All (.JSON)
                </button>
              )}
            </div>

            {records.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                No evidence logs recorded yet. Fill the quick form above to lock your details safely into the browser.
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{rec.id}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="font-mono text-rose-700 font-bold">₹{rec.amountLost}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500">{rec.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopySummary(rec)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-[11px] flex items-center gap-1"
                        >
                          {copiedId === rec.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedId === rec.id ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => {
                            onPopulateFir(rec);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold text-[11px]"
                        >
                          Send to Police FIR
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg font-mono">
                      <div>
                        <span className="text-slate-400 block">Bank / Ref:</span>
                        <span className="truncate block font-semibold text-slate-800">{rec.debitedBank}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">UTR / TXN ID:</span>
                        <span className="truncate block font-semibold text-slate-800">{rec.transactionRefId || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Suspect Phone:</span>
                        <span className="truncate block font-semibold text-slate-800">{rec.suspectPhone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Suspect VPA / A/C:</span>
                        <span className="truncate block font-semibold text-slate-800">{rec.suspectUpiOrAccount || 'N/A'}</span>
                      </div>
                    </div>

                    {rec.gpsCoordinates && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-950">GPS Locked:</span>
                          <span className="truncate">{rec.gpsCoordinates.latitude.toFixed(6)}° N, {rec.gpsCoordinates.longitude.toFixed(6)}° E</span>
                          {rec.gpsCoordinates.accuracy && (
                            <span className="text-emerald-700 text-[10px]"> (±{rec.gpsCoordinates.accuracy}m)</span>
                          )}
                        </div>
                        {rec.gpsCoordinates.mapsUrl && (
                          <a
                            href={rec.gpsCoordinates.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-sans text-[11px] font-semibold flex items-center gap-0.5 shrink-0 ml-2"
                          >
                            <span>Map Pin</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {rec.incidentDescription && (
                      <p className="text-slate-700 text-xs italic bg-white pt-1">
                        "{rec.incidentDescription}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <button
            onClick={() => {
              setIsUnlocked(false);
              onClose();
            }}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span>Lock & Exit</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </>
    )}
      </div>
    </div>
  );
};
