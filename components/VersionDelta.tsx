import React, { useState } from 'react';
import { DELTAS } from '../constants';
import { GitCompare, ArrowRight, Check } from 'lucide-react';

const VersionDelta: React.FC = () => {
    const [selectedDeltaId, setSelectedDeltaId] = useState(DELTAS[0].id);
    const currentDelta = DELTAS.find(d => d.id === selectedDeltaId) || DELTAS[0];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 p-1">
                <GitCompare className="text-rails-red" />
                <h2 className="text-2xl font-bold text-white">Version Delta: 7 vs 8</h2>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                {DELTAS.map(delta => (
                    <button
                        key={delta.id}
                        onClick={() => setSelectedDeltaId(delta.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                            selectedDeltaId === delta.id
                                ? 'bg-rails-red/10 border-rails-red text-white'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                    >
                        <span className="text-sm font-mono font-bold">{delta.topic}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 min-h-0 overflow-y-auto pb-8">
                {/* Rails 7 Side */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-300">{currentDelta.rails7.title}</h3>
                        <span className="text-xs bg-slate-800 text-slate-500 px-2 py-1 rounded">Legacy/Standard</span>
                    </div>
                    <pre className="flex-1 bg-slate-950 p-4 rounded-lg text-xs font-mono text-slate-400 overflow-x-auto border border-slate-900 mb-4">
                        {currentDelta.rails7.code}
                    </pre>
                    <p className="text-sm text-slate-500 italic">
                        {currentDelta.rails7.description}
                    </p>
                </div>

                {/* Rails 8 Side */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-emerald-900/30 rounded-xl p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full"></div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-emerald-400">{currentDelta.rails8.title}</h3>
                        <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded border border-emerald-900">The Frontier</span>
                    </div>
                    <pre className="flex-1 bg-slate-950 p-4 rounded-lg text-xs font-mono text-emerald-100/80 overflow-x-auto border border-emerald-900/20 mb-4">
                        {currentDelta.rails8.code}
                    </pre>
                    <p className="text-sm text-emerald-200/60 italic">
                        {currentDelta.rails8.description}
                    </p>
                </div>
            </div>

            <div className="mt-auto bg-slate-900 border border-slate-700 p-6 rounded-lg flex items-start gap-4">
                <div className="bg-white p-2 rounded-full text-slate-900 mt-1">
                    <Check size={16} strokeWidth={4} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Architectural Verdict</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {currentDelta.architecturalVerdict}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VersionDelta;