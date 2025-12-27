import { Difficulty, LessonCategory, Module, BlueprintProject, DeltaComparison } from './types';

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

export const BLUEPRINTS: BlueprintProject[] = [
  {
    id: 'bp1',
    name: 'Discourse',
    description: 'The standard for modern community forums.',
    tags: ['Forum', 'EmberJS', 'Complex'],
    githubUrl: 'https://github.com/discourse/discourse',
    architecturalHighlight: 'Masterclass in Serializers and heavy background job processing.'
  },
  {
    id: 'bp2',
    name: 'Mastodon',
    description: 'Decentralized social networking server.',
    tags: ['Social', 'ActivityPub', 'Streaming'],
    githubUrl: 'https://github.com/mastodon/mastodon',
    architecturalHighlight: 'Excellent example of Policy Objects (Pundit) and Service Objects in action.'
  },
  {
    id: 'bp3',
    name: 'Feedbin',
    description: 'RSS Reader with a focus on design and speed.',
    tags: ['SaaS', 'Stripe', 'ViewComponents'],
    githubUrl: 'https://github.com/feedbin/feedbin',
    architecturalHighlight: 'Practical use of Russian Doll Caching and intricate PostgreSQL features.'
  },
  {
    id: 'bp4',
    name: 'Solidus',
    description: 'Open source eCommerce framework.',
    tags: ['eCommerce', 'Spree', 'Modular'],
    githubUrl: 'https://github.com/solidusio/solidus',
    architecturalHighlight: 'Learn how to build a modular engine-based architecture.'
  }
];

export const DELTAS: DeltaComparison[] = [
  {
    id: 'd1',
    topic: 'Background Jobs',
    rails7: {
      title: 'Rails 7 (Standard)',
      code: `# Gemfile
gem 'sidekiq'

# config/sidekiq.yml
:concurrency: 5
:queues:
  - default
  - mailers`,
      description: 'Relies on Redis. Requires managing a separate service/container.'
    },
    rails8: {
      title: 'Rails 8 (Solid Queue)',
      code: `# Gemfile
gem 'solid_queue'

# config/queue.yml
default:
  polling_interval: 1
  dispatchers:
    - pool: 5`,
      description: 'DB-backed queuing. No Redis required. Simplifies deployment (Kamal friendly).'
    },
    architecturalVerdict: 'Use Solid Queue for 90% of apps. It reduces infrastructure complexity (no Redis) which is the biggest failure point for small teams.'
  },
  {
    id: 'd2',
    topic: 'Asset Pipeline',
    rails7: {
      title: 'Sprockets / Importmaps',
      code: `// config/importmap.rb
pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"`,
      description: 'Importmaps allow ES modules without a bundler. Sprockets handles CSS.'
    },
    rails8: {
      title: 'Propshaft',
      code: `# config/initializers/assets.rb
Rails.application.config.assets.paths << Rails.root.join("node_modules")
# Propshaft assumes modern browsers and HTTP/2`,
      description: 'Propshaft is simpler and faster. It just copies assets. No complex transpilation pipeline by default.'
    },
    architecturalVerdict: 'Propshaft reduces complexity by relying on modern browser standards and HTTP/2, removing the need for complex transpilation pipelines.'
  }
];

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
    title: 'Rails 8: The Frontier',
    description: 'Understanding the shift to "No-PaaS" and Solid infrastructure.',
    lessons: [
      {
        id: 'l3-1',
        title: 'Version Delta: 7 vs 8',
        category: LessonCategory.VERSION_DELTA,
        difficulty: Difficulty.ADVANCED,
        description: 'Interactive comparison of the architectural shifts in Rails 8.',
        content: 'This module loads the Interactive Delta Interface.',
        aiPromptTemplate: "Explain the difference between Sidekiq and Solid Queue in terms of deployment complexity.",
        architecturalNote: "Rails 8 aims to make you independent of cloud providers. Solid Queue and Solid Cache use your DB, removing the need for Redis."
      }
    ]
  },
  {
    id: 'm4',
    title: 'The Architect\'s Library',
    description: 'Curated Open Source blueprints to study.',
    lessons: [
      {
        id: 'l4-1',
        title: 'Blueprint Repository',
        category: LessonCategory.BLUEPRINTS,
        difficulty: Difficulty.INTERMEDIATE,
        description: 'Analysis of production-grade Open Source Rails apps.',
        content: 'This module loads the Blueprint Repository.',
        aiPromptTemplate: "Analyze the 'app/services' folder of the Mastodon repo and explain the key patterns used.",
        architecturalNote: "Do not invent patterns. Steal them from proven codebases like Discourse and Mastodon."
      }
    ]
  },
  {
    id: 'm5',
    title: 'Deployment & Constraints',
    description: 'Production readiness, Docker, and CI/CD.',
    lessons: [
      {
        id: 'l5-1',
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