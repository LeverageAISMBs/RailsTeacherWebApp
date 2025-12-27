import React from 'react';
import { BLUEPRINTS } from '../constants';
import { BookMarked, Github, ExternalLink, Activity, Sparkles } from 'lucide-react';
import { BlueprintProject } from '../types';

interface BlueprintLibraryProps {
    onAnalyze?: (prompt: string) => void;
}

const BlueprintLibrary: React.FC<BlueprintLibraryProps> = ({ onAnalyze }) => {
    
    const handleAnalyze = (bp: BlueprintProject) => {
        if (onAnalyze) {
            const prompt = `Analyze the software architecture of the ${bp.name} Rails repository (${bp.githubUrl}). Focus on its approach to ${bp.architecturalHighlight}. Explain the key patterns used in strict Rails terms.`;
            onAnalyze(prompt);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <BookMarked className="text-blue-500" />
                <h2 className="text-2xl font-bold text-white">The Architect's Library</h2>
            </div>
            <p className="text-slate-400 mb-8 max-w-2xl">
                Do not reinvent the wheel. Study these production-grade Open Source applications to understand how scaling Rails apps are actually structured.
            </p>

            <div className="grid grid-cols-1 gap-6 pb-8">
                {BLUEPRINTS.map(bp => (
                    <div key={bp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors group relative">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">
                                    {bp.name}
                                </h3>
                                <p className="text-slate-500 text-sm">{bp.description}</p>
                            </div>
                            <a 
                                href={bp.githubUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-500"
                            >
                                <span className="text-xs font-bold">Source</span>
                                <Github size={16} />
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {bp.tags.map(tag => (
                                <span key={tag} className="text-xs font-mono bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-800">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-4 flex items-start gap-3 mb-4">
                            <Activity className="text-blue-500 shrink-0 mt-0.5" size={16} />
                            <div>
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-1">
                                    Pattern Highlight
                                </span>
                                <p className="text-sm text-blue-200/80">
                                    {bp.architecturalHighlight}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleAnalyze(bp)}
                            className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-2 px-4 rounded-lg text-xs font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white"
                        >
                            <Sparkles size={14} />
                            Analyze with AI Architect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlueprintLibrary;