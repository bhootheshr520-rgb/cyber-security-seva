import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  ShieldAlert, 
  Play, 
  Trash2, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Sliders, 
  Sparkles,
  Info
} from 'lucide-react';
import { PushAdvisory } from '../data/pushNotificationsData';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushAdvisory[];
  onOpenAdvisory: (advisory: PushAdvisory) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onTriggerTestPush: () => void;
  onSimulateBackground: (seconds?: number) => void;
  onRequestBrowserPermission: () => void;
  browserPermission: NotificationPermission;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoFeedInterval: 'off' | '45s' | '90s';
  onChangeAutoFeed: (val: 'off' | '45s' | '90s') => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onOpenAdvisory,
  onMarkAllAsRead,
  onClearAll,
  onTriggerTestPush,
  onSimulateBackground,
  onRequestBrowserPermission,
  browserPermission,
  soundEnabled,
  onToggleSound,
  autoFeedInterval,
  onChangeAutoFeed,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'settings'>('feed');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[780px] overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <BellRing className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Threat Notification Center</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-600 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                Simulated real-time CERT-In & I4C emergency feed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subnav Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-semibold px-4 pt-1 shrink-0">
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'feed'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Advisories ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Push & Background Settings</span>
          </button>
        </div>

        {/* Tab 1: Feed Content */}
        {activeTab === 'feed' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Quick Background Simulation Test Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/90 to-purple-950/90 border border-indigo-500/40 flex items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Test Background Delivery</span>
                </h4>
                <p className="text-[10px] text-indigo-300">
                  Simulates phone locked / app minimized with high alert
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onSimulateBackground(4);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm shrink-0"
              >
                <Play className="w-3 h-3" />
                <span>Simulate (4s)</span>
              </button>
            </div>

            {/* Notification Actions Row */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400 font-medium">Recent Cyber Advisories</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <BellOff className="w-10 h-10 mx-auto opacity-40 text-slate-500" />
                <p className="text-xs">No active push notifications</p>
                <button
                  onClick={onTriggerTestPush}
                  className="text-xs font-semibold text-indigo-400 hover:underline inline-block mt-1 cursor-pointer"
                >
                  Generate Test Threat Push →
                </button>
              </div>
            ) : (
              notifications.map((advisory) => {
                const isCritical = advisory.severity === 'Critical';
                return (
                  <div
                    key={advisory.id}
                    onClick={() => {
                      onClose();
                      onOpenAdvisory(advisory);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] ${
                      !advisory.read
                        ? isCritical
                          ? 'bg-slate-800/90 border-rose-500/60 shadow-md shadow-rose-950/30'
                          : 'bg-slate-800/90 border-amber-500/60 shadow-md shadow-amber-950/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            !advisory.read ? (isCritical ? 'bg-rose-500 animate-ping' : 'bg-amber-400') : 'bg-slate-600'
                          }`}
                        />
                        <span className="font-bold text-slate-300 font-mono">{advisory.agency}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.2 rounded font-black uppercase text-[9px] ${
                            isCritical ? 'bg-rose-600/30 text-rose-300' : 'bg-amber-600/30 text-amber-300'
                          }`}
                        >
                          {advisory.severity}
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">{advisory.timestamp}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1 line-clamp-1 flex items-center gap-1.5">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
                      <span>{advisory.title}</span>
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {advisory.body}
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono text-[9px]">{advisory.advisoryCode}</span>
                      <span className="text-indigo-400 font-bold flex items-center gap-0.5 hover:underline">
                        View Details & Countermeasures
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Settings & Controls */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Real Web Notification Permission */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span>Real Browser Push Notifications</span>
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    Fires system OS banners even when tab is backgrounded
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    browserPermission === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : browserPermission === 'denied'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {browserPermission}
                </span>
              </div>

              {browserPermission !== 'granted' && (
                <button
                  onClick={onRequestBrowserPermission}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <BellRing className="w-3.5 h-3.5 text-white" />
                  <span>Request Browser Push Permission</span>
                </button>
              )}

              {browserPermission === 'granted' && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>System notifications active. You will receive OS alerts if you switch tabs.</span>
                </div>
              )}
            </div>

            {/* Sound alert chime */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span>Emergency Advisory Audio Chime</span>
                </h4>
                <p className="text-[10px] text-slate-300">
                  Synthesized two-tone emergency sound on incoming alerts
                </p>
              </div>

              <button
                onClick={onToggleSound}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    soundEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto feed interval */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Simulated Intelligence Feed Frequency</span>
              </h4>
              <p className="text-[10px] text-slate-300">
                Automatically delivers fresh cyber intelligence advisories in the background
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                {(['off', '45s', '90s'] as const).map((interval) => (
                  <button
                    key={interval}
                    onClick={() => onChangeAutoFeed(interval)}
                    className={`py-1.5 px-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      autoFeedInterval === interval
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {interval === 'off' ? 'Manual Only' : `Every ${interval}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Background Mode Trigger */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 space-y-2">
              <h4 className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Simulate App in Background (Phone Lock)</span>
              </h4>
              <p className="text-[10px] text-indigo-300">
                Minimizes Cyber Security Seva to the mobile lockscreen to test background push alerts.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onSimulateBackground(0);
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  Lock Screen Now
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSimulateBackground(5);
                  }}
                  className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Lock + Alert in 5s
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
          <button
            onClick={onTriggerTestPush}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Trigger Instant Push</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
