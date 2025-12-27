export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  ARCHITECT = 'Architect'
}

export enum LessonCategory {
  STRUCTURE = 'Structure',
  PATTERNS = 'Patterns',
  DEPLOYMENT = 'Deployment',
  AI_WORKFLOW = 'AI Workflow',
  ECOSYSTEM = 'Ecosystem'
}

export interface Lesson {
  id: string;
  title: string;
  category: LessonCategory;
  difficulty: Difficulty;
  description: string;
  content: string; // Markdown supported content
  aiPromptTemplate: string; // Suggested prompt to try in the AI Lab
  architecturalNote: string; // The "Senior Engineer" perspective
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface AppState {
  currentModuleId: string | null;
  currentLessonId: string | null;
  sidebarOpen: boolean;
}

export enum RailsComponentType {
  MODEL = 'Model',
  VIEW = 'View',
  CONTROLLER = 'Controller',
  ROUTE = 'Route',
  DATABASE = 'Database'
}