# Hapi + Prisma Backend

A TypeScript backend built with Hapi and Prisma (PostgreSQL) for a simple Todos API.

This document explains how to:
- Run the backend locally or with Docker Compose
- Configure and provide PostgreSQL
- Manage database schema with Prisma
- Run unit tests and integration tests
- Configure all environment variables

---

## Requirements

- Node.js 18.18+ and npm
- PostgreSQL 14+ (local or containerized)
- Docker and Docker Compose (optional, recommended for local DB and containerized runs)

---

## Quick Start (Local, without Docker)

1) Install dependencies:
   - cd backend
   - npm install

2) Provide PostgreSQL:
   - Option A: Start the DB via Docker Compose from the project root
     - docker compose up -d db
   - Option B: Use your own PostgreSQL
     - Ensure a database exists (e.g., todos).
     - Have user credentials and host/port ready.

3) Configure environment:
   - Create a file backend/.env if it doesn’t exist and set at least:
     - DATABASE_URL=postgresql://USER:PASS@HOST:5432/todos?schema=public
     - PORT=3000
     - HOST=0.0.0.0
     - ROUTE_PREFIX=
   - See “Environment variables” below for all details and examples.

4) Initialize the database schema (migrations):
   - npm run prisma:migrate
   - This applies Prisma migrations to the database pointed to by DATABASE_URL.

5) Start the server:
   - npm run dev
   - The server binds to HOST:PORT (defaults to 0.0.0.0:3000).

6) Verify:
   - Access your health endpoint (e.g., http://localhost:3000/health).

---

## Run with Docker Compose

You can run the backend with a containerized PostgreSQL:

- From the project root:
  - docker compose up -d backend
  - This builds and runs:
    - db (PostgreSQL) exposed on 5432
    - backend exposed on 3000

- Logs:
  - docker compose logs -f backend

- Stop:
  - docker compose down
  - To also remove volumes (DB data): docker compose down -v

---

## PostgreSQL Requirements and Options

This backend requires an accessible PostgreSQL instance. You can satisfy this in two ways:

1) Docker Compose (recommended for local dev)
   - A PostgreSQL service is defined and listens on port 5432.
   - Defaults:
     - user: postgres
     - password: postgres
     - database: todos
   - Data persists in a Docker volume.

2) External PostgreSQL
   - Create a database (e.g., todos).
   - Provide a connection string via DATABASE_URL.
   - Apply Prisma migrations before running the server.

Example connection strings:
- Local host:
  - postgresql://postgres:postgres@localhost:5432/todos?schema=public
- Docker network host (from another container):
  - postgresql://postgres:postgres@db:5432/todos?schema=public

Note on schemas:
- The application defaults to schema=public for development.
- Integration tests typically use an isolated schema (e.g., schema=test) to avoid data collisions.

---

## Prisma (Database Schema)

Common commands:
- Generate Prisma client:
  - npm run prisma:generate
- Apply dev migrations (creates a new migration if needed):
  - npm run prisma:migrate
- Open Prisma Studio (DB GUI):
  - npm run prisma:studio

Important:
- Ensure DATABASE_URL is correctly set before running Prisma commands.
- Run migrations any time you pull new schema changes.

---

## Testing

The project uses @hapi/lab for tests. There are two categories of tests:

### 1) Unit tests
- No database required.
- Command (from backend folder):
  - npm run test

### 2) Integration tests
- Requires a running PostgreSQL instance.
- The integration environment uses a dedicated schema (commonly schema=test).
- Steps:
  1) Ensure PostgreSQL is up:
     - docker compose up -d db
     - or provide your own PostgreSQL and update DATABASE_URL accordingly.
  2) Optionally create backend/.env.test with:
     - DATABASE_URL=postgresql://USER:PASS@HOST:5432/todos?schema=test
     - PORT=3000
     - HOST=0.0.0.0
     - ROUTE_PREFIX=
  3) Run:
     - npm run test:integration
     - The runner applies migrations (deploy) against the database referenced by DATABASE_URL, then runs tests.

Tips:
- Using schema=test keeps integration test data separate from your development schema.
- If your DB host differs (e.g., not “db” when outside Docker), ensure DATABASE_URL uses the correct host.

---

## Environment Variables

Set these in backend/.env (local dev), backend/.env.test (integration tests), or via the environment in your process/container.

- DATABASE_URL (required)
  - PostgreSQL connection string used by Prisma.
  - Format: postgresql://USER:PASS@HOST:PORT/DBNAME?schema=SCHEMA
  - Examples:
    - postgresql://postgres:postgres@localhost:5432/todos?schema=public
    - postgresql://postgres:postgres@db:5432/todos?schema=test
  - Notes:
    - HOST should be localhost for local DB, or db when running inside the Docker Compose network.
    - schema can be public for development, and test (or any isolated schema) for integration tests.

- PORT (optional; default: 3000)
  - The HTTP port the server listens on.

- HOST (optional; default: 0.0.0.0)
  - The network interface to bind. 0.0.0.0 allows external access from the host in Docker containers.

- ROUTE_PREFIX (optional; default: empty)
  - If set (e.g., /api), all routes are prefixed by this base path.

- NODE_ENV (optional; common values: development, test, production)
  - Standard Node environment flag used by many tools and libraries.
  - You can set this to adjust behavior in different environments.

Examples:

Local development (.env):
