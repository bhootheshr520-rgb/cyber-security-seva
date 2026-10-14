import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenSos: () => void;
  onGoToTab: (tab: 'post-fraud' | 'scams' | 'alerts' | 'education' | 'legal') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSos, onGoToTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Cyber Security Seva</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              National citizen awareness, post-fraud psychological grounding, 24/7 emergency SOS escalation, and formal legal police FIR portal.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenSos}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                24/7 SOS: Dial 1930
              </button>
            </div>
          </div>

          {/* Col 2: Emergency Hotlines */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Official Helplines</h4>
            <ul className="space-y-1.5">
              <li>
                <span className="text-white font-mono font-bold">1930</span> — National Cyber Financial Fraud
              </li>
              <li>
                <span className="text-white font-mono font-bold">112</span> — National Police Emergency
              </li>
              <li>
                <span className="text-white font-mono font-bold">1091 / 1090</span> — Women Cyber Safety
              </li>
              <li>
                <span className="text-white font-mono font-bold">198</span> — Telecom SIM Swap Emergency
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Portal Sections</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onGoToTab('post-fraud')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  After Fraud: What To Do & NOT To Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToTab('scams')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Searchable Scam Patterns Database
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToTab('alerts')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Real-Time Threat Alerts & Advisories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToTab('education')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Precautions & Explainer Walkthroughs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToTab('legal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Police FIR Generator & Legal Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Portals */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Government Links</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  cybercrime.gov.in (MHA) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sancharsaathi.gov.in/sfc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  Chakshu DoT Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sachet.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  RBI Sachet (Illegal Loan Apps) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://stopncii.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  StopNCII.org (Intimate Image Shield) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            <span>Public Service Cyber Defence Initiative</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Zero Tracking · Client-Side Encrypted Storage</span>
          </div>
          <div>
            <span>Statutory Notice: In active ongoing financial theft, immediately dial <strong>1930</strong>.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
