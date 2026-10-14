import React from 'react';
import { AlertTriangle, Search, Bell, BookOpen, Scale } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'post-fraud' | 'scams' | 'alerts' | 'education' | 'legal';
  setActiveTab: (tab: 'post-fraud' | 'scams' | 'alerts' | 'education' | 'legal') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'post-fraud' as const, label: 'After Fraud', icon: AlertTriangle },
    { id: 'scams' as const, label: 'Scam DB', icon: Search },
    { id: 'alerts' as const, label: 'Alerts', icon: Bell },
    { id: 'education' as const, label: 'Videos', icon: BookOpen },
    { id: 'legal' as const, label: 'Legal FIR', icon: Scale },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1 shadow-lg shrink-0">
      <div className="grid grid-cols-5 items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {tab.id === 'alerts' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 leading-none ${isActive ? 'font-bold text-rose-600' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 rounded-full bg-rose-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
