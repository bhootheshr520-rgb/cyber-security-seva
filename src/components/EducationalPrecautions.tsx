import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Smartphone, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Award,
  Sparkles,
  Trophy,
  Check,
  Video,
  Flame,
  Globe,
  Radio,
  Share2,
  FileText,
  GitFork
} from 'lucide-react';
import { VIDEO_MODULES, VideoModule } from '../data/educationalVideosData';
import { SafetyStreak } from './SafetyStreak';
import { CyberDefenderBadges } from './CyberDefenderBadges';
import { CyberDefenderRewardModal } from './CyberDefenderRewardModal';
import { FraudDecisionFlowchart } from './FraudDecisionFlowchart';
import { CYBER_DEFENDER_BADGES, CyberDefenderBadge } from '../data/cyberDefenderData';
import { playMilestoneUnlockFanfare, playStreakCelebrationChime } from '../services/soundEffects';

interface EducationalPrecautionsProps {
  onOpenSos: () => void;
  onOpenMitigationPlan?: (scenarioId?: string) => void;
}

export const EducationalPrecautions: React.FC<EducationalPrecautionsProps> = ({ 
  onOpenSos,
  onOpenMitigationPlan 
}) => {
  const [selectedModule, setSelectedModule] = useState<VideoModule>(VIDEO_MODULES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [recommendedCategoryFilter, setRecommendedCategoryFilter] = useState<string>('All');
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  // References for smooth navigation between badges, flowcharts and video modules
  const streakRef = useRef<HTMLDivElement>(null);
  const simulationPlayerRef = useRef<HTMLDivElement>(null);
  const recommendedSectionRef = useRef<HTMLDivElement>(null);
  const flowchartRef = useRef<HTMLDivElement>(null);

  // Track completed threat-awareness modules
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cyber_completed_modules_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return ['vid-upi-rules', 'vid-digital-arrest'];
  });

  const [activeRewardModalBadge, setActiveRewardModalBadge] = useState<CyberDefenderBadge | null>(null);

  const isCurrentModuleCompleted = completedModules.includes(selectedModule.id);
  const currentModuleBadge = CYBER_DEFENDER_BADGES.find((b) => b.moduleId === selectedModule.id);

  const handleCompleteCurrentModule = () => {
    if (!isCurrentModuleCompleted) {
      const nextList = [...completedModules, selectedModule.id];
      setCompletedModules(nextList);
      try {
        localStorage.setItem('cyber_completed_modules_v1', JSON.stringify(nextList));
      } catch {
        // Fallback
      }
      window.dispatchEvent(new CustomEvent('cyber_module_completed', { detail: { moduleId: selectedModule.id } }));
      playMilestoneUnlockFanfare();
    }
  };

  const handleSelectModule = (mod: VideoModule) => {
    setSelectedModule(mod);
    setCurrentStepIndex(0);
    simulationPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectModuleFromBadge = (moduleId: string) => {
    const mod = VIDEO_MODULES.find((m) => m.id === moduleId);
    if (mod) {
      handleSelectModule(mod);
    }
  };

  const handleJumpToStreak = () => {
    streakRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleJumpToFlowcharts = () => {
    flowchartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopyShare = (mod: VideoModule) => {
    const shareText = `Cyber Defense Awareness Video: "${mod.title}"\nDuration: ${mod.duration} | Category: ${mod.category}\nKey Takeaway: ${mod.keyTakeaways[0]}\nLearn official countermeasures in Cyber Crime Emergency Hub.`;
    navigator.clipboard.writeText(shareText);
    setCopiedShareId(mod.id);
    playStreakCelebrationChime();
    setTimeout(() => setCopiedShareId(null), 2500);
  };

  // Micro-Quiz: "Spot the Red Flag" Challenge State
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestions = [
    {
      id: 'quiz-upi',
      prompt: 'A buyer on OLX sends a screenshot showing ₹15,000 sent and sends you a QR code: "Scan in Google Pay and enter UPI PIN to receive money into your account." What is the reality?',
      options: [
        'You must enter your UPI PIN to authenticate the incoming deposit.',
        'Entering your UPI PIN will DEDUCT ₹15,000 from your account; receiving money never requires a PIN.',
        'Scanning a QR code is mandatory for merchant-to-person bank transfers in India.'
      ],
      correctIndex: 1,
      explanation: 'Under UPI protocols governed by NPCI, entering your UPI PIN authorizes an outgoing debit. You NEVER enter a PIN to receive funds.'
    },
    {
      id: 'quiz-ai-voice',
      prompt: 'You receive a frantic call sounding identical to your child crying that they were arrested in a car accident and demanding ₹1,50,000 immediately to settle. What is the safest immediate action?',
      options: [
        'Transfer the money immediately to prevent an FIR from being registered.',
        'Ask your secret Family Safe Word, hang up, and call their regular phone number or workplace directly.',
        'Send a partial payment of ₹50,000 while asking the caller for photo proof.'
      ],
      correctIndex: 1,
      explanation: 'Generative AI can clone voices in 3 seconds from social media audio. A family safe word and independent direct callback instantly unmask the deception.'
    },
    {
      id: 'quiz-electricity',
      prompt: 'An SMS from VM-POWEROFC warns your electricity will be disconnected at 9:30 PM tonight and instructs calling a 10-digit mobile number. What should you do?',
      options: [
        'Call the mobile number and download the support app the officer suggests.',
        'Ignore the personal number. State Discoms never disconnect power at night without statutory notices, and check only on the official portal.',
        'Transfer ₹10 to test your connection status on the link provided.'
      ],
      correctIndex: 1,
      explanation: 'Official Discoms never send personal phone numbers or disconnect power at night. The ₹10 test recharge installs remote access trojans.'
    },
    {
      id: 'quiz-trading',
      prompt: 'A WhatsApp VIP investment group promises 500% gains on institutional pre-IPO shares, and the app balance shows ₹10 Lakhs. To withdraw, they ask for a 20% "TDS Clearance Fee". What is the truth?',
      options: [
        'Pay the 20% clearance fee so the platform can release your profits to your bank.',
        'The profits are 100% fabricated numbers on an unverified app. Paying any fee will result in total loss.',
        'Wait 24 hours for the withdrawal to automatically process without fees.'
      ],
      correctIndex: 1,
      explanation: 'SEBI-registered brokers never demand separate cash transfers to withdraw earnings. The app display is completely synthetic.'
    }
  ];

  const currentQuiz = quizQuestions[quizQuestionIndex];

  const step = selectedModule.videoStoryboard[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < selectedModule.videoStoryboard.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCurrentStepIndex(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Filtered module list for the top carousel
  const categoriesList = ['All', 'Banking & UPI', 'Identity & Calls', 'Remote Apps & APKs', 'Blackmail Protection', 'Phishing & Fake Sites'];

  const filteredModules = useMemo(() => {
    if (selectedCategoryFilter === 'All') return VIDEO_MODULES;
    return VIDEO_MODULES.filter((m) => m.category === selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  // Curated recommended video modules
  const recommendedModules = useMemo(() => {
    const recommendedIds = [
      'vid-ai-voice-cloning',
      'vid-electricity-bill-fraud',
      'vid-investment-trading-scam',
      'vid-task-telegram-scam',
      'vid-digital-arrest',
      'vid-upi-rules'
    ];
    let list = VIDEO_MODULES.filter((m) => recommendedIds.includes(m.id));
    if (recommendedCategoryFilter !== 'All') {
      list = list.filter((m) => m.category === recommendedCategoryFilter);
    }
    return list;
  }, [recommendedCategoryFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Interactive Cyber Defense Academy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Precautions, Video Walkthroughs &amp; Decision Trees
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Step-by-step visual simulations showing how attackers craft deceptive screens, paired with D3 interactive decision flowcharts to triage any active cyber incident.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={handleJumpToFlowcharts}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <GitFork className="w-3.5 h-3.5 text-indigo-600" />
              <span>D3 Decision Flowcharts</span>
            </button>
            <button
              onClick={handleJumpToStreak}
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Safety Streak</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills for Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-3 border-t border-slate-100 text-xs">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategoryFilter === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Module Selector Horizontal Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mt-3">
          {filteredModules.map((mod) => {
            const isCompleted = completedModules.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`min-w-[210px] max-w-[230px] shrink-0 p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  selectedModule.id === mod.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={selectedModule.id === mod.id ? 'text-indigo-300 font-semibold' : 'text-slate-500'}>
                    {mod.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {isCompleted && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Completed" />
                    )}
                    <span className="font-mono text-[9px]">{mod.duration}</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold leading-snug line-clamp-2">{mod.title}</h3>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className={`px-1.5 py-0.2 rounded font-bold ${
                    selectedModule.id === mod.id ? 'bg-white/10 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {mod.badge}
                  </span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                    Play <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Safety Streak & Daily Cyber Hygiene Habit Tracker */}
      <div ref={streakRef}>
        <SafetyStreak onOpenSos={onOpenSos} />
      </div>

      {/* Cyber Defender Badges & Digital Rewards Showcase */}
      <CyberDefenderBadges
        onSelectModule={handleSelectModuleFromBadge}
        onJumpToStreak={handleJumpToStreak}
      />

      {/* Interactive Video Storyboard / Simulation Player */}
      <section ref={simulationPlayerRef} className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        {/* Top Player Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              {currentStepIndex + 1}/{selectedModule.videoStoryboard.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold">
                  {selectedModule.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedModule.duration}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                {selectedModule.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Previous Scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextStep}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Next Scene"
            >
              <span>{currentStepIndex === selectedModule.videoStoryboard.length - 1 ? 'Replay' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Stage Simulation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px]">
          {/* Left Column: Script Narrative & Explanation */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-xs font-semibold mb-3">
                <span>Phase {step.stepNumber}: {step.title}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-3">
                {step.description}
              </p>
            </div>

            {step.warningCallout && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-100 block mb-0.5">Tactical Alert</span>
                  <span>{step.warningCallout}</span>
                </div>
              </div>
            )}

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5 pt-4 border-t border-slate-800">
              {selectedModule.videoStoryboard.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentStepIndex === i ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Mobile Device Simulation Frame */}
          <div className="lg:col-span-5 bg-slate-950 p-6 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="w-full max-w-[280px] bg-slate-900 rounded-[28px] border-[6px] border-slate-800 p-4 shadow-2xl space-y-3 relative overflow-hidden">
              {/* Dynamic Island Notch */}
              <div className="w-16 h-3 bg-black rounded-full mx-auto" />

              {/* Simulated Screen UI */}
              <div className="bg-slate-950 rounded-xl p-3 text-xs space-y-2.5 border border-slate-800 min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                    <span className="font-mono uppercase">{step.screenSimulation.type} SIMULATION</span>
                    <span className="text-rose-400 font-bold">UNVERIFIED</span>
                  </div>

                  <div className="mt-2 text-slate-200 font-bold text-xs truncate">
                    {step.screenSimulation.senderOrTitle}
                  </div>

                  <p className="mt-1.5 text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    {step.screenSimulation.body}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="p-2 bg-rose-950/80 border border-rose-800/80 rounded-lg text-center text-[10px] font-bold text-rose-300">
                    {step.screenSimulation.actionText}
                  </div>
                </div>
              </div>

              {/* Virtual Home Bar */}
              <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto" />
            </div>
          </div>
        </div>

        {/* Player Bottom Key Takeaways & Completion */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mastering this module defends against known modus operandi.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyShare(selectedModule)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedShareId === selectedModule.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShareId === selectedModule.id ? 'Copied Briefing!' : 'Share Awareness'}</span>
            </button>

            {isCurrentModuleCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Module Completed (+100 XP)</span>
              </span>
            ) : (
              <button
                onClick={handleCompleteCurrentModule}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Complete Module &amp; Earn Badge (+100 XP)</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* D3 Interactive Decision Flowcharts for Common Cyber Fraud Scenarios */}
      <div ref={flowchartRef}>
        <FraudDecisionFlowchart
          onOpenSos={onOpenSos}
          onOpenMitigationPlan={onOpenMitigationPlan}
        />
      </div>

      {/* CURATED SECTION: RECOMMENDED VIDEOS FOR YOU */}
      <section ref={recommendedSectionRef} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 mb-1">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Trending &amp; Critical Threat Briefings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recommended Video Walkthroughs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Essential simulations designed to recognize covert manipulation in AI voice cloning, Discom power cut SMS, fake pre-IPO trading apps, and part-time tasks.
            </p>
          </div>

          <span className="shrink-0 px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200">
            {recommendedModules.length} Curated Briefings
          </span>
        </div>

        {/* Filter Tabs for Recommended Videos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-xs">
          {['All', 'Identity & Calls', 'Remote Apps & APKs', 'Banking & UPI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setRecommendedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                recommendedCategoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Recommended' : cat}
            </button>
          ))}
        </div>

        {/* Recommended Videos Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedModules.map((mod) => {
            const isCompleted = completedModules.includes(mod.id);
            const isSelected = selectedModule.id === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  {/* Thumbnail / Header Simulation Banner */}
                  <div className="relative w-full h-28 rounded-xl bg-slate-900 p-3 overflow-hidden flex flex-col justify-between text-white mb-3 group-hover:scale-[1.01] transition-transform">
                    <div className="flex items-center justify-between z-10">
                      <span className="px-2 py-0.5 rounded bg-rose-600/90 text-white font-bold text-[10px] uppercase tracking-wider">
                        {mod.badge}
                      </span>
                      <span className="font-mono text-[10px] text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                        {mod.duration}
                      </span>
                    </div>

                    {/* Central Play Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-indigo-600 transition-all shadow-lg">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>

                    <div className="z-10 text-[10px] text-slate-300 font-mono flex items-center gap-1">
                      <Video className="w-3 h-3 text-indigo-400" />
                      <span>{mod.videoStoryboard.length} Interactive Scenes</span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="text-[11px] font-semibold text-indigo-600 mb-1">
                    {mod.category}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Key Takeaway Highlight */}
                  <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{mod.keyTakeaways[0]}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">
                      +100 XP Available
                    </span>
                  )}

                  <span className="text-indigo-600 font-bold flex items-center gap-1 text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>Watch Simulation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Micro-Quiz Challenge */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Interactive Knowledge Check · Drill {quizQuestionIndex + 1} of {quizQuestions.length}</span>
          </div>
          <span className="text-[11px] font-bold text-indigo-600">
            Test Your Awareness
          </span>
        </div>
        <h2 className="text-base font-bold text-slate-900">
          Spot the Red Flag Challenge
        </h2>

        <div className="mt-3 space-y-3">
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {currentQuiz.prompt}
          </p>

          <div className="space-y-2">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = quizAnswer === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setQuizAnswer(idx);
                    setQuizSubmitted(true);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                    quizSubmitted && idx === currentQuiz.correctIndex
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                      : quizSubmitted && isSelected && idx !== currentQuiz.correctIndex
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                      : isSelected
                      ? 'bg-slate-100 border-slate-900 text-slate-900 font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-mono font-bold text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="space-y-3 pt-1">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                <span className="font-bold text-blue-950 block mb-0.5">Official Protocol Rule:</span>
                <span>{currentQuiz.explanation}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  {quizAnswer === currentQuiz.correctIndex ? '🎉 Correct Answer!' : '⚠️ Review the protocol above.'}
                </span>
                <button
                  onClick={() => {
                    setQuizQuestionIndex((prev) => (prev + 1) % quizQuestions.length);
                    setQuizAnswer(null);
                    setQuizSubmitted(false);
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Next Challenge Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cyber Defender Digital Reward & Certificate Modal */}
      {activeRewardModalBadge && (
        <CyberDefenderRewardModal
          badge={activeRewardModalBadge}
          isOpen={Boolean(activeRewardModalBadge)}
          onClose={() => setActiveRewardModalBadge(null)}
          streakDays={7}
        />
      )}
    </div>
  );
};
