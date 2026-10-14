import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export const VictimSupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: 'Hello, I am here to listen. You are safe. What is on your mind?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'I understand this is very difficult. Please remember you are not to blame. Take slow, deep breaths. You have taken the first step by seeking help.', sender: 'bot' }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in duration-200">
      <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
        <span className="font-bold text-sm flex items-center gap-2"><Bot className="w-4 h-4"/> Support AI</span>
        <button onClick={() => setIsOpen(false)}><X className="w-5 h-5"/></button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`text-xs p-2 rounded-lg ${m.sender === 'user' ? 'bg-indigo-100 ml-auto' : 'bg-slate-100'}`}>
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-xs border rounded px-2"
          placeholder="Type here..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="text-indigo-600"><Send className="w-4 h-4"/></button>
      </div>
    </div>
  );
};
