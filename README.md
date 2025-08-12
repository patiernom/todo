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

### Goals
- Clean architecture and separation of concerns: keep domain logic pure and testable; push I/O (DB, network, framework specifics) to the edges behind clear interfaces.
- Type safety: leverage static typing across backend and frontend to reduce runtime surprises and make refactors safer.
- Fast developer feedback: optimize for quick iterations via hot reload, minimal scaffolding, and tooling that shortens the edit–run–verify loop.
- Clear API and data modeling: use a relational database with explicit schemas and migrations to make state changes auditable and reproducible.
- Component‑driven development (CDD): build the UI as a system of isolated components with living documentation and visual test cases.

### Architecture and Tooling Rationale
The backend pairs a mature Node.js web framework with Prisma to create a predictable, type‑safe foundation.
The framework handles routing, validation, and middleware ergonomics while staying out of the domain’s way. Prisma contributes a declarative schema, safe migrations, and an auto‑generated client that fits naturally with TypeScript. The trade‑off is adopting the framework’s conventions and Prisma’s query model, which is repaid through consistent DX, safer schema evolution, and a single source of truth for data models.

Data is persisted in PostgreSQL to benefit from standards compliance, reliability, and excellent tooling. For tests, isolated schemas (or namespaced databases) allow integration runs that don’t bleed state across cases. Migrations execute before tests so what’s exercised reflects production reality. Although database tests are slower than pure unit tests, the additional confidence in query shape and persistence logic justifies the cost.

On the frontend, Vue 3 and Vite focus on speed and maintainability.
Composition API encourages encapsulated logic in composables and components, leading to better reuse and clearer boundaries between behavior and presentation.
Vite’s near‑instant HMR keeps the feedback loop tight. There is a learning curve to Composition API, but the payoff is a codebase that’s easier to test, evolve, and reason about.

Storybook supports a component‑driven workflow by turning UI states into living, versioned documentation.
Stories capture happy paths, edge cases, and error states; controls and interactions make them executable specs that don’t require a full app environment.
Maintaining stories adds some upfront effort, but the result is durable UI knowledge, smoother onboarding, and safer UI changes through visual and interaction regression checks.

### Testing Strategy (A Balanced Pyramid)
Testing follows a pragmatic pyramid. Unit tests provide the fastest feedback for pure logic (formatters, validators, composables) and catch most regressions early.
Integration tests exercise API routes and handlers against a real database schema with migrations to validate boundaries like ORM behavior, validation, and transactions.
Request‑injection tests simulate HTTP calls against the in‑process server to cover end‑to‑end behavior without network flakiness and are reserved for critical flows. 
In the UI, components are validated in isolation via stories and lightweight interaction tests, with full‑browser E2E layered in only for the highest‑value journeys.

#### Backend:
- Unit tests
    - Validate core logic, schemas, and utilities without external dependencies.
- Integration tests
    - Exercise API paths with a real PostgreSQL instance on an isolated schema; migrations run before tests.
- End-to-End via server injection
    - Uses the framework’s server.inject (request injection) to simulate HTTP requests without opening a real port. This covers routing, validation, auth/guards, and handler integration without network flakiness.
- How to run
    - See [backend/README.md](./backend/README.md) for the exact commands for unit, integration, and injection-based E2E tests.

#### Frontend:
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
    - See [frontend/README.md](./frontend/README.md) for Storybook and app testing commands, environment notes, and best practices.


### How These Choices Serve the Goals
Clean architecture keeps domain code framework‑agnostic while adapters handle transport and persistence, enabling targeted tests and easier refactors. Strong typing across models, handlers, and components reduces coupling errors and makes cross‑stack changes (such as adding fields) materially safer. Tooling like Vite and Storybook shortens iteration cycles and supports a CDD workflow, while the Prisma schema and migrations make data changes explicit and traceable; database‑backed integration tests ensure the implementation doesn’t drift from design.

### When to Extend
As requirements grow, add structured logging and tracing to improve observability; introduce caching where real bottlenecks appear; and modularize services as team and code size increase, preserving the boundaries between domain logic and I/O.
Security can be layered in at route boundaries with authentication/authorization, complemented by robust secrets management and rotation policies.

This stack is intentionally small but capable. It emphasizes velocity with guardrails—type safety, clear boundaries, and executable documentation—so additions remain predictable and maintainable as the project evolves.

-------------------------------------------------------------------------------

## Project Layout
A two‑package repository separating API concerns from the UI. Each package is self‑contained with its own tooling, configs, and tests.

- `backend/` — API implementation, data schema, and tests
- `frontend/` — SPA, reusable components, and Storybook
- `docker-compose.yml` — local services (e.g., PostgreSQL) to support development and testing

-------------------------------------------------------------------------------

## Prerequisites
Make sure the following are installed before you start:

- Node.js 18+ and npm
- Docker and Docker Compose (recommended for local PostgreSQL and containerized runs)
- A modern browser

-------------------------------------------------------------------------------
### Install

#### Backend:
From the root of the repository run the following commands:
```shell
cd backend
npm install
```

#### Frontend:
From the root of the repository run the following commands:
```shell
cd frontend
npm install
```

Tip: If you run into lock or permission issues, remove node_modules and the lockfile, then reinstall.

-------------------------------------------------------------------------------

Run (two common options):

Option A — Local dev with Dockerized PostgreSQL:
1) Start the database:
   
   From the repository root run the following command: 
   ```shell
    docker compose up -d db
    ```
2) Start the backend:
   - cd backend
   - Follow [backend/README.md](./backend/README.md) for environment setup and start commands.
3) Start the frontend:
   - cd frontend
   - Follow [frontend/README.md](./frontend/README.md) for environment setup and start commands.

Option B — Fully containerized (optional):
- You can run the backend and database via Docker Compose from the repository root.
- See [backend/README.md](./backend/README.md) for details and environment configuration.

-------------------------------------------------------------------------------

### Environment configuration
- The backend requires a PostgreSQL connection string and exposes standard server configuration variables.
- The frontend reads configuration via Vite-style variables (VITE_*).
- See the respective package READMEs for the exact variables, examples, and recommended .env files:
  - [backend/README.md](./backend/README.md)
  - frontend/README.md

-------------------------------------------------------------------------------

### Contribution and iteration
- Keep business logic pure and testable; keep I/O (DB, HTTP) at the edges.
- Add a story when building or modifying a component (CDD workflow).
- Prefer small, self-contained changes with tests and stories included.

-------------------------------------------------------------------------------

### For concrete commands, ports, and environment variables, refer to:
- Backend README: [backend/README.md](./backend/README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)