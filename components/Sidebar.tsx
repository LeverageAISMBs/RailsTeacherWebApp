import React from 'react';
import { Module, Lesson } from '../types';
import { BookOpen, CheckCircle, Circle, ChevronRight } from 'lucide-react';

interface SidebarProps {
  modules: Module[];
  currentLessonId: string | null;
  onSelectLesson: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ modules, currentLessonId, onSelectLesson }) => {
  return (
    <div className="w-80 h-full bg-slate-950 border-r border-slate-800 overflow-y-auto flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">RailsGen7</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Mastery Protocol</p>
      </div>

      <div className="py-4">
        {modules.map((module) => (
          <div key={module.id} className="mb-6">
            <div className="px-6 mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{module.title}</h3>
            </div>
            <ul>
              {module.lessons.map((lesson) => {
                const isActive = currentLessonId === lesson.id;
                return (
                  <li key={lesson.id}>
                    <button
                      onClick={() => onSelectLesson(lesson.id)}
                      className={`w-full text-left px-6 py-3 flex items-center justify-between group transition-colors ${
                        isActive 
                          ? 'bg-slate-900 text-rails-red border-r-2 border-rails-red' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isActive ? (
                            <BookOpen size={14} />
                        ) : (
                            <Circle size={10} className="text-slate-600" />
                        )}
                        <span className="text-sm font-medium">{lesson.title}</span>
                      </div>
                      {isActive && <ChevronRight size={14} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;