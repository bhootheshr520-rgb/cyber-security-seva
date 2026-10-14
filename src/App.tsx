import React, { useState, useEffect } from 'react';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PostFraudCare } from './components/PostFraudCare';
import { ScamDatabase } from './components/ScamDatabase';
import { ThreatAlerts } from './components/ThreatAlerts';
import { EducationalPrecautions } from './components/EducationalPrecautions';
import { LegalFIRGuide } from './components/LegalFIRGuide';
import { SosModal } from './components/SosModal';
import { EvidenceLockerModal, EvidenceRecord } from './components/EvidenceLockerModal';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { HeadsUpNotificationBanner } from './components/HeadsUpNotificationBanner';
import { LockscreenSimulation } from './components/LockscreenSimulation';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { ThreatAdvisoryDetailModal } from './components/ThreatAdvisoryDetailModal';
import { ThreatMitigationPlan } from './components/ThreatMitigationPlan';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OfflineEmergencyModal } from './components/OfflineEmergencyModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { usePushNotifications } from './hooks/usePushNotifications';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { offlineStorageService } from './services/offlineStorageService';
import { ScamPattern } from './data/scamsData';
import { ThreatAlert } from './data/threatAlertsData';
import { PushAdvisory } from './data/pushNotificationsData';
import { Smartphone, Maximize2, Sparkles, Bell, WifiOff, HardDrive, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'post-fraud' | 'scams' | 'alerts' | 'education' | 'legal'>('post-fraud');
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [selectedEvidenceForFir, setSelectedEvidenceForFir] = useState<EvidenceRecord | null>(null);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);

  // Offline SOS & Legal Guidelines Hub State
  const [isOfflineHubOpen, setIsOfflineHubOpen] = useState(false);
  const [offlineHubTab, setOfflineHubTab] = useState<'sos' | 'legal' | 'generator' | 'storage'>('sos');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Interactive Threat Mitigation Plan State
  const [isMitigationPlanOpen, setIsMitigationPlanOpen] = useState(false);
  const [mitigationPlanScam, setMitigationPlanScam] = useState<ScamPattern | null>(null);
  const [mitigationPlanAlert, setMitigationPlanAlert] = useState<ThreatAlert | null>(null);
  const [mitigationPlanAdvisory, setMitigationPlanAdvisory] = useState<PushAdvisory | null>(null);
  const [mitigationPlanScenario, setMitigationPlanScenario] = useState<string | null>(null);

  const { isOnline } = useOnlineStatus();
  const effectiveOffline = !isOnline || isSimulatedOffline;

  // Initialize offline cache on startup
  useEffect(() => {
    offlineStorageService.ensureCacheInitialized();
  }, []);

  // Push Notifications System Hook
  const {
    notifications,
    isAppBackgrounded,
    activeHeadsUp,
    selectedAdvisory,
    isNotificationCenterOpen,
    soundEnabled,
    browserPermission,
    autoFeedInterval,
    scheduledSecondsRemaining,
    setIsNotificationCenterOpen,
    setSelectedAdvisory,
    setActiveHeadsUp,
    setSoundEnabled,
    setAutoFeedInterval,
    triggerPushNotification,
    scheduleBackgroundPush,
    simulateBackground,
    returnToApp,
    markAllAsRead,
    clearAll,
    handleOpenAdvisory,
    requestBrowserPermission,
  } = usePushNotifications();

  const handlePopulateFir = (record: EvidenceRecord) => {
    setSelectedEvidenceForFir(record);
    setActiveTab('legal');
  };

  const handleOpenMitigationPlan = (options?: {
    scam?: ScamPattern | null;
    alert?: ThreatAlert | null;
    advisory?: PushAdvisory | null;
    scenario?: string | null;
  }) => {
    setMitigationPlanScam(options?.scam || null);
    setMitigationPlanAlert(options?.alert || null);
    setMitigationPlanAdvisory(options?.advisory || null);
    setMitigationPlanScenario(options?.scenario || null);
    setIsMitigationPlanOpen(true);
  };

  const tabTitles = {
    'post-fraud': 'Emergency Relief & Reassurance',
    'scams': 'Scam Patterns & AI Inspector',
    'alerts': 'Live Threat Advisories',
    'education': 'Video Modules & Safety Tips',
    'legal': 'Police Complaint & FIR Guide',
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Desktop Device Frame Switcher Bar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-2 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-rose-400" />
          <span>Mobile App Mode</span>
          {effectiveOffline && (
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">
              <WifiOff className="w-2.5 h-2.5" />
              Offline
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenMitigationPlan()}
            className="hover:text-white transition-colors flex items-center gap-1 text-[11px] bg-slate-800/90 text-rose-300 hover:bg-slate-700 px-2 py-0.5 rounded cursor-pointer border border-rose-500/30"
            title="Open Step-by-Step Threat Mitigation Checklist"
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Mitigation Plan</span>
          </button>
          <button
            onClick={() => {
              setOfflineHubTab('sos');
              setIsOfflineHubOpen(true);
            }}
            className="hover:text-white transition-colors flex items-center gap-1 text-[11px] bg-slate-800/90 text-amber-300 hover:bg-slate-700 px-2 py-0.5 rounded cursor-pointer border border-amber-500/30"
            title="Open Offline Emergency SOS & Legal Hub (Zero internet needed)"
          >
            <HardDrive className="w-3 h-3 text-amber-400" />
            <span>Offline Kit</span>
          </button>
          <PWAInstallButton variant="compact" />
          <button
            onClick={() => setShowDeviceFrame(!showDeviceFrame)}
            className="hover:text-white transition-colors flex items-center gap-1 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded cursor-pointer"
          >
            <Maximize2 className="w-3 h-3" />
            <span>{showDeviceFrame ? 'Full Width' : 'Device Bezel'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Smartphone Frame Container */}
      <div
        className={`w-full bg-slate-50 flex flex-col overflow-hidden relative shadow-2xl transition-all ${
          showDeviceFrame
            ? 'sm:max-w-[430px] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-white/10'
            : 'max-w-md min-h-screen'
        }`}
      >
        {/* Dynamic Island Notch (Phone Mockup) */}
        {showDeviceFrame && (
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2 border border-slate-800" />
            <div className="w-2 h-2 rounded-full bg-slate-900" />
          </div>
        )}

        {isAppBackgrounded ? (
          /* Phone in Background / Lock Screen Mode */
          <LockscreenSimulation
            notifications={notifications}
            onOpenAdvisory={handleOpenAdvisory}
            onReturnToApp={() => returnToApp()}
            onTriggerTestPush={triggerPushNotification}
            onScheduleBackgroundPush={scheduleBackgroundPush}
            scheduledSecondsRemaining={scheduledSecondsRemaining}
            onOpenSos={() => setIsSosOpen(true)}
          />
        ) : (
          /* Foreground Mobile App Experience */
          <>
            {/* Heads-Up Notification Banner (Drops from Notch) */}
            <HeadsUpNotificationBanner
              advisory={activeHeadsUp}
              onOpenAdvisory={handleOpenAdvisory}
              onDismiss={() => setActiveHeadsUp(null)}
            />

            {/* Native Mobile App Header */}
            <MobileHeader
              onOpenSos={() => setIsSosOpen(true)}
              onOpenGemini={() => setIsGeminiOpen(true)}
              onOpenNotifications={() => setIsNotificationCenterOpen(true)}
              onSimulateBackground={() => simulateBackground(5)}
              onOpenOfflineHub={() => {
                setOfflineHubTab('sos');
                setIsOfflineHubOpen(true);
              }}
              isOffline={effectiveOffline}
              unreadNotificationsCount={notifications.filter(n => !n.read).length}
              activeTabTitle={tabTitles[activeTab]}
            />

            {/* Scrollable Mobile App Body */}
            <main className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 overscroll-contain">
              {activeTab === 'post-fraud' && (
                <PostFraudCare
                  onOpenSos={() => setIsSosOpen(true)}
                  onOpenEvidenceLocker={() => setIsEvidenceOpen(true)}
                  onGoToLegal={() => setActiveTab('legal')}
                  onOpenGemini={() => setIsGeminiOpen(true)}
                  onOpenMitigationPlan={(scenario) => handleOpenMitigationPlan({ scenario })}
                />
              )}

              {activeTab === 'scams' && (
                <ScamDatabase
                  onOpenSos={() => setIsSosOpen(true)}
                  onGoToPostFraud={() => setActiveTab('post-fraud')}
                  onGoToLegal={() => setActiveTab('legal')}
                  onOpenMitigationPlan={(scam) => handleOpenMitigationPlan({ scam })}
                />
              )}

              {activeTab === 'alerts' && (
                <ThreatAlerts
                  onOpenSos={() => setIsSosOpen(true)}
                  onOpenNotifications={() => setIsNotificationCenterOpen(true)}
                  onSimulateBackground={(secs) => simulateBackground(secs || 5)}
                  onTriggerTestPush={triggerPushNotification}
                  onOpenMitigationPlan={(alert) => handleOpenMitigationPlan({ alert })}
                />
              )}

              {activeTab === 'education' && (
                <EducationalPrecautions
                  onOpenSos={() => setIsSosOpen(true)}
                  onOpenMitigationPlan={(scenario) => handleOpenMitigationPlan({ scenario })}
                />
              )}

              {activeTab === 'legal' && (
                <LegalFIRGuide
                  initialEvidence={selectedEvidenceForFir}
                  onOpenSos={() => setIsSosOpen(true)}
                  onOpenOfflineHub={() => {
                    setOfflineHubTab('legal');
                    setIsOfflineHubOpen(true);
                  }}
                />
              )}
            </main>

            {/* Floating Dynamic Gemini AI Quick Triage Trigger */}
            <div className="absolute bottom-16 right-3.5 z-30 pointer-events-auto">
              <button
                onClick={() => setIsGeminiOpen(true)}
                className="px-3.5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs shadow-xl shadow-indigo-950/50 flex items-center gap-1.5 transition-all cursor-pointer border border-white/20 animate-in fade-in"
                title="Ask Dynamic Gemini AI"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin [animation-duration:4s]" />
                <span>Ask Gemini AI</span>
              </button>
            </div>

            {/* Native Mobile Bottom Navigation Bar */}
            <MobileBottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </>
        )}

        {/* Slide-Up Mobile SOS Bottom Sheet */}
        <SosModal
          isOpen={isSosOpen}
          onClose={() => setIsSosOpen(false)}
          onOpenEvidenceLocker={() => setIsEvidenceOpen(true)}
          onGoToPostFraud={() => {
            setIsSosOpen(false);
            setActiveTab('post-fraud');
          }}
          onOpenOfflineHub={() => {
            setIsSosOpen(false);
            setOfflineHubTab('sos');
            setIsOfflineHubOpen(true);
          }}
        />

        {/* Slide-Up Mobile Evidence Locker Bottom Sheet */}
        <EvidenceLockerModal
          isOpen={isEvidenceOpen}
          onClose={() => setIsEvidenceOpen(false)}
          onPopulateFir={handlePopulateFir}
        />

        {/* Slide-Up Dynamic Gemini AI Assistant Sheet */}
        <GeminiAssistantModal
          isOpen={isGeminiOpen}
          onClose={() => setIsGeminiOpen(false)}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenEvidence={() => setIsEvidenceOpen(true)}
          onGoToLegal={() => setActiveTab('legal')}
        />

        {/* Notification Center Tray Bottom Sheet */}
        <NotificationCenterModal
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          notifications={notifications}
          onOpenAdvisory={handleOpenAdvisory}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearAll}
          onTriggerTestPush={triggerPushNotification}
          onSimulateBackground={(secs) => simulateBackground(secs !== undefined ? secs : 5)}
          onRequestBrowserPermission={requestBrowserPermission}
          browserPermission={browserPermission}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          autoFeedInterval={autoFeedInterval}
          onChangeAutoFeed={setAutoFeedInterval}
        />

        {/* Detailed Threat Advisory Deep-Dive Modal */}
        <ThreatAdvisoryDetailModal
          advisory={selectedAdvisory}
          onClose={() => setSelectedAdvisory(null)}
          onOpenSos={() => setIsSosOpen(true)}
          onGoToLegal={() => {
            setSelectedAdvisory(null);
            setActiveTab('legal');
          }}
          onGoToEvidenceLocker={() => {
            setSelectedAdvisory(null);
            setIsEvidenceOpen(true);
          }}
          onOpenMitigationPlan={(advisory) => handleOpenMitigationPlan({ advisory })}
        />

        {/* Offline Connectivity Status Indicator Bar */}
        <OfflineIndicator
          onOpenOfflineHub={() => {
            setOfflineHubTab('sos');
            setIsOfflineHubOpen(true);
          }}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
        />

        {/* Dedicated Offline Emergency SOS & Legal Hub Modal */}
        <OfflineEmergencyModal
          isOpen={isOfflineHubOpen}
          onClose={() => setIsOfflineHubOpen(false)}
          defaultTab={offlineHubTab}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
        />

        {/* Interactive Step-by-Step Threat Mitigation Plan Modal */}
        <ThreatMitigationPlan
          isOpen={isMitigationPlanOpen}
          onClose={() => setIsMitigationPlanOpen(false)}
          initialScam={mitigationPlanScam}
          initialAlert={mitigationPlanAlert}
          initialAdvisory={mitigationPlanAdvisory}
          initialScenario={mitigationPlanScenario}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenEvidenceLocker={() => setIsEvidenceOpen(true)}
          onGoToLegal={() => {
            setIsMitigationPlanOpen(false);
            setActiveTab('legal');
          }}
        />
      </div>
    </div>
  );
}
