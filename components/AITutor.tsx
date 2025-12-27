import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Cpu, Image as ImageIcon, MessageSquarePlus, Copy, Check, History, ChevronDown, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToTutor, generateConceptSlide } from '../services/geminiService';

interface AITutorProps {
  initialPrompt?: string;
  currentContext?: string;
  overrideInput?: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    lastModified: number;
}

const STORAGE_KEY = 'railsgen7_chat_sessions_v1';

const DEFAULT_INIT_MSG: ChatMessage = {
    id: 'init',
    role: 'model',
    text: 'System Online. I am your Senior Rails Architect. Ask me about structure, patterns, or code generation.',
    timestamp: Date.now()
};

const AITutor: React.FC<AITutorProps> = ({ initialPrompt, currentContext, overrideInput }) => {
  // --- State Initialization ---
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
            console.error("Failed to parse chat sessions", e);
        }
    }
    // Default initial session
    return [{
        id: Date.now().toString(),
        title: 'New Session',
        messages: [DEFAULT_INIT_MSG],
        lastModified: Date.now()
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
      // Default to the most recent session (first in array usually if sorted, but we'll take index 0 for now)
      return sessions[0]?.id || ''; 
  });

  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [visualizing, setVisualizing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Derived State ---
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession.messages;

  // --- Effects ---
  
  // Persist to Local Storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Handle Prop Overrides
  useEffect(() => {
    if (initialPrompt) setInput(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (overrideInput) setInput(overrideInput);
  }, [overrideInput]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentSessionId]);

  // --- Handlers ---

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
        id: newId,
        title: 'New Session',
        messages: [{ ...DEFAULT_INIT_MSG, timestamp: Date.now() }],
        lastModified: Date.now()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setHistoryOpen(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const newSessions = sessions.filter(s => s.id !== id);
      if (newSessions.length === 0) {
          // If deleted last one, create new empty one
          handleNewChat();
      } else {
          setSessions(newSessions);
          if (currentSessionId === id) {
              setCurrentSessionId(newSessions[0].id);
          }
      }
  };

  const updateCurrentSession = (newMessages: ChatMessage[], newTitle?: string) => {
      setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
              return {
                  ...s,
                  messages: newMessages,
                  title: newTitle || s.title,
                  lastModified: Date.now()
              };
          }
          return s;
      }));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    // Determine if we should update the title (if it's the first user message)
    let newTitle = undefined;
    if (messages.length === 1 && messages[0].id === 'init') {
        newTitle = input.slice(0, 30) + (input.length > 30 ? '...' : '');
    }

    const updatedMessages = [...messages, userMsg];
    updateCurrentSession(updatedMessages, newTitle);
    
    setInput('');
    setLoading(true);

    const responseText = await sendMessageToTutor(userMsg.text, updatedMessages);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    updateCurrentSession([...updatedMessages, modelMsg]);
    setLoading(false);
  };

  const handleVisualize = async () => {
    if (visualizing || loading) return;
    
    const concept = input.trim() || currentContext || "Rails Request Cycle";
    setVisualizing(true);
    
    const placeholderId = Date.now().toString();
    const placeholderMsg: ChatMessage = {
        id: placeholderId,
        role: 'model',
        text: `Initializing NanoBanana Visual Synthesis for: "${concept}"...`,
        timestamp: Date.now()
    };

    // Add placeholder
    updateCurrentSession([...messages, placeholderMsg]);

    const base64Image = await generateConceptSlide(concept);

    // Update placeholder with result
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            const finalMessages = s.messages.map(msg => {
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
            return { ...s, messages: finalMessages, lastModified: Date.now() };
        }
        return s;
    }));

    setVisualizing(false);
    setInput('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700 relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900 z-10 relative">
        <div className="flex items-center gap-2">
            <Cpu className="text-rails-red w-5 h-5" />
            <h2 className="font-mono font-bold text-slate-100 hidden md:block">AI Architect</h2>
        </div>
        
        <div className="flex items-center gap-2">
             {visualizing && <span className="text-[10px] text-emerald-400 animate-pulse font-mono mr-2">RENDERING</span>}
             
             {/* History Dropdown Trigger */}
             <div className="relative">
                 <button 
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded transition-colors ${historyOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Chat History"
                 >
                    <History size={16} />
                    <ChevronDown size={12} />
                 </button>

                 {/* Dropdown Menu */}
                 {historyOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider pl-2">Previous Chats</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {sessions.map(session => (
                                <div 
                                    key={session.id} 
                                    className={`group flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 transition-colors border-b border-slate-800/50 ${session.id === currentSessionId ? 'bg-slate-800/50' : ''}`}
                                >
                                    <button 
                                        onClick={() => { setCurrentSessionId(session.id); setHistoryOpen(false); }}
                                        className="flex-1 min-w-0"
                                    >
                                        <div className={`text-xs font-medium truncate ${session.id === currentSessionId ? 'text-rails-red' : 'text-slate-300'}`}>
                                            {session.title}
                                        </div>
                                        <div className="text-[10px] text-slate-600 font-mono">
                                            {new Date(session.lastModified).toLocaleDateString()}
                                        </div>
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Chat"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
             </div>

             <div className="w-px h-4 bg-slate-700 mx-1"></div>

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