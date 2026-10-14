import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  Trophy,
  Sparkles,
  Lock,
  ChevronRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  FileText,
  RotateCcw,
  Zap,
  Download,
  Share2,
  BookOpen
} from 'lucide-react';
import {
  CYBER_DEFENDER_BADGES,
  CyberDefenderBadge
} from '../data/cyberDefenderData';
import { CyberDefenderRewardModal } from './CyberDefenderRewardModal';
import { playMilestoneUnlockFanfare, playStreakCelebrationChime } from '../services/soundEffects';

interface CyberDefenderBadgesProps {
  onSelectModule?: (moduleId: string) => void;
  onJumpToStreak?: () => void;
}

const MODULES_STORAGE_KEY = 'cyber_completed_modules_v1';
const STREAK_STORAGE_KEY = 'cyber_safety_streak_v1';

export const CyberDefenderBadges: React.FC<CyberDefenderBadgesProps> = ({
  onSelectModule,
  onJumpToStreak
}) => {
  // Load completed modules
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(MODULES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Default initial state: user has completed 2 modules already (UPI rules & Digital arrest)
    return ['vid-upi-rules', 'vid-digital-arrest'];
  });

  // Load streak from safety streak storage
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentStreak || 4;
      }
    } catch {
      // Fallback
    }
    return 5; // Default engaging streak: 5 days (close to 7!)
  });

  const [selectedRewardBadge, setSelectedRewardBadge] = useState<CyberDefenderBadge | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [newlyUnlockedBadgeName, setNewlyUnlockedBadgeName] = useState<string | null>(null);

  // Sync completed modules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(completedModules));
    } catch {
      // Ignore
    }
  }, [completedModules]);

  // Listen to window storage events or check streak storage periodically
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
        if (savedStreak) {
          const parsed = JSON.parse(savedStreak);
          if (parsed.currentStreak !== undefined) {
            setStreakDays(parsed.currentStreak);
          }
        }
        const savedModules = localStorage.getItem(MODULES_STORAGE_KEY);
        if (savedModules) {
          setCompletedModules(JSON.parse(savedModules));
        }
      } catch {
        // Fallback
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom internal event when user completes module inside EducationalPrecautions
    const handleModuleCompletedEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ moduleId: string }>;
      if (customEvent.detail?.moduleId) {
        const modId = customEvent.detail.moduleId;
        setCompletedModules((prev) => {
          if (!prev.includes(modId)) {
            return [...prev, modId];
          }
          return prev;
        });
      }
    };
    window.addEventListener('cyber_module_completed' as any, handleModuleCompletedEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cyber_module_completed' as any, handleModuleCompletedEvent);
    };
  }, []);

  // Determine if a badge is earned
  const isBadgeEarned = (badge: CyberDefenderBadge): boolean => {
    if (badge.requirementType === 'module') {
      return !!badge.moduleId && completedModules.includes(badge.moduleId);
    }
    if (badge.requirementType === 'streak') {
      const req = badge.requiredStreakDays || 7;
      return streakDays >= req;
    }
    if (badge.requirementType === 'master') {
      const allModulesCompleted = CYBER_DEFENDER_BADGES
        .filter((b) => b.requirementType === 'module')
        .every((b) => b.moduleId && completedModules.includes(b.moduleId));
      return allModulesCompleted && streakDays >= 7;
    }
    return false;
  };

  const earnedBadgesCount = CYBER_DEFENDER_BADGES.filter(isBadgeEarned).length;
  const totalBadges = CYBER_DEFENDER_BADGES.length;
  const progressPercent = Math.round((earnedBadgesCount / totalBadges) * 100);

  // Compute Rank Title
  const getDefenderRank = () => {
    if (earnedBadgesCount >= 7) return { rank: 'Grand Master Cyber Defender', level: 'V', color: 'text-amber-400' };
    if (earnedBadgesCount >= 5) return { rank: 'Senior Cyber Sentinel', level: 'IV', color: 'text-purple-400' };
    if (earnedBadgesCount >= 3) return { rank: 'Advanced Cyber Defender', level: 'III', color: 'text-indigo-400' };
    if (earnedBadgesCount >= 1) return { rank: 'Apprentice Defender', level: 'II', color: 'text-blue-400' };
    return { rank: 'Recruit Citizen', level: 'I', color: 'text-slate-400' };
  };

  const rankInfo = getDefenderRank();

  // Filtered badges list
  const filteredBadges = CYBER_DEFENDER_BADGES.filter((badge) => {
    if (filterTier === 'all') return true;
    if (filterTier === 'earned') return isBadgeEarned(badge);
    if (filterTier === 'locked') return !isBadgeEarned(badge);
    return badge.tier.toLowerCase() === filterTier.toLowerCase();
  });

  // Quick module toggle action (for easy completion right from badge card)
  const handleToggleModuleCompletion = (moduleId: string) => {
    const isCompleted = completedModules.includes(moduleId);
    let nextList: string[];
    if (isCompleted) {
      nextList = completedModules.filter((id) => id !== moduleId);
    } else {
      nextList = [...completedModules, moduleId];
      playMilestoneUnlockFanfare();
      const badge = CYBER_DEFENDER_BADGES.find((b) => b.moduleId === moduleId);
      if (badge) {
        setNewlyUnlockedBadgeName(badge.title);
        setTimeout(() => setNewlyUnlockedBadgeName(null), 3500);
      }
    }
    setCompletedModules(nextList);
  };

  // Demo / Simulation Tools
  const handleSimulate7DayStreak = () => {
    const newStreak = 7;
    setStreakDays(newStreak);
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        STREAK_STORAGE_KEY,
        JSON.stringify({ ...parsed, currentStreak: newStreak, highestStreak: Math.max(parsed.highestStreak || 0, newStreak) })
      );
    } catch {
      // Fallback
    }
    playMilestoneUnlockFanfare();
    setNewlyUnlockedBadgeName('7-Day Suraksha Veteran');
    setTimeout(() => setNewlyUnlockedBadgeName(null), 3500);
  };

  const handleCompleteAllModules = () => {
    const allModIds = CYBER_DEFENDER_BADGES
      .map((b) => b.moduleId)
      .filter((id): id is string => Boolean(id));
    setCompletedModules(allModIds);
    playMilestoneUnlockFanfare();
    setNewlyUnlockedBadgeName('All Threat Modules Completed!');
    setTimeout(() => setNewlyUnlockedBadgeName(null), 3500);
  };

  const handleResetDemo = () => {
    setCompletedModules(['vid-upi-rules']);
    setStreakDays(5);
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        STREAK_STORAGE_KEY,
        JSON.stringify({ ...parsed, currentStreak: 5 })
      );
    } catch {
      // Fallback
    }
  };

  return (
    <section className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Newly Unlocked Celebration Toast */}
      {newlyUnlockedBadgeName && (
        <div className="p-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl text-slate-950 font-black text-xs flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>🎉 BADGE & DIGITAL REWARD EARNED: {newlyUnlockedBadgeName}!</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-white/30 px-2 py-0.5 rounded font-extrabold">
            Accredited
          </span>
        </div>
      )}

      {/* Header & Defender Rank Showcase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="uppercase tracking-wider">Cyber Defender Digital Rewards Program</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Cyber Defender Badges & Accreditation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Earn official digital rewards and verifiable citizen certificates by finishing threat-awareness modules or keeping your safety streak active for 7+ days.
          </p>
        </div>

        {/* Current Rank Badge Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
              🎖️
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Accreditation Level {rankInfo.level}
            </span>
            <span className={`text-xs font-black ${rankInfo.color} block`}>
              {rankInfo.rank}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {earnedBadgesCount}/{totalBadges} Badges Unlocked
            </span>
          </div>
        </div>
      </div>

      {/* Progress & 7-Day Streak Callout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Overall Completion Progress */}
        <div className="md:col-span-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Accreditation Progress</span>
            </span>
            <span className="font-mono text-amber-400 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{earnedBadgesCount} digital rewards claimed</span>
            <span>{totalBadges - earnedBadgesCount} more to master</span>
          </div>
        </div>

        {/* 7+ Day Streak Requirement Tracker */}
        <div className="md:col-span-6 p-4 rounded-xl bg-slate-950/60 border border-orange-500/30 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="font-bold text-orange-300">7-Day Streak Reward Status</span>
            </div>
            {streakDays >= 7 ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold">
                ✓ Unlocked (Streak: {streakDays}d)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-orange-950 border border-orange-800 text-orange-300 text-[10px] font-bold">
                {streakDays}/7 Days Active
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            {streakDays >= 7
              ? 'Congratulations! You unlocked the 7-Day Suraksha Veteran digital certificate.'
              : `Maintain daily cyber vigilance for ${7 - streakDays} more consecutive ${7 - streakDays === 1 ? 'day' : 'days'} to claim the accredited 7-Day Certificate.`}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => (
                <div
                  key={dayNum}
                  className={`w-5 h-5 rounded-md text-[9px] font-mono flex items-center justify-center font-bold ${
                    streakDays >= dayNum
                      ? 'bg-orange-500/20 border border-orange-400 text-orange-300'
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}
                >
                  {streakDays >= dayNum ? '✓' : dayNum}
                </div>
              ))}
            </div>

            {onJumpToStreak && streakDays < 7 && (
              <button
                onClick={onJumpToStreak}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Practice Today's Drill →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Rewards' },
            { id: 'earned', label: `Earned (${earnedBadgesCount})` },
            { id: 'locked', label: `In Progress (${totalBadges - earnedBadgesCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTier(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterTier === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Demo simulator controls */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-500 hidden sm:inline">Demo Tools:</span>
          <button
            onClick={handleSimulate7DayStreak}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-amber-300 font-semibold cursor-pointer"
            title="Simulate 7+ Day Streak to unlock the 7-Day badge"
          >
            ⚡ Sim 7d Streak
          </button>
          <button
            onClick={handleCompleteAllModules}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-indigo-300 font-semibold cursor-pointer"
            title="Complete all modules to unlock Grand Master"
          >
            ⚡ Complete All
          </button>
          <button
            onClick={handleResetDemo}
            className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            title="Reset demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Badges Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBadges.map((badge) => {
          const earned = isBadgeEarned(badge);

          return (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between relative overflow-hidden ${
                earned
                  ? `bg-gradient-to-br ${badge.bgGradient} ${badge.borderAccent} shadow-lg shadow-black/40`
                  : 'bg-slate-950/40 border-slate-800 opacity-75 hover:opacity-95'
              }`}
            >
              <div>
                {/* Top Badge Card Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl p-0.5 shadow-md flex items-center justify-center shrink-0 ${
                      earned ? 'bg-gradient-to-br from-amber-400 to-indigo-500' : 'bg-slate-800'
                    }`}>
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                        {badge.icon}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          {badge.codeName}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                          badge.tier === 'Master' ? 'bg-indigo-950 text-indigo-300 border border-indigo-700' :
                          badge.tier === 'Diamond' ? 'bg-orange-950 text-orange-300 border border-orange-700' :
                          badge.tier === 'Gold' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {badge.tier}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-white leading-tight mt-0.5">
                        {badge.title}
                      </h3>
                    </div>
                  </div>

                  {earned ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Earned</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-medium flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Threat Category & Description */}
                <div className="space-y-1.5 my-2">
                  <span className="text-[10px] font-semibold text-indigo-300 block">
                    Domain: {badge.threatCategory}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Digital Reward Perk Preview */}
                <div className="my-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Digital Reward Included:</span>
                    <span className="font-bold text-amber-400">{badge.digitalReward.rewardType}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">
                    {badge.digitalReward.rewardTitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 mt-2">
                {earned ? (
                  <button
                    onClick={() => setSelectedRewardBadge(badge)}
                    className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 fill-slate-950" />
                    <span>View Digital Reward & Certificate</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    {badge.requirementType === 'module' && badge.moduleId ? (
                      <>
                        <button
                          onClick={() => {
                            if (badge.moduleId && onSelectModule) {
                              onSelectModule(badge.moduleId);
                            }
                          }}
                          className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Start Module</span>
                        </button>
                        <button
                          onClick={() => badge.moduleId && handleToggleModuleCompletion(badge.moduleId)}
                          className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                          title="Quick mark module as completed"
                        >
                          Mark Done
                        </button>
                      </>
                    ) : badge.requirementType === 'streak' ? (
                      <button
                        onClick={onJumpToStreak}
                        className="w-full py-1.5 px-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Flame className="w-3 h-3" />
                        <span>Build Streak ({streakDays}/7 Days)</span>
                      </button>
                    ) : (
                      <div className="w-full text-center py-1 text-[10px] text-slate-400 font-mono">
                        Finish all 5 modules + 7d streak to unlock
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reward & Certificate Modal */}
      {selectedRewardBadge && (
        <CyberDefenderRewardModal
          badge={selectedRewardBadge}
          isOpen={Boolean(selectedRewardBadge)}
          onClose={() => setSelectedRewardBadge(null)}
          streakDays={streakDays}
        />
      )}
    </section>
  );
};
