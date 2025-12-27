import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Cpu, Image as ImageIcon, MessageSquarePlus, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToTutor, generateConceptSlide } from '../services/geminiService';

interface AITutorProps {
  initialPrompt?: string;
  currentContext?: string; // To give context to the visualizer
  overrideInput?: string; // To allow parent to set input
}

const LOCAL_STORAGE_KEY = 'railsgen7_chat_history';

const AITutor: React.FC<AITutorProps> = ({ initialPrompt, currentContext, overrideInput }) => {
  // Load initial state from local storage or default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse chat history", e);
        }
    }
    return [{
      id: 'init',
      role: 'model',
      text: 'System Online. I am your Senior Rails Architect. Ask me about structure, patterns, or code generation.',
      timestamp: Date.now()
    }];
  });

  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [visualizing, setVisualizing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) setInput(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (overrideInput) setInput(overrideInput);
  }, [overrideInput]);

  // Persist messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    const initMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: 'System Online. I am your Senior Rails Architect. Ask me about structure, patterns, or code generation.',
        timestamp: Date.now()
    };
    setMessages([initMsg]);
    // localStorage updates via useEffect
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  const handleVisualize = async () => {
    if (visualizing || loading) return;
    
    // Determine concept to visualize based on input or current context
    const concept = input.trim() || currentContext || "Rails Request Cycle";
    
    setVisualizing(true);
    // Add a placeholder message
    const placeholderId = Date.now().toString();
    setMessages(prev => [...prev, {
        id: placeholderId,
        role: 'model',
        text: `Initializing NanoBanana Visual Synthesis for: "${concept}"...`,
        timestamp: Date.now()
    }]);

    const base64Image = await generateConceptSlide(concept);

    setMessages(prev => {
        // Replace placeholder or add new message
        return prev.map(msg => {
            if (msg.id === placeholderId) {
                if (base64Image) {
                    return {
                        ...msg,
                        text: `Architectural Diagram generated for: ${concept}`,
                        image: base64Image
                    };
                } else {
                    return {
                        ...msg,
                        text: `Visualization failed. Please check API configuration or try a simpler concept.`
                    };
                }
            }
            return msg;
        });
    });
    setVisualizing(false);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2">
            <Cpu className="text-rails-red w-5 h-5" />
            <h2 className="font-mono font-bold text-slate-100">AI Architect Console</h2>
        </div>
        <div className="flex items-center gap-3">
             {visualizing && <span className="text-[10px] text-emerald-400 animate-pulse font-mono">RENDERING</span>}
             <div className="text-xs text-slate-500 font-mono">Gemini-3-Flash</div>
             <button 
                onClick={handleNewChat}
                className="text-slate-400 hover:text-white transition-colors"
                title="New Chat"
             >
                <MessageSquarePlus size={16} />
             </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-sm font-mono whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-900/30 text-blue-100 border border-blue-800'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 group'
              }`}
            >
              {msg.text}
              
              {/* Copy Button for Model Responses */}
              {msg.role === 'model' && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-end">
                      <button 
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-wider font-bold"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                            <>
                                <Check size={12} />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy size={12} />
                                <span>Copy</span>
                            </>
                        )}
                      </button>
                  </div>
              )}
            </div>
            
            {msg.image && (
                <div className="mt-2 max-w-[85%] rounded-lg overflow-hidden border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <img src={msg.image} alt="Generated Visualization" className="w-full h-auto" />
                </div>
            )}
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
            placeholder="Ask about Rails patterns or visualize concepts..."
            className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-md pl-4 pr-12 py-3 text-sm font-mono focus:outline-none focus:border-rails-red focus:ring-1 focus:ring-rails-red resize-none h-20"
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            <button
                onClick={handleVisualize}
                disabled={loading || visualizing}
                title="Generate Visual Slide (NanoBanana)"
                className="p-2 text-slate-400 hover:text-emerald-400 disabled:opacity-50 transition-colors"
            >
                <ImageIcon size={16} />
            </button>
            <button
                onClick={handleSend}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
            >
                <Send size={16} />
            </button>
          </div>
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