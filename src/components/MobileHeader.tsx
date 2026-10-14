import React, { useState, useEffect } from 'react';
import { ShieldAlert, PhoneCall, Wifi, WifiOff, Battery, Signal, Sparkles, Bell, Smartphone, HardDrive } from 'lucide-react';

interface MobileHeaderProps {
  onOpenSos: () => void;
  onOpenGemini?: () => void;
  onOpenNotifications?: () => void;
  onSimulateBackground?: () => void;
  onOpenOfflineHub?: () => void;
  isOffline?: boolean;
  unreadNotificationsCount?: number;
  activeTabTitle: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  onOpenSos, 
  onOpenGemini, 
  onOpenNotifications,
  onSimulateBackground,
  onOpenOfflineHub,
  isOffline = false,
  unreadNotificationsCount = 0,
  activeTabTitle 
}) => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md shrink-0">
      {/* Mobile OS Status Bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1 text-[11px] font-mono text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight">{timeStr}</span>
          {unreadNotificationsCount > 0 && (
            <button
              onClick={onOpenNotifications}
              className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded-full cursor-pointer hover:bg-rose-500/30 transition-colors"
              title="Unread threat alerts"
            >
              <Bell className="w-2.5 h-2.5 animate-bounce" />
              <span>{unreadNotificationsCount} alert{unreadNotificationsCount > 1 ? 's' : ''}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          {onSimulateBackground && (
            <button
              onClick={onSimulateBackground}
              className="hidden sm:flex items-center gap-1 text-[10px] font-sans text-slate-400 hover:text-white bg-slate-800/80 px-1.5 py-0.2 rounded cursor-pointer transition-colors"
              title="Simulate backgrounding app / phone lock"
            >
              <Smartphone className="w-2.5 h-2.5 text-indigo-400" />
              <span>Background</span>
            </button>
          )}
          <Signal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">{isOffline ? 'OFFLINE' : '5G'}</span>
          {isOffline ? (
            <button
              onClick={onOpenOfflineHub}
              className="flex items-center gap-1 text-amber-400 bg-amber-500/20 px-1 rounded hover:bg-amber-500/30 transition-colors"
              title="Device is offline - Open Offline SOS & Legal Hub"
            >
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            </button>
          ) : (
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
          )}
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Mobile App Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shadow-md shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-white leading-tight truncate">
                Cyber Security Seva
              </h1>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold shrink-0">
                1930
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 truncate">
              {activeTabTitle}
            </p>
          </div>
        </div>

        {/* Action Buttons: Bell, Gemini AI & SOS 1930 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Actions Dropdown */}
          <div className="relative group">
            <button className="min-h-[36px] px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-700 transition-all cursor-pointer">
              <span>Actions</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50">
              <a href="tel:1930" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer">Emergency Call</a>
              <button className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer">Disable All Accounts</button>
              <button className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer">Freeze Bank Cards</button>
            </div>
          </div>

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative min-h-[36px] w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center border border-slate-700 transition-all cursor-pointer"
              title="Open Threat Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {onOpenGemini && (
            <button
              onClick={onOpenGemini}
              className="min-h-[36px] px-2.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-1 border border-indigo-400/40 transition-all cursor-pointer shadow-sm"
              title="Open Gemini AI Cyber Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden xs:inline">Gemini AI</span>
            </button>
          )}

          <button
            onClick={onOpenSos}
            className="min-h-[36px] px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-black rounded-lg flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <PhoneCall className="w-3.5 h-3.5" />
            <span>1930</span>
          </button>
        </div>
      </div>
    </header>
  );
};

