import React from 'react';
import { BLUEPRINTS } from '../constants';
import { BookMarked, Github, ExternalLink, Activity } from 'lucide-react';

const BlueprintLibrary: React.FC = () => {
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
                    <div key={bp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors group">
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
                                className="text-slate-600 hover:text-white transition-colors"
                            >
                                <Github size={20} />
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {bp.tags.map(tag => (
                                <span key={tag} className="text-xs font-mono bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-800">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-4 flex items-start gap-3">
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlueprintLibrary;