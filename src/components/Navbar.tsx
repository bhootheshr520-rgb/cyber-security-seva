import React from 'react';
import { ShieldAlert, AlertTriangle, BookOpen, Search, FileText, Bell } from 'lucide-react';

interface NavbarProps {
  activeTab: 'post-fraud' | 'scams' | 'alerts' | 'education' | 'legal';
  setActiveTab: (tab: 'post-fraud' | 'scams' | 'alerts' | 'education' | 'legal') => void;
  openSosModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openSosModal }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('post-fraud')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                  Cyber Security Seva
                </span>
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap hidden sm:block leading-none">
                  Citizen Cyber Fraud & Relief Portal
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('post-fraud')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'post-fraud'
                  ? 'text-slate-900 bg-slate-100 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              After Fraud: What To Do
            </button>

            <button
              onClick={() => setActiveTab('scams')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'scams'
                  ? 'text-slate-900 bg-slate-100 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              Scam Database
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'text-slate-900 bg-slate-100 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4 text-rose-500" />
              Threat Alerts
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'education'
                  ? 'text-slate-900 bg-slate-100 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Precautions & Videos
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'legal'
                  ? 'text-slate-900 bg-slate-100 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-600" />
              FIR & Legal Guide
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openSosModal}
              className="relative px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              title="Open 24/7 Emergency SOS Helpline"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>24/7 SOS REPORT</span>
              <span className="hidden sm:inline-block font-mono bg-rose-700 px-1.5 py-0.5 rounded text-[10px] tracking-wide">
                1930
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between overflow-x-auto py-2 border-t border-slate-100 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('post-fraud')}
            className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
              activeTab === 'post-fraud' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
            }`}
          >
            After Fraud
          </button>
          <button
            onClick={() => setActiveTab('scams')}
            className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
              activeTab === 'scams' ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600'
            }`}
          >
            Scams
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
              activeTab === 'alerts' ? 'bg-rose-100 text-rose-900 font-semibold' : 'text-slate-600'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
              activeTab === 'education' ? 'bg-indigo-100 text-indigo-900 font-semibold' : 'text-slate-600'
            }`}
          >
            Videos & Tips
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
              activeTab === 'legal' ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-slate-600'
            }`}
          >
            Police FIR Guide
          </button>
        </div>
      </div>
    </header>
  );
};
