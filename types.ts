
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
  ECOSYSTEM = 'Ecosystem',
  VERSION_DELTA = 'Version Delta',
  BLUEPRINTS = 'Blueprints',
  CLI_ARCHITECT = 'CLI Architect',
  SNIPPET_FORGE = 'Snippet Forge',
  DEPLOYMENT_SIMULATOR = 'Deployment Simulator'
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
  image?: string; // Base64 image data
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

export interface BlueprintProject {
  id: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  architecturalHighlight: string;
}

export interface DeltaComparison {
  id: string;
  topic: string;
  rails7: {
    title: string;
    code: string;
    description: string;
  };
  rails8: {
    title: string;
    code: string;
    description: string;
  };
  architecturalVerdict: string;
}

export interface CLICommandResponse {
  command: string;
  explanation: string;
  flags: string[];
}

export interface SnippetResponse {
  title: string;
  code: string;
  explanation: string;
  bestPractices: string[];
  suggestedPath: string;
}
