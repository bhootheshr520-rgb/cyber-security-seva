import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Sparkles,
  Calendar,
  Share2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Award,
  Zap,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Check,
  Snowflake,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  DAILY_SAFETY_TIPS,
  MILESTONE_BADGES,
  REINFORCEMENT_QUOTES,
  DailySafetyTip,
  MilestoneBadge,
  SafetyStreakState
} from '../data/safetyStreakData';
import { playStreakCelebrationChime, playMilestoneUnlockFanfare } from '../services/soundEffects';

interface SafetyStreakProps {
  onOpenSos?: () => void;
  onSelectVideoModule?: (moduleId: string) => void;
}

const STORAGE_KEY = 'cyber_safety_streak_v1';

// Helper to get formatted local date YYYY-MM-DD
const getLocalDateString = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const SafetyStreak: React.FC<SafetyStreakProps> = () => {
  const todayStr = getLocalDateString(0);
  const yesterdayStr = getLocalDateString(-1);

  // Initialize or load state
  const [streakState, setStreakState] = useState<SafetyStreakState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    // Default engaging initial state: 4-day streak, yesterday completed, today ready to complete
    const initialHistory: { [dateStr: string]: boolean } = {};
    initialHistory[getLocalDateString(-4)] = true;
    initialHistory[getLocalDateString(-3)] = true;
    initialHistory[getLocalDateString(-2)] = true;
    initialHistory[yesterdayStr] = true;

    return {
      currentStreak: 4,
      highestStreak: 6,
      totalTipsCompleted: 11,
      shieldXp: 350,
      lastCompletedDate: yesterdayStr,
      history: initialHistory,
      activeFreezes: 1,
      completedTipIds: ['tip-1', 'tip-2', 'tip-3', 'tip-4'],
      unlockedBadgeIds: ['bronze-sentinel']
    };
  });

  // Today's completion status
  const isCompletedToday = streakState.lastCompletedDate === todayStr;

  // Active tip index to view (default to current tip in sequence, modulo tips count)
  const [tipIndex, setTipIndex] = useState<number>(() => {
    return (streakState.currentStreak) % DAILY_SAFETY_TIPS.length;
  });

  // Confetti / Celebration feedback state
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Quick micro-booster question state
  const [boosterAnswered, setBoosterAnswered] = useState(false);
  const [boosterSelectedOption, setBoosterSelectedOption] = useState<number | null>(null);
  const [boosterCorrect, setBoosterCorrect] = useState<boolean | null>(null);

  // Save to localStorage whenever streakState changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(streakState));
    } catch {
      // Storage error fallback
    }
  }, [streakState]);

  const currentTip: DailySafetyTip = DAILY_SAFETY_TIPS[tipIndex % DAILY_SAFETY_TIPS.length];

  // Find next milestone
  const nextMilestone = MILESTONE_BADGES.find(
    (b) => b.requiredDays > streakState.currentStreak
  ) || MILESTONE_BADGES[MILESTONE_BADGES.length - 1];

  const daysToNextMilestone = Math.max(0, nextMilestone.requiredDays - streakState.currentStreak);

  // Current motivational quote
  const currentQuote = REINFORCEMENT_QUOTES.find(
    (q) => q.days === streakState.currentStreak
  ) || {
    days: streakState.currentStreak,
    quote: 'Consistent cyber vigilance is your strongest defense against digital extortion and UPI fraud.',
    author: 'I4C Citizen Shield'
  };

  // Generate 7-day habit track for the current week (from 6 days ago up to today)
  const weekDays = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const shortDate = d.getDate();
    const isToday = offset === 0;
    const isCompleted = isToday ? isCompletedToday : !!streakState.history[dateStr];
    return { offset, dateStr, dayLabel, shortDate, isToday, isCompleted };
  });

  // Action: Complete Today's Safety Tip / Daily Check-in
  const handleCompleteToday = () => {
    if (isCompletedToday) return;

    const newStreak = streakState.currentStreak + 1;
    const newHighest = Math.max(streakState.highestStreak, newStreak);
    const newCompletedCount = streakState.totalTipsCompleted + 1;
    const newXp = streakState.shieldXp + 50;

    const newHistory = { ...streakState.history, [todayStr]: true };
    const newCompletedTips = Array.from(new Set([...streakState.completedTipIds, currentTip.id]));

    // Check if new badges unlocked
    const newUnlockedBadges = [...streakState.unlockedBadgeIds];
    let justUnlockedBadgeName: string | null = null;
    MILESTONE_BADGES.forEach((badge) => {
      if (newStreak >= badge.requiredDays && !newUnlockedBadges.includes(badge.id)) {
        newUnlockedBadges.push(badge.id);
        justUnlockedBadgeName = badge.name;
      }
    });

    setStreakState({
      ...streakState,
      currentStreak: newStreak,
      highestStreak: newHighest,
      totalTipsCompleted: newCompletedCount,
      shieldXp: newXp,
      lastCompletedDate: todayStr,
      history: newHistory,
      completedTipIds: newCompletedTips,
      unlockedBadgeIds: newUnlockedBadges
    });

    // Positive reinforcement effects
    if (justUnlockedBadgeName) {
      playMilestoneUnlockFanfare();
      setCelebrationMessage(`🎉 MILESTONE UNLOCKED: ${justUnlockedBadgeName}!`);
    } else {
      playStreakCelebrationChime();
      setCelebrationMessage(`🔥 Streak Extended to ${newStreak} Days! +50 Shield XP Earned`);
    }

    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  };

  // Booster question handler
  const handleBoosterSubmit = (optionIdx: number) => {
    if (boosterAnswered) return;
    setBoosterSelectedOption(optionIdx);
    setBoosterAnswered(true);

    // Question: "You receive an SMS from your bank: 'Click bit.ly/kyc-alert to update PAN'. What should you do?"
    // Option 1: "Never click links; login only through official bank app or call official helpline" (Correct)
    if (optionIdx === 1) {
      setBoosterCorrect(true);
      playStreakCelebrationChime();
      setStreakState((prev) => ({ ...prev, shieldXp: prev.shieldXp + 25 }));
    } else {
      setBoosterCorrect(false);
    }
  };

  // Share streak achievement
  const handleShareStreak = () => {
    const text = `🛡️ I have an active ${streakState.currentStreak}-Day Cyber Safety Streak on Cyber Security Seva! Learning daily tips to protect my family against UPI frauds and cyber scams. #DigitalSuraksha #CyberSafetyStreak`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Simulator / Test Controls
  const handleSimulatePlusOne = () => {
    const newStreak = streakState.currentStreak + 1;
    playStreakCelebrationChime();
    setStreakState((prev) => ({
      ...prev,
      currentStreak: newStreak,
      highestStreak: Math.max(prev.highestStreak, newStreak),
      totalTipsCompleted: prev.totalTipsCompleted + 1,
      shieldXp: prev.shieldXp + 50,
      lastCompletedDate: todayStr
    }));
  };

  const handleResetForTesting = () => {
    const resetHistory: { [dateStr: string]: boolean } = {};
    resetHistory[yesterdayStr] = true;
    setStreakState({
      currentStreak: 3,
      highestStreak: 5,
      totalTipsCompleted: 8,
      shieldXp: 250,
      lastCompletedDate: yesterdayStr,
      history: resetHistory,
      activeFreezes: 1,
      completedTipIds: ['tip-1', 'tip-2'],
      unlockedBadgeIds: ['bronze-sentinel']
    });
    setBoosterAnswered(false);
    setBoosterSelectedOption(null);
    setBoosterCorrect(null);
  };

  return (
    <div className="space-y-4">
      {/* Celebration Banner when completed */}
      {showCelebration && celebrationMessage && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-4 rounded-2xl shadow-xl animate-bounce border border-amber-300">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0">
                🔥
              </div>
              <div>
                <h4 className="text-sm font-extrabold tracking-wide uppercase flex items-center gap-1.5">
                  <span>Great Job!</span>
                  <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
                </h4>
                <p className="text-xs font-semibold text-white/95 mt-0.5">{celebrationMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors"
            >
              Nice!
            </button>
          </div>
          {/* Decorative Sparks */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />
        </div>
      )}

      {/* Main Safety Streak Hero Card */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background glow highlights */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Streak Stats */}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              {/* Animated Flame Icon Container */}
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/25 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Flame className={`w-7 h-7 text-amber-400 ${streakState.currentStreak > 0 ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                {/* Flame level pill */}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-black uppercase text-slate-950 rounded-full shadow-sm">
                  Lvl {Math.min(5, Math.max(1, Math.floor(streakState.currentStreak / 3) + 1))}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Safety Streak</span>
                  </span>
                  {streakState.activeFreezes > 0 && (
                    <span className="px-2 py-0.5 bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-medium rounded-full flex items-center gap-1">
                      <Snowflake className="w-2.5 h-2.5" />
                      <span>{streakState.activeFreezes} Freeze Shield</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mt-0.5">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {streakState.currentStreak} <span className="text-base font-bold text-amber-400 font-sans">Days Active</span>
                  </h2>
                </div>
              </div>
            </div>

            {/* Shield XP & Badges Button */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Defense XP</span>
                <span className="text-xs font-black text-indigo-300 flex items-center gap-1 justify-end">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {streakState.shieldXp} XP
                </span>
              </div>

              <button
                onClick={() => setShowBadgesModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Badges ({streakState.unlockedBadgeIds.length})</span>
              </button>
            </div>
          </div>

          {/* Reinforcement Praise Quote */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-amber-400 text-base">“</span>
              <p className="italic text-[11px] sm:text-xs leading-snug">
                {currentQuote.quote}
              </p>
              <span className="text-amber-400 text-base">”</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 shrink-0 hidden sm:inline">
              — {currentQuote.author}
            </span>
          </div>

          {/* 7-Day Rolling Habit Calendar Track */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>7-Day Habit Tracker</span>
              </span>
              <span className="text-[11px] text-amber-400 font-bold">
                {isCompletedToday ? '✓ Done for Today' : '⚡ 1 Drill Pending Today'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weekDays.map((day) => (
                <div
                  key={day.dateStr}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    day.isToday
                      ? day.isCompleted
                        ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/20 border-amber-400/80 ring-2 ring-amber-400/30'
                        : 'bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-400/20 animate-pulse'
                      : day.isCompleted
                      ? 'bg-slate-800/90 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {day.dayLabel}
                  </span>
                  <div className="my-1">
                    {day.isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      </div>
                    ) : day.isToday ? (
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
                        <Flame className="w-3 h-3 text-amber-400 animate-bounce" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    {day.shortDate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Milestone Progress Bar */}
          <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{nextMilestone.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Next Goal: {nextMilestone.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {nextMilestone.requiredDays} Days
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {daysToNextMilestone === 0
                    ? 'Goal achieved! You earned this milestone title.'
                    : `${daysToNextMilestone} more ${daysToNextMilestone === 1 ? 'day' : 'days'} of practice to unlock`}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full sm:w-44">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((streakState.currentStreak / nextMilestone.requiredDays) * 100))}%`
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-1">
                <span>{streakState.currentStreak}d</span>
                <span>{nextMilestone.requiredDays}d</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Daily Cyber Security Drill Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                Daily Defense Drill #{currentTip.dayNumber}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {currentTip.title}
              </h3>
            </div>
          </div>

          {/* Cycle through tips */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTipIndex((prev) => (prev > 0 ? prev - 1 : DAILY_SAFETY_TIPS.length - 1))}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Previous Tip"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-500 px-1">
              {((tipIndex % DAILY_SAFETY_TIPS.length) + 1)}/{DAILY_SAFETY_TIPS.length}
            </span>
            <button
              onClick={() => setTipIndex((prev) => prev + 1)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Next Tip"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tip Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-800 border border-slate-200">
            {currentTip.category}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 font-semibold text-indigo-700 border border-indigo-100">
            ⏱ {currentTip.readTime}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Ref: {currentTip.officialRef}
          </span>
        </div>

        {/* The Golden Rule Callout */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-900 block mb-0.5">Core Rule to Memorize:</span>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                {currentTip.goldenRule}
              </p>
            </div>
          </div>
        </div>

        {/* Real Scenario Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Realistic Modus Operandi
            </span>
            <p className="text-slate-700 leading-relaxed">
              {currentTip.scenario}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Action Drill of the Day
            </span>
            <p className="text-emerald-900 leading-relaxed font-medium">
              {currentTip.actionDrill}
            </p>
          </div>
        </div>

        {/* Primary Daily Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {isCompletedToday ? (
            <div className="w-full flex-1 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Today's Safety Streak is Completed & Protected! (+50 XP)</span>
              </div>
              <button
                onClick={handleShareStreak}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Share2 className="w-3 h-3" />
                <span>{copiedShare ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleCompleteToday}
              className="w-full flex-1 py-3.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="w-5 h-5 fill-slate-950 animate-bounce" />
              <span>Mark As Practiced • Extend to Day {streakState.currentStreak + 1} (+50 XP)</span>
            </button>
          )}

          <button
            onClick={handleShareStreak}
            className="w-full sm:w-auto px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedShare ? 'Copied Streak Link!' : 'Share Streak'}</span>
          </button>
        </div>
      </section>

      {/* Daily Booster Micro-Knowledge Check (Quick Positive Reinforcement Quiz) */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Streak Booster Drill • +25 Bonus Shield XP
            </h4>
          </div>
          {boosterCorrect === true && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              Bonus Claimed (+25 XP)
            </span>
          )}
        </div>

        <p className="text-xs text-slate-800 font-medium">
          You receive an SMS alert: <span className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[11px]">"Urgent: SBI Account deactivated. Update PAN immediately via bit.ly/sbi-pan-update"</span>. What is your correct immediate response?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Click the link quickly to ensure debit card is not blocked', isCorrect: false },
            { label: 'Never click links in SMS; access only via official YONO app or bank branch', isCorrect: true },
            { label: 'Forward the message to family members to ask if their accounts are safe', isCorrect: false },
            { label: 'Call back the mobile number that sent the text message', isCorrect: false }
          ].map((opt, idx) => {
            const isSelected = boosterSelectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleBoosterSubmit(idx)}
                disabled={boosterAnswered}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${
                  boosterAnswered && opt.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                    : boosterAnswered && isSelected && !opt.isCorrect
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : isSelected
                    ? 'bg-slate-200 border-slate-900 text-slate-900 font-semibold'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-mono font-bold text-slate-500 text-[11px]">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-[11px] leading-snug">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {boosterAnswered && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            boosterCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
          }`}>
            <Info className="w-4 h-4 shrink-0" />
            <span>
              {boosterCorrect
                ? 'Correct! Indian banks never send shortened URL links (bit.ly/tinyurl) for KYC compliance.'
                : 'Incorrect. Legitimate banks NEVER send bit.ly links for KYC. Always open your official app directly.'}
            </span>
          </div>
        )}
      </section>

      {/* Simulator / Reviewer Controls (Collapsible helper to test streak progression) */}
      <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-slate-700">Streak Testing & Demo Tools:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulatePlusOne}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-800 transition-colors cursor-pointer"
          >
            +1 Day Sim
          </button>
          <button
            onClick={handleResetForTesting}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Milestone Badges Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Safety Streak Badges & Ranks
                </h3>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Earn official citizen safety badges and unlock recognition by maintaining a consistent daily streak of cyber hygiene.
            </p>

            <div className="space-y-3">
              {MILESTONE_BADGES.map((badge) => {
                const isUnlocked = streakState.unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isUnlocked
                        ? `bg-gradient-to-r ${badge.bgGradient} ${badge.borderColor} shadow-sm`
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{badge.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs font-bold ${isUnlocked ? badge.color : 'text-slate-700'}`}>
                              {badge.name}
                            </h4>
                            {isUnlocked ? (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">
                                Unlocked
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 bg-slate-200 text-slate-600 text-[9px] font-bold rounded-full">
                                {badge.requiredDays} Days Req.
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {badge.description}
                          </p>
                          <span className="text-[10px] font-bold text-indigo-700 block mt-1">
                            Reward: {badge.perk}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowBadgesModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close Badges
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
