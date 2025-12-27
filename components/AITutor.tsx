import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Cpu } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToTutor } from '../services/geminiService';

interface AITutorProps {
  initialPrompt?: string;
}

const AITutor: React.FC<AITutorProps> = ({ initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: 'System Online. I am your Senior Rails Architect. Ask me about structure, patterns, or code generation.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) setInput(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await sendMessageToTutor(userMsg.text, messages);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2">
            <Cpu className="text-rails-red w-5 h-5" />
            <h2 className="font-mono font-bold text-slate-100">AI Architect Console</h2>
        </div>
        <div className="text-xs text-slate-500 font-mono">Gemini-3-Flash</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-sm font-mono whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-900/30 text-blue-100 border border-blue-800'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 text-slate-500 text-xs p-2 rounded font-mono">
              Processing Architecture...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about Rails patterns or generate code..."
            className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-md pl-4 pr-12 py-3 text-sm font-mono focus:outline-none focus:border-rails-red focus:ring-1 focus:ring-rails-red resize-none h-20"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 bottom-2 p-2 text-slate-400 hover:text-white disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 text-[10px] text-slate-600 font-mono flex gap-2">
            <Terminal size={12} />
            <span>Cmd + Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default AITutor;