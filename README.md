# Full-Stack Todo App

A minimal, full-stack project showcasing a typed backend API and a modern frontend UI. 
This repository is split into two main packages:

- backend — API built with a Node.js framework and Prisma ORM targeting PostgreSQL.
- frontend — SPA built with Vue 3, TypeScript, and Vite, with Storybook for component development.

For detailed, technology-specific instructions, see:
- Backend README: [backend/README.md](./backend/README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)

-------------------------------------------------------------------------------

## Overview
This project is a deliberately minimal full‑stack application designed to demonstrate clean architecture, end‑to‑end type safety, and fast feedback loops. It favors clarity over complexity, showing how a small, well‑structured codebase can scale in maintainability and confidence without heavy ceremony.

Goals
- Clean architecture and separation of concerns: keep domain logic pure and testable; push I/O (DB, network, framework specifics) to the edges behind clear interfaces.
- Type safety: leverage static typing across backend and frontend to reduce runtime surprises and make refactors safer.
- Fast developer feedback: optimize for quick iterations via hot reload, minimal scaffolding, and tooling that shortens the edit–run–verify loop.
- Clear API and data modeling: use a relational database with explicit schemas and migrations to make state changes auditable and reproducible.
- Component‑driven development (CDD): build the UI as a system of isolated components with living documentation and visual test cases.

Rationale and trade‑offs
- Backend framework + Prisma
  - Why: A mature Node.js web framework provides routing, validation, and middleware ergonomics while staying unopinionated about domain code. Prisma offers a declarative schema, safe migrations, and an auto‑generated client that aligns closely with TypeScript, improving correctness and developer velocity.
  - Trade‑offs: You adopt the framework’s conventions and Prisma’s query model. In return you gain consistent DX, safer schema evolution, and a single source of truth for data models.
- PostgreSQL and isolated testing with schemas
  - Why: PostgreSQL is a reliable, standards‑compliant relational database with strong tooling. Using per‑test schemas (or namespaced databases) enables isolated integration tests without cross‑test contamination. Migrations run before tests so the schema under test matches production.
  - Trade‑offs: Tests that touch the DB are slower than pure unit tests, but they provide higher confidence in persistence logic and query shape. Schema‑level isolation strikes a good balance between speed and realism.
- Vue 3 + Vite for fast feedback and TypeScript‑first DX
  - Why: Vue’s Composition API encourages encapsulated, testable logic in composables and components. Vite gives near‑instant HMR and modern bundling, which shortens the feedback loop. Strong TypeScript support reduces UI runtime errors and improves refactorability.
  - Trade‑offs: Composition API comes with a learning curve. The payoff is improved code reuse and clearer boundaries between UI behavior and presentation.
- Storybook for CDD/BDD‑style UI design and documentation
  - Why: Stories capture component states (happy path, edge cases, error states) as living, versioned documentation. Controls and interaction tests turn stories into executable specs, encouraging a Given/When/Then mindset without requiring a full app environment.
  - Trade‑offs: Maintaining stories adds some upfront cost. The benefit is durable UI documentation, easier onboarding, and safer UI changes through visual and interaction regression checks.
- Testing pyramid for speed, confidence, and realism
  - Unit tests: fastest feedback on pure logic (formatters, validators, composables). Cheap to write and run; they catch most regressions early.
  - Integration tests: exercise API routes/handlers with a real database schema and migrations. Slightly slower but validate boundaries (ORM, validation, transactions).
  - Request injection / E2E‑like tests: simulate HTTP requests against the in‑process server for end‑to‑end behavior without network flakiness. Use sparingly for critical flows.
  - UI tests: components are validated in isolation through stories and lightweight interaction tests. Full‑browser E2E can be layered in for high‑value journeys.

How these choices serve the goals
- Clean architecture: Domain code is framework‑agnostic; adapters handle transport (HTTP) and persistence (DB). This separation enables targeted tests and easier refactors.
- Type safety: Strong typing in models, handlers, and components reduces coupling errors and makes changes (like adding fields) safer across the stack.
- Fast feedback: Vite HMR, Storybook for components, and quick unit/integration test runs keep iteration cycles short.
- Clear modeling: Prisma schema and migrations make data changes explicit and traceable, while DB‑backed integration tests prevent “works on my machine” drift.
- CDD and documentation: Storybook centralizes UI knowledge—teams can reason about states visually, and CI can validate them without spinning up the whole app.

When to extend
- Observability: add structured logging and tracing around key flows.
- Performance: introduce caching layers (in‑memory or external) once bottlenecks are observed.
- Scale: modularize services when team/code size grows, preserving the same boundaries between domain and I/O.
- Security: layer in authentication/authorization at route boundaries and consider secrets management and rotation.

This stack is intentionally small but capable. It emphasizes velocity with guardrails—type safety, clear boundaries, and executable documentation—so additions remain predictable and maintainable as the project evolves.

-------------------------------------------------------------------------------

Project layout:
- backend/ — API, schema, and tests
- frontend/ — SPA, components, and Storybook
- docker-compose.yml — local development services (e.g., PostgreSQL and app containers)

-------------------------------------------------------------------------------

Prerequisites:
- Node.js 18+ and npm
- Docker and Docker Compose (recommended for local PostgreSQL and containerized runs)
- Modern browser

-------------------------------------------------------------------------------

Install (one-time per workspace):
- Backend:
  - cd backend
  - npm install
- Frontend:
  - cd frontend
  - npm install

Tip: If you run into lock or permission issues, remove node_modules and the lockfile, then reinstall.

-------------------------------------------------------------------------------

Run (two common options):

Option A — Local dev with Dockerized PostgreSQL:
1) Start the database:
   - From the repository root: docker compose up -d db
2) Start the backend:
   - cd backend
   - Follow backend/README.md for environment setup and start commands.
3) Start the frontend:
   - cd frontend
   - Follow frontend/README.md for environment setup and start commands.

Option B — Fully containerized (optional):
- You can run the backend and database via Docker Compose from the repository root.
- See backend/README.md for details and environment configuration.

-------------------------------------------------------------------------------

Environment configuration:
- The backend requires a PostgreSQL connection string and exposes standard server configuration variables.
- The frontend reads configuration via Vite-style variables (VITE_*).
- See the respective package READMEs for the exact variables, examples, and recommended .env files:
  - backend/README.md
  - frontend/README.md

-------------------------------------------------------------------------------

Testing strategy:

Backend:
- Unit tests
  - Validate core logic, schemas, and utilities without external dependencies.
- Integration tests
  - Exercise API paths with a real PostgreSQL instance on an isolated schema; migrations run before tests.
- End-to-End via server injection
  - Uses the framework’s server.inject (request injection) to simulate HTTP requests without opening a real port. This covers routing, validation, auth/guards, and handler integration without network flakiness.
- How to run
  - See backend/README.md for the exact commands for unit, integration, and injection-based E2E tests.

Frontend:
- Component-driven development (CDD) with Storybook
  - Build components in isolation; stories act as living documentation and executable examples.
  - Encourages BDD-style naming and scenarios (Given/When/Then) translated into story args and interactions.
- Storybook usage
  - Run Storybook locally during development; export a static build for review or CI previews.
  - Use stories to validate states, edge cases, and accessibility.
- UI testing approaches
  - Component tests using the same stories for deterministic rendering and interactions.
  - Optional end-to-end UI tests can target the running app in a real browser (e.g., using a browser automation tool) if desired.
- How to run
  - See frontend/README.md for Storybook and app testing commands, environment notes, and best practices.

-------------------------------------------------------------------------------

Contribution and iteration:
- Keep business logic pure and testable; keep I/O (DB, HTTP) at the edges.
- Add a story when building or modifying a component (CDD workflow).
- Prefer small, self-contained changes with tests and stories included.

-------------------------------------------------------------------------------

For concrete commands, ports, and environment variables, refer to:
- Backend README: [backend/README.md](./backend/README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)