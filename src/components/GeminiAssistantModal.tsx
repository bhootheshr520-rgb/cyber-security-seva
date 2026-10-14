import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  PhoneCall, 
  Lock, 
  Scale, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  Bot, 
  User, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AudioTranscriber } from './AudioTranscriber';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; uri: string }>;
  timestamp: string;
}

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSos: () => void;
  onOpenEvidence: () => void;
  onGoToLegal: () => void;
}

const PRESET_PROMPTS = [
  '🚨 ₹25,000 was just debited via UPI without OTP. What is step 1?',
  '📞 Caller claims to be Police/Customs placing me under "Digital Arrest".',
  '📱 I downloaded an APK for electricity bill update. Is my phone hacked?',
  '⚖️ The local police station is asking me to go elsewhere. What is Zero-FIR?',
  '⚠️ Blackmailer threatening to share morphed photos on social media.',
  '🛡️ What is my bank’s liability under RBI 3-day zero-liability rules?',
];

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenSos,
  onOpenEvidence,
  onGoToLegal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `**Hello, I am Gemini Cyber Rakshak.**

I provide real-time, calm triage for cyber emergencies, online fraud, fake legal threats, and financial scams.

**If money was debited within the last 2 hours:**
1. Call **1930** immediately to initiate beneficiary account freezing.
2. Dial your bank to freeze your account/cards.
3. Save all transaction IDs (UTRs) and chats.

Tell me what happened or tap a common situation below.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const apiMessages = newHistory.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'Please contact 1930 immediately.',
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: `**Immediate Safety Directive:**\n\n1. **Call 1930** to report unauthorized UPI/bank transfer.\n2. **Freeze Account**: Call your bank hotline immediately.\n3. **Preserve Proof**: Log transaction reference (UTR) in Evidence Locker.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'assistant',
        content: `**Hello, I am Gemini Cyber Rakshak.**\n\nHow can I help protect you today? You can type, dictate with your microphone, or choose a topic below.`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Simple Markdown renderer for bolding, bullet points, and numbered lists
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Header
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }

          // Bullet point
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.substring(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-indigo-500 font-bold shrink-0">•</span>
                <span>{renderInlineBold(content)}</span>
              </div>
            );
          }

          // Numbered item
          const matchNum = line.match(/^(\d+)\.\s+(.*)/);
          if (matchNum) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
                <span className="font-bold text-indigo-600 shrink-0">{matchNum[1]}.</span>
                <span>{renderInlineBold(matchNum[2])}</span>
              </div>
            );
          }

          return <p key={idx}>{renderInlineBold(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden h-[92vh] max-h-[850px] flex flex-col">
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Dynamic Gemini Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-3.5 shrink-0 flex items-center justify-between border-b border-indigo-800/40 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1">
                  Gemini Cyber Rakshak
                </h2>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono">
                  3.8 FLASH
                </span>
              </div>
              <p className="text-[10px] text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Live Emergency Triage & RBI Rules</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 overscroll-contain">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[90%]">
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl shadow-xs transition-all ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                  }`}
                >
                  {renderFormattedText(msg.content)}

                  {/* Grounded Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="text-slate-400 font-semibold">Verified Grounding:</span>
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Bot Message Quick Actions */}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenSos();
                          }}
                          className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded flex items-center gap-1 border border-rose-200 transition-colors"
                        >
                          <PhoneCall className="w-2.5 h-2.5" />
                          <span>1930 SOS</span>
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenEvidence();
                          }}
                          className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded flex items-center gap-1 border border-indigo-200 transition-colors"
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>Save Evidence</span>
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onGoToLegal();
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1 transition-colors"
                        >
                          <Scale className="w-2.5 h-2.5" />
                          <span>FIR Guide</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-1 p-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-8 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs shadow-xs text-xs flex items-center gap-2 text-indigo-700 font-medium">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Gemini 3.8 is analyzing threat & drafting legal triage...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Chips */}
        {messages.length <= 2 && (
          <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200/80 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick:
            </span>
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-[11px] font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5"
          >
            {/* Microphone Dictation (gemini-3.5-transcribe) */}
            <AudioTranscriber
              buttonLabel="Speak"
              compact
              onTranscribeComplete={(transcribed) => {
                setInputText((prev) => (prev ? `${prev} ${transcribed}` : transcribed));
              }}
            />

            <input
              type="text"
              placeholder="Ask Gemini about fraud, threats, or legal steps..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 min-h-[40px] min-w-[40px]"
              title="Send to Gemini"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Dynamic AI powered by Gemini 3.8 Flash</span>
            <span className="font-mono">Toll-Free 1930</span>
          </div>
        </div>
      </div>
    </div>
  );
};
