import React, { useState } from 'react';
import { Terminal, Send, Copy, Check, Cpu } from 'lucide-react';
import { generateRailsCLICommand } from '../services/geminiService';
import { CLICommandResponse } from '../types';

const CLIArchitect: React.FC = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CLICommandResponse | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!input.trim() || loading) return;
        
        setLoading(true);
        setResult(null); // Reset previous result
        const response = await generateRailsCLICommand(input);
        setResult(response);
        setLoading(false);
    };

    const handleCopy = () => {
        if (result?.command) {
            navigator.clipboard.writeText(result.command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 p-1">
                <Terminal className="text-rails-red" />
                <h2 className="text-2xl font-bold text-white">CLI Architect</h2>
            </div>

            <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
                
                {/* Input Section */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Describe your requirement (Natural Language)
                    </label>
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                            placeholder="e.g., I need a Blog Post model with a title, rich text body, published status enum, and it belongs to an Author."
                            className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-4 pr-12 h-32 resize-none focus:outline-none focus:border-rails-red focus:ring-1 focus:ring-rails-red font-mono text-sm"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !input.trim()}
                            className="absolute bottom-4 right-4 bg-rails-red hover:bg-rails-dark text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Cpu className="animate-spin" size={20} /> : <Send size={20} />}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-black/80 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                            {/* Terminal Header */}
                            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="text-xs text-slate-400 font-mono">bash — 80x24</div>
                            </div>

                            {/* Terminal Body */}
                            <div className="p-6 font-mono text-sm relative group">
                                <div className="text-emerald-400 mb-2">$ rails_architect generate</div>
                                <div className="text-slate-100 break-all pr-12">
                                    {result.command}
                                    <span className="animate-pulse inline-block w-2 h-4 bg-emerald-500 ml-1 align-middle"></span>
                                </div>

                                <button
                                    onClick={handleCopy}
                                    className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    title="Copy Command"
                                >
                                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Explanation Card */}
                        <div className="mt-4 bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex gap-4">
                             <div className="shrink-0 mt-1">
                                <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
                                    <span className="text-xs font-bold text-blue-400">i</span>
                                </div>
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-300 mb-1">Architect's Analysis</h4>
                                <p className="text-sm text-slate-400">{result.explanation}</p>
                                {result.flags && result.flags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {result.flags.map((flag, idx) => (
                                            <span key={idx} className="text-xs bg-slate-950 text-slate-500 px-2 py-1 rounded border border-slate-800 font-mono">
                                                {flag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CLIArchitect;