import { Difficulty, LessonCategory, Module } from './types';

export const SYSTEM_INSTRUCTION = `You are a Senior Ruby on Rails Architect and Teacher. 
Your goal is to teach modern Rails 7+ development with a focus on:
1. "The Rails Way" (Convention over Configuration).
2. Modern stack: Hotwire (Turbo + Stimulus), Importmaps, Solid Queue.
3. Architecture: Service Objects, ViewComponents, Concerns.
4. AI-First Workflow: Teaching the user how to prompt AI to write the boilerplate so they can focus on logic.

When providing code:
- Use strict Ruby syntax.
- Add comments explaining *why* a decision was made.
- If the user asks for code, do not just give it; explain the architectural implication.
- Prefer Tailwind CSS for styling in examples.
- Assume Rails 7.1+ or 8.0 context.

Be concise. Direct. No fluff.`;

export const CURRICULUM: Module[] = [
  {
    id: 'm1',
    title: 'The Systemic View',
    description: 'Understanding Rails as a coherent system, not just a framework.',
    lessons: [
      {
        id: 'l1-1',
        title: 'Rails 7+ Architecture & The Doctrine',
        category: LessonCategory.STRUCTURE,
        difficulty: Difficulty.BEGINNER,
        description: 'The Request/Response Cycle and Directory Structure.',
        content: `
# The Rails Doctrine

Rails is opinionated. It optimizes for programmer happiness and convention over configuration.

## Key Changes in Rails 7+
*   **No Webpack by default**: Uses Importmaps for JS management.
*   **Hotwire**: Turbo Drive, Frames, and Streams are native.
*   **Encrypted Attributes**: Security by default.

## The Mental Model
Don't fight the framework. If you are writing a lot of configuration code, you are likely missing a Rails convention.

### The Request Cycle
1.  **Route**: Dispatches URL to Controller.
2.  **Controller**: Orchestrates data (Model) and presentation (View).
3.  **Model**: Business logic and Database interaction (Active Record).
4.  **View**: HTML generation (ERB/Slim).
        `,
        aiPromptTemplate: "Explain the directory structure of a new Rails 7 app and the purpose of the app/services folder if I add it manually.",
        architecturalNote: "The 'app' folder is your domain. Everything else (config, db, lib) is support. Keep your controllers skinny and your models rich."
      },
      {
        id: 'l1-2',
        title: 'AI-Driven Development',
        category: LessonCategory.AI_WORKFLOW,
        difficulty: Difficulty.BEGINNER,
        description: 'How to use AI to generate boilerplate and migrations.',
        content: `
# Leveraging Momentum

Do not write migrations by hand. Do not write standard CRUD controllers by hand. These are solved problems.

## The Strategy
Use AI to generate the *schema* and the *scaffold*, then manually refine the *business logic*.

### Effective Prompting
Instead of: "Make a blog."
Try: "Generate a Rails 7 scaffold command for a BlogPost model with title:string, body:text, status:enum, and published_at:datetime. Include a System Spec validation."
        `,
        aiPromptTemplate: "Generate the Rails console commands to create a User model with secure password, an associated Profile model, and the necessary migrations.",
        architecturalNote: "AI is a force multiplier. Verify its output against Rails conventions. It sometimes hallucinates older Rails 5/6 syntax."
      }
    ]
  },
  {
    id: 'm2',
    title: 'Patterns of Power',
    description: 'Moving beyond MVC: Service Objects, Concerns, and Components.',
    lessons: [
      {
        id: 'l2-1',
        title: 'Fat Models, Skinny Controllers?',
        category: LessonCategory.PATTERNS,
        difficulty: Difficulty.INTERMEDIATE,
        description: 'Refactoring logic into Concerns and Service Objects.',
        content: `
# The "Fat Model" Trap

Eventually, "Fat Models" become unmaintainable God Objects.

## The Solution: Extraction

1.  **Concerns (\`app/models/concerns\`)**: For shared logic across models (e.g., \`Searchable\`, \`Archivable\`).
2.  **Service Objects (\`app/services\`)**: For specific actions/procedures (e.g., \`User::OnboardService\`, \`Payment::ProcessService\`).
3.  **ViewComponents**: For complex, reusable UI elements (encapsulated logic + template).

## Rule of Thumb
If a controller action has more than 5 lines of code, you probably need a Service Object.
        `,
        aiPromptTemplate: "Refactor this complex controller method into a Service Object pattern using Ruby `call` syntax.",
        architecturalNote: "Service Objects isolate side effects. This makes testing trivial. You test the input and output of the service, not the HTTP request."
      }
    ]
  },
  {
    id: 'm3',
    title: 'Deployment & Constraints',
    description: 'Production readiness, Docker, and CI/CD.',
    lessons: [
      {
        id: 'l3-1',
        title: 'The Dockerfile',
        category: LessonCategory.DEPLOYMENT,
        difficulty: Difficulty.ADVANCED,
        description: 'Containerizing Rails 7.',
        content: `
# Immutable Infrastructure

Rails 7.1+ ships with a default Dockerfile. Use it.

## Key Components
1.  **Base Image**: Usually Ruby-slim.
2.  **Assets**: Precompilation stage.
3.  **Entrypoint**: Handling PID files.

## Constraints
*   Do not store uploads locally (use S3/ActiveStorage).
*   Do not rely on local file system state.
*   Environment variables for ALL secrets (\`config/credentials.yml.enc\` or \`ENV\`).
        `,
        aiPromptTemplate: "Analyze a standard Rails 7 Dockerfile and explain how to optimize layer caching for bundle install.",
        architecturalNote: "Your dev environment should mirror production. Use Docker Compose locally to spin up Postgres and Redis so you aren't surprised by env differences."
      }
    ]
  }
];