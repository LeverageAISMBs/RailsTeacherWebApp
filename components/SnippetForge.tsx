import React, { useState } from 'react';
import { Hammer, Sparkles, Copy, Check, FileCode, Play, BrainCircuit } from 'lucide-react';
import { generateRailsCodeSnippet } from '../services/geminiService';
import { SnippetResponse } from '../types';

interface SnippetForgeProps {
    onAnalyze: (prompt: string) => void;
}

const SnippetForge: React.FC<SnippetForgeProps> = ({ onAnalyze }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SnippetResponse | null>(null);
    const [copied, setCopied] = useState(false);

    const handleForge = async () => {
        if (!input.trim() || loading) return;
        setLoading(true);
        setResult(null);
        const response = await generateRailsCodeSnippet(input);
        setResult(response);
        setLoading(false);
    };

    const handleCopy = () => {
        if (result?.code) {
            navigator.clipboard.writeText(result.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAnalyze = () => {
        if (!result) return;
        const prompt = `Review this generated code snippet for "${result.title}". Verify if there are any edge cases missing or performance improvements available.\n\nCode:\n${result.code}`;
        onAnalyze(prompt);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 p-1">
                <Hammer className="text-amber-500" />
                <h2 className="text-2xl font-bold text-white">The Snippet Forge</h2>
            </div>
            
            <p className="text-slate-400 mb-6 text-sm">
                Describe complex logic (Service Objects, Custom Scopes, Background Jobs) and let the AI forge a production-ready template.
            </p>

            <div className="flex gap-6 h-full min-h-0 pb-4">
                {/* Left Pane: Input */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-lg flex-1 flex flex-col">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                            Blueprint Description
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleForge();
                                }
                            }}
                            placeholder="e.g., A Service Object that handles user subscription renewal. It should check if the credit card is valid via Stripe, charge the card, update the user's subscription end date, and send a renewal email."
                            className="w-full flex-1 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-4 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-mono text-sm leading-relaxed"
                        />
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-[10px] text-slate-600 font-mono">Cmd + Enter to forge</span>
                            <button
                                onClick={handleForge}
                                disabled={loading || !input.trim()}
                                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Sparkles className="animate-spin" size={16} /> : <Hammer size={16} />}
                                Forge
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Output */}
                <div className="flex-1 flex flex-col min-w-0">
                    {result ? (
                         <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
                             {/* Header */}
                             <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-t-xl px-4 py-3">
                                 <div className="flex items-center gap-3">
                                     <FileCode size={18} className="text-amber-400" />
                                     <div>
                                         <h3 className="text-sm font-bold text-slate-200">{result.title}</h3>
                                         <span className="text-xs text-slate-500 font-mono block">{result.suggestedPath}</span>
                                     </div>
                                 </div>
                                 <button
                                     onClick={handleCopy}
                                     className="text-slate-400 hover:text-white transition-colors"
                                     title="Copy Code"
                                 >
                                     {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                 </button>
                             </div>

                             {/* Code Editor Look */}
                             <div className="flex-1 bg-slate-950 border-x border-slate-700 overflow-y-auto p-4 custom-scrollbar">
                                 <pre className="font-mono text-xs text-blue-100 whitespace-pre-wrap leading-relaxed">
                                     {result.code}
                                 </pre>
                             </div>

                             {/* Footer / Analysis */}
                             <div className="bg-slate-900 border border-slate-700 rounded-b-xl p-4">
                                 <div className="flex items-start gap-4 mb-4">
                                     <div className="flex-1">
                                         <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Architectural Logic</h4>
                                         <p className="text-sm text-slate-300 leading-relaxed mb-3">{result.explanation}</p>
                                         <div className="flex flex-wrap gap-2">
                                             {result.bestPractices?.map((practice, idx) => (
                                                 <span key={idx} className="text-[10px] bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 px-2 py-1 rounded font-mono">
                                                     {practice}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                 </div>
                                 
                                 <button
                                     onClick={handleAnalyze}
                                     className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm group"
                                 >
                                     <BrainCircuit size={16} className="text-blue-400 group-hover:text-blue-200" />
                                     Analyze with AI Architect
                                 </button>
                             </div>
                         </div>
                    ) : (
                        <div className="h-full border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-600 p-8 text-center bg-slate-900/30">
                            <Hammer size={48} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-medium mb-2">Ready to Forge</h3>
                            <p className="text-sm max-w-md">
                                Enter a description of your desired Rails component on the left.
                                The AI will construct strict, clean code adhering to best practices.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnippetForge;