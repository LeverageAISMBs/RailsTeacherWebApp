import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AITutor from './components/AITutor';
import Visualizer from './components/Visualizer';
import VersionDelta from './components/VersionDelta';
import BlueprintLibrary from './components/BlueprintLibrary';
import CLIArchitect from './components/CLIArchitect';
import { CURRICULUM } from './constants';
import { Lesson, RailsComponentType, LessonCategory } from './types';
import { Layers, Lightbulb, Activity, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(CURRICULUM[0].lessons[0]);
  const [aiInputOverride, setAiInputOverride] = useState('');

  const handleSelectLesson = (id: string) => {
    const lesson = CURRICULUM.flatMap(m => m.lessons).find(l => l.id === id);
    if (lesson) setCurrentLesson(lesson);
    setAiInputOverride(''); // Clear override on lesson change
  };

  const handleBlueprintAnalyze = (prompt: string) => {
      setAiInputOverride(prompt);
  };

  // Determine active visualizer stage based on lesson content (simple heuristic)
  const getVisualizerStage = (text: string): RailsComponentType | undefined => {
    const lower = text.toLowerCase();
    if (lower.includes('model') || lower.includes('database')) return RailsComponentType.MODEL;
    if (lower.includes('controller')) return RailsComponentType.CONTROLLER;
    if (lower.includes('view') || lower.includes('html')) return RailsComponentType.VIEW;
    if (lower.includes('route')) return RailsComponentType.ROUTE;
    return undefined;
  };

  // Render content based on category
  const renderMainContent = () => {
    if (currentLesson.category === LessonCategory.VERSION_DELTA) {
        return <VersionDelta />;
    }
    if (currentLesson.category === LessonCategory.BLUEPRINTS) {
        return <BlueprintLibrary onAnalyze={handleBlueprintAnalyze} />;
    }
    if (currentLesson.category === LessonCategory.CLI_ARCHITECT) {
        return <CLIArchitect />;
    }

    // Default Text Content
    return (
        <>
            <div className="mb-8">
                <Visualizer activeStage={getVisualizerStage(currentLesson.title)} />
            </div>

            <div className="prose prose-invert prose-slate max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
                {currentLesson.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-4">{line.replace('# ', '')}</h2>
                    if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-semibold text-slate-200 mt-5 mb-3">{line.replace('## ', '')}</h3>
                    if (line.startsWith('### ')) return <h4 key={i} className="text-lg font-medium text-slate-300 mt-4 mb-2">{line.replace('### ', '')}</h4>
                    if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-slate-400">{line.replace('* ', '')}</li>
                    if (line.trim().startsWith('1.')) return <li key={i} className="ml-4 list-decimal text-slate-400">{line.substring(2)}</li>
                    return <p key={i} className="mb-4 text-slate-300 leading-relaxed">{line}</p>
                })}
            </div>

            {/* Architectural Note */}
            <div className="mt-8 p-6 bg-amber-950/20 border border-amber-900/50 rounded-lg">
                <div className="flex items-start gap-3">
                    <Lightbulb className="text-amber-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                        <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">Senior Architect Note</h4>
                        <p className="text-sm text-amber-200/80 leading-relaxed font-mono">
                            {currentLesson.architecturalNote}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar 
        modules={CURRICULUM} 
        currentLessonId={currentLesson.id} 
        onSelectLesson={handleSelectLesson} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950">
            <div>
                <span className="text-xs font-mono text-rails-red border border-rails-red/30 bg-rails-red/10 px-2 py-1 rounded">
                    {currentLesson.difficulty}
                </span>
                <span className="ml-3 text-sm text-slate-400">
                    {currentLesson.category} / 
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button 
                  className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-white font-medium transition-colors border border-slate-700"
                  onClick={() => alert("Deployment check initiated...")}
                >
                    Deploy Status
                </button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            {/* Lesson Content */}
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">{currentLesson.title}</h1>
                    <p className="text-lg text-slate-400 leading-relaxed font-light">{currentLesson.description}</p>
                </div>

                {renderMainContent()}
            </div>

            {/* Split Pane - AI Console */}
            <div className="w-[450px] flex-shrink-0 h-full border-l border-slate-800">
                <AITutor 
                    initialPrompt={currentLesson.aiPromptTemplate} 
                    currentContext={currentLesson.title + ": " + currentLesson.architecturalNote}
                    overrideInput={aiInputOverride}
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;