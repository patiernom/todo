# Full-Stack Todo App

A minimal, full-stack project showcasing a typed backend API and a modern frontend UI. 
This repository is split into two main packages:

- backend — API built with a Node.js framework and Prisma ORM targeting PostgreSQL.
- frontend — SPA built with Vue 3, TypeScript, and Vite, with Storybook for component development.

For detailed, technology-specific instructions, see:
- Backend README: [backend/README.md](./backend/README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)

Goals:
- Demonstrate clean architecture, type safety, and fast developer feedback loops.
- Showcase API design and data modeling with a relational database.
- Exhibit component-driven development (CDD) and UI documentation via Storybook.

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

Notes for the interview write-up:
- After scaffolding, you can add a section describing the rationale behind the chosen technologies and trade-offs:
  - Why this Node.js framework and Prisma for data access and migrations.
  - Why PostgreSQL and how schemas enable isolated testing.
  - Why Vue 3 + Vite for fast dev feedback and TypeScript-first DX.
  - Why Storybook for CDD/BDD-style UI design and documentation.
  - How the testing pyramid balances speed (unit), confidence (integration), and realism (injection/E2E).

For concrete commands, ports, and environment variables, refer to:
- backend/README.md
- frontend/README.md